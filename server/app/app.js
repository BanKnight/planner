/**
 * 放置启动时候的初始化工作,
 * 这时候只有config,没有其他内容
 */
const fs = require("fs")
const semver = require('semver')
const Db = require("./utils/Db")

exports.before = async (app) =>
{
    await load_version(app)

    await connct_db(app)

    await load_db_version(app)
}

exports.after = async (app) =>
{
    //写入新的版本号
    app.db.set("env", "version", { val: process.env.VERSION })
}

async function load_version(app)
{
    const content = JSON.parse(fs.readFileSync("./package.json", { encoding: "utf8" }))

    process.env.VERSION = content.version

    process.env.MAJOR_VERSION = semver.major(content.version).toString()
    process.env.MINOR_VERSION = semver.minor(content.version).toString()
}

async function connct_db(app)
{
    const config = app.config.db

    app.db = new Db(config)

    return app.db.connect()
}

/**
 * 读取数据库中的版本
 */
async function load_db_version(app)
{
    let data = await app.db.get("env", "version")

    if (data == null)
    {
        return
    }

    let version = data.val

    process.env.LAST_VERSION = version

    process.env.LAST_MAJOR_VERSION = semver.major(version).toString()
    process.env.LAST_MINOR_VERSION = semver.minor(version).toString()
}






