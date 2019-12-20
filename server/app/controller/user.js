const { Controller } = require("../core")
const md5 = require('md5');

const { error } = require("../define")

module.exports = class Current extends Controller
{
    constructor(ctx, app)
    {
        super(ctx, app)
    }

    login()
    {
        const body = this.ctx.request.body

        const { account, password } = body

        let user = this.app.service.user.get_account(account)

        if (user == null)
        {
            this.ctx.status = error.USER_NOT_FOUND
            this.ctx.body = {
                error: 'User not found',
            }

            return
        }

        if (md5(password) != user.password)
        {
            this.ctx.status = error.WRONG_PASSWORD
            this.ctx.body = {
                error: 'wrong password',
            }
            return
        }

        this.ctx.session = { user: user._id }
        this.ctx.body = { user: user._id }
    }

    regist()
    {
        if (this.ctx.user)
        {
            this.ctx.body = {}
            return
        }

        const body = this.ctx.request.body

        let { account, password, name } = body

        if (account == null || password == null)
        {
            this.ctx.status = error.BAD_REQUEST
            this.ctx.body = {
                error: "account or password is invalid"
            }
            return
        }

        account = account.trim()
        password = password.trim()
        name = name.trim()

        if (account.length == 0 || password.length == 0 || name.length == 0)
        {
            this.ctx.status = error.BAD_REQUEST
            this.ctx.body = {
                error: "account or password or name is invalid"
            }
            return
        }

        let user = this.app.service.user.get_account(account)

        if (user)
        {
            this.ctx.status = error.NAME_CONFLICT
            this.ctx.body = {
                error: 'account conflict',
            }
            return
        }

        password = md5(password)

        user = this.app.service.user.create({
            account, password, name
        })

        this.ctx.session = { user: user._id }
        this.ctx.user = user

        this.ctx.body = {}

    }

    detail()
    {
        const { ctx, service } = this
        const current = service.user

        const user_id = ctx.params.user

        const that = current.get(user_id)

        if (that == null)
        {
            this.ctx.status = error.USER_NOT_FOUND
            this.ctx.body = {
                error: 'no such user',
            }
            return
        }

        ctx.body = {
            _id: that._id,
            name: that.name
        }
    }
}