const shortid = require('shortid');
const extend = require("extend2")
const utils = require("../utils")
const LRU = require("lru-cache")
const { Service } = require("../core")

module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)

        this.threads = new LRU({ max: 100 })
    }

    async start()
    {
        //这里不进行数据库读取
    }

    /**
  * 按照创建时间排序
  * id大的
  */
    static cmp(first, second)
    {
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
     * 生成评论
     * option = {
     *  thread:xxx,         //评论所在的讨论页面id
     *  title:xx,
     *  author:xxx,
     *  attachment：[],
     * }
     */
    create(thread, option)
    {
        let one = {
            _id: shortid.generate(),
            ...option,
            created: Date.now(),
            updated: Date.now(),
        }

        one.attachments = one.attachments || []                //附件

        thread.comments.push(one)
        thread.ids[one._id] = one

        this.app.db.set("comments", one._id, one)

        return one
    }

    destroy(thread, id)
    {
        let one = thread.ids[id]
        if (one == null)
        {
            return
        }

        thread.comments.pop(one)

        delete thread.ids[id]

        this.app.db.delete("comments", one._id, one)

        return one
    }

    update(one, option)
    {
        delete option._id
        delete option.created

        extend(one, option)

        one.updated = Date.now()

        this.app.db.set("comments", one._id, one)
    }

    async get_thread(id)
    {
        let thread = this.threads.get(id)

        if (thread == null)
        {
            thread = {
                _id: id,
                ids: {},
                comments: new utils.SortedArray(Current.cmp)
            }

            this.threads.set(id, thread)
        }

        let array = await this.app.db.load("comments", { thread: id })

        for (let one of array)
        {
            thread.comments.push(one)
            thread.ids[one._id] = one
        }

        return thread
    }

    get(thread, id)
    {
        let one = thread.ids[id]

        return one
    }

}