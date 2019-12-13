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
            this.ids[one._id] = one

            let planner = this.planners[one.planner]
            if (planner == null)
            {
                planner = {
                    _id: one.planner,
                    backlogs: new Map()
                }

                this.planners[one.planner] = planner
            }

            planner.backlogs.set(one._id, one)
        }
    }
}