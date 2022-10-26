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
          if(sessionStorage.getItem('role') === 'appuser'){
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
          if(sessionStorage.getItem('role') === 'appuser'){
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
