const shortid = require('shortid')
const extend = require("extend2")
const { STATS_ORDER } = require("../define")

const { Service } = require("../core")

const { shadow_copy } = require("../utils")
/**
 * 被关闭了的note不会存放在col中
 */
module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)

        /*
        [planner_id] = {groups:[],...}
        group = {cols:[],...}
        col = {notes:[],...}
        note = {planner,...}        
        */
        this.planners = {}
    }

    async start()
    {
        let array = await this.app.db.load("planner.boards")        //放置排序等信息

        for (let one of array)
        {
            let planner = { ...one, notes: {}, groups: [] }

            this.planners[one._id] = planner

            const notes = await this.app.db.load("planner.boards.notes", { planner: one._id })

            for (let note of notes)
            {
                planner.notes[note._id] = note
            }

            for (let group_id of one.groups)
            {
                const db_group = await this.app.db.get("planner.boards.groups", group_id)

                if (db_group == null)
                {
                    continue
                }

                let group = { ...db_group, cols: [] }

                for (let col_id of db_group.cols)
                {
                    const db_col = await this.app.db.get("planner.boards.cols", col_id)

                    if (db_col == null)
                    {
                        continue
                    }

                    let col = { ...db_col, notes: [] }
                    for (let note_id of db_col.notes)
                    {
                        const note = planner.notes[note_id]

                        col.notes.push(note)
                    }

                    group.cols.push(col)
                }

                planner.groups.push(group)
            }
        }
    }

    static find_by_id(one)
    {
        return one._id == this
    }

    static note_cmp(first, second)
    {
        if (first.stats != null && second.stats == null)
        {
            return 1
        }

        if (first.stats == null && second.stats != null)
        {
            return -1
        }

        if (first.stats != second.stats)
        {
            return STATS_ORDER[second.stats] - STATS_ORDER[first.stats]
        }

        if (first.updated != second.updated)
        {
            return second.updated - first.updated;
        }

        if (first.created != second.created)
        {
            return second.created - first.created
        }

        if (first._id < second._id)
        {
            return -1
        }

        if (first._id > second._id)
        {
            return 1
        }

        return 0
    }

    /**
     * {
     *  title:
     *  planner:
     *  author:
     *  
     * }
     *
     * @param {*} option
     * @returns
     */
    create_group(option)
    {
        let planner = this.get_planner(option.planner)
        if (planner == null)
        {
            planner = this.create_planner(option.planner)
        }

        let group = {
            _id: shortid.generate(),
            ...option,
            cols: [],        //所有列
            created: Date.now(),
            updated: Date.now(),
        }

        planner.groups.push(group)

        this.save_planner(planner)

        this.save_group(group)

        return group
    }

    update_group(group, option)
    {
        delete option._id
        delete option.cols

        extend(group, option)

        group.updated = Date.now()

        this.save_group(group)
    }

    destroy_group(planner_id, group_id)
    {
        let planner = this.get_planner(planner_id)

        let group = this.del_group(planner, group_id)

        if (group == null)
        {
            return
        }

        this.save_planner(planner)

        for (let col of group.cols)
        {
            for (let note of col.notes)
            {
                this.app.db.delete("planner.boards.notes", note._id)
            }

            this.app.db.delete("planner.boards.cols", col._id)
        }

        this.app.db.delete("planner.boards.groups", group_id)

        return group
    }

    /**
     *option = {
         title:
         author:
         planner
         group
     }
     *
     * @param {*} option
     */
    create_col(option)
    {
        let planner = this.get_planner(option.planner)

        let group = this.get_group(planner, option.group)

        let col = {
            _id: shortid.generate(),
            ...option,
            notes: [],
            created: Date.now(),
            updated: Date.now(),
        }

        group.cols.push(col)

        this.save_group(group)

        this.save_col(col)

        return col
    }

    update_col(one, option)
    {
        delete option._id
        delete option.notes

        extend(one, option)

        one.updated = Date.now()

        this.save_col(one)
    }

    destroy_col(planner_id, group_id, col_id)
    {
        let planner = this.get_planner(planner_id)

        let group = this.get_group(planner, group_id)

        let col = this.del_col(group, col_id)

        if (col == null)
        {
            return
        }

        this.save_group(group)

        for (let note of col.notes)
        {
            this.app.db.delete("planner.boards.notes", note._id)
        }

        this.app.db.delete("planner.boards.cols", col_id)

        return col
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

        for (let group of planner.groups)
        {
            for (let cols of group.cols)
            {
                for (let note of cols.notes)
                {
                    if (note.assignee == assignee)
                    {
                        result.push(note)
                    }
                }
            }
        }

        return result
    }

    /**
     * 移动两个列
     */
    move_col(planner_id, group_id, option)
    {
        let planner = this.get_planner(planner_id)
        if (planner == null)
        {
            return false
        }

        let group = this.get_group(planner, group_id)

        let from_col = group.cols[option.from]

        if (from_col == null || group.cols[option.to] == null)
        {
            return false
        }

        group.cols.splice(option.from, 1)
        group.cols.splice(option.to, 0, from_col)

        this.save_group(group)

        return group.cols
    }

    move_note(planner_id, group_id, option)
    {
        let planner = this.get_planner(planner_id)

        let group = this.get_group(planner, group_id)

        let from = this.get_col(group, option.from)
        let to = this.get_col(group, option.to)

        if (from == null || to == null)
        {
            throw new Error("no such col")
        }

        let note = from.notes[option.old]

        if (note == null)
        {
            throw new Error("数据太旧请先刷新")
        }

        if (option.target && note.id != option.target)
        {
            note = planner.notes[option.target]
            option.old = from.notes.indexOf(note)

            if (option.old < 0)
            {
                throw new Error("数据太旧请先刷新")
            }
        }

        if (option.new > to.notes.length)
        {
            option.new = to.notes.length
        }

        from.notes.splice(option.old, 1)
        to.notes.splice(option.new, 0, note)

        to.notes.sort(Current.note_cmp)

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
     *  group
     *  col:
     * }
     *
     * @param {*} option
     */
    create_note(planner, group, col, option)
    {
        col.updated = Date.now()

        let note = {
            _id: shortid.generate(),
            ...option,
            created: Date.now(),
            updated: Date.now(),
        }

        col.notes.unshift(note)

        col.notes.sort(Current.note_cmp)

        planner.notes[note._id] = note

        this.save_note(note)
        this.save_col(col)

        return note
    }

    /**
     * 工作流模式中：改变状态就是改变所在列
     * 普通模式中：改变状态只能是有限的那几个状态
     */
    update_note(group, col, note, option)
    {
        const stats = option.stats

        delete option._id
        delete option.stats

        let is_closed = note.closed

        extend(note, option)

        note.updated = Date.now()

        let index = col.notes.indexOf(note)

        if (!option.closed)
        {
            note.closed = null

            // 工作流模式改变列
            if (group.mode == "workflow")
            {
                if (stats != null && stats != col._id)
                {
                    let new_col = this.get_col(group, stats)

                    if (new_col)
                    {
                        col.notes.splice(index, 1)
                        new_col.notes.splice(0, 0, note)

                        new_col.notes.sort(Current.note_cmp)

                        this.save_col(new_col)
                    }
                }
            }
            else
            {
                note.stats = stats
            }

            col.notes.sort(Current.note_cmp)

        }
        else if (!is_closed)        //从不关闭到关闭
        {
            note.closed = Date.now()

            col.notes.splice(index, 1)

            this.save_col(col)
        }

        this.save_note(note)
    }

    /**
     * 删除某个列中的note
     */
    destroy_note(planner, group_id, col_id, id)
    {
        let note = planner.notes[id]
        let group = this.get_group(planner, group_id)
        let col = this.get_col(group, col_id)

        let index = col.notes.indexOf(note)

        col.notes.splice(index, 1)

        delete planner.notes[note._id]

        this.save_col(col)

        this.app.db.delete("planner.boards.notes", note._id)
    }

    del_group(planner, group_id)
    {
        let index = planner.groups.findIndex(Current.find_by_id, group_id)

        if (index < 0)
        {
            return
        }

        let group = planner.groups[index]

        planner.groups.splice(index, 1)

        return group
    }

    del_col(group, col_id)
    {
        let index = group.cols.findIndex(Current.find_by_id, col_id)

        if (index < 0)
        {
            return
        }

        let col = group.cols[index]

        group.cols.splice(index, 1)

        return col
    }

    create_planner(id)
    {
        let one = {
            _id: id,
            groups: [],       //分组
            notes: {},       //所有工单，无论是否关闭
            created: Date.now()
        }

        this.planners[id] = one

        return one
    }

    get_planner(id)
    {
        return this.planners[id]
    }

    get_group(planner, group_id)
    {
        let index = planner.groups.findIndex(Current.find_by_id, group_id)

        return planner.groups[index]
    }

    get_col(group, col_id)
    {
        let index = group.cols.findIndex(Current.find_by_id, col_id)

        return group.cols[index]
    }

    save_planner(planner)
    {
        const record = shadow_copy(planner, ["notes", "groups"])

        record.groups = planner.groups.map((one) =>
        {
            return one._id
        })

        this.app.db.set("planner.boards", record._id, record)
    }

    save_group(group)
    {
        const record = shadow_copy(group, "cols")

        record.cols = group.cols.map((one) =>
        {
            return one._id
        })

        this.app.db.set("planner.boards.groups", record._id, record)
    }

    save_col(col)
    {
        let record = shadow_copy(col, "notes")

        record.notes = col.notes.map((one) =>
        {
            return one._id
        })

        this.app.db.set("planner.boards.cols", col._id, record)
    }

    save_note(note)
    {
        this.app.db.set("planner.boards.notes", note._id, note)
    }
}