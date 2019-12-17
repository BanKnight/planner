const bs = require("binary-search")

function default_cmp(first, second)
{
    return first - second
}

module.exports = class SortedArray
{
    constructor(cmp)
    {
        this.cmp = cmp || default_cmp
        this.data = []
    }

    push(item)
    {
        let index = bs(this.data, item, this.cmp)
        if (index >= 0)
        {
            return
        }

        index = ~index

        this.data.splice(index, 0, item)
    }

    pop(item)
    {
        let index = bs(this.data, item, this.cmp)
        if (index < 0)
        {
            return
        }

        if (this.data[index] != item)
        {
            return
        }

        this.data.splice(index, 1)
    }
}