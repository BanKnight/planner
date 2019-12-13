const shortid = require("shortid")
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
     * option = {
     *  title:"",
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

        this.app.db.set(one._id, one)

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
                milestones: {}
            }

            this.planners[one.planner] = planner
        }

        planner.milestones[one._id] = one
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