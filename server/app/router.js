module.exports = function(app)
{
    const router = app.router

    const logined = app.middleware.logined
    const in_project = app.middleware.in_project
    const upload = app.middleware.upload

    {
        router.post("/api/user/login", app.controller.user.login)
        router.post("/api/user/regist", app.controller.user.regist)
        router.post("/api/user/search", logined, app.controller.user.search)
        router.post("/api/user/reset", logined, app.controller.user.reset)
        router.get("/api/user/:user", logined, app.controller.user.detail)
    }

    {
        router.get("/api/planner", logined, app.controller.planner.list)
        router.put("/api/planner", logined, app.controller.planner.create)
        router.post("/api/planner/star", logined, app.controller.planner.star)
        router.get("/api/planner/star", logined, app.controller.planner.list_star)

        router.post("/api/planner/public", logined, app.controller.planner.public)
        router.get("/api/planner/:planner", logined, in_project, app.controller.planner.detail)
        router.delete("/api/planner", logined, in_project, app.controller.planner.destroy)
        router.post("/api/planner/:planner", logined, in_project, app.controller.planner.update)
    }

    {
        router.get("/api/planner/:planner/member", logined, in_project, app.controller.member.list)
        router.get("/api/planner/:planner/member/:member", logined, in_project, app.controller.member.detail)
        router.put("/api/planner/:planner/member", logined, in_project, app.controller.member.create)
        router.delete("/api/planner/:planner/member/:member", logined, in_project, app.controller.member.destroy)
    }

    {
        router.get("/api/planner/:planner/mine", logined, in_project, app.controller.mine.list)
    }
    {
        router.get("/api/planner/:planner/milestone", logined, in_project, app.controller.milestone.list)
        router.put("/api/planner/:planner/milestone", logined, in_project, app.controller.milestone.create)
        router.post("/api/planner/:planner/milestone", logined, in_project, app.controller.milestone.detail)
        router.post("/api/planner/:planner/milestone/:milestone", logined, in_project, app.controller.milestone.update)
        router.delete("/api/planner/:planner/milestone/:milestone", logined, in_project, app.controller.milestone.destroy)
    }

    {
        router.get("/api/planner/:planner/backlogs", logined, in_project, app.controller.backlogs.list)
        router.get("/api/planner/:planner/backlogs/:backlog", logined, in_project, app.controller.backlogs.detail)
        router.put("/api/planner/:planner/backlogs", logined, in_project, app.controller.backlogs.create)
        router.post("/api/planner/:planner/backlogs/:backlog", logined, in_project, app.controller.backlogs.update)
        router.delete("/api/planner/:planner/backlogs/:backlog", logined, in_project, app.controller.backlogs.destroy)
    }

    {
        router.get("/api/planner/:planner/issues", logined, in_project, app.controller.issues.list)
        router.get("/api/planner/:planner/issues/:issue", logined, in_project, app.controller.issues.detail)
        router.put("/api/planner/:planner/issues", logined, in_project, app.controller.issues.create)
        router.post("/api/planner/:planner/issues/:issue", logined, in_project, app.controller.issues.update)
        router.delete("/api/planner/:planner/issues/:issue", logined, in_project, app.controller.issues.destroy)
    }

    {
        router.get("/api/planner/:planner/boards", logined, in_project, app.controller.boards.list)
        router.put("/api/planner/:planner/boards", logined, in_project, app.controller.boards.create_group)
        router.get("/api/planner/:planner/boards/:group", logined, in_project, app.controller.boards.group_detail)
        router.post("/api/planner/:planner/boards/:group", logined, in_project, app.controller.boards.update_group)
        router.delete("/api/planner/:planner/boards/:group", logined, in_project, app.controller.boards.destroy_group)

        router.put("/api/planner/:planner/boards/:group", logined, in_project, app.controller.boards.create_col)
        router.get("/api/planner/:planner/boards/:group/:col", logined, in_project, app.controller.boards.col_detail)

        router.post("/api/planner/:planner/boards/:group/move", logined, in_project, app.controller.boards.move_col)        //这两条的路由和下面的及其相似，不要搞错地方了
        router.post("/api/planner/:planner/boards/:group/move_note", logined, in_project, app.controller.boards.move_note)

        router.post("/api/planner/:planner/boards/:group/:col", logined, in_project, app.controller.boards.update_col)
        router.delete("/api/planner/:planner/boards/:group/:col", logined, in_project, app.controller.boards.destroy_col)

        router.put("/api/planner/:planner/boards/:group/:col", logined, in_project, app.controller.boards.create_note)
        router.post("/api/planner/:planner/boards/:group/:col/:note", logined, in_project, app.controller.boards.update_note)
        router.delete("/api/planner/:planner/boards/:group/:col/:note", logined, in_project, app.controller.boards.destroy_note)
    }

    {
        router.get("/api/planner/:planner/wiki", logined, in_project, app.controller.wiki.list)
        router.get("/api/planner/:planner/wiki/:article", logined, in_project, app.controller.wiki.detail)
        router.put("/api/planner/:planner/wiki", logined, in_project, app.controller.wiki.create)
        router.post("/api/planner/:planner/wiki/:article", logined, in_project, app.controller.wiki.update)
        router.delete("/api/planner/:planner/wiki/:article", logined, in_project, app.controller.wiki.destroy)
    }

    {
        router.get("/api/planner/:planner/pan", logined, in_project, app.controller.pan.list)                   //通过query 获得路径
        router.put("/api/planner/:planner/pan", logined, in_project, app.controller.pan.mkdir)                  //post body
        router.post("/api/planner/:planner/pan", logined, in_project, upload, app.controller.pan.upload)        //通过query 获得路径
        router.post("/api/planner/:planner/pan/delete", logined, in_project, app.controller.pan.destroy)        //post body
    }

    if (process.env.NODE_ENV == "development")
    {
        const static = app.middleware.static

        router.get("/public/upload/*", static)             // post body
    }
}