import Vue from "vue";
import VueRouter from "vue-router";
import Cookie from "js-cookie"
import NProgress from 'nprogress' // 进度条

import views from "../views";

Vue.use(VueRouter);

console.log(views)

const routes = []

function make_routes(container, views, parent)
{
  for (let key in views)
  {
    let view = views[key]
    let page = view.core || view
    let route = {
      path: page.path,
      name: page.name,
      meta: page.meta || {},
      component: page,
    }
    container.push(route)

    if (parent && route.meta.menu_title == null)
    {
      route.meta.menu_title = parent.meta.menu_title
    }

    if (view.children == null)
    {
      continue
    }

    route.children = []

    make_routes(route.children, view.children, route)
  }
}

make_routes(routes, views)

const router = new VueRouter({
  routes
});

NProgress.configure({ minimum: 0.1, ease: 'ease', speed: 500, trickleSpeed: 200, showSpinner: false });

router.beforeEach(function (to, from, next)
{
  NProgress.start()

  if (to.meta == null)
  {
    return next()
  }

  if (!to.meta.require_logined)
  {
    return next()
  }

  if (Cookie.get("token") == null)
  {
    return next(
      {
        path: "/login",
        query: { redirect: to.fullPath }
      }
    )
  }

  return next()
})

router.afterEach(() =>
{
  NProgress.done();
});

export default router;