<template>
  <div>
    <h1>美國旅遊專區 🇺🇸</h1>
    <p>這裡是 USA.vue 的內容，可以用來測試是否成功載入。</p>

    <button @click="sayHello">點我試試事件</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const sayHello = () => {
  alert('成功載入 USA.vue！')
}
</script>

<style scoped>
h1 {
  color: #409eff;
  margin-bottom: 16px;
}

p {
  font-size: 16px;
  color: #333;
}

button {
  margin-top: 12px;
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #66b1ff;
}
</style>
