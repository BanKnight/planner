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

        const current = service.boards

        const col_planner = current.get_planner(planner._id)
        if (col_planner == null)
        {
            ctx.body = []

            return
        }

        ctx.body = col_planner.curr
    }
    /**
     * 获得一列的具体信息
     */
    col_detail()
    {
        const { ctx, service } = this

        const current = service.boards

        let col = current.get_col(ctx.params.col)
        if (col == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such col exists"
            }
            return
        }

        ctx.body = {
            _id: col._id, title: col.title, curr: [], updated: col.updated
        }

        for (let id of col.curr)
        {
            let note = col.notes[id]
            ctx.body.curr.push(note)
        }
    }

    /**
     * 创建一列
     */
    create()
    {
        const { ctx, service, config } = this
        const { user, planner } = ctx

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

        ctx.body = { _id: col._id }
    }

    update()
    {
        const { ctx, service } = this

        const current = service.boards

        const col_id = ctx.params.col

        if (col_id == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "col id required"
            }
            return
        }

        const col = current.get_col(col_id)
        if (col == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "col is not exists"
            }
            return
        }

        const body = ctx.request.body

        current.update_col(col, body)

        ctx.body = {}
    }

    swap()
    {
        const { ctx, service } = this

        const current = service.boards

        const body = ctx.request.body

        if (body.first == body.second)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "two swap index must be different"
            }
            return
        }
    }

    destroy()
    {
        const { ctx, service } = this

        const boards = service.boards

        const col_id = ctx.params.col

        if (col_id == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "col id required"
            }
            return
        }

        boards.destroy_col(col_id)

        ctx.body = {}
    }

    create_note()
    {
        const { ctx, service, config } = this
        const { user, planner } = ctx

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

        body.content = body.content || ""
        body.author = user._id
        body.planner = planner._id
        body.col = ctx.params.col
        body.planner = ctx.params.planner

        if (body.start)
        {
            body.start = new Date(body.start)
        }

        if (body.stop)
        {
            body.stop = new Date(body.stop)
        }

        const note = current.create_note(body)

        ctx.body = { _id: note._id }
    }

    update_note()
    {
        const { ctx, service, config } = this
        const planner = ctx.planner

        const current = service.boards

        const col_id = ctx.params.col
        const note_id = ctx.params.note

        if (col_id == null || note_id == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "col id && note id required"
            }
            return
        }

        const col = current.get_col(col_id)
        if (col == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such col"
            }
            return
        }

        if (col.planner != planner._id)
        {
            ctx.status = error.NO_AUTH
            ctx.body = {
                error: "you are not in this planner"
            }
            return
        }

        const note = col.notes[note_id]

        if (note == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such note"
            }
            return
        }

        const body = ctx.request.body

        if (body.title.length == 0)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "title is invalid"
            }
            return
        }

        if (body.start)
        {
            body.start = new Date(body.start)
        }

        if (body.stop)
        {
            body.stop = new Date(body.stop)
        }

        current.update_note(note, body)

        ctx.body = note
    }

    destroy_note()
    {
        const { ctx, service, config } = this
        const planner = ctx.planner

        const current = service.boards

        const col_id = ctx.params.col
        const note_id = ctx.params.note

        if (col_id == null || note_id == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "col id && note id required"
            }
            return
        }

        const col = current.get_col(col_id)
        if (col == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such col"
            }
            return
        }

        if (col.planner != planner._id)
        {
            ctx.status = error.NO_AUTH
            ctx.body = {
                error: "you are not in this planner"
            }
            return
        }

        const note = col.notes[note_id]

        if (note == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such note"
            }
            return
        }

        current.destroy_note(note_id)

        ctx.body = {}
    }
}