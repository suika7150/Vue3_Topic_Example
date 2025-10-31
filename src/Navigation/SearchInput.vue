<template>
  <div class="search-wrapper">
    <el-button type="primary" circle @click="toggleSearch" class="search-btn">
      <el-icon><Search /></el-icon>
    </el-button>

    <transition name="expand">
      <el-input
        v-show="showSearch"
        v-model="searchText"
        placeholder="搜尋商品"
        class="search-input"
        @blur="collapseSearch"
      >
        <template #append>
          <el-button type="primary" @click="performSearch">搜尋</el-button>
        </template>
      </el-input>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const showSearch = ref(false)
const searchText = ref('')

const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

const collapseSearch = () => {
  setTimeout(() => {
    showSearch.value = false
  }, 200)
}
</script>

<style scoped>
.search-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 展開動畫 */
.expand-enter-active,
.expand-leave-active {
  transition:
    max-width 0.3s ease,
    opacity 0.3s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-width: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-width: 200px;
}

.search-input {
  max-width: 200px;
  width: 200px;
  height: 20px;
  font-size: 12px;
  overflow: hidden;
}
.search-btn {
  background-color: black;
  border: none;
  width: 32px;
  height: 32px;
  /* padding: 0; */
  font-size: 13px;
}
</style>
