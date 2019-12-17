module.exports = (options, app) =>
{
    return async function (ctx, next)
    {
        try
        {
            await next()
        }
        catch (e)
        {
            ctx.status = 502
            ctx.body = {
                error: e.message
            }
        }
    }
}