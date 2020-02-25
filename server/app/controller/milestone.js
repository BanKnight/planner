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

        const planner = ctx.planner
        const current = service.milestone

        const milestone_planner = current.get_planner(planner._id)

        if (milestone_planner == null)        
        {
            ctx.body = cal_page([], config.page.size, ctx.query.page)
            return
        }

        let data = milestone_planner.curr.data

        if (ctx.query.closed === "false")
        {
            data = data.filter((one) =>
            {
                return !one.closed
            })
        }

        ctx.body = cal_page(data, config.page.size, +ctx.query.curr, (one) =>
        {
            let data = { ...one }

            if (one.assignee)
            {
                let assignee = service.user.get(one.assignee)
                data.assignee = {
                    _id: assignee._id,
                    name: assignee.name,
                }
            }

            if (one.milestone)
            {
                let milestone = service.milestone.get(one.milestone)
                data.assignee = {
                    _id: milestone._id,
                    name: milestone.title,
                }
            }

            return data
        })
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

    update()
    {
        const { ctx, service } = this
        const { user, planner } = ctx

        const milestone = service.milestone

        const stone = ctx.params.milestone
        const body = ctx.request.body

        if (stone == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "milestone id required"
            }
            return
        }

        let item = milestone.get(stone)
        if (item == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "milestone is not exist"
            }
            return
        }

        milestone.update(item, body)

        if (body.closed)
        {
            service.backlogs.close_by_milestone(planner._id, stone)
            service.issues.close_by_milestone(planner._id, stone)
            service.boards.close_by_milestone(planner._id, stone)
        }

        ctx.body = {}
    }

    destroy()
    {
        const { ctx, service } = this

        const milestone = service.milestone

        const stone = ctx.params.milestone

        if (stone == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "milestone id required"
            }
            return
        }

        milestone.destroy(stone)

        ctx.body = {}

    }

    detail()
    {
        const { ctx, service } = this

        const current = service.milestone

        const body = ctx.request.body

        const resp = []

        for (let id of body.ids)
        {
            let one = current.get(id)

            resp.push(one)
        }

        ctx.body = resp
    }

    about()
    {
        const { ctx, service } = this

        const stone = ctx.params.milestone

        const planner_id = ctx.params.planner

        const option = { milestone: stone }

        let backlogs = service.backlogs.search(planner_id, option)
        let issues = service.issues.search(planner_id, option)
        let notes = service.boards.search(planner_id, option)

        ctx.body = {
            backlogs,
            issues,
            notes,
        }
    }
}