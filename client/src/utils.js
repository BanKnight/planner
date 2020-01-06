export function utc_to_local(time)
{
    let formatNum = (num) =>
    {
        return num >= 10 ? num : ('0' + num)
    }
    let arr = time.split(/[^0-9]/)
    let worldDate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
    let localDate = new Date(worldDate.getTime() + 8 * 60 * 60 * 1000)
    return formatNum(localDate.getFullYear()) + "-"
        + formatNum((localDate.getMonth() + 1)) + "-"
        + formatNum(localDate.getDate()) + " "
        + formatNum(localDate.getHours()) + ":"
        + formatNum(localDate.getMinutes()) + ":"
        + formatNum(localDate.getSeconds())
}

export function planner_res_url(base, planner, res)
{
    return `${base}/public/upload/${planner}/${res}`;

}

export function do_together(together)
{
    let waiting = null;
    let running = null;

    let do_ = (id) =>
    {
        waiting = waiting || {};

        let existed = waiting[id];
        if (existed == null)
        {
            existed = [];
            waiting[id] = existed;
        }

        let pro = new Promise((resolve, reject) =>
        {
            existed.push({
                resolve,
                reject
            });
        });

        if (!running)
        {
            run();
        }

        return pro;
    }

    let run = () =>
    {
        running = true;
        setImmediate(async () =>
        {
            let temp = waiting;

            waiting = null;

            let ids = [];

            for (let id in temp)
            {
                ids.push(id);
            }

            try
            {
                let resps = await together(ids)

                for (let index = 0; index < ids.length; ++index)
                {
                    let id = ids[index];
                    let resp = resps[index]

                    for (let pro of temp[id])
                    {
                        pro.resolve(resp);
                    }
                }
            }
            catch (e)
            {
                for (let index = 0; index < ids.length; ++index)
                {
                    let id = ids[index];

                    for (let pro of temp[id])
                    {
                        pro.reject(e);
                    }
                }
            }

            if (waiting == null)
            {
                running = false;
            }
            else
            {
                run();
            }
        });
    }

    return do_
}