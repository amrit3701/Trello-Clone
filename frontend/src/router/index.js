import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index';

import HomeView from '../views/HomeView.vue';
import SignUp from '../views/SignUp.vue';
import LoginCmp from '../views/Login.vue';
import BoardsCmp from '../views/Boards.vue';
import BoardCmp from '../views/Board.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginCmp,
  },
  {
    path: '/boards',
    name: 'boards',
    component: BoardsCmp,
    meta: { requiresAuth: true },
  },
  {
    path: '/board/:id',
    name: 'board',
    component: BoardCmp,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta && to.meta.requiresAuth) {
    try {
      await store.dispatch('auth/authenticate');
    } catch (err) {
      next({ name: 'login' });
    }
  }
  next();
});

export default router;
