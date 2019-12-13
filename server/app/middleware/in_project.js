module.exports = (app) =>
{
    return function (ctx, next)
    {
        const user = ctx.user
        const planner_id = ctx.params.id

        ctx.member = app.service.member.get(planner_id, user._id)

        if (ctx.member == null)
        {
            ctx.status = 403
            ctx.body = {
                error: "you are not authorized to this planner"
            }
            return
        }

        ctx.planner = app.service.planner.get(planner_id)

        return next()
    }
}