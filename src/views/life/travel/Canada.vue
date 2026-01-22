<template>
  <div>
    <h1>加拿大旅遊專區 🇨🇦</h1>
    <p>這裡是 Canada.vue 的內容，可以用來測試是否成功載入。</p>

    <button @click="sayHello">點我試試事件</button>
  </div>
</template>

<script setup>
const sayHello = () => {
  alert('成功載入 Canada.vue！')
}
</script>

<style scoped>
h1 {
  color: #67c23a;
  margin-bottom: 16px;
}

p {
  font-size: 16px;
  color: #333;
}

button {
  margin-top: 12px;
  padding: 8px 16px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #85d38a;
}
</style>
