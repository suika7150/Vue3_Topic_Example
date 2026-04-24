<template>
  <div class="topbar-dropdowns">
    <!-- 活動專區 -->
    <el-dropdown trigger="hover" popper-class="refined-dropdown" :show-timeout="50">
      <el-button class="topbar-btn"
        >活動專區<el-icon class="caret-icon"><CaretBottom /></el-icon
      ></el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goFlashSale">本週特惠</el-dropdown-item>
          <el-dropdown-item @click="goLuckyWheel">幸運輪盤</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 聯名專區 -->
    <el-dropdown trigger="hover" popper-class="refined-dropdown" :show-timeout="50">
      <el-button class="topbar-btn">
        聯名專區 <el-icon class="caret-icon"><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goAnime">動漫聯名款</el-dropdown-item>
          <el-dropdown-item @click="goMovie">電影大聯盟</el-dropdown-item>
          <el-dropdown-item @click="goDesigner">設計師聯名款</el-dropdown-item>
          <el-dropdown-item @click="goLimited">全球限量版</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 品牌專區 -->
    <el-dropdown trigger="hover" popper-class="refined-dropdown" :show-timeout="50">
      <el-button class="topbar-btn">
        品牌專區 <el-icon class="caret-icon"><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu class="center-menu-dropdown">
          <el-dropdown-item @click="">食品飲品</el-dropdown-item>
          <el-dropdown-item @click="">汽機車用品</el-dropdown-item>
          <el-dropdown-item @click="">居家生活</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 季節限定 -->
    <el-dropdown trigger="hover" popper-class="refined-dropdown" :show-timeout="50">
      <el-button class="topbar-btn"
        >季節限定<el-icon class="caret-icon"><CaretBottom /></el-icon
      ></el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="">季節精選</el-dropdown-item>
          <el-dropdown-item @click="">出遊推薦</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 雙11大優惠 -->
    <el-dropdown trigger="hover" popper-class="refined-dropdown" :show-timeout="50">
      <el-button class="topbar-btn">
        雙11周年慶典 <el-icon class="caret-icon"><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="">年度特選回饋</el-dropdown-item>
          <el-dropdown-item @click="">滿額加碼驚喜</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 更多活動 -->
    <el-dropdown trigger="hover" popper-class="refined-dropdown" :show-timeout="50">
      <el-button class="topbar-btn">
        更多活動 <el-icon class="caret-icon"><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="">新聞</el-dropdown-item>
          <el-dropdown-item @click="">公告</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 購買須知 -->
    <div class="hover">
      <el-button class="topbar-btn" @click="goShoppingGuide"> 購買須知 </el-button>
    </div>

    <!-- 常見問題 Q&A -->
    <!-- <div>
      <el-button class="topbar-btn" @click="goQA"> 常見問題 Q&A </el-button>
    </div> -->
  </div>
</template>

<script setup>
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElIcon } from 'element-plus'
import { ArrowDown, CaretBottom } from '@element-plus/icons-vue'
import { useNavigation } from '@/composables/useNavigation'

const {
  goShoppingGuide,
  goQA,
  goFlashSale,
  goLuckyWheel,
  goAnime,
  goMovie,
  goDesigner,
  goLimited,
} = useNavigation()
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
