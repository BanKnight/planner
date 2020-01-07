const { Controller } = require("../core")

module.exports = class Current extends Controller
{
    constructor(ctx, app)
    {
        super(ctx, app)
    }

    list()
    {
        const { ctx, service } = this

        const { user } = ctx

        const planner_id = ctx.params.planner

        const option = { assignee: user._id }

        let backlogs = service.backlogs.search(planner_id, option)
        let issues = service.issues.search(planner_id, option)
        let notes = service.boards.search(planner_id, option)

        ctx.body = {
            backlogs,
            issues,
            notes,
        }
    }
}
