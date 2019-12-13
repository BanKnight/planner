const shortid = require('shortid');

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
        let array = await this.app.db.load("user")

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
        let user = {
            _id: shortid.generate(),
            ...option,
        }

        this.ids[user._id] = user

        if (user.name)
        {
            this.names[user.name] = user
        }

        this.app.db.set("user", user._id, user)

        return user
    }
}