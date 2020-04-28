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
    logger: {
        enabled: true,
    },
}