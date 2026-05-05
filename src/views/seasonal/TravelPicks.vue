<template>
  <ShowcaseLayout bg="/images/season/summer-travel.jpg">
    <h1>🚗 出遊推薦</h1>

    <div class="grid">
      <div class="card" v-for="i in 6" :key="i">
        <h3>推薦行程 {{ i }}</h3>
        <p>輕旅行 / 週末放鬆 / 親子行程</p>
      </div>
    </div>
  </ShowcaseLayout>
</template>

<script setup>
import ShowcaseLayout from '@/layouts/ShowcaseLayout.vue'
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  color: white;
}
</style>
