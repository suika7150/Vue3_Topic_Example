<template>
  <header class="search-input">
    <el-input :type="text" placeholder="搜尋商品" prefix-icon="el-icon-search" :width="'50px'">
      <template #append>
        <el-button class="search-button" :is-loading="false" icon="Search">
          <div class="search-button-font">搜尋</div>
        </el-button>
      </template>
    </el-input>
  </header>
</template>

<script>
// const props = defineProps({
//   modelValue: {
//     type: String,
//     default: '',
//   },
// })
</script>

<style scoped>
.search-input {
  height: 40px;
  width: 15%;
  color: #000;
}
.search-button {
  width: 30;
}

.search-button-font {
  font-size: 16px;
  color: black;
}
</style>
