import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/movies',
    name: 'Movies',
    component: HomeView
  },
  {
    path: '/tv',
    name: 'TV Shows',
    component: () => import(/* webpackChunkName: "shows" */ '../views/TvShowsView.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import(/* webpackChunkName: "auth" */ '../views/AuthView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `TESTFLIX: ${to.name}`;
  next();
})

export default router
