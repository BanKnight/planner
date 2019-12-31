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
     * 查询某个member的具体信息
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

        let that_user = service.user.get(body.user)

        const member_planner = current.get_planner(planner._id)
        let new_member = member_planner.members[body.user]

        if (new_member)       //已经加入了,当做成功
        {
            ctx.body = {
                _id: new_member._id,
                name: that_user.name,
            }
            return
        }

        new_member = service.member.create({
            planner: planner._id,
            user: body.user
        })

        console.log("create new member in planner", planner._id, body.user, new_member._id)

        ctx.body = {
            _id: new_member._id,
            name: that_user.name,
        }
    }

    destroy()
    {
        const { ctx, service } = this
        const { planner, user } = ctx

        const current = service.member

        const quitter = ctx.params.member

        const that = current.get(planner._id, quitter)

        if (that == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "查无此人"
            }
            return
        }

        if (user._id != planner.owner)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "只有拥有者才能操作"
            }
            return
        }

        if (planner.owner == that.user)     //持有者，不允许退出
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "拥有者不允许退出"
            }
            return
        }

        const member = current.destroy(planner._id, that.user)

        console.log("kick member in planner", planner._id, user._id, member._id)

        ctx.body = {}
    }

}