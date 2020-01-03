const { Controller } = require("../core")
const { error } = require("../define")
const { cal_page } = require("../utils")

module.exports = class Current extends Controller
{
    constructor(ctx, app)
    {
        super(ctx, app)
    }

    list()
    {
        const { ctx, service, config } = this

        const current = service.backlogs

        const planner = current.get_planner(ctx.params.planner)

        if (planner == null)
        {
            ctx.body = cal_page([], config.page.size, ctx.query.page)
            return
        }

        const data = current.search(planner, ctx.query)

        ctx.body = cal_page(data, config.page.size, +ctx.query.curr)
    }

    detail()
    {
        const { ctx, service } = this

        const current = service.backlogs

        const one = current.get(ctx.params.backlog)

        if (one == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "article is not exists"
            }
            return
        }

        ctx.body = one
    }

    create()
    {
        const { ctx, service } = this
        const { user, planner } = ctx

        const current = service.backlogs

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

        current.create(body)

        ctx.body = {}
    }
    update()
    {
        const { ctx, service } = this

        const current = service.backlogs

        const id = ctx.params.backlog
        const body = ctx.request.body

        if (id == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "backlogs id required"
            }
            return
        }

        let item = current.get(id)
        if (item == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "backlogs is not exist"
            }
            return
        }

        current.update(item, body)

        ctx.body = {}
    }

    destroy()
    {
        const { ctx, service } = this

        const current = service.backlogs

        const id = ctx.params.backlog

        if (id == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "backlogs id required"
            }
            return
        }

        current.destroy(id)

        ctx.body = {}
    }
}