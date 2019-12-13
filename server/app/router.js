module.exports = function (app)
{
    const router = app.router

    const logined = app.middlewares.logined({}, app)
    const in_project = app.middlewares.in_project({}, app)

    if (process.env.NODE_ENV === "development")
    {
        router.get("/api/ping", app.controller.test.ping)
    }

    router.post("/api/user/login", app.controller.user.login)
    router.post("/api/user/regist", app.controller.user.regist)

    router.get("/api/planner", logined, app.controller.planner.list)
    router.put("/api/planner", logined, app.controller.planner.create)

    router.get("/api/planner/:id/milestone", logined, in_project, app.controller.milestone.list)
    router.put("/api/planner/:id/milestone", logined, in_project, app.controller.milestone.create)

}