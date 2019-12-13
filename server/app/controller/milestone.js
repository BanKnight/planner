const { Controller } = require("../core")
const { error } = require("../define")

module.exports = class Current extends Controller
{
    constructor(ctx, app)
    {
        super(ctx, app)
    }

    list()
    {
        const { ctx, service } = this

        const planner = ctx.planner
        const milestone = service.milestone

        const all = milestone.get_by_planner(planner._id)

        ctx.body = all
    }

    create()
    {
        const { ctx, service } = this
        const { user, planner } = ctx
        const milestone = service.milestone

        const body = ctx.request.body

        body.title = (body.title || "").trim()

        if (body.title.length == 0)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "title is invalid"
            }
            return
        }

        body.author = user._id
        body.planner = planner._id

        milestone.create(body)

        ctx.body = {}
    }
}