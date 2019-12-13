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

        const { name, password } = body

        let user = this.app.service.user.get_by_name(name)

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

        this.ctx.session.user = user._id
        this.ctx.body = { user: user._id }
    }

    regist()
    {
        if (this.ctx.user)
        {
            this.ctx.redirect("/")
            return
        }

        const body = this.ctx.request.body

        const { name, password } = body

        if (name == null || password == null)
        {
            this.ctx.status = error.BAD_REQUEST
            this.ctx.body = {
                error: "name or password is invalid"
            }
            return
        }

        name = name.trim()
        password = password.trim()

        if (name.length == 0 || password == 0)
        {
            this.ctx.status = error.BAD_REQUEST
            this.ctx.body = {
                error: "name or password is invalid"
            }
            return
        }

        let user = this.app.service.user.get_by_name(name)

        if (user)
        {
            this.ctx.status = error.NAME_CONFLICT
            this.ctx.body = {
                error: 'name conflict',
            }
            return
        }

        password = md5(password)

        user = this.ctx.service.user.create({
            name, password,
        })

        this.ctx.session.user = user._id
        this.ctx.user = user

        this.ctx.redirect("/")
    }
}