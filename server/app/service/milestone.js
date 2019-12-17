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

    static cmp(first, second)
    {
        if (first.created != second.created)
        {
            return second.created - first.created
        }

        return first._id - second._id
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

        extend(one, option)

        if (!is_closed && one.closed)
        {
            one.closed = Date.now()

            let planner = this.planners[one.planner]

            planner.curr.pop(one)
        }

        one.updated = Date.now()

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
                milestones: {},
                curr: new utils.SortedArray(Milestone.cmp),         //当前还没有关闭的
            }

            this.planners[one.planner] = planner
        }

        planner.milestones[one._id] = one

        if (!one.closed)
        {
            planner.curr.push(one)
        }
    }

    del(one)
    {
        let planner = this.planners[one.planner]

        delete this.ids[one._id]
        delete planner.milestones[one._id]

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