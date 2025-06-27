import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'

import List from '@/views/List.vue'
import Details from '@/views/Details.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          component: List,
        },
        {
          path: '/zgloszenie/:id',
          component: Details,
        },
      ],
    },
  ],
})

export default router
