<template>
  <el-dropdown trigger="hover">
    <el-button class="topbar-btn">
      活動專區
      <el-icon><ArrowDown /></el-icon>
    </el-button>

    <el-button class="topbar-btn">
      活動專區
      <el-icon><ArrowDown /></el-icon>
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="goNews1">秋季限定 </el-dropdown-item>
        <el-dropdown-item @clcik="goNews2">雙11大優惠 </el-dropdown-item>
        <el-dropdown-item divided>
          更多活動
          <el-dropdown-menu>
            <el-dropdown-item @click="goNews3"> 新聞</el-dropdown-item>
            <el-dropdown-item @click="goNews4"> 公告</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElIcon } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useNavigation } from '@/composables/useNavigation'

const { goto } = useNavigation()
const goNews1 = () => {
  goto('/news1')
}
const goNews2 = () => {
  goto('/news2')
}
const goNews3 = () => {
  goto('/news3')
}
const goNews4 = () => {
  goto('/news4')
}
</script>
<style scoped>
.topbar-btn {
  background-color: transparent;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
}
.topbar-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
