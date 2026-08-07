/** * 404 頁面 */
<template>
  <div class="not-found">
    <el-result
      icon="warning"
      title="404 頁面不存在"
      sub-title="抱歉，我們找不到您要求的頁面，可能網址有誤或已被移除。"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/')">回首頁</el-button>
        <el-button @click="$router.back()">返回上一頁</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}
</style>
