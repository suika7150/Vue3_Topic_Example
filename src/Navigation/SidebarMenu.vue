<template>
  <el-menu default-active="1" class="menu-in-drawer" @select="handleMenuSelect">
    <el-menu-item index="news" class="main-link">最新消息</el-menu-item>
    <el-menu-item index="about" class="main-link">關於我們</el-menu-item>
    <el-menu-item index="home" class="main-link">回首頁</el-menu-item>
    <el-menu-item index="guide" class="main-link">購買須知</el-menu-item>
    <el-menu-item index="qa" class="main-link">常見問題 Q&A</el-menu-item>

    <el-divider v-if="menuData.length > 0" />

    <template v-for="category in menuData" :key="category.name">
      <el-sub-menu v-if="category.subs && category.subs.length > 0" :index="category.name">
        <template #title>
          <div class="category-title">
            <el-icon><component :is="category.icon" /></el-icon>
            <span>{{ category.label }}</span>
          </div>
        </template>

        <template v-for="sub in category.subs" :key="sub.name">
          <!-- <div class="category-title"> -->
          <el-menu-item v-if="sub.route" :index="sub.route">
            <el-icon><component :is="sub.icon" /></el-icon>
            {{ sub.label }}
          </el-menu-item>

          <el-sub-menu
            v-else-if="sub.subs && sub.subs.length > 0"
            :index="`${category.name}-${sub.name}`"
          >
            <template #title>
              <el-icon><component :is="sub.icon" /></el-icon>
              <span>{{ sub.label }}</span>
            </template>
            <el-menu-item v-for="subSub in sub.subs" :key="subSub.name" :index="subSub.route">
              <el-icon><component :is="subSub.icon" /></el-icon>
              {{ subSub.label }}
            </el-menu-item>
          </el-sub-menu>
          <!-- </div> -->
        </template>
      </el-sub-menu>
    </template>

    <el-divider />

    <el-menu-item index="cart" class="main-link">購物車</el-menu-item>
    <el-menu-item index="profile" class="main-link">個人資料維護</el-menu-item>
    <el-menu-item index="setting" class="main-link">設定</el-menu-item>

    <template v-if="!isLogin">
      <el-menu-item index="login" divided class="main-link">登入</el-menu-item>
      <el-menu-item index="register" divided class="main-link">註冊</el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { getNavMenu } from '@/Navigation/getNavMenu'
import { useUserStore } from '@/store/userStore'
import { ElDivider } from 'element-plus'

const userStore = useUserStore()
const isLogin = computed(() => !!userStore.user?.isLogin)
const userRole = computed(() => userStore.role || 'GUEST')

const menuData = computed(() => getNavMenu(userRole.value))

const emit = defineEmits(['navigate', 'open-cart'])

const handleMenuSelect = (index) => {
  switch (index) {
    case 'home':
      emit('navigate', 'Home')
      break
    case 'guide':
      emit('navigate', 'ShoppingGuide')
      break
    case 'qa':
      emit('navigate', 'QA')
      break
    case 'news':
      emit('navigate', 'News')
      break
    case 'about':
      emit('navigate', 'About')
      break
    case 'cart':
      emit('open-cart') // 觸發購物車
      break
    case 'profile':
      emit('navigate', 'Profile')
      break
    case 'setting':
      emit('navigate', 'Setting')
      break
    case 'login':
      emit('navigate', 'Login')
      break
    case 'register':
      emit('navigate', 'Register')
      break
    default:
      if (index.startsWith('/')) {
        emit('navigate-route', index)
      }
      break
  }
  console.log('現在的 userRole 是：', userRole.value)
}
console.log('現在的 userRole 是：', userRole.value)
</script>

<style scoped>
.menu-in-drawer {
  border-right: none;
}
.main-link {
  font-weight: bold;
}
.category-title {
  font-weight: bold;
}
</style>
