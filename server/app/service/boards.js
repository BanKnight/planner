const shortid = require('shortid')
const extend = require("extend2")
const { board_status } = require("../define")

const { Service } = require("../core")
/**
 * 被关闭了的note不会存放在col中
 */
module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)

        this.planners = {}
    }

    async start()
    {
        let array = await this.app.db.load("planner.boards")        //放置排序等信息

        for (let one of array)
        {
            let planner = { ...one, notes: {} }

            this.planners[one._id] = planner

            planner.curr = []

            for (let col_id of one.curr)
            {
                const col = await this.app.db.get("planner.boards.cols", col_id)

                if (col == null)
                {
                    continue
                }

                planner.curr.push(col)
            }

            const notes = await this.app.db.load("planner.boards.notes", { planner: one._id })

            for (let note of notes)
            {
                note.status = note.status || board_status.default
                planner.notes[note._id] = note
            }
        }
    }
    /**
     *option = {
         title:
         author:
         planner
     }
     *
     * @param {*} option
     */
    create_col(option)
    {
        let planner = this.get_planner(option.planner)
        if (planner == null)
        {
            planner = this.create_planner(option.planner)
        }

        let col = {
            _id: shortid.generate(),
            ...option,
            curr: [],                //当前的note的id
            created: Date.now(),
            updated: Date.now(),
        }

        planner.curr.push(col)

        this.save_planner(planner)

        this.save_col(col)

        return col
    }

    destroy_col(planner_id, col_id)
    {
        let planner = this.get_planner(planner_id)

        let col = this.del_col(planner, col_id)

        if (col == null)
        {
            return
        }

        this.save_planner(planner)

        for (let id in col.notes)
        {
            this.app.db.delete("planner.boards.notes", id)
        }

        this.app.db.delete("planner.boards.cols", col_id)

        return col
    }

    update_col(one, option)
    {
        delete option._id

        extend(one, option)

        one.updated = Date.now()

        this.save_col(one)
    }

    search(planner_id, option)
    {
        let planner = this.get_planner(planner_id)
        if (planner == null)
        {
            return []
        }

        if (option.assignee)
        {
            return this.search_assignee(planner, option.assignee)
        }

    }

    search_assignee(planner, assignee)
    {
        let result = []

        for (let col of planner.curr)
        {
            for (let note_id of col.curr)
            {
                let note = planner.notes[note_id]

                if (note.assignee == assignee)
                {
                    result.push(note)
                }
            }
        }
        return result
    }

    /**
     * 移动两个列
     */
    move(planner_id, option)
    {
        let planner = this.get_planner(planner_id)
        if (planner == null)
        {
            return false
        }

        let from_col = planner.curr[option.from]

        if (from_col == null || planner.curr[option.to] == null)
        {
            return false
        }

        planner.curr.splice(option.from, 1)
        planner.curr.splice(option.to, 0, from_col)

        this.save_planner(planner)

        return planner.curr
    }

    move_note(planner_id, option)
    {
        let planner = this.get_planner(planner_id)

        let from = this.get_col(planner, option.from)
        let to = this.get_col(planner, option.to)

        if (from == null || to == null)
        {
            throw new Error("no such col")
        }

        let note_id = from.curr[option.old]

        if (note_id == null)
        {
            throw new Error("数据太旧请先刷新")
        }

        if (option.target && note_id != option.target)
        {
            option.old = from.curr.indexOf(option.target)
            console.log("数据版本太旧请先刷新")
        }

        if (option.old < 0)
        {
            throw new Error("数据太旧请先刷新")
        }

        if (option.new > to.curr.length)
        {
            option.new = to.curr.length
        }

        from.curr.splice(option.old, 1)
        to.curr.splice(option.new, 0, option.target)

        this.save_col(from)

        if (from != to)
        {
            this.save_col(to)
        }
    }

    /**
     * option = {
     *  title:          //可选
     *  author:
     *  planner:
     * }
     *
     * @param {*} option
     */
    create_note(planner, col, option)
    {
        col.updated = Date.now()

        let note = {
            _id: shortid.generate(),
            ...option,
            created: Date.now(),
            updated: Date.now(),
        }

        col.curr.unshift(note._id)
        planner.notes[note._id] = note

        this.save_note(note)

        this.save_col(col)

        return note
    }

    update_note(col, note, option)
    {
        delete option._id

        let is_closed = note.closed

        extend(note, option)

        note.updated = Date.now()

        if (!option.closed)
        {
            note.closed = null
        }
        else if (!is_closed)
        {
            note.closed = Date.now()

            let index = col.curr.indexOf(note._id)

            col.curr.splice(index, 1)

            this.save_col(col)
        }

        this.save_note(note)
    }

    /**
     * 删除某个列中的note
     */
    destroy_note(planner, col, id)
    {
        let note = planner.notes[id]
        let index = col.curr.indexOf(id)

        col.curr.splice(index, 1)

        delete planner.notes[note._id]

        this.save_col(col)

        this.app.db.delete("planner.boards.notes", note._id)
    }

    create_planner(id)
    {
        let one = {
            _id: id,
            curr: [],        //当前在用的col
            notes: {},       //所有工单，无论是否关闭
            created: Date.now()
        }

        this.planners[id] = one

        return one
    }

    del_col(planner, col_id)
    {
        let col = null
        for (let i = 0; i < planner.curr.length; ++i)
        {
            let one = planner.curr[i]

            if (one._id == col_id)
            {
                col = one
                planner.curr.splice(i, 1)
                break
            }
        }

        return col
    }

    get_col(planner, col_id)
    {
        let col = null
        for (let one of planner.curr)
        {
            if (one._id == col_id)
            {
                col = one
                break
            }
        }
        return col
    }

    get_planner(id)
    {
        return this.planners[id]
    }

    save_planner(planner)
    {
        const record = { ...planner }

        delete record.notes

        record.curr = planner.curr.map((one) =>
        {
            return one._id
        })

        this.app.db.set("planner.boards", record._id, record)
    }

    save_col(col)
    {
        let record = { ...col }

        this.app.db.set("planner.boards.cols", col._id, record)
    }

    save_note(note)
    {
        this.app.db.set("planner.boards.notes", note._id, note)
    }
}