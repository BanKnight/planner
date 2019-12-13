const shortid = require('shortid');
const { Service } = require("../core")

module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)

        this.ids = {}
        this.planners = {}
    }

    async start()
    {
        let array = await this.app.db.load("planner.backlogs")

        for (let one of array)
        {
            this.add(one)
        }
    }
    /**
     * option = { 
     *  planner:xx
     *  title:xx,
     *  bodys:[],   多个内容
     *  attachment：[],
     *  author:xx,
     *  milestone:xx,
     *  tags:[],
     * }
     */
    create(option)
    {
        let one = {
            _id: shortid.generate(),
            ...option,
        }

        this.add(one)

        this.app.db.set(one.id, one)
    }

    destroy(id)
    {
        let one = this.get(id)
        if (one == null)
        {
            return
        }

        this.app.db.delete("planner.backlogs", id)

        delete this.ids[id]

        let planner = this.planners[one.planner]

        delete planner.backlogs[one._id]

        for (let tag of one.tags)
        {
            let tag_notes = planner.tags[tag]

            tag_notes.splice(tag_notes.indexOf(one), 1)
        }

        return one
    }

    add(one)
    {
        this.ids[one._id] = one

        let planner = this.planners[one.planner]
        if (planner == null)
        {
            planner = {
                _id: one.planner,
                backlogs: {},
                tags: {},
            }

            this.planners[one.planner] = planner
        }

        planner.backlogs[one._id] = one

        for (let tag of one.tags)
        {
            let tag_notes = planner.tags[tag]
            if (tag_nodes == null)
            {
                tag_nodes = []
                planner.tags[tag] = tag_nodes
            }

            tag_notes.push(one)
        }
    }

    update(id, option)
    {

    }

    get(id)
    {
        return this.ids[id]
    }
}