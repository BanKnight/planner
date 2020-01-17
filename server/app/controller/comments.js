const { Controller } = require("../core")
const { error } = require("../define")
const { cal_page } = require("../utils")

module.exports = class Current extends Controller
{
    constructor(ctx, app)
    {
        super(ctx, app)
    }

    async list()
    {
        const { ctx, service, config } = this

        const current = service.comments

        const thread = await current.get_thread(ctx.params.thread)

        ctx.body = cal_page(thread.comments, config.page.size, +ctx.query.curr)
    }

    async create()
    {
        const { ctx, service } = this
        const { user } = ctx

        const current = service.comments

        const body = ctx.request.body

        body.title = (body.title || "").trim()
        body.thread = ctx.params.thread

        if (!body.title || !body.thread)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "title or thread is invalid"
            }
            return
        }

        body.author = user._id

        let thread = await current.get_thread(body.thread)

        let one = current.create(thread, body)

        ctx.body = one
    }

    async update()
    {
        const { ctx, service } = this

        const current = service.comments

        const body = ctx.request.body

        body.thread = ctx.params.thread

        if (!body.thread)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "backlogs id required"
            }
            return
        }

        let thread = await current.get_thread(body.thread)

        let one = current.get(thread, ctx.params.comment)

        if (one == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "不存在"
            }
            return
        }

        current.update(one, body)

        ctx.body = {}
    }

    async destroy()
    {
        const { ctx, service } = this

        const current = service.comments

        let thread = await current.get_thread(ctx.params.thread)

        current.destroy(thread, ctx.params.comment)

        ctx.body = {}
    }
}