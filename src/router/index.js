import {createRouter, createWebHistory} from 'vue-router'
import RootWrap from "views/root/RootWrap";
import HomePage from "views/root/home/HomePage";

const routes = [
  {
    path: "",
    component: RootWrap,
    children: [
      {
        path: "",
        meta: {
          title: "首页",
        },
        component: HomePage,
      },
      {
        path: "/bbs",
        name: "bbs",
        meta: {
          title: "论坛",
          keepAlive: true
        },
        component: () => import("views/root/BBS/BBS"),
      },
      {
        path: "/bbs/post-article",
        meta: {
          title: "发布帖子",
          auth: true,
        },
        component: () => import("views/root/BBS/PostArticle"),
      },
      {
        path: "/bbs/article/:id",
        meta: {
          title: "帖子详情",
        },
        component: () => import("views/root/BBS/Article"),
      },
      {
        path: "/404",
        meta: {
          title: "页面不见了",
        },
        component: () => import("views/root/other/NotFound")
      },
      {
        path: "/topic",
        name: "topic",
        meta: {
          title: "全部话题",
        },
        component: () => import("views/root/topic/AllTopic"),
      },
      {
        path: "/topic-detail/:id",
        name: "topic-detail",
        meta: {
          title: "话题详情",
        },
        component: () => import("views/root/topic/TopicDetail"),
      },
      {
        path: "/issue/:address",
        name: "issue",
        meta: {
          title: "预测详情",
        },
        component: () => import("views/root/topic/IssueDetail"),
      },
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
        component: () => import("views/user/sign/Login"),
      },

      {
        path: "/user/message",
        component: () => import("views/user/message/MessageWrap"),
        children: [
          {path: "", redirect: "/user/message/reply"},

          {
            path: "/user/message/reply",
            meta: {
              title: "回复我的",
              auth: true
            },
            component: () => import("views/user/message/Reply"),
          },

          {
            path: "/user/message/at",
            meta: {
              title: "@我的",
              auth: true
            },
            component: () => import("views/user/message/At"),
          },

          {
            path: "/user/message/like",
            meta: {
              title: "收到的赞",
              auth: true
            },
            component: () => import("views/user/message/Like"),
          },

          {
            path: "/user/message/system",
            meta: {
              title: "系统消息",
              auth: true
            },
            component: () => import("views/user/message/System"),
          },

          {
            path: "/user/message/private",
            meta: {
              title: "我的私信",
              auth: true
            },
            component: () => import("views/user/message/Private"),
          },
        ]
      },

      {
        path: "/user/reset-password",
        meta: {
          title: "重置密码",
        },
        component: () => import("views/user/sign/ResetPassword"),
      },

      {
        path: "/user/change-password",
        meta: {
          title: "修改密码",
          auth: true
        },
        component: () => import("views/user/sign/ChangePassword"),
      },
    ]
  },

  {path: '/:pathMatch(.*)', redirect: "/404"}
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
