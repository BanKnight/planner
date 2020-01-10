const fs = require("fs")
const path = require("path")

exports.load_folder = function(root)
{
    let ret = {}
    let files = fs.readdirSync(root)

    for (let file of files)
    {
        let whole = path.join(root, file)

        let name = path.basename(file, path.extname(file))

        ret[name] = require(whole)
    }

    return ret
}

function default_filter(data)
{
    return data
}
/**
 * array:数组
 * size:每页的条目数量
 * curr：当前页码
 * filter:过滤器
 */
exports.cal_page = function(array, size, curr, filter = default_filter)
{
    let count = Math.floor(array.length / size)
    if (array.length % size > 0)
    {
        count += 1
    }
    let page = {
        curr: curr, //当前页码
        count: Math.max(count, 1), //总页数
        total: array.length,//条目总数
        data: [],//当前页的数据
    }

    curr = Math.min(page.count, curr)
    curr = Math.max(1, curr)

    let index = size * (curr - 1)

    for (let i = 0; i < size; ++i, ++index)
    {
        let data = array[index]
        if (data == null)
        {
            break
        }

        page.data.push(filter(data))
    }

    page.curr = curr

    return page
}

exports.SortedArray = require("./SortedArray")