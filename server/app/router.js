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
    router.post("/api/user/search", logined, app.controller.user.search)
    router.get("/api/user/:user", logined, app.controller.user.detail)

    router.get("/api/planner", logined, app.controller.planner.list)
    router.put("/api/planner", logined, app.controller.planner.create)
    router.get("/api/planner/:planner", logined, in_project, app.controller.planner.detail)
    router.delete("/api/planner", logined, in_project, app.controller.planner.destroy)

    router.get("/api/planner/:planner/member", logined, in_project, app.controller.member.list)
    router.get("/api/planner/:planner/member/:member", logined, in_project, app.controller.member.detail)
    router.put("/api/planner/:planner/member", logined, in_project, app.controller.member.create)
    router.delete("/api/planner/:planner/member/:member", logined, in_project, app.controller.member.destroy)

    router.get("/api/planner/:planner/milestone", logined, in_project, app.controller.milestone.list)
    router.put("/api/planner/:planner/milestone", logined, in_project, app.controller.milestone.create)
    router.post("/api/planner/:planner/milestone/:milestone", logined, in_project, app.controller.milestone.update)
    router.get("/api/planner/:planner/milestone/:milestone", logined, in_project, app.controller.milestone.detail)
    router.delete("/api/planner/:planner/milestone/:milestone", logined, in_project, app.controller.milestone.destroy)

    router.get("/api/planner/:planner/backlogs", logined, in_project, app.controller.backlogs.list)
    router.get("/api/planner/:planner/backlogs/:backlog", logined, in_project, app.controller.backlogs.detail)
    router.put("/api/planner/:planner/backlogs", logined, in_project, app.controller.backlogs.create)
    router.post("/api/planner/:planner/backlogs/:backlog", logined, in_project, app.controller.backlogs.update)
    router.delete("/api/planner/:planner/backlogs/:backlog", logined, in_project, app.controller.backlogs.destroy)

    router.get("/api/planner/:planner/issues", logined, in_project, app.controller.issues.list)
    router.get("/api/planner/:planner/issues/:issue", logined, in_project, app.controller.issues.detail)
    router.put("/api/planner/:planner/issues", logined, in_project, app.controller.issues.create)
    router.post("/api/planner/:planner/issues/:issue", logined, in_project, app.controller.issues.update)
    router.delete("/api/planner/:planner/issues/:issue", logined, in_project, app.controller.issues.destroy)

    router.get("/api/planner/:planner/boards", logined, in_project, app.controller.boards.list)
    router.get("/api/planner/:planner/boards/:col", logined, in_project, app.controller.boards.col_detail)
    router.put("/api/planner/:planner/boards", logined, in_project, app.controller.boards.create)
    router.post("/api/planner/:planner/boards/move", logined, in_project, app.controller.boards.move)
    router.post("/api/planner/:planner/boards/:col", logined, in_project, app.controller.boards.update)
    router.delete("/api/planner/:planner/boards/:col", logined, in_project, app.controller.boards.destroy)

    router.put("/api/planner/:planner/boards/:col", logined, in_project, app.controller.boards.create_note)
    router.post("/api/planner/:planner/boards/notes/move", logined, in_project, app.controller.boards.move_note)
    router.post("/api/planner/:planner/boards/:col/:note", logined, in_project, app.controller.boards.update_note)
    router.delete("/api/planner/:planner/boards/:col/:note", logined, in_project, app.controller.boards.destroy_note)

}