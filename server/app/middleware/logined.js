module.exports = (options, app) =>
{
    return function (ctx, next)
    {
        if (ctx.user == null)
        {
            return ctx.redirect("/login")
        }

        return next()
    }
}