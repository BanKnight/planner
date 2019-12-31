const { Service } = require("../core")
const extend = require("extend2")

/**
 */
module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)

        this.ids = {}           //[id = planner + user] = member
        this.planners = {}      //[planner_id] = {members:}
        this.to_planners = {}   //[user_id] = [planner_id]
    }

    async start()
    {
        let array = await this.app.db.load("planner.member")

        for (let one of array)
        {
            this.add(one)
        }
    }

    /**
     * option = { 
     * user:
     * planner:
     * }
     *
     * @param {*} option
     * @returns
     */
    create(option)
    {
        let one = {
            _id: `${option.user}@${option.planner}`,
            ...option,
            created: Date.now(),
        }

        this.add(one)

        this.app.db.set("planner.member", one._id, one)

        return one
    }

    try_create(option)
    {
        let planner = this.planners[option.planner]
        if (planner == null)
        {
            throw new Error("no such planner in member")
        }

        if (planner.members[option.user])
        {
            return
        }

        return this.create(option)
    }

    destroy(planner_id, user)
    {
        let planner = this.planners[planner_id]
        if (planner == null)
        {
            return
        }

        let one = planner.members[user]
        if (one == null)
        {
            return
        }

        this.del(one)

        this.app.db.delete("planner.member", one._id)

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
                members: {}
            }

            this.planners[one.planner] = planner
        }

        planner.members[one.user] = one

        let to_planner = this.to_planners[one.user]
        if (to_planner == null)
        {
            to_planner = []

            this.to_planners[one.user] = to_planner
        }

        to_planner.push(one.planner)
    }

    del(one)
    {
        delete this.ids[one._id]

        let planner = this.planners[one.planner]

        delete planner.members[one.user]

        let to_planner = this.to_planners[one.user]

        to_planner.splice(to_planner.indexOf(one), 1)
    }

    get(planner_id, user)
    {
        let planner = this.planners[planner_id]

        if (planner == null)
        {
            return
        }

        return planner.members[user]
    }

    get_planner(planner_id)
    {
        let planner = this.planners[planner_id]

        return planner
    }
}