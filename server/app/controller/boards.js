const { Controller } = require("../core")
const { error } = require("../define")

module.exports = class Current extends Controller
{
    constructor(ctx, app)
    {
        super(ctx, app)
    }

    /**
     * 获得当前在使用中的列表信息，
     * 单子信息不包括在里面
     */
    list()
    {
        const { ctx, service } = this
        const { user, planner } = ctx

        ctx.body = []

        const planner = service.get_planner(planner._id)
        if (planner == null)
        {
            return
        }

        for (let id of planner.curr)
        {
            let one = planner.cols[id]
            ctx.body.push({
                _id: one._id,
                title: one.title,
            })
        }
    }

    create()
    {
        const { ctx, service, config } = this
        const planner = ctx.planner

        const current = service.boards

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

        const col = current.create_col(body)

        ctx.body = { _id: col._id, title: col.title }
    }
}