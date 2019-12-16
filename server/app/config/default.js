module.exports = {
    port: 7000,
    middleware: ["cors", "compress", "session", "user", "cache", "body"],
    mongodb: {
        host: "192.168.1.4",
        port: 27019,
        db: "planner",
    },
    session: {
        key: 'sess-secret:',
        maxAge: 86400000,
    },
    compress: {
        threshold: 2048,
    },
    cache: {
        max: 500,
    },
    cors: {
        credentials: true,
    }
}