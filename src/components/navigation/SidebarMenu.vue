<template>
  <div class="sidebar-container">
    <el-divider style="margin: 0" />
    <el-menu default-active="1" class="menu-in-drawer" @select="handleMenuSelect">
      <el-menu-item index="news" class="main-link">最新消息</el-menu-item>
      <el-menu-item index="about" class="main-link">關於我們</el-menu-item>
      <el-menu-item index="home" class="main-link">回首頁</el-menu-item>
      <el-menu-item index="shoppingGuide" class="main-link">購買須知</el-menu-item>
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
            <el-menu-item v-if="!sub.subs" :index="sub.key || sub.routeName">
              <el-icon><component :is="sub.icon" /></el-icon>
              {{ sub.label }}
            </el-menu-item>

            <el-sub-menu v-else :index="sub.name">
              <template #title>
                <el-icon><component :is="sub.icon" /></el-icon>
                <span>{{ sub.label }}</span>
              </template>

              <el-menu-item v-for="subSub in sub.subs" :key="subSub.name" :index="subSub.routeName">
                <el-icon><component :is="subSub.icon" /></el-icon>
                {{ subSub.label }}
              </el-menu-item>
            </el-sub-menu>
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getNavMenu } from '@/utils/navMenu'
import { useUserStore } from '@/store/userStore'
import { useSidebarStore } from '@/store/sidebarStore'
import { ElDivider } from 'element-plus'

const router = useRouter()
const sidebarStore = useSidebarStore()
const userStore = useUserStore()
const isLogin = computed(() => !!userStore.user?.isLogin)
const userRole = computed(() => userStore.role || 'GUEST')

const menuData = computed(() => getNavMenu(userRole.value))

const emit = defineEmits(['navigate', 'open-cart'])

const handleMenuSelect = (item) => {
  if (!item) return

  if (item === 'cart') {
    emit('open-cart')
    sidebarStore.setCollapse(true)
    return
  }

  // crossover 特別處理
  const crossoverTypes = ['anime', 'movie', 'designer', 'limited']

  if (crossoverTypes.includes(item)) {
    router.push({ name: 'crossover', params: { type: item } })
  } else {
    router.push({ name: item })
  }

  sidebarStore.setCollapse(true)
}
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
