import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store/index'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/layout/Home.vue'),
        meta: {
          needLogin: true
        }
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('../views/layout/Search.vue')
      },
      {
        path: '/community',
        name: 'Community',
        component: () => import('../views/layout/Community.vue'),
        meta: {
          needLogin: true
        }
      },
      {
        path: '/mine',
        name: 'Mine',
        component: () => import('../views/layout/Mine.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Login.vue')
  },
  {
    path: '/player/:id',
    name: 'Player',
    component: () => import('../views/Player.vue')
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('../views/Detail.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/more/:type',
    name: 'More',
    component: () => import('../views/More.vue')
  },
  {
    path: '/DJ/:id',
    name: 'DJ',
    component: () => import('../views/DJ.vue')
  },
  {
    path: '/mine/detail',
    name: 'MineDetail',
    component: () => import('../views/MineDetail.vue'),
    meta: {
      needLogin: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.meta.needLogin){
    if(!store.state.User.token)
      store.commit('getUser')
    if(!store.state.User.token)
      console.log('需要登录');
    else{
      console.log('已登录');
      next()
    }
  }
  else{
    console.log('无需登录');
    next()
  }
  
})

export default router