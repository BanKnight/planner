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
        this.cache = new LRU({ max: 100 })         //根据关键字缓存搜索结果
    }

    async start()
    {
        let array = await this.app.db.load("planner.issues")

        for (let one of array)
        {
            this.add(one)
        }
    }

    /**
   * 未关闭的
   * 最新更新的
   * id大的
   */
    static cmp(first, second)
    {
        if (first.closed == null && second.closed != null)
        {
            return -1
        }

        if (first.closed != null && second.closed == null)
        {
            return 1
        }

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
     *  assignee:xx
     *  attachment：[],
     *  author:xx,
     *  milestone:xx,
     *  tags:[],
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

        one.content = one.content || ""
        one.tags = one.tags || []

        this.add(one)

        this.cache.forEach((val, keyword) =>
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

        this.app.db.set("planner.issues", one._id, one)
    }

    destroy(id)
    {
        let one = this.get(id)
        if (one == null)
        {
            return
        }

        this.cache.forEach((val) =>
        {
            val.pop(one)
        })

        this.app.db.delete("planner.issues", id)

        this.del(one)

        return one
    }

    update(one, option)
    {
        delete option._id

        let is_closed = one.closed

        this.del(one)

        this.cache.forEach((val) =>
        {
            val.pop(one)
        })

        extend(one, option)

        if (!option.closed)
        {
            one.closed = null
        }
        else if (!is_closed)
        {
            one.closed = Date.now()
        }

        one.updated = Date.now()

        this.cache.forEach((val, keyword) =>
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

        this.app.db.set("planner.issues", one._id, one)
    }

    search(planner, keyword)
    {
        if (keyword == null || keyword.length == 0)
        {
            return planner.items.data
        }

        let result = this.cache.get(keyword)
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

        this.cache.set(keyword, result)

        return result.data
    }

    add(one)
    {
        this.ids[one._id] = one

        let planner = this.planners[one.planner]
        if (planner == null)
        {
            planner = {
                _id: one.planner,
                items: new utils.SortedArray(Current.cmp),
                tags: {},
            }

            this.planners[one.planner] = planner
        }

        planner.items.push(one)

        for (let tag of one.tags)
        {
            let tag_notes = planner.tags[tag]
            if (tag_nodes == null)
            {
                tag_nodes = new utils.SortedArray(Current.cmp),
                    planner.tags[tag] = tag_nodes
            }

            tag_notes.push(one)
        }
    }

    del(one)
    {
        delete this.ids[one._id]

        let planner = this.planners[one.planner]

        planner.items.pop(one)

        for (let tag of one.tags)
        {
            let tag_notes = planner.tags[tag]

            tag_notes.pop(one)
        }
    }

    get(id)
    {
        return this.ids[id]
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
}