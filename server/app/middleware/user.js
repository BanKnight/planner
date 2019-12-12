module.exports = (options, app) =>
{
    return function (ctx, next)
    {
        let user_id = ctx.session.user

        if (user_id == null)
        {
            return next()
        }

        ctx.user = app.service.user.get(user_id)

        return next()
    }
}