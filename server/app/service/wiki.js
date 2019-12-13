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
        let array = await this.app.db.load("planner.wiki")

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
     * }
     */
    create(option)
    {
        let one = {
            _id: shortid.generate(),
            ...option,
        }

        this.add(one)

        this.app.db.set("planner.wiki", one._id, one)
    }

    destroy(id)
    {
        let article = this.get(id)
        if (article == null)
        {
            return
        }

        this.del(article)

        this.app.db.delete("planner.wiki", article._id)
    }

    get(id)
    {
        return this.ids[id]
    }

    add(article)
    {
        this.ids[article._id] = article

        let planner = this.planners[article.planner]
        if (planner == null)
        {
            planner = {
                _id: article.planner,
                wiki: new Map()
            }

            this.planners[article.planner] = planner
        }

        planner.wiki.set(article._id, article)
    }

    del(article)
    {
        delete this.ids[article._id]

        let planner = this.planners[article.planner]

        planner.wiki.delete(article._id)
    }
}