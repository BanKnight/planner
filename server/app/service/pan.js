const shortid = require("shortid")
const utils = require("../utils")
const { Service } = require("../core")
const extend = require("extend2")

const path = require("path")
const fs = require("fs-extra")

/**
 * 放置planner 中的基本信息
 */
module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)

        this.ids = {}       //[pan-id] = {_id:xx,files}
    }

    async start()
    {
        let array = await this.app.db.load("pan.files")

        for (let one of array)
        {
            let pan = this.get_pan(one.pan)

            pan.files[one.path] = one
        }
    }

    mkdir(pan, parent_path, name, author_id)
    {
        let parent_file = pan.files[parent_path]

        if (parent_path != "/" && (parent_file == null || !parent_file.directory))
        {
            throw new Error("目标目录不存在父目录")
        }

        let whole_path = path.join(parent_path, name).replace(/\\/g, "/")

        let file = pan.files[whole_path]

        if (file != null && file.directory == true)
        {
            return
        }

        if (file != null)
        {
            throw new Error("同名文件存在")
        }

        file = {
            _id: shortid.generate(),
            name: name,
            author: author_id,
            pan: pan._id,
            path: whole_path,
            directory: true,
            updated: Date.now(),
        }

        pan.files[whole_path] = file

        this.app.db.set("pan.files", file._id, file)

        return file
    }

    get_private(pan)
    {
        let file = pan.files["/.private"]
        if (file)
        {
            return file
        }

        file = {
            _id: shortid.generate(),
            name: "private",
            pan: pan._id,
            path: "/.private",
            directory: true,
            updated: Date.now(),
        }

        pan.files[file.path] = file

        this.app.db.set("pan.files", file._id, file)

        return file
    }

    /**
     * 删除
     */
    unlink(pan, parent_path, name)
    {
        let whole_path = path.join(parent_path, name).replace(/\\/g, "/")

        let files = []

        let file = pan.files[whole_path]

        if (file == null)
        {
            return files
        }

        files.push(file)

        delete pan.files[whole_path]

        this.app.db.delete("pan.files", file._id)

        if (!file.directory)
        {
            return files
        }

        this.travel(pan, file, (child) =>
        {
            files.push(child)

            delete pan.files[child.path]

            this.app.db.delete("pan.files", child._id)
        })

        return files
    }

    upload(pan, parent_path, name, author_id, raw_file)
    {
        let parent_file = pan.files[parent_path]

        if (parent_path != "/" && (parent_file == null || !parent_file.directory))
        {
            throw new Error("目标目录不存在父目录")
        }

        let ext = path.extname(name)

        let base_name = path.basename(name, ext)

        let whole_path = null

        while (true)
        {
            name = `${base_name}${ext}`

            whole_path = path.join(parent_path, name).replace(/\\/g, "/")

            let file = pan.files[whole_path]

            if (file == null)
            {
                break
            }

            base_name = `${base_name}_copy`
        }

        const _id = shortid.generate()
        let file = {
            _id: _id,
            pan: pan._id,
            name: name,
            size: raw_file.size,
            author: author_id,
            ext: ext,
            base: base_name,
            path: whole_path,
            res: `${_id}${ext}`,
            updated: Date.now(),

        }

        pan.files[whole_path] = file

        this.app.db.set("pan.files", file._id, file)

        return file
    }

    move(pan, old_path, parent_path)
    {
        let file = pan.files[old_path]

        if (file == null)
        {
            throw new Error("no such file")
        }

        let parent = pan.files[parent_path]

        if (parent_path != "/" && (parent == null || !parent.directory))
        {
            throw new Error("目标目录不存在父目录")
        }

        let new_path = path.join(parent_path, file.name).replace(/\\/g, "/")

        if (pan.files[new_path])
        {
            throw new Error("目标位置已经有文件存在")
        }

        if (file.directory)
        {
            this.travel(pan, file, (one) =>
            {
                one.path.replace(file.path, new_path)

                this.app.db.set("pan.files", one._id, one)
            })
        }

        file.path = new_path

        this.app.db.set("pan.files", file._id, file)
    }

    rename(pan, whole_path, new_name)
    {
        let file = pan.files[whole_path]

        if (file == null)
        {
            throw new Error("no such file")
        }

        let parent_path = path.dirname(whole_path)

        let new_path = path.join(parent_path, new_name).replace(/\\/g, "/")

        let existed = pan.files[new_path]

        if (existed)
        {
            throw new Error("has already had the same name file")
        }

        if (file.directory)
        {
            this.travel(pan, file, (one) =>
            {
                one.path.replace(file.path, new_path)

                this.app.db.set("pan.files", one._id, one)
            })
        }

        file.path = new_path

        this.app.db.set("pan.files", file._id, file)
    }

    under(pan, file, cb)
    {
        let parent_path = file.path

        for (let child_path in pan.files)
        {
            let one = pan.files[child_path]

            if (child_path != parent_path && path.dirname(child_path) == parent_path)
            {
                cb(one)
            }
        }
    }

    travel(pan, file, cb)
    {
        let parent_path = file.path

        for (let child_path in pan.files)
        {
            let one = pan.files[child_path]

            if (one.path.startsWith(parent_path) == false)
            {
                continue
            }

            cb(one)
        }
    }

    get_pan(id)
    {
        let pan = this.ids[id]
        if (pan == null)
        {
            pan = {
                _id: id,
                files: {
                    "/": { directory: true, path: "/" }
                },          //[path] = file
            }

            this.ids[id] = pan
        }

        return pan
    }
}