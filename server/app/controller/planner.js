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
        const ctx = this.ctx

        ctx.body = this.app.service.planner.ids
    }

    create()
    {
        const { ctx, service } = this
        const user = ctx.user

        const body = ctx.request.body

        body.name = (body.name || "").trim()

        if (body.name.length == 0)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "name is invalid"
            }
            return
        }

        let planner = service.planner.get_by_name(body.name)

        if (planner)
        {
            ctx.status = error.NAME_CONFLICT
            ctx.body = {
                error: "name conflict"
            }
            return
        }

        body.author = user._id

        planner = service.planner.create(body)

        service.planner.member.create({
            user: user._id,
            planner: planner._id
        })

        ctx.body = {
            planner: planner._id
        }
    }
}