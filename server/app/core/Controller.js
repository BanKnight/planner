module.exports = class Controller
{
    constructor(ctx, app)
    {
        this.ctx = ctx
        this.app = app
        this.config = app.config
        this.service = app.service
    }
}