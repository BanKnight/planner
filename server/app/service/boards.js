const { Service } = require("../core")

module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)

        this.cols = {}
        this.notes = {}
        this.planners = {}
    }

    async start()
    {
        let array = await this.app.db.load("planner.boards.cols")

        for (let one of array)
        {
            this.cols[one._id] = one

            one.notes = []

            let planner = this.planners[one.planner]
            if (planner == null)
            {
                planner = {
                    _id: one.planner,
                    cols: new Map()
                }

                this.planners[one.planner] = planner
            }

            planner.cols.set(one._id, one)
        }

        array = await this.app.db.load("planner.boards.notes")

        for (let one of array)
        {
            this.notes[one._id] = one

            let col = this.cols[one.col]
            if (col == null)
            {
                continue
            }

            col.notes.push(one)
        }
    }
}