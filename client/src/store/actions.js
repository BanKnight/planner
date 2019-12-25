
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
     * payload = ["",""]
     */
    async user_search(context, payload)
    {
        return await Vue.axios.post("/api/user/search", payload)
    },
    //-----------------------
    async planner_list(context, payload)
    {
        return await Vue.axios.get("/api/planner", payload)
    },

    async planner_create(context, payload)
    {
        await Vue.axios.put("/api/planner", payload)
    },
    async planner_detail(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}`)
    },

    //-----------------------

    async member_list(context, id)
    {
        return await Vue.axios.get(`/api/planner/${id}/member`)
    },

    //-----------------------


    async milestone_list(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/milestone`, payload)
    },

    async milestone_detail(context, payload)
    {
        return await Vue.axios.get(`/api/planner/${payload.planner}/milestone/${payload.milestone}`)
    },

    async milestone_create(context, payload)
    {
        await Vue.axios.put(`/api/planner/${payload.planner}/milestone`, payload.data)
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
        return await Vue.axios.get(`/api/planner/${payload.planner}/backlogs/${payload.backlogs}`)
    },

    async backlogs_create(context, payload)
    {
        await Vue.axios.put(`/api/planner/${payload.planner}/backlogs`, payload.data)
    },

    async backlogs_destroy(context, payload)
    {
        await Vue.axios.delete(`/api/planner/${payload.planner}/backlogs/${payload.backlogs}`)
    },

    async backlogs_update(context, payload)
    {
        await Vue.axios.post(`/api/planner/${payload.planner}/backlogs/${payload.backlogs}`, payload.data)
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

    async boards_swap(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}/boards/swap`, payload.data)
    },

    //-----------------------
    async note_create(context, payload)
    {
        return await Vue.axios.put(`/api/planner/${payload.planner}/boards/${payload.col}`, payload.data)
    },

    async note_destroy(context, payload)
    {
        return await Vue.axios.delete(`/api/planner/${payload.planner}/boards/${payload.col}`)
    },

    async note_update(context, payload)
    {
        return await Vue.axios.post(`/api/planner/${payload.planner}/boards/${payload.col}/${payload.note}`, payload.data)
    },
}