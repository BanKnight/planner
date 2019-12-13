const { Service } = require("../core")
const shortid = require("shortid")
/**
 * 放置planner 中的基本信息
 */
module.exports = class Planner extends Service
{
    constructor(app)
    {
        super(app)

        this.ids = {}
        this.names = {}
    }

    async start()
    {
        let array = await this.app.db.load("planner")

        for (let one of array)
        {
            this.ids[one._id] = one
            this.names[one.name] = one
        }
    }

    get(id)
    {
        return this.ids[id]
    }

    get_by_name(name)
    {
        return this.names[name]
    }

    create(option)
    {
        let planner = {
            _id: shortid.generate(),
            ...option,      //author
            owner:option.author,
            created:Date.now(),
        }

        this.ids[planner._id] = planner
        this.names[planner.name] = planner

        this.app.db.set("planner",planner._id,planner)

        return planner
    }
}