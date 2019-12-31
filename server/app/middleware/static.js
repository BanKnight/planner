const static = require('koa-static')

module.exports = (options, app) =>
{
    return static(options.dir)
}

