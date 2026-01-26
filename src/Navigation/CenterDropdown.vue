<template>
  <div class="topbar-dropdowns">
    <!-- 活動專區 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn"
        >活動專區<el-icon><CaretBottom /></el-icon
      ></el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goFlashSale">本週特惠</el-dropdown-item>
          <el-dropdown-item @click="goLuckyWheel">幸運輪盤</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 聯名專區 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn">
        聯名專區 <el-icon><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goNews3">動漫聯名款</el-dropdown-item>
          <el-dropdown-item @click="goNews4">電影大聯盟</el-dropdown-item>
          <el-dropdown-item @click="goNews4">設計師聯名款</el-dropdown-item>
          <el-dropdown-item @click="goNews4">全球限量版</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 品牌專區 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn">
        品牌專區 <el-icon><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu class="center-menu-dropdown">
          <el-dropdown-item @click="goNews3">食品飲品</el-dropdown-item>
          <el-dropdown-item @click="goNews4">汽機車用品</el-dropdown-item>
          <el-dropdown-item @click="goNews4">居家生活</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 季節限定 -->
    <el-dropdown trigger="hover">
      <el-button class="topbar-btn"
        >季節限定<el-icon><CaretBottom /></el-icon
      ></el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goNews2">季節精選</el-dropdown-item>
          <el-dropdown-item @click="goNews2">出遊推薦</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 雙11大優惠 -->
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

    <!-- 購買須知 -->
    <div class="hover">
      <el-button class="topbar-btn" @click="goShoppingGuide"> 購買須知 </el-button>
    </div>

    <!-- 常見問題 Q&A -->
    <div>
      <el-button class="topbar-btn" @click="goQA"> 常見問題 Q&A </el-button>
    </div>
  </div>
</template>

<script setup>
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElIcon } from 'element-plus'
import { ArrowDown, CaretBottom } from '@element-plus/icons-vue'
import { useNavigation } from '@/composables/useNavigation'

const { goShoppingGuide, goQA, goFlashSale, goLuckyWheel } = useNavigation()

// const goNews1 = () => goto('/news1')
// const goNews2 = () => goto('/news2')
// const goNews3 = () => goto('/news3')
// const goNews4 = () => goto('/news4')
</script>

<style scoped>
.topbar-dropdowns {
  display: flex;
  gap: 15px;
  margin: 20px 0 0 40px;
  flex-wrap: wrap;
}

.topbar-btn {
  background-color: transparent;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 18px;
  cursor: pointer;
}

.topbar-btn:hover,
.topbar-btn:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  outline: none;
}
</style>
