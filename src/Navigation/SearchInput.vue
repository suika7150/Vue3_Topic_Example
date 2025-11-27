<template>
  <div class="search-wrapper">
    <el-button type="primary" circle @click="toggleSearch" class="search-btn">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
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
}

/* 展開動畫 */
.expand-enter-active,
.expand-leave-active {
  transition:
    max-width 0.7s ease,
    opacity 0.7s ease;
  max-width: 300px;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-width: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-width: 300px;
}

.search-input {
  height: 32px;
  font-size: 12px;
  overflow: hidden;
}
.search-btn {
  background-color: black;
  border: none;
  width: 32px;
  height: 32px;
  font-size: 16px;
}
</style>
