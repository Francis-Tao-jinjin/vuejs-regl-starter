import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/img-processing',
      name: 'img-processing',
      component: () => import('../views/pages/ImageProcessing/ImageProcessing.vue')
    },
    {
      path: '/transform2d',
      name: 'transform2d',
      component: () => import('../views/pages/transform2d/transform2d.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
