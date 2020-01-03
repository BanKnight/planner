
import Vue from 'vue'

export default {

    async login(context, payload)
    {
        return await Vue.axios.post("/api/user/login", payload)
    },

    async regist(context, payload)
    {
        return await Vue.axios.post("/api/user/regist", payload)
    },

    /**
     * payl
     */
    async user_search(context, payload)
    {
        return await Vue.axios.post("/api/user/search", payload)
    },

    async user_reset(context, payload)
    {
        return await Vue.axios.post("/api/user/reset", payload)
    },

    //-----------------------
    async planner_list(context, payload)
    {
        return await Vue.axios.get("/api/planner", payload)
    },

    async planner_create(context, payload)
    {
        return await Vue.axios.put("/api/planner", payload)
    },
    async planner_public(context, payload)
    {
        return await Vue.axios.post(`/api/planner/public`, payload.data)
    },
    async planner_detail(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}`)
    },
    async planner_update(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}`, payload.data)
    },

    async planner_star(context, payload)
    {
        return await Vue.axios.post(`/api/planner/star`, payload.data)
    },

    async planner_list_star()
    {
        return await Vue.axios.get(`/api/planner/star`)
    },

    //-----------------------

    async member_list(context, id)
    {
        return await Vue.axios.get(`/api/planner/${id}/member`)
    },

    async member_create(context, payload)
    {
        return await Vue.axios.put(`/api/planner/${payload.planner}/member`, payload)
    },

    async member_destroy(context, payload)
    {
        return await Vue.axios.delete(`/api/planner/${payload.planner}/member/${payload.member}`)
    },
    //-----------------------


    async milestone_list(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/milestone`, payload)
    },

    async milestone_detail(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}/milestone`, payload.data)
    },

    async milestone_create(context, payload)
    {
        return await Vue.axios.put(`/api/planner/${payload.planner}/milestone`, payload.data)
    },

    async milestone_destroy(context, payload)
    {
        await Vue.axios.delete(`/api/planner/${payload.planner}/milestone/${payload.milestone}`)
    },

    async milestone_update(context, payload)
    {
        await Vue.axios.post(`/api/planner/${payload.planner}/milestone/${payload.milestone}`, payload.data)
    },

    //-----------------------
    async backlogs_list(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/backlogs`, payload)
    },

    async backlogs_detail(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/backlogs/${payload.backlog}`)
    },

    async backlogs_create(context, payload)
    {
        return await Vue.axios.put(`/api/planner/${payload.planner}/backlogs`, payload.data)
    },

    async backlogs_destroy(context, payload)
    {
        await Vue.axios.delete(`/api/planner/${payload.planner}/backlogs/${payload.backlog}`)
    },

    async backlogs_update(context, payload)
    {
        await Vue.axios.post(`/api/planner/${payload.planner}/backlogs/${payload.backlog}`, payload.data)
    },

    //-----------------------   
    async issues_list(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/issues`, payload)
    },

    async issues_detail(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/issues/${payload.issue}`)
    },

    async issues_create(context, payload)
    {
        return await Vue.axios.put(`/api/planner/${payload.planner}/issues`, payload.data)
    },

    async issues_destroy(context, payload)
    {
        await Vue.axios.delete(`/api/planner/${payload.planner}/issues/${payload.issue}`)
    },

    async issues_update(context, payload)
    {
        await Vue.axios.post(`/api/planner/${payload.planner}/issues/${payload.issue}`, payload.data)
    },

    //-----------------------
    async boards_list(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/boards`, payload)
    },

    async boards_col_detail(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/boards/${payload.col}`)
    },

    async boards_create(context, payload)
    {
        return await Vue.axios.put(`/api/planner/${payload.planner}/boards`, payload.data)
    },

    async boards_destroy(context, payload)
    {
        return await Vue.axios.delete(`/api/planner/${payload.planner}/boards/${payload.col}`)
    },

    async boards_update(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}/boards/${payload.col}`, payload.data)
    },

    async boards_move(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}/boards/move`, payload.data)
    },

    //-----------------------
    async note_create(context, payload)
    {
        return await Vue.axios.put(`/api/planner/${payload.planner}/boards/${payload.col}`, payload.data)
    },

    async note_destroy(context, payload)
    {
        return await Vue.axios.delete(`/api/planner/${payload.planner}/boards/${payload.col}/${payload.note}`)
    },

    async note_update(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}/boards/${payload.col}/${payload.note}`, payload.data)
    },

    async note_move(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}/boards/notes/move`, payload.data)
    },
    //-----------------------  

    async wiki_list(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/wiki`, payload)
    },

    async wiki_detail(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/wiki/${payload.article}`)
    },

    async wiki_create(context, payload)
    {
        return await Vue.axios.put(`/api/planner/${payload.planner}/wiki`, payload.data)
    },

    async wiki_destroy(context, payload)
    {
        return await Vue.axios.delete(`/api/planner/${payload.planner}/wiki/${payload.article}`)
    },

    async wiki_update(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}/wiki/${payload.article}`, payload.data)
    },

    //-----------------------  

    async pan_list(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/pan`, payload)
    },

    async pan_mkdir(context, payload)
    {
        return await Vue.axios.put(`/api/planner/${payload.planner}/pan`, payload.data)
    },

    async pan_upload(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}/pan`, payload.data)
    },

    async pan_upload_priavte(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}/pan/private`, payload.data)
    },

    async pan_destroy(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}/pan/delete`, payload.data)
    },
}