<template>
  <div class="topbar-dropdowns">
    <!-- dropdown -->
    <el-dropdown
      v-for="menu in navigationMenu.filter((m) => m.type === 'dropdown')"
      :key="menu.key"
      trigger="hover"
      popper-class="refined-dropdown"
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
      v-for="item in navigationMenu.filter((m) => m.type === 'button')"
      :key="item.label"
      class="topbar-btn"
      @click="handleClick(item.route)"
    >
      {{ item.label }}
    </el-button>
  </div>
</template>

<script setup>
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElIcon } from 'element-plus'
import { ArrowDown, CaretBottom } from '@element-plus/icons-vue'
import { navigationMenu } from '@/data/navigationMenu'
import { useNavigation } from '@/composables/useNavigation'

const { goTo } = useNavigation()

const handleClick = (route) => {
  if (typeof route === 'object') {
    goTo(route.name, route.params)
  } else {
    goTo(route)
  }
}
</script>

<style scoped>
.custom-dropdown.el-popper {
  background: #fff !important;
}

.topbar-dropdowns {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 30px auto 0 auto;
  flex-wrap: wrap;
  width: 100%;
}

.topbar-btn {
  background-color: transparent;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 18px;
  border-radius: 10px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  height: 40px;
  cursor: pointer;
}

/* .el-button {
  font-family: inherit;
  font-size: 20px;
} */

.topbar-btn:hover,
.topbar-btn:focus {
  outline: none;
  border: none;
  /* background-color: rgba(255, 255, 255, 0.1); */
}

.caret-icon {
  font-size: 16px;
  opacity: 0.8;
  transition: all 0.5s;
}

.hover {
  border: none;
  outline: none;
}

.el-icon {
  margin-left: 4px;
  opacity: 0.8;
}

@media (max-width: 1024px) {
  .topbar-dropdowns {
    display: none;
  }
}
</style>
<style>
.refined-dropdown {
  background: #ffffff;
  border-radius: 15px !important;
  border: none !important;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.08),
    0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  padding: 4px !important;
  margin-top: 10px !important;
}

.refined-dropdown .el-dropdown-menu__item {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #374151;
  padding: 10px 20px;
  margin: 2px 4px;
  border-radius: 15px;
  transition: all 0.2s ease;
}

.refined-dropdown .el-dropdown-menu__item:hover {
  background-color: #f3f4f6;
  color: #111827;
  transform: translateY(-1px);
}
</style>
