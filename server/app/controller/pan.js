const { Controller } = require("../core")
const { error } = require("../define")
const { cal_page } = require("../utils")

const fs = require("fs-extra")
const path = require("path")

module.exports = class Current extends Controller
{
    constructor(ctx, app)
    {
        super(ctx, app)
    }

    /**
     */
    list()
    {
        const { ctx, service } = this

        const current = service.pan

        let pan = current.get_pan(ctx.params.planner)

        let target_path = ctx.query.path || "/"

        let file = pan.files[target_path]

        if (file == null)
        {
            ctx.status = 404
            ctx.body = {
                error: "no such file"
            }
            return
        }

        if (!file.directory)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "is not a directory"
            }
            return
        }

        let children = []

        current.under(pan, file, (child) =>
        {
            children.push(child)

        })

        ctx.body = {
            file,
            children,
        }
    }

    async mkdir()
    {
        const { ctx, service } = this
        const { user } = ctx
        const planner_id = ctx.params.planner
        const current = service.pan

        let body = ctx.request.body

        let file = current.mkdir(planner_id, body.path, body.name, user._id)

        ctx.body = file
    }

    async upload()
    {
        const { ctx, service, config } = this
        const { user } = ctx

        const planner_id = ctx.params.planner
        const current = service.pan

        const file = ctx.request.files.file

        const pan_file = current.upload(planner_id, ctx.query.path, file.name, user._id, file)

        const pan_directory = path.join(config.upload.dir, ctx.params.planner)

        await fs.mkdirp(pan_directory)

        const whole_path = path.join(pan_directory, pan_file.res)

        await this._save(file, whole_path)

        ctx.body = pan_file
    }

    destroy()
    {
        const { ctx, service, config } = this

        const planner_id = ctx.params.planner
        const current = service.pan

        const body = ctx.request.body

        const files = current.unlink(planner_id, body.path, body.name)

        const pan_directory = path.join(config.upload.dir, ctx.params.planner)

        for (let file of files)
        {
            if (!file.directory)
            {
                const whole_path = path.join(pan_directory, file.res)

                fs.unlink(whole_path)
            }
        }

        ctx.body = {}
    }

    _save(file, path)
    {
        return new Promise((resolve, reject) =>
        {
            let render = fs.createReadStream(file.path);
            // 创建写入流
            let upStream = fs.createWriteStream(path);
            render.pipe(upStream);
            upStream.on('finish', () =>
            {
                resolve(path)
            });
            upStream.on('error', (err) =>
            {
                reject(err)
            });
        })
    }
}