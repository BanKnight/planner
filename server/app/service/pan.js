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

    mkdir(pan_id, parent_path, name, author_id)
    {
        let pan = this.get_pan(pan_id)

        let parent_file = pan.files[parent_path]

        if (parent_path != "/" && (parent_file == null || !parent_file.directory))
        {
            throw new Error("目标目录不存在父目录")
        }

        let whole_path = path.join(parent_path, name).replace("\\", "/")

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
            pan: pan_id,
            path: whole_path,
            directory: true,
        }

        pan.files[whole_path] = file

        this.app.db.set("pan.files", file._id, file)

        return file
    }

    unlink(pan_id, parent_path, name)
    {
        let pan = this.get_pan(pan_id)

        let whole_path = path.join(parent_path, name).replace("\\", "/")

        let file = pan.files[whole_path]

        if (file == null)
        {
            return
        }

        delete pan.files[whole_path]

        if (!file.directory)
        {
            this.app.db.delete("pan.files", file._id)

            return file
        }

        for (let child_path in pan.files)
        {
            let one = pan.files[child_path]

            if (path.dirname(child_path) == whole_path)
            {
                delete pan.files[child_path]

                this.app.db.delete("pan.files", one._id)
            }
        }

        return file
    }

    upload(pan_id, parent_path, name, author_id, raw_file)
    {
        let pan = this.get_pan(pan_id)

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

            whole_path = path.join(parent_path, name).replace("\\", "/")

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
            pan: pan_id,
            name: name,
            size: raw_file.size,
            author: author_id,
            ext: ext,
            base: base_name,
            path: whole_path,
            res: `${_id}${ext}`
        }

        pan.files[whole_path] = file

        this.app.db.set("pan.files", file._id, file)

        return file
    }

    move(pan_id, old_path, parent_path)
    {
        let pan = this.get_pan(pan_id)

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

        let new_path = path.join(parent_path, file.name).replace("\\", "/")

        if (pan.files[new_path])
        {
            throw new Error("目标位置已经有文件存在")
        }

        if (file.directory)
        {

        }

        file.path = new_path

        this.app.db.set("pan.files", file._id, file)
    }

    rename(pan_id, whole_path, new_name)
    {
        let pan = this.get_pan(pan_id)

        let file = pan.files[whole_path]

        if (file == null)
        {
            throw new Error("no such file")
        }

        let parent_path = path.dirname(whole_path)

        let new_path = path.join(parent_path, new_name).replace("\\", "/")

        let existed = pan.files[new_path]

        if (existed)
        {
            throw new Error("has already had the same name file")
        }

        file.path = new_path

        this.app.db.set("pan.files", file._id, file)
    }

    get_pan(id)
    {
        let pan = this.ids[id]
        if (pan == null)
        {
            pan = {
                _id: id,
                files: {},          //[path] = file
            }

            this.ids[id] = pan
        }

        return pan
    }
}