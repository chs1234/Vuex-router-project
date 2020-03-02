import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index"

Vue.use(VueRouter);

const rejectAuthUser = (to, from, next) => {
  if (store.state.isLogin === true) {
    //이미 로그인된 유저
    alert('이미 로그인을 하였습니다.');
    next("/");
  } else {
    next();
  }
}

const onlyAuthUser = (to, from, next) => {
  if (store.state.isLogin === false) {
    //이미 로그인된 유저
    alert('로그인이 필요한 기능입니다.');
    next("/");
  } else {
    next();
  }
}

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/login",
    name: "login",
    beforeEnter: rejectAuthUser,
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/mypage",
    name: "mypage",
    beforeEnter: onlyAuthUser,
    component: () =>
      import(/* webpackChunkName: "mypage" */ "../views/Mypage.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
