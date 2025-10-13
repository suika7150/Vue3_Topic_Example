<template>
  <h1>音樂專區</h1>
  <div>
    <button @click="sayHello">點我試試事件</button>
  </div>
</template>
<script setup>
function sayHello() {
  alert('正在施工中，敬請期待！')
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
