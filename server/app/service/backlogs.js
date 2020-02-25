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
        let array = await this.app.db.load("planner.backlogs")

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

        one.attachments = one.attachments || []                //附件
        one.content = one.content || ""
        one.tags = one.tags || []

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

        this.app.db.set("planner.backlogs", one._id, one)
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

        this.app.db.delete("planner.backlogs", id)

        this.del(one)

        return one
    }

    update(one, option)
    {
        delete option._id

        let is_closed = one.closed

        this.del(one)

        let cache = this.get_cache(one.planner)

        cache.forEach((val) =>
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

        this.app.db.set("planner.backlogs", one._id, one)
    }

    search(planner_id, option)
    {
        let planner = this.get_planner(planner_id)
        if (planner == null)
        {
            return []
        }

        if (option.keyword != null)
        {
            return this.search_keyword(planner, option.keyword)
        }

        if (option.id)
        {
            let existed = this.get(option.id)
            if (existed)
            {
                return [existed]
            }
            return []
        }

        if (option.assignee)
        {
            return this.search_assignee(planner, option.assignee)
        }

        if (option.milestone)
        {
            return this.search_milestone(planner, option.milestone)
        }

        return planner.items.data
    }

    search_keyword(planner, keyword)
    {
        if (keyword.length == 0)
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

    search_assignee(planner, assignee)
    {
        let result = []

        for (let one of planner.items.data)
        {
            if (one.assignee == assignee)
            {
                result.push(one)
            }
        }

        return result
    }

    search_milestone(planner, milestone)
    {
        let result = []

        for (let one of planner.items.data)
        {
            if (one.milestone == milestone)
            {
                result.push(one)
            }
        }

        return result
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
            if (tag_notes == null)
            {
                tag_notes = new utils.SortedArray(Current.cmp)
                planner.tags[tag] = tag_notes
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