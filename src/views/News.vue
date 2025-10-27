<template>
  <div>
    <button @click="news">
      <h3>最新消息</h3>
    </button>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const news = () => {
  alert('開發中')
}
</script>
<style scoped></style>
