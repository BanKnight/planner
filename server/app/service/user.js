const { Service } = require("../core")

module.exports = class User extends Service
{
    constructor(app)
    {
        super(app)

        this.ids = {}
        this.names = {}
    }

    async start()
    {
        let array = await this.app.mongo.load("user")

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
}