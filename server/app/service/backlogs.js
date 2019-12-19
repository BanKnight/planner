const shortid = require('shortid');
const utils = require("../utils")
const { Service } = require("../core")

module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)

        this.ids = {}
        this.planners = {}
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

        one.tags = one.tags || []

        this.add(one)

        this.app.db.set("planner.backlogs", one._id, one)
    }

    destroy(id)
    {
        let one = this.get(id)
        if (one == null)
        {
            return
        }

        this.app.db.delete("planner.backlogs", id)

        this.del(one)

        return one
    }

    update(one, option)
    {
        let is_closed = one.closed

        this.del(one)

        extend(one, option)

        if (option.closed == false)
        {
            one.closed = null
        }
        else if (!is_closed)
        {
            one.closed = Date.now()
        }

        one.updated = Date.now()

        this.add(one)

        this.app.db.set("planner.milestone", one._id, one)
    }

    add(one)
    {
        this.ids[one._id] = one

        let planner = this.planners[one.planner]
        if (planner == null)
        {
            planner = {
                _id: one.planner,
                backlogs: new utils.SortedArray(Current.cmp),

                tags: {},
            }

            this.planners[one.planner] = planner
        }

        planner.backlogs.push(one)

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

        planner.backlogs.pop(one)

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