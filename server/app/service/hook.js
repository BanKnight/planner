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
      this.delete_message(data.hook_url,'backlogs',data.data)
    }

    add_backlog(body)
    {
      let data = this.default_serialize(body)
      this.create_message(data.hook_url,'backlogs',data.data)

    }

    update_backlog(old_one,new_one)
    {
      let data = {}
      let planner = this.get_planner(old_one.planner)
      let url = old_one.url
      url = url + `/detail/${old_one._id}`

      let author = this.service.user.get(old_one.author)
      data.author = author.name
      // default
      data.url = url
      data.planner = planner.planner
      data.arg = new Date().getTime()
      let assignee = this.get_assignee(old_one.assignee)
      data.assignee = [assignee]

      if(new_one.closed === true)
      {
          data.title = old_one.title
          data.back_online = false
          return this.update_message(planner.hook_url,'backlogs', data)
      }

      let result = this.compare(old_one,new_one,['title','milestone','assignee','content','closed'])

      if(result.size ===0)
      {
          return
      }

      // 表示问题重新上线
      if(result.get('closed'))
      {
        data.title = old_one.title
        data.back_online = true
        return this.update_message(planner.hook_url,'backlogs', data)
      }
      data.title = new_one.title
      data.update  = this.backlogs_update_serialize(result)
      assignee = this.get_assignee(new_one.assignee)
      data.assignee.push(assignee)
      this.update_message(planner.hook_url,'backlogs',data)
    }

    // boards --------------------------------

    add_boards(body,group,col)
    {
        let data = this.default_serialize(body)
        let hook_url = data.hook_url
        data = data.data
        data.stop = body.stop
        data.content = body.content
        data.group = group
        data.col = col
        data.stats = body.stats
        data.url = body.url
        this.create_message(hook_url,'boards',data)
    }

    update_boards(old_one,new_one)
    {
        let new_stop = new_one.stop
        new_one.stop = String(new_stop)
        let data = this.default_serialize(new_one)
        let hook_url = data.hook_url
        data = data.data

        let arg = ['title','assignee','content','stop','stats']
        let result = this.compare(old_one,new_one,arg)
        data.update = this.backlogs_update_serialize(result)
        data.url = new_one.url

        // 指派人发生了变化三方都通知
        if(result.get('assignee'))
        {
            let assignee = this.get_assignee(old_one.assignee)
            data.assignee.push(assignee)

        }

        data.assignee.push(data.author)
        this.update_message(hook_url,'boards',data)
    }

    del_boards(body)
    {
        let data = this.default_serialize(body)
        this.delete_message(data.hook_url,'boards',data.data)
    }
    
    move_boards(old_one,to_title,target)
    {
        let from_title = old_one.title
        let note_list = old_one.notes
        let title = ''
        let assignee = false
        let url = ''
        for(let index in note_list)
        {
            let item = note_list[index]
            if(target === item._id)
            {
                title = item.title
                assignee = item.assignee
                url = item.url
                break
            }
        }
        if(!assignee)
        {
            return
        }
        old_one.title = title
        old_one.assignee = assignee
        
        let data = this.default_serialize(old_one)
        let hook_url = data.hook_url
        data = data.data
        data.assignee.push(data.author)
        data.move = [from_title,to_title]
        data.url = url
        this.move_message(hook_url,'boards',data)

    }


    // issues ---------------------------------------
    add_issues(body)
    {
        let data = this.default_serialize(body)
        this.create_message(data.hook_url,'issues',data.data)
    }
    del_issues(body)
    {
        let data = this.default_serialize(body)
        this.delete_message(data.hook_url,'issues',data.data)
    }

    update_issues(old_one,new_one)
    {
        let data = {}
        let planner = this.get_planner(old_one.planner)
        let url = old_one.url
        url = url + `/detail/${old_one._id}`
  
        let author = this.service.user.get(old_one.author)
        data.author = author.name
        // default
        data.url = url
        data.planner = planner.planner
        data.arg = new Date().getTime()
        let assignee = this.get_assignee(old_one.assignee)
        data.assignee = [assignee]
  
        if(new_one.closed === true)
        {
            data.title = old_one.title
            data.back_online = false
            return this.update_message(planner.hook_url,'issues', data)
        }
  
        let result = this.compare(old_one,new_one,['title','milestone','assignee','content','closed'])
  
        if(result.size ===0)
        {
            return
        }
        // 表示问题重新上线
        if(result.get('closed'))
        {
            data.title = old_one.title
            data.back_online = true
            return this.update_message(planner.hook_url,'backlogs', data)
        }
    
        data.title = new_one.title
        data.update  = this.backlogs_update_serialize(result)
        assignee = this.get_assignee(new_one.assignee)
        data.assignee.push(assignee)
        this.update_message(planner.hook_url,'issues',data)
    }

    // 默认序列化
    // author url milestone title planner
    default_serialize(body)
    {
        let data = {}
        let planner = this.get_planner(body.planner)
        let url = body.url
        url = url + `/detail/${body._id}`

        let author = this.service.user.get(body.author)
        data.author = author.name

        let milestone = '无'
        if(body.milestone)
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
        if(body.assignee)
        {
            let assignee = this.get_assignee(body.assignee)
            data.assignee.push(assignee)
        }
        let hook_url = planner.hook_url
        return {data,hook_url}
    }
    // arg 要对比的字段 type array
    compare(old,one,arg)
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

        return {planner,hook_url}
    }

    get_assignee(id)
    {
        let assignee = this.service.user.get(id)
        return assignee.name
    }


    // milestone --------------------------------
    add_milestone()
    {}

    update_milestone()
    {}

    del_milestone()
    {}


    //-------serialize--------------------------------------------------------
    backlogs_update_serialize(info)
    {
        let result = {}
        if(info.size === 0)
        {
            return
        }

        let milestone_list = info.get('milestone')
        if(milestone_list)
        {
            let milestone = []
            for(let item of milestone_list)
            {
                let data = this.service.milestone.get(item)
                milestone.push(data.title)
            }
    
            result.milestone = milestone
        }
        

        
        let assignee_list = info.get('assignee')
        if(assignee_list)
        {
            let assignee = []
            for(let item of assignee_list)
            {
                let data = this.service.user.get(item)
                assignee.push(data.name)
            }
    
            result.assignee = assignee
        }
        if(info.get('title'))
        {
            result.title = info.get('title')
        }

        if(info.get('content'))
        {
            result.content = info.get('content')
        }

        if(info.get('stop'))
        {
            result.stop = info.get('stop')
        }

        if(info.get('stats'))
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
      let url = body.url
      let title = body.title
      let assignee = this.service.user.get(assignee_id)
      let author = this.service.user.get(author_id)
      let planner = this.service.planner.get(planner_id)

      let milestone = '无'
      if(milestone_id)
      {
          milestone = this.service.milestone.get(milestone_id)
          milestone = milestone.title
      }

      url = url + `/detail/${body._id}`

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
        url,
        title,
        form,
        author
      }
      return {
        hook_url:hook_url,
        msg:{assignee, msg}
      }
    }
    // api----------------------------------------

    move_message(url,describe,data)
    {
        return this.send_hook({
            url: url+`/api/${describe}/${data.arg}/move`,
            json: data,
            method:'put'
          })
    }
    create_message(url,describe,data)
    {
      return this.send_hook({
        url: url+`/api/${describe}`,
        json: data,
        method:'post'
      })
    }
  
    update_message(url,describe,data)
    {
      return this.send_hook({
        url: url+`/api/${describe}/${data.arg}`,
        json: data,
        method:'put'
      })
    }
  
    delete_message(url,describe,data)
    {
      return this.send_hook({
        url: url+`/api/${describe}/${data.arg}`,
        json: data,
        method:'delete'
      })
    }

    async send_hook(options)
    {
      options.headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }

      let res = await https(options)
      res = res.body
      return res
    }
}
