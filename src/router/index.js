import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index.js";

import Index from "../views/Index.vue";
import Login from "../views/Login.vue";
import Search from "../views/Search.vue";
import User from "../views/User.vue";
import Choose from "../views/Choose.vue";
import Mutichoose from "../views/Mutichoose.vue";
import Published from "../views/Published.vue";
import Print from "../views/Print.vue";
import Mutisearch from "../views/Mutisearch.vue";
import Register from "../views/Register.vue";
import Tasks from "../views/Tasks.vue";

const routes = [
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        redirect: (to) => {
          return { path: "/search", query: { q: to.params.searchText } };
        },
      },
      {
        path: "search",
        name: "search",
        component: Search,
        meta: {
          keepAlive: true,
        },
      },
      {
        path: "mutisearch",
        name: "mutisearch",
        component: Mutisearch,
        meta: {
          keepAlive: true,
        },
      },
      {
        path: "index",
        name: "index",
        component: Index,
        meta: {
          keepAlive: true,
        },
      },
      {
        path: "user",
        name: "user",
        component: User,
      },
      {
        path: "choose",
        name: "choose",
        component: Choose,
      },
      {
        path: "mutichoose",
        name: "mutichoose",
        component: Mutichoose,
      },
      {
        path: "published",
        name: "published",
        component: Published,
      },
      {
        path: "tasks",
        name: "tasks",
        component: Tasks,
      }
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/print",
    name: "print",
    component: Print,
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("../views/Error404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  var isAuthenticated = '';
  var isrole = '';
  if (sessionStorage.length !== 0){
    isAuthenticated = JSON.parse(sessionStorage.state).jwtToken;
    isrole = JSON.parse(sessionStorage.state).user.role;
  } else {
    isAuthenticated = store.state.jwtToken;
    isrole = store.state.user.role;
  }
  if (to.path === "/search" && isrole === "appuser"){
    this.$message({
      type: 'error',
      message: '权限不足'
    });
    next({path: "/published" });
  }
  if (to.path === "/mutisearch" && isrole === "appuser"){
    alert('权限不足')
    next({path: "/published" });
  }
  if (to.path === "/search" && isrole === "superadmin"){
    next({path: "/user" });
  }
  if (to.path === "/mutisearch" && isrole === "superadmin"){
    next({path: "/user" });
  }
  if (to.path === "/tasks" && isrole === "appuser"){
    alert('权限不足')
    next({path: "/published" });
  }
  if (to.path === "/published" && isrole === "superadmin"){
    next({path: "/user" });
  }
  if (to.path !== "/login" && isAuthenticated === '') {
    next({ path: "/login" });
  } else {
    next();
  }
});

export default router;
