const { Controller } = require("../core")

module.exports = class Test extends Controller
{
    constructor(ctx, app)
    {
        super(ctx, app)
    }

    ping()
    {
        this.ctx.body = {
            resp: "ping"
        }
    }
}