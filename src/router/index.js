import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from 'nprogress' // 进度条

import * as views from "../views";

Vue.use(VueRouter);

console.log(views)

const routes = []

for (let name in views)
{
  let view = views[name]
  let core = view.core
  let children = view.children

  let route = {
    path: core.path,
    name: name,
    weight: core.weight,
    meta: core.meta,
    component: core,
  }

  routes.push(route)
  if (children == null)
  {
    continue

  }
  route.children = []
  for (let child of children)
  {
    let child_route = {
      path: child.path,
      meta: child.meta,
      component: child,
    }

    route.children.push(child_route)
  }
}

console.log(routes)

const router = new VueRouter({
  routes
});

NProgress.configure({ minimum: 0.1, ease: 'ease', speed: 500, trickleSpeed: 200, showSpinner: false });

router.beforeEach(function (to, from, next)
{
  NProgress.start()

  return next()

})

router.afterEach(() =>
{
  NProgress.done();
});

export default router;