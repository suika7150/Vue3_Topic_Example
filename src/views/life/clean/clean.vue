<template>
  <div class="page-layout">
    <ProductList forced-category="清潔用品" />
  </div>
</template>

<script setup>
import ProductList from '@/views/products/ProductList.vue'
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
