const fs = require("fs")

const files = fs.readdirSync(__dirname)

module.exports = {}

for (let file of files)
{
    if (file == "index.js")
    {
        continue
    }

    const md = require(`./${file}`)

    Object.assign(module.exports, md)
}