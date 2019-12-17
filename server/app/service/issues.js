const shortid = require('shortid');
const { Service } = require("../core")

module.exports = class Current extends Service {
    constructor(app) {
        super(app)

        this.ids = {}
        this.planners = {}
    }

    async start() {
        let array = await this.app.db.load("planner.issues")

        for (let one of array) {
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
    create(option) {
        let one = {
            _id: shortid.generate(),
            ...option,
            created: Date.now(),

        }

        this.add(one)

        this.app.db.set("planner.issues", one._id, one)
    }

    destroy(id) {
        let one = this.get(id)
        if (one == null) {
            return
        }

        this.app.db.delete("planner.issues", id)

        delete this.ids[id]

        let planner = this.planners[one.planner]

        delete planner.issues[one._id]

        for (let tag of one.tags) {
            let tag_notes = planner.tags[tag]

            tag_notes.splice(tag_notes.indexOf(one), 1)
        }

        return one
    }

    add(one) {
        this.ids[one._id] = one

        let planner = this.planners[one.planner]
        if (planner == null) {
            planner = {
                _id: one.planner,
                issues: {},
                tags: {},
            }

            this.planners[one.planner] = planner
        }

        planner.issues[one._id] = one

        for (let tag of one.tags) {
            let tag_notes = planner.tags[tag]
            if (tag_nodes == null) {
                tag_nodes = []
                planner.tags[tag] = tag_nodes
            }

            tag_notes.push(one)
        }
    }

    get(id) {
        return this.ids[id]
    }
}