import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dev',
      name: '',
      component: ()=>import('../views/dev/view/DevMainView.vue'),

      children:[
        {
          path: '',
          component: ()=>import('../views/dev/view/DevMonView.vue'),
        }
      ]
    },

    {
      path: '/:pathMatch(.*)',
      redirect: {path:'dev'},
    }
    
  ]
})

export default router
