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

        const planner = ctx.planner

        const backlogs_planner = current.get_planner(planner._id)

        if (backlogs_planner == null)
        {
            ctx.body = cal_page([], config.page.size, ctx.query.page)
            return
        }

        const backlogs = backlogs_planner.backlogs

        ctx.body = cal_page(backlogs.data, config.page.size, +ctx.query.curr, (one) =>
        {
            let data = {
                _id: one._id,
                title: one.title,
                tags: one.tags,
                created: one.created,
                updated: one.updated,
                closed: one.closed,

            }

            if (one.assignee)
            {
                let user = service.user.get(one.assignee)
                if (user)
                {
                    data.assignee = {
                        _id: user._id,
                        name: user.name,
                    }
                }
            }
            if (one.milestone)
            {
                let milestone = service.milestone.get(one.milestone)
                if (milestone)
                {
                    data.milestone = {
                        _id: milestone._id,
                        title: milestone.title
                    }
                }
            }

            return data
        })
    }

    detail()
    {
        const { ctx, service } = this

        const current = service.backlogs

        const one = current.get(ctx.params.id)

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

        const backlogs = service.backlogs

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

        backlogs.create(body)

        ctx.body = {}
    }
    update()
    {
        const { ctx, service } = this
        const { user, planner } = ctx

        const current = service.backlogs

        const id = ctx.params.backlogs
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

        const id = ctx.params.backlogs

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