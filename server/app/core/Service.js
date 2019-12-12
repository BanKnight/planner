module.exports = class Service
{
    constructor(app)
    {
        this.app = app
        this.config = app.config
        this.service = app.service
    }

    async start()
    {

    }
}