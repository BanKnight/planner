const shortid = require('shortid');
const extend = require("extend2")

const { Service } = require("../core")

module.exports = class User extends Service
{
    constructor(app)
    {
        super(app)

        this.ids = {}
        this.accounts = {}
    }

    async start()
    {
        let array = await this.app.db.load("user")

        for (let one of array)
        {
            this.ids[one._id] = one
            this.accounts[one.account] = one
        }
    }

    get(id)
    {
        return this.ids[id]
    }

    get_account(account)
    {
        return this.accounts[account]
    }

    /**
     * option = {
     *  account:账户名
     *  password：md5后的密码
     *  name:姓名
     * }
     *
     * @param {*} option
     * @returns
     */
    create(option)
    {
        let user = {
            _id: shortid.generate(),
            ...option,
        }

        this.ids[user._id] = user

        this.accounts[user.account] = user

        this.app.db.set("user", user._id, user)

        return user
    }

    update(one, option)
    {
        delete option._id
        delete option.account
        delete option.star

        extend(one, option)

        this.app.db.set("user", one._id, one)
    }

    search(keyword)
    {
        let ret = []
        for (let user_id in this.ids)
        {
            let user = this.ids[user_id]
            if (user.name.includes(keyword))
            {
                ret.push(user)
            }
        }

        return ret
    }

    star(user, option)
    {
        user.star = user.star || []

        let index = user.star.indexOf(option.planner)

        if (option.value == true)
        {
            if (index < 0)
            {
                user.star.push(option.planner)
            }
        }
        else if (index >= 0)
        {
            user.star.splice(index, 1)
        }

        this.app.db.set("user", user._id, user)
    }
}