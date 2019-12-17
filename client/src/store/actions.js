
import Vue from 'vue'

export default {

    async login(context, payload)
    {
        await Vue.axios.post("/api/user/login", payload)
    },

    async regist(context, payload)
    {
        await Vue.axios.post("/api/user/regist", payload)
    },

    async planner_list(context, payload)
    {
        return await Vue.axios.get("/api/planner", payload)
    },

    async planner_create(context, payload)
    {
        await Vue.axios.put("/api/planner", payload)
    },
    async milestone_list(context, id)
    {
        return await Vue.axios.get(`/api/planner/${id}/milestone`)
    },

    async milestone_create(context, payload)
    {
        await Vue.axios.put(`/api/planner/${payload.planner}/milestone`, payload.data)
    },

    async milestone_destroy(context, payload)
    {
        await Vue.axios.delete(`/api/planner/${payload.planner}/milestone/${payload.milestone}`, payload.data)
    },

    async milestone_update(context, payload)
    {
        await Vue.axios.post(`/api/planner/${payload.planner}/milestone/${payload.milestone}`, payload.data)
    },
}