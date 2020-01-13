/**
 * 放置启动时候的初始化工作,
 * 这时候只有config,没有其他内容
 */

const Db = require("./utils/Db")

module.exports = async (app) =>
{
    const config = app.config.db

    app.db = new Db(config)

    return app.db.connect()
}

