const shortid = require("shortid")
const utils = require("../utils")
const { Service } = require("../core")


/**
 * 放置planner 中的基本信息
 */
module.exports = class Planner extends Service
{
    constructor(app)
    {
        super(app)

        this.ids = {}
        this.sorted = new utils.SortedArray(Planner.cmp)
        this.names = {}
    }

    async start()
    {
        let array = await this.app.db.load("planner")

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

    get(id)
    {
        return this.ids[id]
    }

    get_by_name(name)
    {
        return this.names[name]
    }

    /**
     * option = {
     *   name:
     *   desc:
     *   author:
     * }
     *
     * @param {*} option
     * @returns
     */
    create(option)
    {
        let planner = {
            _id: shortid.generate(),
            ...option,      //author
            owner: option.author,
            created: Date.now(),
        }

        this.add(planner)

        this.ids[planner._id] = planner
        this.names[planner.name] = planner

        console.log("add", planner)

        this.app.db.set("planner", planner._id, planner)

        return planner
    }

    add(one)
    {
        this.ids[one._id] = one
        this.names[one.name] = one

        this.sorted.push(one)
    }
}