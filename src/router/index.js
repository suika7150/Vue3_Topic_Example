import CategoryPage from '@/Navigation/sub/CategoryPage.vue'
import Storage, { TOKEN_KEY, USER_ROLE_KEY } from '@/utils/storageUtil'
import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/Home.vue') },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/users/Login.vue'),
  },
  { path: '/register', name: 'register', component: () => import('@/views/users/Register.vue') },
  { path: '/about', name: 'about', component: () => import('@/views/About.vue') },
  { path: '/news', name: 'news', component: () => import('@/views/News.vue') },
  { path: '/setting', name: 'setting', component: () => import('@/views/Setting.vue') },
  {
    path: '/shoppingguide',
    name: 'shoppingGuide',
    component: () => import('@/views/ShoppingGuide.vue'),
  },
  {
    path: '/qa',
    name: 'qa',
    component: () => import('@/views/QA.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/users/Profile.vue'),
    meta: { requiresAuth: true, role: ['USER'] },
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
    path: '/products/manage',
    name: 'ProductManage',
    component: () => import('@/views/products/ProductManage.vue'),
    meta: {
      requiresAuth: true,
      role: ['ADMIN', 'USER'],
    },
  },
  {
    path: '/products/edit/:id',
    name: 'EditProduct',
    component: () => import('@/views/products/EditProduct.vue'),
  },
  // 開發中
  // {
  //   path: '/product/:id',
  //   name: 'ProductDetail',
  //   component: () => import('@/views/products/ProductDetailView.vue'),
  // },
  {
    path: '/settings/options',
    name: 'OptionsManage',
    component: () => import('@/views/settings/OptionsManage.vue'),
    meta: { requiresAuth: true, role: ['ADMIN', 'USER'] },
  },
  {
    path: '/event/flashsale',
    name: 'flashSale',
    component: () => import('@/views/event/FlashSale.vue'),
  },
  {
    path: '/event/luckywheel',
    name: 'luckyWheel',
    component: () => import('@/views/event/LuckyWheel.vue'),
  },
  {
    path: '/crossover/anime',
    name: 'anime',
    component: () => import('@/views/crossover/Anime.vue'),
  },
  {
    path: '/crossover/movie',
    name: 'movie',
    component: () => import('@/views/crossover/Movie.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/checkout/checkout.vue'),
    meta: { requiresAuth: true, role: ['USER'] },
    beforeEnter: (to, from, next) => {
      // 1. 登入檢查交給全域守衛 (meta.requiresAuth) 處理即可
      // 2. 這裡只專心檢查「購物車是否有東西」
      const cartItems = Storage.get('cartItems') || []

      if (cartItems.length === 0) {
        // 如果購物車是空的，移動至登入畫面
        ElMessage.warning('您的購物車是空的，請先挑選商品')
        return next('/accessDenied')
      }
      // next()
    },
  },
  {
    path: '/checkout/success',
    name: 'checkoutSuccess',
    component: () => import('@/views/checkout/CheckoutSuccess.vue'),
  },

  {
    path: '/accessDenied',
    name: 'accessDenied',
    component: () => import('@/views/users/AccessDenied.vue'),
  },
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 路由守衛，權限驗證
router.beforeEach((to, from, next) => {
  // 檢查是否已登入
  const isLoggedIn = !!Storage.get(TOKEN_KEY)
  const role = Storage.get(USER_ROLE_KEY)

  if (to.meta.requiresAuth && !isLoggedIn) {
    ElMessage.error('請先登入會員')
    return next('/login')
  }

  if (to.meta.requiresAuth && !to.meta?.role?.includes(role)) {
    return next('/accessDenied')
  }
  next()
})
export default router
