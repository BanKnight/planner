// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://planner.tinyfunny.net",
        changeOrigin: true,
        ws: true
      },
      "/public": {
        target: "http://planner.tinyfunny.net",
        changeOrigin: true,
        ws: true
      }
    }
  }
};
