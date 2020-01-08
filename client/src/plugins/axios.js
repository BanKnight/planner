import Vue from "vue";
import router from "../router";
import axios from "axios";
import Cookie from "js-cookie";
import VueAxios from "vue-axios";
import NProgress from "nprogress"; // 进度条
import { Message } from "element-ui";

Vue.use(VueAxios, axios);

axios.defaults.baseURL = "http://localhost:7000";
axios.defaults.withCredentials = true;

if (process.env.NODE_ENV == "development") {
  axios.defaults.timeout = 50000;
} else {
  axios.defaults.timeout = 5000;
}
//定义一个请求拦截器
axios.interceptors.request.use(function(config) {
  NProgress.start();
  return config;
});

//添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    NProgress.done();

    if (response.status === 200) {
      return Promise.resolve(response.data);
    }

    return Promise.reject(response.data);
  },
  function(error) {
    NProgress.done();

    if (error.response) {
      switch (error.response.status) {
        case 401:
          {
            to_login();
          }
          break;
        default: {
          Message.error(error.response.data.error);
        }
      }

      return Promise.reject(error.response.data);
    }
    //请求错误时做些事
    return Promise.reject(error);
  }
);

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const to_login = () => {
  Cookie.remove("token");

  router.replace({
    path: "/login",
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
};
