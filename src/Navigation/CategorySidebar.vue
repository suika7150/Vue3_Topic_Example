<template>
  <div>
    <!-- <div
    class="sidebar-wrapper"
    :class="{ collapsed: isCollapsed }"
    @mouseenter="isCollapsed = false"
    @mouseleave="isCollapsed = true"
  > -->
    <el-menu
      class="sidebar-menu"
      :default-active="active"
      router
      :collapse="isCollapsed"
      :unique-opened="false"
      :collapse-transition="false"
    >
      <MenuItem
        v-for="item in categoriesWithPaths"
        :key="item.path"
        :item="item"
        :basePath="basePath"
      />
    </el-menu>

    <!-- 右下小按鈕 -->
    <!-- <div class="collapse-btn" @click="toggleCollapse">
      <el-icon>
        <component :is="isCollapsed ? DArrowRight : DArrowLeft" />
      </el-icon>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MenuItem from './MenuItem.vue'
import { useRoute } from 'vue-router'
import { DArrowLeft, DArrowRight } from '@element-plus/icons-vue' // ⬅️ 必要的 Icon

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  basePath: {
    type: String,
    default: '',
  },
  defaultOpenAll: {
    type: Boolean,
    default: true,
  },
})

/**
 * 這個方法用來建立菜單樹的結構
 *
 * @param {Array} items - 菜單項目的陣列
 * @param {string} parentPath - 父菜單項目的路徑
 */
const buildMenuTree = (items, parentPath = '') => {
  return items.map((item) => {
    const path = parentPath ? `${parentPath}/${item.name}` : item.name
    const newItem = {
      ...item,
      path,
    }
    if (item.subs) {
      newItem.subs = buildMenuTree(item.subs, path)
    }
    return newItem
  })
}

const categoriesWithPaths = computed(() => buildMenuTree(props.categories))

const route = useRoute()
const active = computed(() => {
  if (route.path.startsWith(props.basePath)) {
    return route.path.slice(props.basePath.length + 1) // 去掉 basePath + '/'
  }
  return ''
})

/**
 * 這個方法用來收集所有開啟的子項目
 *
 * @param items - 菜單項目的陣列
 */
const collectOpenKeys = (items) => {
  let keys = []
  items.forEach((item) => {
    if (item.subs) {
      keys.push(item.path)
      keys = keys.concat(collectOpenKeys(item.subs))
    }
  })
  return keys
}

const isCollapsed = ref(false)
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>
<style scoped>
.sidebar-wrapper {
  margin-top: 100px; /* 或 padding-top: 100px */
  width: 240px;
  min-height: 100%;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  display: flex; /* 高度隨內容延伸 */
  flex-direction: column;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
  transition: width 0.3s ease;
}

/* 收合狀態 */
.sidebar-wrapper.collapsed {
  width: 64px; /* 收合寬度 */
}

.sidebar-wrapper.collapsed .el-menu-item span {
  opacity: 0;
}

.sidebar-menu {
  border-right: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  flex: 1; /* 填滿 Sidebar 容器 */
  width: 100%;
  background-color: #f5f7fa;
}

.sidebar-menu .el-menu-item span {
  transition: opacity 0.3s;
  opacity: 1;
}

.sidebar-menu .el-menu-item,
.sidebar-menu .el-sub-menu__title {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #333;
  font-weight: 500;
}

.sidebar-menu .el-menu-item:hover,
.sidebar-menu .el-sub-menu__title:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #409eff;
  color: #f5f7fa;
}

.sidebar-menu .el-sub-menu.is-open > .el-sub-menu__title {
  background-color: #f5f7fa;
  color: #409eff;
}

.collapse-btn {
  position: absolute;
  bottom: 20px;
  right: -14px;
  transform: translateX(-50%); /* 精準置中 */
  width: 36px;
  height: 36px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10; /* 防止被 Menu 蓋住 */
}

.collapse-btn:hover {
  background-color: #f2f2f2;
  transform: translateX(-50%) scale(1.1);
}
</style>
