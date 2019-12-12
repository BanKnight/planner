
const session = require('koa-session');

module.exports = (options, app) =>
{
    const config = Object.assign({}, options, {
        store: new Store(app.mongo, "session")
    })

    return session(config, app)
}

class Store
{
    constructor(mongodb, collection)
    {
        this.connection = mongodb
        this.collection = collection

        this.cache = new Map()
    }

    async destroy(id)
    {
        await this.connection.delete(this.collection, id)
    }

    async get(id, maxAge, options)
    {
        let record = this.cache.get(id)

        if (record == null)
        {
            record = await this.connection.get(this.collection, id)
        }

        if (record == null)
        {
            return
        }

        this.cache.set(id, record)

        if (Date.now() < record.expired)
        {
            return record.data
        }

        if (!options.rolling)
        {
            return
        }

        this.set(id, record.data, maxAge, options)

        return record.data
    }

    async set(id, data, maxAge, { changed, rolling })
    {
        let record = this.cache.get(id)

        if (record == null)
        {
            record = { _id: id, data, expired: Date.now() + maxAge }

            this.cache.set(id, record)
        }

        if (changed || rolling)
        {
            record.data = data
            record.expired = Date.now() + maxAge

            await this.connection.set(this.collection, id, record)
        }

        return data;
    }

}