const { Controller } = require("../core")
const { error } = require("../define")

module.exports = class Current extends Controller
{
    constructor(ctx, app)
    {
        super(ctx, app)
    }

    /**
     * 查询某个计划中的所有人员
     */
    list()
    {
        const { ctx, service } = this
        const { planner } = ctx

        const current = service.member

        const member_planner = current.get_planner(planner._id)

        const resp = []

        for (let user_id in member_planner.members)
        {
            let member = member_planner.members[user_id]

            let user = service.user.get(member.user)

            resp.push({
                _id: user._id,
                name: user.name,
            })
        }

        ctx.body = resp
    }

    /**
     *
     *
     */
    detail()
    {

    }

    /**
     * 添加成员
     */
    create()
    {
        const { ctx, service } = this
        const { planner, user } = ctx

        const current = service.member

        if (planner.owner != user._id)
        {
            ctx.status = error.NO_AUTH
            ctx.body = {
                error: "权限不足"
            }
            return
        }

        const body = ctx.request.body

        if (body.user == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "参数错误"
            }
            return
        }

        const member_planner = current.get_planner(planner._id)
        if (member_planner.members[body.user])       //已经加入了,当做成功
        {
            ctx.body = {}
            return
        }

        let new_member = service.member.create({
            planner: planner._id,
            user: body.user
        })

        console.log("create new member in planner", planner._id, body.user, new_member._id)

        ctx.body = {}
    }

    destroy()
    {
        const { ctx, service } = this
        const { planner, me } = ctx

        const current = service.member

        const body = ctx.request.body

        const quitter = body.user || me._id

        const that = current.get(planner._id, quitter)

        if (that == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "拥有者不允许退出"
            }
            return
        }

        if (planner.owner == that._id)     //持有者，不允许退出
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "拥有者不允许退出"
            }
            return
        }

        const member = current.destroy(planner._id, that._id)

        console.log("kick member in planner", planner._id, body.user, member._id)

        ctx.body = {}
    }
}