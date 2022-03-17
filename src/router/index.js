import {createRouter, createWebHistory} from 'vue-router'
import HomeWrap from "views/home/HomeWrap";
import HomePage from "views/home/HomePage";

const routes = [
  {path: "", redirect: "/home",},

  {
    path: "/home",
    component: HomeWrap,
    children: [
      {
        path: "/",
        meta: {
          title: "首页",
        },
        component: HomePage,
      },
      {
        path: "/home/404",
        meta: {
          title: "页面不见了",
        },
        component: () => import("views/home/NotFound")
      }
    ]
  },

  {
    path: "/user",
    component: () => import("views/user/UserWrap"),
    children: [
      {path: "", redirect: "/user/user-info",},

      {
        path: "/user/user-info",
        component: () => import("views/user/userInfo/UserInfoWrap"),
        children: [
          {path: "", redirect: "/user/user-info/profile",},
          {
            path: "/user/user-info/profile",
            meta: {
              title: "用户信息",
              auth: true
            },
            component: () => import("views/user/userInfo/Profile"),
          },
          {
            path: "/user/user-info/article",
            meta: {
              title: "我的文章",
              auth: true
            },
            component: () => import("views/user/userInfo/Article"),
          },
          {
            path: "/user/user-info/comment",
            meta: {
              title: "我的评论",
              auth: true
            },
            component: () => import("views/user/userInfo/Comment"),
          },
          {
            path: "/user/user-info/favorite",
            meta: {
              title: "我的收藏",
              auth: true
            },
            component: () => import("views/user/userInfo/Favorite"),
          },
        ]
      },

      {
        path: "/user/login",
        meta: {
          title: "登录",
        },
        component: () => import("views/user/Login"),
      },
      {
        path: "/user/reset-password",
        meta: {
          title: "重置密码",
        },
        component: () => import("views/user/ResetPassword"),
      },
      {
        path: "/user/change-password",
        meta: {
          title: "修改密码",
          auth: true
        },
        component: () => import("views/user/ChangePassword"),
      },
    ]
  },

  {path: '/:pathMatch(.*)', redirect: "/home/404"}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.matched.some(route => route.meta.auth)) {
    if (!document.cookie.match(/token=(.*?)(;|$)/)) {
      next({path: "/user/login", query: {next: to.path}})
    } else {
      next()
    }
  } else {
    next()
  }
})

router.return = function (path) {
  return (!window.history.state.back && path) ? router.replace(path) : router.back()
}

export default router
