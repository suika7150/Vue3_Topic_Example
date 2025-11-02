<template>
  <div class="topbar-dropdowns">
    <!-- 秋季限定 -->
    <el-dropdown trigger="hover" class="topbar-dropdown">
      <el-button class="topbar-btn">秋季限定</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goNews1">新聞1</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 雙11大優惠 -->
    <el-dropdown trigger="hover" class="topbar-dropdown">
      <el-button class="topbar-btn">雙11大優惠</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goNews2">新聞2</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 更多活動 -->
    <el-dropdown trigger="hover" class="topbar-dropdown">
      <el-button class="topbar-btn">
        更多活動 <el-icon><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goNews3">新聞</el-dropdown-item>
          <el-dropdown-item @click="goNews4">公告</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElIcon } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useNavigation } from '@/composables/useNavigation'

const { goto } = useNavigation()
const goNews1 = () => goto('/news1')
const goNews2 = () => goto('/news2')
const goNews3 = () => goto('/news3')
const goNews4 = () => goto('/news4')
</script>

<style scoped>
.topbar-dropdowns {
  display: flex;
  gap: 20px; /* 按鈕間距 */
  margin-left: 40px;
}

.topbar-btn {
  background-color: transparent;
  color: white;
  border: none;
  padding: 12px 20px; /* 放大按鈕 */
  font-size: 18px;
  cursor: pointer;
}

.topbar-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
