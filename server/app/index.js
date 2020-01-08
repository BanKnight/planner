
const { Application } = require("./core")

module.exports = async function()
{
    const app = new Application({
        app_path: __dirname
    })

    try
    {
        await app.run()

    }
    catch (err)
    {
        console.error(err)
    }

}
