import Vue from 'vue'
import VueRouter from 'vue-router'
import { RouteMetaConfig } from '@/types/RouteConfig'
import useMe from '@/modules/useMe'
import i18n from '@/plugins/i18n'
import Dashboard from '../views/Dashboard.vue'
import Products from '../views/Products.vue'
import Users from '../views/Users.vue'
import User from '../views/User.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes: Array<RouteMetaConfig> = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      breadcrumbs: [
        {
          name: i18n.t('dashboard'),
        },
      ],
    },
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: {
      breadcrumbs: [
        {
          name: i18n.t('products'),
        },
      ],
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: {
      rerender: true,
      breadcrumbs: [
        {
          name: i18n.t('users'),
        },
      ],
    },
  },
  {
    path: '/users/:id',
    name: 'User',
    component: User,
    meta: {
      breadcrumbs: [
        {
          name: i18n.t('users'),
          link: '/users',
        },
        {
          genName: ({ params }) => params.id,
        },
      ],
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      layout: 'blank',
    },
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const { isAuth } = useMe()

  if (to.name !== 'Login' && !isAuth.value) next({ name: 'Login' })
  else if (to.name === 'Login' && isAuth.value) next({ path: '/' })
  else next()
})

export default router
