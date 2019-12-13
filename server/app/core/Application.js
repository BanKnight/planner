const utils = require('../utils');
const KoaApplication = require('koa');
const Router = require("./Router");

const path = require('path');
const is = require("is-type-of")
const extend = require('extend2');

module.exports = class Application extends KoaApplication
{
    constructor(options = {})
    {
        super()

        this.app_path = options.app_path

    }

    async run()
    {
        this.router = new Router()

        this.load_config()

        await this.load_app()

        this.load_service()

        this.load_schedule()

        this.load_controller()

        this.load_middleware()

        this.load_router()

        await this.start_service()

        this
            .use(this.router.routes())
            .use(this.router.allowedMethods())

        this.listen(this.config.port)

        console.log(`app is listening on port ${this.config.port}`)
    }

    load_config()
    {
        const all = utils.load_folder(path.join(this.app_path, "config"))

        this.config = extend(true, {}, all.default, all[process.env.NODE_ENV]); //深拷贝，同字段覆盖
    }

    load_controller()
    {
        const all = utils.load_folder(path.join(this.app_path, "controller"))

        for (let name in all)
        {
            let controller = all[name]

            all[name] = this.wrap_controller(controller)
        }

        this.controller = all
    }

    load_middleware()
    {
        this.middlewares = utils.load_folder(path.join(this.app_path, "middleware"))    //koa 中已经有middleware 的字段，所以这里换成middlewares

        for (let name of this.config.middleware)         //按照配置里面的顺序use
        {
            let options = this.config[name] || {}
            let middleware = this.middlewares[name]

            if (middleware == null)
            {
                throw new Error(`middleware[${name}] not found`)
            }

            middleware = middleware(options, this)

            middleware = this.to_middleware(middleware, options)

            if (middleware)
            {
                this.use(middleware)
            }
        }
    }

    load_schedule()
    {
        // this.schedule = utils.load_folder(path.join(this.app_path, "schedule"))

    }

    load_service()
    {
        this.service_classes = utils.load_folder(path.join(this.app_path, "service"))
    }

    load_router()
    {
        const func = require(path.join(this.app_path, "router"))

        func(this)
    }

    async start_service()
    {
        this.service = {}

        for (let name in this.service_classes)
        {
            let one = this.service_classes[name]
            let inst = new one(this)

            this.service[name] = inst
        }

        for (let name in this.service)
        {
            let inst = this.service[name]

            await inst.start()
        }
    }

    async load_app()
    {
        const func = require(path.join(this.app_path, "./app"))

        await func(this)
    }

    wrap_controller(Controller)
    {
        const ret = {}
        let proto = Controller.prototype;

        while (proto !== Object.prototype)
        {
            const keys = Object.getOwnPropertyNames(proto);
            for (const key of keys)
            {
                // getOwnPropertyNames will return constructor
                // that should be ignored
                if (key === 'constructor')
                {
                    continue;
                }
                // skip getter, setter & non-function properties
                const d = Object.getOwnPropertyDescriptor(proto, key);
                // prevent to override sub method
                if (is.function(d.value) && !ret.hasOwnProperty(key))
                {
                    ret[key] = this.to_route(Controller, key);
                }
            }
            proto = Object.getPrototypeOf(proto);
        }

        return ret
    }

    to_route(Controller, key)
    {
        const app = this
        return function (ctx, next)
        {
            const controller = new Controller(ctx, app);
            const fun = controller[key]

            if (fun == null)
            {
                return
            }

            return fun.call(controller, ctx, next)
        };

    }

    to_middleware(func, options)
    {
        if (options.enabled === false)
        {
            return
        }

        return func
    }
}