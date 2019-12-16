
const LRU = require("lru-cache")

module.exports = (options, app) =>
{
    const cache = new LRU(options)

    return async function (ctx, next)
    {
        ctx.cache = cache

        await next()

        if (!ctx.cached_key)
        {
            return
        }

        cache.set(ctx.cached_key, ctx.body)
    }
}