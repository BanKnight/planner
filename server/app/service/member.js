const { Service } = require("../core")
/**
 */
module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)

        this.ids = {}           //[id = planner + user] = member
        this.planners = {}      //[planner_id] = {members:}
        this.to_planners = {}   //[user_id] = [planner]
    }

    async start()
    {
        let array = await this.app.db.load("planner.member")

        for (let one of array)
        {
            this.add(one)
        }
    }

    create(option)
    {
        let one = {
            _id: `${option.user}@${option.planner}`,
            ...option,
        }

        this.add(one)

        this.app.db.set(one._id, one)

        return one
    }

    add(one)
    {
        this.ids[one.id] = one

        let planner = this.planners[one.planner]
        if (planner == null)
        {
            planner = {
                _id: one.planner,
                members: new Map()
            }

            this.planners[one.planner] = planner
        }

        planner.members.set(one._id, one)

        let to_planner = this.to_planners[one.user]
        if (to_planner == null)
        {
            to_planner = {
                _id: one.user,
                planners: []
            }

            this.to_planners[one.user] = to_planner
        }

        to_planner.planners.push(one.planner)
    }

    get(planner_id, user)
    {
        let planner = this.planners[planner_id]

        if (planner == null)
        {
            return
        }

        return planner.members.get(user)
    }
}