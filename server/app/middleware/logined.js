module.exports = (options, app) =>
{
    return function (ctx, next)
    {
        if (ctx.user == null)
        {
            ctx.status = 401
            ctx.body = {
                error: "need to login first"
            }

            return
        }

        return next()
    }
}