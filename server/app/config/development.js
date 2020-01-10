const path = require("path")

module.exports = {
    port: 7000,
    db: {
        url: "mongodb://192.168.1.4:27019",
        name: "planner",
    },
    jwt: {
        secret: "nobody",
        options: {
            expiresIn: "30d",
        }
    },
}