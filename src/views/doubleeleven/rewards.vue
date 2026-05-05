<template>
  <CampaignShell theme="dark" :full="true" bgImage="/layoutImages/campaign-double-eleven.png">
    <template #hero>
      <div class="hero">
        <h1>年度特選回饋</h1>
        <p>雙11限定回饋活動</p>
      </div>
    </template>

    <div class="rewards-page">
      <div class="card">
        <h2>回饋規則</h2>
        <p>消費滿額即可獲得加碼回饋</p>
      </div>

      <div class="card">
        <h2>活動期間</h2>
        <p>11/1 - 11/30</p>
      </div>
    </div>
  </CampaignShell>
</template>

<script setup>
import CampaignShell from '@/layouts/EventLayout.vue'

const bgImage = '/images/double11-bg.jpg'
</script>

<style scoped>
.hero {
  text-align: center;
  color: white;
}

.hero h1 {
  font-size: 36px;
  font-weight: bold;
}

.hero p {
  opacity: 0.8;
}

.rewards-page {
  display: grid;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.card {
  background: rgba(255, 255, 255, 0.08);
  padding: 20px;
  border-radius: 12px;
  color: white;
  backdrop-filter: blur(10px);
}
</style>
