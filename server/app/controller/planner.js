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

        ctx.body = this.app.service.planner.sorted.data
    }

    create()
    {
        const { ctx, service } = this
        const user = ctx.user

        const body = ctx.request.body

        body.name = (body.name || "").trim()
        body.desc = body.desc || ""

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

        service.member.create({
            user: user._id,
            planner: planner._id
        })

        ctx.body = {
            planner: planner._id
        }
    }

    destroy()
    {
        const { ctx, service } = this

        const { planner, user } = ctx

        if (planner.owner != user._id)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "you are not the owner"
            }
            return
        }

        service.planner.destroy(planner.id)

        ctx.body = {}
    }

    /**
     * 公共信息
     */
    public()
    {
        const { ctx, service } = this

        const current = service.planner

        const that = current.get(ctx.params.planner)

        if (that == null)
        {
            ctx.status = 404
            ctx.body = {
                errror: "planner is not exists"
            }

            return
        }

        ctx.body = {
            _id: that._id,
            name: that.name,
        }
    }

    /**
     * 私有信息
     */
    detail()
    {
        const { ctx, service } = this

        const current = service.planner

        const that = current.get(ctx.params.planner)

        if (that == null)
        {
            ctx.status = 404
            ctx.body = {
                errror: "planner is not exists"
            }

            return
        }

        ctx.body = { ...that }
    }

    update()
    {
        const { ctx, service } = this
        const { user } = ctx

        const current = service.planner

        const body = ctx.request.body

        const that = current.get(ctx.params.planner)

        if (that == null)
        {
            ctx.status = 404
            ctx.body = {
                errror: "planner is not exists"
            }

            return
        }

        if (that.owner != user._id)
        {
            ctx.status = error.NO_AUTH
            ctx.body = {
                error: "权限不足"
            }

            return
        }

        const member_planner = service.member.get_planner(ctx.params.planner)

        if (body.owner && body.owner != that.owner && member_planner.members[body.owner] == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                errror: "new owner must be one of members"
            }
            return
        }

        current.update(that, body)

        ctx.body = {}
    }
}