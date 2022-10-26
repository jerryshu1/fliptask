import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/Login.vue";
import User from "../views/User.vue";
import Mutichoose from "../views/Mutichoose.vue";
import Published from "../views/Published.vue";
import Print from "../views/Print.vue";
import Tasks from "../views/Tasks.vue";
import NewSearch from "../views/NewSearch/index.vue"

const routes = [
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        redirect: (to) => {
          return { path: "/login", query: { q: to.params.searchText } };
        },
      },
      {
        path: "newsearch",
        name: "newsearch",
        component: NewSearch,
        beforeEnter: function(to, from, next){
          if(window.localStorage.getItem('role') === 'appuser'){
            next({ name: from.name })
          }else{
            next()
          }
        }
      },
      {
        path: "user",
        name: "user",
        component: User,
      },
      {
        path: "mutichoose",
        name: "mutichoose",
        component: Mutichoose,
        beforeEnter: function(to, from, next){

          if(from.fullPath !== '/newsearch'){
            next({ name: from.name })
          }else{
            next()
          }
        }
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
        beforeEnter: function(to, from, next){
          if(window.localStorage.getItem('role') === 'appuser'){
            next({ name: from.name })
          }else{
            next()
          }
        }
      }
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/print",
    name: "print",
    component: Print,
    beforeEnter: function(to, from, next){
			if(from.fullPath !== '/published'){
        next({ name: from.name })
      }else{
        next()
      }
		}
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


// router.beforeEach((to, from, next) => {
//   var isAuthenticated = '';
//   var isrole = '';
//   if (sessionStorage.length !== 0){
//     isAuthenticated = JSON.parse(sessionStorage.state).jwtToken;
//     isrole = JSON.parse(sessionStorage.state).user.role;
//   } else {
//     isAuthenticated = store.state.jwtToken;
//     isrole = store.state.user.role;
//   }
//   if (to.path === "/newsearch" && isrole === "appuser"){
//     this.$message({
//       type: 'error',
//       message: '权限不足'
//     });
//     next({path: "/published" });
//   }
//   if (to.path === "/mutisearch" && isrole === "appuser"){
//     alert('权限不足')
//     next({path: "/published" });
//   }
//   if (to.path === "/newsearch" && isrole === "superadmin"){
//     next({path: "/user" });
//   }
//   if (to.path === "/tasks" && isrole === "appuser"){
//     alert('权限不足')
//     next({path: "/published" });
//   }
//   if (to.path === "/published" && isrole === "superadmin"){
//     next({path: "/user" });
//   }
//   if (to.path !== "/login" && isAuthenticated === '') {
//     next({ path: "/login" });
//   } else {
//     next();
//   }
// });

router.beforeEach((to, from, next) => {
  if(to.name === 'login'){
    next()
  } else if(sessionStorage.getItem('token')){
    next()
   } else {
    next({name: 'login'})
   }
})


export default router;
