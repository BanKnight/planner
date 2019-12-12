
const { Application } = require("./core")

module.exports = async function ()
{
    const app = new Application({
        app_path: __dirname
    })

    console.log(`app path:${__dirname}`)


    await app.run()

    console.log("app is listener")
}
