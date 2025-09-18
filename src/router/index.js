import CategoryPage from '@/navigation/sub/CategoryPage.vue'
import Storage, { TOKEN_KEY,USER_ROLE_KEY } from '@/utils/storageUtil'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('@/views/users/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/users/Register.vue') },
  { path: '/about', name: 'About', component: () => import('@/views/About.vue') },
  { path: '/setting', name: 'Setting', component: () => import('@/views/Setting.vue') },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/users/Profile.vue'),
    meta: { requiresAuth: true ,role:['ADMIN','USER']},
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/products/ProductList.vue'),
  },
  {
    path: '/products/add',
    name: 'AddProduct',
    component: () => import('@/views/products/AddProduct.vue'),
  },
  {
    path: '/products/list',
    name: 'ProductList',
    component: () => import('@/views/products/ProductManage.vue'),
  },
  {
    path: '/products/edit/:id',
    name: 'EditProduct',
    component: () => import('@/views/products/EditProduct.vue'),
  },
  {
    path: '/settings/options',
    name: 'OptionsManage',
    component: () => import('@/views/settings/OptionsManage.vue'),
    meta: { requiresAuth: true ,role:['ADMIN','USER']},
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/checkout/checkout.vue'),
    meta: { requiresAuth: true,role:['USER'] },
    beforeEach: (to, from, next) => {
      // 檢查是否已登入
      const isLoggedIn = !!Storage.get(TOKEN_KEY)
      const cartItems = Storage.get('cartItems')
      if (!isLoggedIn&&!cartItems) {
        return next('/login')
      }
      next()
    }
  },
  {
    path:'/accessDenied',
    name:'AccessDenied',
    component: () => import('@/views/users/AccessDenied.vue'),
  },
  { path: '/about', name: 'About', component: () => import('@/views/About.vue') },
  {
    path: '/:paths(.*)*',
    name: 'Category',
    component: CategoryPage,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
// ✅ 加入全域導航守衛：權限驗證
router.beforeEach((to, from, next) => {
  // 檢查是否已登入
  const isLoggedIn = !!Storage.get(TOKEN_KEY)
  const role = Storage.get(USER_ROLE_KEY)

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }
  
  if (to.meta.requiresAuth && !to.meta?.role?.includes(role)) {
    return next('/accessDenied')
  }
  next()
})
export default router
