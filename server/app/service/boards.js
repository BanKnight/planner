const shortid = require('shortid')
const extend = require("extend2")
const { Service } = require("../core")

module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)

        this.cols = {}
        this.notes = {}
        this.planners = {}
    }

    async start()
    {
        let array = await this.app.db.load("planner.boards")        //放置排序等信息

        for (let one of array)
        {
            this.planners[one._id] = one

            const cols = await this.app.db.load("planner.boards.cols", { planner: one._id })

            one.cols = {}

            for (let col of cols)
            {
                this.add_col(one, col)

                const notes = await this.app.db.load("planner.boards.notes", { col: col._id })

                col.notes = {}

                for (let note of notes)
                {
                    this.add_note(col, note)
                }
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
            curr: [],                //当前
            notes: {},               //所有
            created: Date.now(),
            updated: Date.now(),
        }

        this.add_col(planner, col)

        this.save_planner(planner)

        this.save_col(col)

        return col
    }

    destroy_col(id)
    {
        let col = this.get_col(id)
        if (col == null)
        {
            return
        }

        let planner = this.get_planner(col.planner)

        this.del_col(planner, col)

        this.save_planner(planner)

        this.app.db.delete("planner.boards.cols", col._id)
        this.app.db.delete_cond("planner.boards.notes", { col: col._id })

        return col
    }

    update_col(one, option)
    {
        delete option._id

        extend(one, option)

        one.updated = Date.now()

        this.save_col(one)
    }

    /**
     * option = {
     *  col:
     *  title:          //可选
     *  author:
     *  planner:
     * }
     *
     * @param {*} option
     */
    create_note(option)
    {
        let col = this.get_col(option.col)
        if (col == null)
        {
            return false
        }

        col.updated = Date.now()

        let note = {
            _id: shortid.generate(),
            ...option,
            created: Date.now(),
            updated: Date.now(),
        }

        this.add_note(col, note)

        this.save_note(note)

        this.save_col(col)

        return note
    }

    update_note(note, option)
    {
        delete option._id

        let is_closed = note.closed
        let col = this.cols[note.col]

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
            if (index >= 0)
            {
                col.curr.splice(index)
            }
        }

        this.save_col(col)

        this.save_note(note)
    }

    destroy_note(id)
    {
        let note = this.notes[id]
        if (note == null) return

        let col = this.cols[note.col]

        this.del_note(col, note)

        this.save_col(col)
        this.app.db.delete("planner.boards.notes", note._id)
    }

    create_planner(id)
    {
        let one = {
            _id: id,
            curr: [],        //当前在用的，里面放的是 id
            cols: {},         //所有col，包括curr中的，放的是对象
            created: Date.now()
        }

        this.planners[id] = one

        return one
    }

    add_col(planner, col)
    {
        this.cols[col._id] = col

        planner.cols[col._id] = col

        let index = planner.curr.indexOf(col._id)
        if (index >= 0)
        {
            return
        }

        planner.curr.push(col._id)
    }

    del_col(planner, col)
    {
        delete this.cols[col._id]
        delete planner.cols[col._id]

        let index = planner.curr.indexOf(col._id)
        if (index >= 0)
        {
            planner.curr.splice(index)
        }

        for (let id in col.notes)
        {
            delete this.notes[id]
        }
    }

    add_note(col, note)
    {
        col.notes[note._id] = note

        let index = col.curr.indexOf(note._id)
        if (index < 0)
        {
            col.curr.unshift(note._id)
        }

        this.notes[note._id] = note
    }

    del_note(col, note)
    {
        delete col.notes[note._id]
        delete this.notes[note._id]

        let index = col.curr.indexOf(note._id)
        if (index >= 0)
        {
            col.curr.splice(index)
        }
    }

    get_col(id)
    {
        return this.cols[id]
    }

    get_planner(id)
    {
        return this.planners[id]
    }

    save_planner(planner)
    {
        const record = { ...planner }

        delete record.cols

        this.app.db.set("planner.boards", record._id, record)
    }

    save_col(col)
    {
        let record = Object.assign({}, col)

        delete record.notes

        this.app.db.set("planner.boards.cols", col._id, record)
    }

    save_note(note)
    {
        this.app.db.set("planner.boards.notes", note._id, note)
    }
}