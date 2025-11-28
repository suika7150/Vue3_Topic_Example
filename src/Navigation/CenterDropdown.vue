<template>
  <div class="topbar-dropdowns">
    <!-- 秋季限定 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn"
        >活動專區<el-icon><CaretBottom /></el-icon
      ></el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goNews1">新聞1</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 更多活動 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn">
        聯名專區 <el-icon><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goNews3">動漫聯名</el-dropdown-item>
          <el-dropdown-item @click="goNews4">電影聯名</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 更多活動 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn">
        品牌專區 <el-icon><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu class="center-menu-dropdown">
          <el-dropdown-item @click="goNews3">蘋果</el-dropdown-item>
          <el-dropdown-item @click="goNews4">三星</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 雙11大優惠 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn"
        >季節限定<el-icon><CaretBottom /></el-icon
      ></el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goNews2">冬季限定</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 更多活動 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn">
        雙11大優惠 <el-icon><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goNews3">新聞</el-dropdown-item>
          <el-dropdown-item @click="goNews4">公告</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 更多活動 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn">
        更多活動 <el-icon><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goNews3">新聞</el-dropdown-item>
          <el-dropdown-item @click="goNews4">公告</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 更多活動 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn">
        購物須知 <el-icon><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goNews3">新聞</el-dropdown-item>
          <el-dropdown-item @click="goNews4">公告</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 更多活動 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn">
        Q & A <el-icon><CaretBottom /></el-icon>
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
import { ArrowDown, CaretBottom } from '@element-plus/icons-vue'
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
  gap: 15px; /* 按鈕間距 */
  margin-left: 40px;
  flex-wrap: wrap; /* 允許換行 */
}

.topbar-btn {
  background-color: transparent;
  color: white;
  border: none;
  padding: 8px 12px; /* 放大按鈕 */
  font-size: 18px;
  cursor: pointer;
  /* gap: 50px; */
}

.topbar-btn:hover,
.topbar-btn:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  outline: none;
}
</style>
