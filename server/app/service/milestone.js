const shortid = require("shortid")
const extend = require("extend2")
const utils = require("../utils")
const { Service } = require("../core")


module.exports = class Milestone extends Service
{
    constructor(app)
    {
        super(app)

        this.ids = {}
        this.planners = {}
    }

    async start()
    {
        let array = await this.app.db.load("planner.milestone")

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
     *  title:"",
     *  desc:"",
     *  due:0,
     *  author:user_id,
     *  planner:planner_id
     * }
     *
     * @param {*} option
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

        this.app.db.set("planner.milestone", one._id, one)

        return one
    }

    /**
     * 删除
     *
     * @param {*} id
     */
    destroy(id)
    {
        let one = this.ids[id]
        if (one == null)
        {
            return
        }

        this.del(one)

        this.app.db.delete("planner.milestone", one._id)

        return one
    }

    update(one, option)
    {
        let is_closed = one.closed

        this.del(one)

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
                curr: new utils.SortedArray(Milestone.cmp),
            }

            this.planners[one.planner] = planner
        }

        planner.curr.push(one)
    }

    del(one)
    {
        delete this.ids[one._id]

        let planner = this.planners[one.planner]

        planner.curr.pop(one)
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