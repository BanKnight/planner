const shortid = require('shortid');
const extend = require("extend2")

const utils = require("../utils")
const LRU = require("lru-cache")
const { Service } = require("../core")

module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)

        this.ids = {}
        this.planners = {}
        this.cache = {}        //根据关键字缓存搜索结果

    }

    async start()
    {
        let array = await this.app.db.load("planner.wiki")

        for (let one of array)
        {
            this.add(one)
        }
    }

    /**
      * 最新更新的
      * id大的
      */
    static cmp(first, second)
    {
        if (first.updated != second.updated)
        {
            return second.updated - first.updated
        }

        if (first._id < second._id)
        {
            return -1
        }

        if (first._id > second._id)
        {
            return 1
        }

        return 0
    }

    /**
     * option = { 
     *  planner:xx
     *  title:xx,
     *  content:xx,   
     *  attachment：[],
     *  author:xx,
     * }
     */
    create(option)
    {
        let one = {
            _id: shortid.generate(),
            ...option,
            created: Date.now(),
            updated: Date.now(),
        }

        this.add(one)

        let cache = this.get_cache(one.planner)

        cache.forEach((val, keyword) =>
        {
            if (one.title.includes(keyword))
            {
                val.push(one)
            }
            else if (one.content.includes(keyword))
            {
                val.push(one)
            }
        })

        this.app.db.set("planner.wiki", one._id, one)

        return one
    }

    destroy(id)
    {
        let one = this.get(id)
        if (one == null)
        {
            return
        }

        let cache = this.get_cache(one.planner)

        cache.forEach((val) =>
        {
            val.pop(one)
        })

        this.del(one)

        this.app.db.delete("planner.wiki", one._id)

        return one
    }

    search(planner, keyword)
    {
        if (keyword == null || keyword.length == 0)
        {
            return planner.items.data
        }

        let cache = this.get_cache(planner._id)

        let result = cache.get(keyword)
        if (result)
        {
            return result.data
        }

        result = new utils.SortedArray(Current.cmp)

        for (let one of planner.items.data)
        {
            if (one.title.includes(keyword))
            {
                result.push(one)
            }
            else if (one.content.includes(keyword))
            {
                result.push(one)
            }
        }

        cache.set(keyword, result)

        return result.data
    }

    update(one, option)
    {
        delete option._id

        this.del(one)

        let cache = this.get_cache(one.planner)

        cache.forEach((val) =>
        {
            val.pop(one)
        })

        extend(one, option)

        one.updated = Date.now()

        cache.forEach((val, keyword) =>
        {
            if (one.title.includes(keyword))
            {
                val.push(one)
            }
            else if (one.content.includes(keyword))
            {
                val.push(one)
            }
        })

        this.add(one)

        this.app.db.set("planner.wiki", one._id, one)
    }

    get(id)
    {
        return this.ids[id]
    }

    get_cache(planner_id)
    {
        let one = this.cache[planner_id]
        if (one == null)
        {
            one = new LRU({ max: 10 })
            this.cache[planner_id] = one
        }

        return one
    }

    get_planner(id)
    {
        let planner = this.planners[id]
        if (planner == null)
        {
            return
        }

        return planner
    }

    add(article)
    {
        this.ids[article._id] = article

        let planner = this.planners[article.planner]
        if (planner == null)
        {
            planner = {
                _id: article.planner,
                items: new utils.SortedArray(Current.cmp)
            }

            this.planners[article.planner] = planner
        }

        planner.items.push(article)
    }

    del(article)
    {
        delete this.ids[article._id]

        let planner = this.planners[article.planner]

        planner.items.pop(article)
    }


}