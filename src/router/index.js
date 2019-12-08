import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from 'nprogress' // 进度条

import views from "../views";

Vue.use(VueRouter);

console.log(views)

const routes = []

function make_routes(parent, views) {
  for (let key in views) {
    let view = views[key]
    let page = view.core || view
    let route = {
      path: page.path,
      name: page.name,
      meta: page.meta,
      component: page,
    }
    parent.push(route)
    if (view.children == null) {
      continue
    }

    route.children = []

    make_routes(route.children, view.children)
  }
}

make_routes(routes, views)
console.log(routes)

const router = new VueRouter({
  routes
});

NProgress.configure({ minimum: 0.1, ease: 'ease', speed: 500, trickleSpeed: 200, showSpinner: false });

router.beforeEach(function (to, from, next) {
  NProgress.start()

  return next()

})

router.afterEach(() => {
  NProgress.done();
});

export default router;