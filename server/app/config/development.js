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
    upload: {
        multipart: true, // 支持文件上传
        dir: path.resolve("./public/upload"), // 支持文件上传
        formidable: {
            keepExtensions: true,    // 保持文件的后缀
            maxFieldsSize: 20 * 1024 * 1024, // 最大文件大小
            multipart: true // 是否支持 multipart-formdate 的表单
        }
    },
}