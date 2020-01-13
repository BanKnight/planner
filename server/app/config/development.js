const path = require("path")

module.exports = {
    port: 7000,
    db: {
        url: "tinydb://./data",
        name: "planner",
    },
    jwt: {
        secret: "nobody",
        options: {
            expiresIn: "30d",
        }
    },
}