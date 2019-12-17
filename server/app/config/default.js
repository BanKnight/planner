module.exports = {
    port: 7000,
    middleware: ["cors", "compress", "jwt", "user", "cache", "body"],
    mongodb: {
        host: "192.168.1.4",
        port: 27019,
        db: "planner",
    },
    compress: {
        threshold: 2048,
    },
    cache: {
        max: 500,
    },
    cors: {
        credentials: true,
    },
    jwt: {
        secret: "nobody",
        options: {
            expiresIn: "30d",
        }
    }
}