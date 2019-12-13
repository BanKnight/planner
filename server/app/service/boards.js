const shortid = require('shortid')
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

            for (let col of cols)
            {
                this.add_col(one, col)

                const notes = await this.app.db.load("planner.boards.notes", { col: col._id })

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
            created: Date.now(),
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

        this.del_col(planner, one)

        this.save_planner(planer)

        this.app.delete("planner.boards.cols", one._id)
        this.app.delete_cond("planner.boards.notes", { col: one._id })
    }

    /**
     * option = {
     *  col:
     *  title:          //可选
     *  author:
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

        let note = {
            _id: shortid.generate(),
            ...option,
            created: Date.now(),
        }

        this.add_note(col, note)

        this.save_note(note)

        this.save_col(col)
    }

    destroy_note(id)
    {
        let note = this.notes[id]
        if (note == null) return

        let col = this.cols[note.col]

        this.del_note(col, note)

        this.save_col(col)
        this.app.delete("planner.boards.notes", note._id)
    }

    create_planner(id)
    {
        let one = {
            _id: id,
            curr: [],        //当前在用的，里面放的是 id
            cols: {}         //所有col，包括curr中的，放的是对象
        }

        this.planners[one.planner] = one

        this.save_planner(one)

        return one
    }

    add_col(planner, col)
    {
        col.notes = {}
        col.curr = col.curr || []

        this.cols[col._id] = col

        planner.cols[col._id] = col
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
        col.curr.push(note._id)

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
        return this.ids[id]
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