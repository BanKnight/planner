const shortid = require("shortid")
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
        if (first.updated != second.updated)
        {
            return first.updated - second.updated
        }

        return first._id - second._id
    }

    /**
     * option = {
     *  title:"",
     *  desc:"",
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
        }

        this.add(one)

        this.app.db.set("planner.milestone", one._id, one)

        return one
    }

    /**
     * 关闭
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

        if (one.closed)
        {
            return
        }

        this.close(one)

        this.app.db.set("planner.milestone", one._id, one)

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
                milestones: {},
                curr: new utils.SortedArray(Milestone.cmp),         //当前还没有关闭的
            }

            this.planners[one.planner] = planner
        }

        planner.milestones[one._id] = one

        if (one.closed)
        {
            planner.sorted.push(one)
        }
    }

    close(one)
    {
        one.closed = Date.now()
        one.updated = Date.now()

        let planner = this.planners[one.planner]

        planner.curr.pop(one)
    }

    get(id)
    {
        return this.ids[id]
    }

    get_by_planner(id)
    {
        let planner = this.planners[id]
        if (planner == null)
        {
            return
        }

        return planner.milestones
    }
}