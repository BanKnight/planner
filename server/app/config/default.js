const path = require("path")

module.exports = {
    port: 7000,
    middleware: ["cors", "compress", "jwt", "user", "cache", "body", "catch"],
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
    },
    page: {
        size: 10,                    //每页条目数量    
    },
    upload: {
        multipart: true, // 支持文件上传
        dir: path.resolve("./public/upload"), // 支持文件上传
        formidable: {
            keepExtensions: true,    // 保持文件的后缀
            maxFieldsSize: 20 * 1024 * 1024, // 最大文件大小
            multipart: true // 是否支持 multipart-formdate 的表单
        }
    },
    static: {
        dir: path.resolve("./")
    }
}