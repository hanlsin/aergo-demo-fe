import Vue from "vue";
import VueRouter from "vue-router";

import Contracts from "./views/Contracts.vue";
import Login from "./views/Login.vue";
import Signup from "./views/Signup.vue";
import Logout from "./views/Logout.vue";
import Profile from "./views/Profile.vue";
import NewContract from "./views/NewContract.vue";
import IssuedContract from "./views/IssuedContract.vue";

import store from "./store.js";

Vue.use(VueRouter);

let entryUrl = null;

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/contracts/default"
    },
    {
      path: "/contracts/:address",
      name: "contracts",
      component: Contracts,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/newcontract",
      name: "newcontract",
      component: NewContract,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/isscontract/:contractId",
      name: "isscontract",
      component: IssuedContract,
      meta: {
        requiresAuth: true
      }
    },
    /*
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
      import(/* webpackChunkName: "about" * / "./views/About.vue")
    }
    */
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)
    && !store.getters.hasCert) {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    });
  } else {
    next();
  }
});

export default router;
