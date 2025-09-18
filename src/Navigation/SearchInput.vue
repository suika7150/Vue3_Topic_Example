<template>
  <el-input type="text" placeholder="搜尋商品" prefix-icon="el-icon-search" class="search-input">
    <template #append>
      <el-button class="search-button">搜尋</el-button>
    </template>
  </el-input>
</template>

<script setup>
// 可以加 props 或 v-model
</script>

<style scoped>
.search-input {
  width: 100%;
  max-width: 500px;
}
.search-button {
  height: 40px;
}
</style>
