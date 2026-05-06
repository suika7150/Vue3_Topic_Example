<template>
  <div class="sidebar-container">
    <el-divider />

    <el-menu class="menu-in-drawer" @select="handleMenuSelect">
      <template v-for="item in menuData" :key="item.key">
        <el-divider v-if="item.key === 'cart'" />

        <el-menu-item
          v-if="item.type === 'button'"
          :index="item.route.name || item.key"
          class="main-link"
        >
          {{ item.label }}
        </el-menu-item>

        <el-divider v-if="item.key === 'qa'" />

        <el-sub-menu v-else-if="item.type === 'dropdown'" :index="item.key">
          <template #title>
            <div class="category-title">
              <el-icon v-if="item.icon">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.label }}</span>
            </div>
          </template>

          <el-menu-item v-for="sub in item.subs" :key="sub.label" :index="getSubIndex(sub)">
            <el-icon v-if="sub.icon">
              <component :is="sub.icon" />
            </el-icon>
            {{ sub.label }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getNavMenu } from '@/services/navigationService'
import { useUserStore } from '@/store/userStore'
import { useSidebarStore } from '@/store/sidebarStore'
import { useCartStore } from '@/store/cartStore'

const router = useRouter()
const userStore = useUserStore()
const sidebarStore = useSidebarStore()
const cartStore = useCartStore()

const userRole = computed(() => userStore.role || 'GUEST')

const menuData = computed(() => {
  const role = userRole.value

  const result = getNavMenu(role, { includeSystem: true, usage: 'sidebar' })

  return result
})

const getSubIndex = (sub) => {
  if (typeof sub.route === 'string') return sub.route

  if (sub.route?.name) {
    return `${sub.route.name}__${sub.label}`
  }

  return sub.label
}

const handleMenuSelect = (index) => {
  if (!index) return
  for (const item of menuData.value) {
    if (item.key === 'cart') {
      if (index === (item.route?.name || item.key)) {
        cartStore.setDrawerVisible(true)
        sidebarStore.setCollapse(true)
        return
      }
    }

    if (item.type === 'button') {
      const itemIndex = item.route?.name || item.key
      if (itemIndex === index) {
        router.push(item.route)
        sidebarStore.setCollapse(true)
        return
      }
    }

    if (item.type === 'dropdown') {
      for (const sub of item.subs || []) {
        if (getSubIndex(sub) === index) {
          router.push(sub.route)
          sidebarStore.setCollapse(true)
          return
        }
      }
    }
  }
}
</script>

<style scoped>
.menu-in-drawer {
  font-family: 'Inter', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
  font-size: 14px;
  color: #2b2f36;
  border-right: none;
  padding: 8px 0;
}

:deep(.el-divider) {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 16px 0;
  opacity: 1;
}

/* 主選單 */
.main-link {
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.3px;
  color: #1d1d1f;
}

.main-link:hover {
  background: #f5f5f7;
}

/* 分類標題 */
.category-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: 16px;
  letter-spacing: 0.4px;
  gap: 6px;
  padding: 6px 0;
}

/* 子選單 */
:deep(.el-sub-menu .el-menu-item) {
  font-size: 14px;
  font-weight: 500;
  padding-left: 65px !important;
  color: #303133;
}
</style>
