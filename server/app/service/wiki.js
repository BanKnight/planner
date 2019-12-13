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
        let array = await this.app.db.load("wiki")

        for (let one of array)
        {
            this.ids[one._id] = one

            let planner = this.planners[one.planner]
            if (planner == null)
            {
                planner = {
                    _id: one.planner,
                    wiki: new Map()
                }

                this.planners[one.planner] = planner
            }

            planner.wiki.set(one._id, one)
        }
    }
}