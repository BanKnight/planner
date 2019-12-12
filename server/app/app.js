/**
 * 放置启动时候的初始化工作,
 * 这时候只有config,没有其他内容
 */

const mongo = require("mongodb")

module.exports = async (app) =>
{
    const config = app.config.mongodb

    app.mongo = new Mongodb(config)

    return app.mongo.connect()
}

const empty = {}

class Mongodb
{
    constructor(config)
    {
        this.config = config
    }

    async connect()
    {
        const connect_str = `mongodb://${this.config.host}:${this.config.port}`

        const client = await mongo.connect(connect_str, { useNewUrlParser: true })

        this.db = client.db(this.config.db)
    }

    async load(name, cond, fields, sort)
    {
        cond = cond || empty
        fields = fields || empty

        const col = this.db.collection(name)
        const ret = await col.find(cond, { projection: fields, sort: sort }).toArray()

        return ret
    }

    async index(name, field)
    {
        try
        {
            const col = this.db.collection(name)

            await col.createIndex(field, { unique: true })
        }
        catch (err)
        {
            console.error(err)
        }
    }

    async get(name, id)
    {
        const col = this.db.collection(name)
        const ret = await col.find({ _id: id }).toArray()

        if (ret.length > 0)
        {
            return ret[0]
        }
    }

    async set(name, id, data)
    {
        try
        {
            const col = this.db.collection(name)

            await col.updateOne({ _id: id }, { $set: data }, { upsert: true, safe: true })
        }
        catch (err)
        {
            console.error(err)
        }
    }

    async delete(name, id)
    {

        try
        {
            const col = this.db.collection(name)

            await col.deleteOne({ _id: id })
        }
        catch (err)
        {
            console.error(err)
        }
    }

    async delete_cond(name, cond)
    {

        try
        {
            const col = this.db.collection(name)

            await col.deleteMany(cond)
        }
        catch (err)
        {
            console.error(err)
        }
    }
}