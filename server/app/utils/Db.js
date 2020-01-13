const mongo = require("mongodb")
const tinydb = require("@bansky/tinydb")

module.exports = class Db
{
    constructor(config)
    {
        this.config = config
    }

    async connect()
    {
        if (this.config.url.startsWith("mongodb://"))
        {
            this.client = await mongo.connect(this.config.url, { useNewUrlParser: true, useUnifiedTopology: true })
        }
        else if (this.config.url.startsWith("tinydb://"))
        {
            this.client = await tinydb.connect(this.config.url)
        }

        this.db = this.client.db(this.config.name)
    }

    async load(name, cond, fields, sort)
    {
        cond = cond || {}
        fields = fields || {}

        const col = this.db.collection(name)

        const cursor = await col.find(cond, { projection: fields, sort: sort })
        const ret = cursor.toArray()

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
        const ret = col.findOne({ _id: id })

        return ret
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