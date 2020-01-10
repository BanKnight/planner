// vue.config.js
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:7000',
                changeOrigin: true,
                ws: true,
            },
            '/public': {
                target: 'http://localhost:7000',
                changeOrigin: true,
                ws: true,
            },
        }
    }
}
