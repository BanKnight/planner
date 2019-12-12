module.exports = {
    port: 7000,
    middleware: ["compress", "session", "user", "body"],
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
}