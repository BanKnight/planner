const { Service } = require("../core")
const https = require('koa2-request')
module.exports = class Current extends Service
{
    constructor(app)
    {
        super(app)
    }
    // backlogs ------------------------------------------------

    del_backlog(body)
    {
        let data = this.default_serialize(body)
        let url = this.get_url(body, 'backlogs', true)
        data.data.url = url
        this.delete_message(data.hook_url, 'backlogs', data.data)
    }

    add_backlog(body)
    {
        let data = this.default_serialize(body)
        let url = this.get_url(body, 'backlogs')
        data.data.url = url
        this.create_message(data.hook_url, 'backlogs', data.data)

    }

    update_backlog(old_one, new_one)
    {
        let data = this.default_serialize(old_one)
        let url = this.get_url(old_one, 'backlogs')
        let hook_url = data.hook_url
        data = data.data
        data.url = url

        if (new_one.closed !== null)
        {
            data.back_online = false
            return this.update_message(hook_url, 'backlogs', data)
        }

        let result = this.compare(old_one, new_one, ['title', 'milestone', 'assignee', 'content', 'closed'])
        if (result.size === 0)
        {
            return
        }

        // back online
        if (result.get('closed'))
        {
            data.back_online = true
            return this.update_message(hook_url, 'backlogs', data)
        }

        data.title = new_one.title
        data.update = this.backlogs_update_serialize(result)
        let assignee = this.get_assignee(new_one.assignee)
        data.assignee.push(assignee)
        this.update_message(hook_url, 'backlogs', data)
    }

    // boards --------------------------------
    add_boards(body, group, col)
    {
        body = Object.assign({}, body)
        body._id = col.group

        let url = this.get_url(body, 'boards')
        let data = this.default_serialize(body)
        let hook_url = data.hook_url

        data = data.data
        data.stop = body.stop
        data.content = body.content
        data.group = group
        data.col = col.title
        data.stats = body.stats
        data.url = url
        this.create_message(hook_url, 'boards', data)
    }

    update_boards(old_one, new_one, group_id)
    {
        new_one = Object.assign({}, new_one)
        old_one = Object.assign({}, old_one)

        let new_stop = new_one.stop
        let data = this.default_serialize(new_one)
        let hook_url = data.hook_url
        new_one.stop = String(new_stop)
        old_one.stop = String(old_one.stop)
        new_one._id = group_id
        data = data.data

        let arg = ['title', 'assignee', 'content', 'stop', 'stats']
        let result = this.compare(old_one, new_one, arg)
        data.update = this.backlogs_update_serialize(result)
        data.url = this.get_url(new_one, 'boards')

        // 指派人发生了变化三方都通知
        if (result.get('assignee'))
        {
            let assignee = this.get_assignee(old_one.assignee)
            data.assignee.push(assignee)

        }

        data.assignee.push(data.author)
        this.update_message(hook_url, 'boards', data)
    }

    del_boards(body)
    {
        let data = this.default_serialize(body)
        let url = this.get_url(body, 'boards', true)
        data.data.url = url
        this.delete_message(data.hook_url, 'boards', data.data)
    }

    move_boards(from, to, target)
    {

        from = Object.assign({}, from)
        to = Object.assign({}, to)

        let to_title = to.title
        let note_list = to.notes
        let title = ''
        let assignee = false

        for (let index in note_list)
        {
            let item = note_list[index]
            if (target === item._id)
            {
                title = item.title
                assignee = item.assignee
                break
            }
        }
        if (!assignee)
        {
            return
        }
        to.title = title
        to.assignee = assignee
        to._id = to.group

        let data = this.default_serialize(to)
        let hook_url = data.hook_url
        let url = this.get_url(to, 'boards')

        data = data.data
        data.assignee.push(data.author)
        data.move = [from.title, to_title]
        data.url = url
        this.move_message(hook_url, 'boards', data)

    }


    // issues ---------------------------------------
    add_issues(body)
    {
        let data = this.default_serialize(body)
        let url = this.get_url(body, 'issues')
        data.data.url = url
        this.create_message(data.hook_url, 'issues', data.data)
    }
    del_issues(body)
    {
        let data = this.default_serialize(body)
        let url = this.get_url(body, 'issues', true)
        data.data.url = url
        this.delete_message(data.hook_url, 'issues', data.data)
    }

    update_issues(old_one, new_one)
    {
        let data = this.default_serialize(old_one)
        let url = this.get_url(old_one, 'issues')
        let hook_url = data.hook_url
        data = data.data
        data.url = url

        if (new_one.closed !== null)
        {
            data.back_online = false
            return this.update_message(hook_url, 'issues', data)
        }

        let result = this.compare(old_one, new_one, ['title', 'milestone', 'assignee', 'content', 'closed'])

        if (result.size === 0)
        {
            return
        }
        // 表示问题重新上线
        if (result.get('closed'))
        {
            data.title = old_one.title
            data.back_online = true
            return this.update_message(hook_url, 'issues', data)
        }

        data.title = new_one.title
        data.update = this.backlogs_update_serialize(result)
        let assignee = this.get_assignee(new_one.assignee)
        data.assignee.push(assignee)
        this.update_message(hook_url, 'issues', data)
    }

    // 默认序列化
    // author milestone title planner arg
    default_serialize(body)
    {
        let data = {}
        let planner = this.get_planner(body.planner)
        let url = body.url
        url = url + `/detail/${body._id}`

        let author = this.service.user.get(body.author)
        data.author = author.name

        let milestone = '无'
        if (body.milestone)
        {
            milestone = this.service.milestone.get(body.milestone)
            milestone = milestone.title
        }

        data.milestone = milestone
        data.url = url
        data.planner = planner.planner
        data.arg = new Date().getTime()
        data.title = body.title
        data.assignee = []
        if (body.assignee)
        {
            let assignee = this.get_assignee(body.assignee)
            data.assignee.push(assignee)
        }
        let hook_url = planner.hook_url
        return { data, hook_url }
    }
    // arg 要对比的字段 type array
    compare(old, one, arg)
    {
        let compare_list = new Map()
        for (let item of arg)
        {
            if (old[item] !== one[item])
            {
                compare_list.set(item, [old[item], one[item]])
            }
        }
        return compare_list
    }

    get_planner(id)
    {
        let planner = this.service.planner.get(id)
        let hook_url = planner.hook_url
        planner = planner.name

        return { planner, hook_url }
    }

    get_assignee(id)
    {
        let assignee = this.service.user.get(id)
        return assignee.name
    }

    get_url(info, arg, is_delete)
    {
        if (is_delete)
        {
            return `/#/planner/${info.planner}/${arg}`
        }
        return `/#/planner/${info.planner}/${arg}/detail/${info._id}`
    }

    //-------serialize--------------------------------------------------------
    backlogs_update_serialize(info)
    {
        let result = {}
        if (info.size === 0)
        {
            return
        }

        let milestone_list = info.get('milestone')
        if (milestone_list)
        {
            let milestone = []
            for (let item of milestone_list)
            {
                let data = this.service.milestone.get(item) || {}
                milestone.push(data.title || '无')
            }

            result.milestone = milestone
        }



        let assignee_list = info.get('assignee')
        if (assignee_list)
        {
            let assignee = []
            for (let item of assignee_list)
            {
                let data = this.service.user.get(item)
                assignee.push(data.name)
            }

            result.assignee = assignee
        }
        if (info.get('title'))
        {
            result.title = info.get('title')
        }

        if (info.get('content'))
        {
            result.content = info.get('content')
        }

        if (info.get('stop'))
        {
            result.stop = info.get('stop')
        }

        if (info.get('stats'))
        {
            result.stats = info.get('stats')
        }

        return result


    }

    backlogs_serialize(body)
    {
        let assignee_id = body.assignee
        let author_id = body.author
        let planner_id = body.planner
        let milestone_id = body.milestone
        let title = body.title
        let assignee = this.service.user.get(assignee_id)
        let author = this.service.user.get(author_id)
        let planner = this.service.planner.get(planner_id)

        let milestone = '无'
        if (milestone_id)
        {
            milestone = this.service.milestone.get(milestone_id)
            milestone = milestone.title
        }

        assignee = assignee.name
        let hook_url = planner.hook_url
        author = author.name
        planner = planner.name
        milestone = milestone.title

        let form = {
            planner,
            milestone,
        }
        let msg = {
            title,
            form,
            author
        }
        return {
            hook_url: hook_url,
            msg: { assignee, msg }
        }
    }
    // api----------------------------------------

    move_message(url, describe, data)
    {
        return this.send_hook({
            url: url + `/api/${describe}/${data.arg}/move`,
            json: data,
            method: 'put'
        })
    }
    create_message(url, describe, data)
    {
        return this.send_hook({
            url: url + `/api/${describe}`,
            json: data,
            method: 'post'
        })
    }

    update_message(url, describe, data)
    {
        return this.send_hook({
            url: url + `/api/${describe}/${data.arg}`,
            json: data,
            method: 'put'
        })
    }

    delete_message(url, describe, data)
    {
        return this.send_hook({
            url: url + `/api/${describe}/${data.arg}`,
            json: data,
            method: 'delete'
        })
    }

    send_hook(options)
    {
        options.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        console.log(options)
        let res = https(options)
    }
}
