<template>
  <div class="center-dropdowns">
    <el-dropdown
      v-for="menu in dropdownMenus"
      :key="menu.key"
      trigger="hover"
      popper-class="refined-dropdown"
      :show-timeout="50"
    >
      <el-button class="topbar-btn">
        {{ menu.label }}
        <el-icon class="caret-icon"><CaretBottom /></el-icon>
      </el-button>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="sub in menu.subs"
            :key="sub.label"
            @click="handleClick(sub.route)"
          >
            {{ sub.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- button -->
    <el-button
      v-for="item in buttonMenus"
      :key="item.key"
      class="topbar-btn"
      @click="handleClick(item.route)"
    >
      {{ item.label }}
    </el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElIcon } from 'element-plus'
import { CaretBottom } from '@element-plus/icons-vue'

import { getNavMenu } from '@/services/navigationService'
import { useNavigation } from '@/composables/useNavigation'
import { useUserStore } from '@/store/userStore'

const { goTo } = useNavigation()
const userStore = useUserStore()

const userRole = computed(() => userStore.role || 'GUEST')

const filteredMenu = computed(() =>
  getNavMenu(userRole.value, {
    type: 'all',
    includeSystem: false,
    usage: 'topbar',
  }),
)

const dropdownMenus = computed(() => filteredMenu.value.filter((m) => m.type === 'dropdown'))

const buttonMenus = computed(() => filteredMenu.value.filter((m) => m.type === 'button'))
const handleClick = (route) => {
  if (!route) return

  if (typeof route === 'object') {
    goTo(route.name, route.params)
  } else {
    goTo(route)
  }
}
</script>

<style scoped>
.center-dropdowns {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin: 30px auto 0;
  flex-wrap: wrap;
  width: 100%;
}

.topbar-btn {
  padding: 8px 14px;
  font-size: 19px;
  font-weight: 600;
  border-radius: 10px;
  height: 40px;
  border: none;
  outline: none;
  box-shadow: none;
  cursor: pointer;
  background-color: transparent;
  color: white;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 箭頭 */
.caret-icon {
  font-size: 16px;
  margin-left: 4px;
  opacity: 0.8;
  transition: transform 0.25s ease;
}

:deep(.el-dropdown-menu__item) {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #374151;
  padding: 10px 18px;
  margin: 2px 6px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f3f4f6;
  color: #111827;
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .center-dropdowns {
    display: none;
  }
}
</style>

<style>
/* 選單外框 */
.refined-dropdown.el-popper {
  padding: 4px;
  border-radius: 15px;
  background: #ffffff;
  border: none;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.08),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
