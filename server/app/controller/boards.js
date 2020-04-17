const { Controller } = require("../core")
const { error } = require("../define")

module.exports = class Current extends Controller
{
    constructor(ctx, app)
    {
        super(ctx, app)
    }

    /**
     * 获得当前在使用中的任务分组
     * 列信息以及工单信息不在里面
     */
    list()
    {
        const { ctx, service } = this
        const { planner } = ctx

        const current = service.boards

        const col_planner = current.get_planner(planner._id)
        if (col_planner == null)
        {
            ctx.body = []
            return
        }

        ctx.body = col_planner.groups.map((one) =>
        {
            return {
                _id: one._id,
                planner: one.planner,
                title: one.title,
                mode: one.mode,
            }
        })
    }

    /**
     * 创建一个分组
     */
    create_group()
    {
        const { ctx, service } = this
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

        if (body.mode.length == 0)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "mode is invalid"
            }
            return
        }

        body.author = user._id
        body.planner = planner._id

        const one = current.create_group(body)

        ctx.body = one
    }

    /**
    * 获得某个group的具体信息
    */
    group_detail()
    {
        const { ctx, service } = this

        const current = service.boards

        const planner = current.get_planner(ctx.params.planner)
        if (planner == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such planner exists"
            }
            return
        }

        let group = current.get_group(planner, ctx.params.group)

        if (group == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such group exists"
            }
            return
        }

        ctx.body = {
            _id: group._id, title: group.title, mode: group.mode, updated: group.updated
        }

        ctx.body.cols = group.cols.map(one =>
        {
            return {
                _id: one._id, title: one.title, updated: one.updated
            }
        })
    }

    update_group()
    {
        const { ctx, service } = this

        const current = service.boards

        const planner = current.get_planner(ctx.params.planner)
        if (planner == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such planner exists"
            }
            return
        }

        let one = current.get_group(planner, ctx.params.group)
        if (one == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such col exists"
            }
            return
        }

        const body = ctx.request.body

        current.update_group(one, body)

        ctx.body = {}
    }

    destroy_group()
    {
        const { ctx, service } = this

        const boards = service.boards

        boards.destroy_group(ctx.params.planner, ctx.params.group)

        ctx.body = {}
    }

    /**
   * 创建一列
   */
    create_col()
    {
        const { ctx, service } = this
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
        body.group = ctx.params.group

        const col = current.create_col(body)

        ctx.body = col
    }

    /**
     * 获得一列的具体信息
     */
    col_detail()
    {
        const { ctx, service } = this

        const current = service.boards

        const planner = current.get_planner(ctx.params.planner)
        if (planner == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such planner exists"
            }
            return
        }

        let group = current.get_group(planner, ctx.params.group)
        if (group == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such group exists"
            }
            return
        }

        let col = current.get_col(group, ctx.params.col)
        if (col == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such col exists"
            }
            return
        }

        ctx.body = {
            _id: col._id, title: col.title, updated: col.updated, notes: col.notes
        }
    }

    update_col()
    {
        const { ctx, service } = this

        const current = service.boards

        const planner = current.get_planner(ctx.params.planner)
        if (planner == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such planner exists"
            }
            return
        }

        let group = current.get_group(planner, ctx.params.group)
        if (group == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such group exists"
            }
            return
        }

        let col = current.get_col(group, ctx.params.col)
        if (col == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such col exists"
            }
            return
        }

        const body = ctx.request.body

        current.update_col(col, body)

        ctx.body = {}
    }

    move_col()
    {
        const { ctx, service } = this

        const current = service.boards

        const body = ctx.request.body

        if (body.from == body.to || body.from == null || body.to == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "two swap index must be different"
            }
            return
        }

        let result = current.move_col(ctx.params.planner, ctx.params.group, body)
        if (!result)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "swap error"
            }

            return
        }

        ctx.body = result.map((one) =>
        {
            return {
                _id: one._id, title: one.title, updated: one.updated
            }
        })
    }

    destroy_col()
    {
        const { ctx, service } = this

        const boards = service.boards

        boards.destroy_col(ctx.params.planner, ctx.params.group, ctx.params.col)

        ctx.body = {}
    }

    create_note()
    {
        const { ctx, service } = this
        const { user } = ctx

        const current = service.boards

        let planner = current.get_planner(ctx.params.planner)
        if (planner == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such planner exists"
            }
            return
        }

        let group = current.get_group(planner, ctx.params.group)
        if (group == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such group exists"
            }
            return
        }

        let col = current.get_col(group, ctx.params.col)
        if (col == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such col exists"
            }
            return
        }

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

        if (body.start)
        {
            body.start = new Date(body.start)
        }

        if (body.stop)
        {
            body.stop = new Date(body.stop)
        }

        const note = current.create_note(planner, group, col, body)

        ctx.body = { _id: note._id }
    }

    /**
     * 更新某个列中的note
     */
    update_note()
    {
        const { ctx, service } = this

        const current = service.boards

        let planner = current.get_planner(ctx.params.planner)
        if (planner == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such planner exists"
            }
            return
        }

        const note = planner.notes[ctx.params.note]

        if (note == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such note"
            }
            return
        }

        let group = current.get_group(planner, ctx.params.group)
        if (group == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such group exists"
            }
            return
        }

        let col = current.get_col(group, ctx.params.col)
        if (col == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such col exists"
            }
            return
        }

        if (col.notes.indexOf(note) < 0)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such note in col"
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

        current.update_note(group, col, note, body)

        if (!body.closed)
        {
            ctx.body = note

            return
        }

        if (note.close_backlog && note.backlog)
        {
            let target = service.backlogs.get(note.backlog)
            service.backlogs.update(target, {
                closed: true
            })
        }

        if (note.close_issue && note.issue)
        {
            let target = service.issues.get(note.issue)
            service.issues.update(target, {
                closed: true
            })
        }

        ctx.body = note
    }

    close_note()
    {
        const { ctx, service } = this

        const current = service.boards

        let planner = current.get_planner(ctx.params.planner)
        if (planner == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such planner exists"
            }
            return
        }


        const note = planner.notes[ctx.params.note]

        if (note == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such note"
            }
            return
        }

        let group = current.get_group(planner, ctx.params.group)
        if (group == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such group exists"
            }
            return
        }

        let col = current.get_col(group, ctx.params.col)
        if (col == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such col exists"
            }
            return
        }

        if (col.notes.indexOf(note) < 0)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such note in col"
            }
            return
        }

        current.update_note(group, col, note, { closed: true })

        if (note.close_backlog && note.backlog)
        {
            let target = service.backlogs.get(note.backlog)
            service.backlogs.update(target, {
                closed: true
            })
        }

        if (note.close_issue && note.issue)
        {
            let target = service.issues.get(note.issue)
            service.issues.update(target, {
                closed: true
            })
        }

        ctx.body = note
    }

    move_note()
    {
        const { ctx, service } = this

        const current = service.boards

        const body = ctx.request.body

        if (body.old < 0 || body.new < 0)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "old or new is invalid"
            }
            return
        }

        current.move_note(ctx.params.planner, ctx.params.group, ctx.request.body)

        ctx.body = {}
    }

    /**
     * 删除col中的note
     * 
     */
    destroy_note()
    {
        const { ctx, service } = this

        const current = service.boards

        let planner = current.get_planner(ctx.params.planner)
        if (planner == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such planner exists"
            }
            return
        }

        current.destroy_note(planner, ctx.params.group, ctx.params.col, ctx.params.note)

        ctx.body = {}
    }


}