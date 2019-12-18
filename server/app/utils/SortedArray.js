const bs = require("binary-search")

function default_cmp(first, second)
{
    return first - second
}


module.exports = class SortedArray
{
    /**
     * 注意：为了可以正确pop出对应的item，
     * cmp 必须是精确比较，提供三值
     * 
     * 0：等于
     * 1：大于
     * -1：小于
     * @param {*} cmp
     */
    constructor(cmp)
    {
        this.cmp = cmp || default_cmp
        this.data = []
    }

    push(item)
    {
        let index = bs(this.data, item, this.cmp)
        if (index < 0)
        {
            index = ~index
        }

        this.data.splice(index, 0, item)
    }

    /**
     * 注意：为了可以正确pop出对应的item，
     * cmp 必须是精确比较，提供三值
     * 
     * 0：等于
     * 1：大于
     * -1：小于
     *
     * @param {*} item
     */
    pop(item)
    {
        let index = bs(this.data, item, this.cmp)
        if (index < 0)
        {
            return
        }

        this.data.splice(index, 1)
    }
}