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
    router.get("/api/user/:user", logined, app.controller.user.detail)

    router.get("/api/planner", logined, app.controller.planner.list)
    router.put("/api/planner", logined, app.controller.planner.create)
    router.get("/api/planner/:planner", logined, in_project, app.controller.planner.detail)
    router.delete("/api/planner", logined, in_project, app.controller.planner.destroy)

    router.get("/api/planner/:planner/milestone", logined, in_project, app.controller.milestone.list)
    router.put("/api/planner/:planner/milestone", logined, in_project, app.controller.milestone.create)
    router.post("/api/planner/:planner/milestone/:milestone", logined, in_project, app.controller.milestone.update)
    router.delete("/api/planner/:planner/milestone/:milestone", logined, in_project, app.controller.milestone.destroy)

    router.get("/api/planner/:planner/backlogs", logined, in_project, app.controller.backlogs.list)
    router.get("/api/planner/:planner/backlogs/:id", logined, in_project, app.controller.backlogs.detail)
    router.put("/api/planner/:planner/backlogs", logined, in_project, app.controller.backlogs.create)
    router.post("/api/planner/:planner/backlogs/:backlogs", logined, in_project, app.controller.backlogs.update)
    router.delete("/api/planner/:planner/backlogs/:backlogs", logined, in_project, app.controller.backlogs.destroy)

    router.get("/api/planner/:planner/member", logined, in_project, app.controller.member.list)
    router.get("/api/planner/:planner/member/:member", logined, in_project, app.controller.member.detail)
    router.put("/api/planner/:planner/member", logined, in_project, app.controller.member.create)
    router.delete("/api/planner/:planner/member/:member", logined, in_project, app.controller.member.destroy)

}