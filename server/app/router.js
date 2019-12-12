module.exports = function (app)
{
    const router = app.router

    if (process.env.NODE_ENV === "development")
    {
        router.get("/ping", app.controller.test.ping)
    }
}