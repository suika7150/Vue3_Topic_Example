/*
*
meta.title搭配BreadCrumb.vue的title顯示在麵包屑上
*
*/
import CategoryPage from '@/Navigation/sub/CategoryPage.vue'
import Storage, { CART_KEY, TOKEN_KEY, USER_ROLE_KEY } from '@/utils/storageUtil'
import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/Home.vue'), meta: { title: '首頁' } },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/users/Login.vue'),
    meta: { title: '登入' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/users/Register.vue'),
    meta: { title: '註冊' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    meta: { title: '關於我們' },
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/News.vue'),
    meta: { title: '新聞資訊' },
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/Setting.vue'),
    meta: { title: '設定' },
  },
  {
    path: '/shoppingguide',
    name: 'shoppingGuide',
    component: () => import('@/views/ShoppingGuide.vue'),
    meta: { title: '購物指南' },
  },
  {
    path: '/qa',
    name: 'qa',
    component: () => import('@/views/QA.vue'),
    meta: { title: '常見問題' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/users/Profile.vue'),
    meta: { requiresAuth: true, role: ['USER'] },
  },
  {
    path: '/products',
    name: 'overview',
    component: () => import('@/views/products/ProductList.vue'),
    meta: { title: '商品總覽' },
  },
  {
    path: '/products/add',
    name: 'AddProduct',
    component: () => import('@/views/products/AddProduct.vue'),
    meta: { title: '新增商品' },
  },
  {
    path: '/products/manage',
    name: 'productManage',
    component: () => import('@/views/products/ProductManage.vue'),
    meta: {
      title: '商品管理',
      requiresAuth: true,
      role: ['ADMIN', 'USER'],
    },
  },
  {
    path: '/products/edit/:id',
    name: 'editProduct',
    component: () => import('@/views/products/EditProduct.vue'),
    meta: { title: '商品編輯' },
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
    meta: { meta: { title: '選項管理' }, requiresAuth: true, role: ['ADMIN', 'USER'] },
  },
  {
    path: '/event/flashsale',
    name: 'flashSale',
    component: () => import('@/views/event/FlashSale.vue'),
    meta: { title: '本週特惠' },
  },
  {
    path: '/event/luckywheel',
    name: 'luckyWheel',
    component: () => import('@/views/event/LuckyWheel.vue'),
    meta: { title: '活動專區' },
  },
  {
    path: '/crossover/anime',
    name: 'anime',
    component: () => import('@/views/crossover/Anime.vue'),
    meta: { title: '動漫聯名款' },
  },
  {
    path: '/crossover/movie',
    name: 'movie',
    component: () => import('@/views/crossover/Movie.vue'),
    meta: { title: '電影大聯盟' },
  },
  {
    path: '/crossover/designer',
    name: 'designer',
    component: () => import('@/views/crossover/Designer.vue'),
    meta: { title: '設計師聯名款' },
  },
  {
    path: '/crossover/limited',
    name: 'limited',
    component: () => import('@/views/crossover/LimitedEdition.vue'),
    meta: { title: '全球限量版' },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/checkout/Checkout.vue'),
    meta: { requiresAuth: true, role: ['USER', 'ADMIN'] },
    beforeEnter: (to, from, next) => {
      // 檢查「購物車是否有東西」
      const cartItems = Storage.get(CART_KEY) || []

      if (cartItems.length === 0) {
        // 如果購物車是空的，移動至登入畫面
        ElMessage.warning('您的購物車是空的，請先挑選商品')
        return next('/products')
      }
      next()
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
    //把當前想去的路徑 (to.fullPath) 傳給登入頁
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
  // 如果已登入，但角色不符
  if (to.meta.requiresAuth && !to.meta?.role?.includes(role)) {
    return next('/accessDenied')
  }
  next()
})
export default router
