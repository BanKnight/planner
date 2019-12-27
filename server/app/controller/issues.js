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

        const current = service.issues

        const planner = current.get_planner(ctx.params.planner)

        if (planner == null)
        {
            ctx.body = cal_page([], config.page.size, ctx.query.page)
            return
        }

        const data = current.search(planner, ctx.query.keyword)

        ctx.body = cal_page(data, config.page.size, +ctx.query.curr, (one) =>
        {
            let data = {
                _id: one._id,
                title: one.title,
                tags: one.tags,
                assignee: one.assignee,
                milestone: one.milestone,
                created: one.created,
                updated: one.updated,
                closed: one.closed,

            }
            return data
        })
    }

    detail()
    {
        const { ctx, service } = this

        const current = service.issues

        const one = current.get(ctx.params.issue)

        if (one == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "article is not exists"
            }
            return
        }

        let data = {
            _id: one._id,
            title: one.title,
            content: one.content,
            assignee: one.assignee,
            milestone: one.milestone,
            tags: one.tags,
            created: one.created,
            updated: one.updated,
            closed: one.closed,
        }

        ctx.body = data
    }

    create()
    {
        const { ctx, service } = this
        const { user, planner } = ctx

        const current = service.issues

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

        const current = service.issues

        const id = ctx.params.issue
        const body = ctx.request.body

        if (id == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "issues id required"
            }
            return
        }

        let item = current.get(id)
        if (item == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "issues is not exist"
            }
            return
        }

        current.update(item, body)

        ctx.body = {}
    }

    destroy()
    {
        const { ctx, service } = this

        const current = service.issues

        const id = ctx.params.issue

        if (id == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "issue id required"
            }
            return
        }

        current.destroy(id)

        ctx.body = {}
    }
}