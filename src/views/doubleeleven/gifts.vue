<template>
  <CampaignShell theme="dark" :full="true" bgImage="/layoutImages/campaign-double-eleven.png">
    <template #hero>
      <div class="hero">
        <h1>滿額加碼驚喜</h1>
        <p>消費越多，驚喜越多！</p>
      </div>
    </template>

    <div class="gifts-page">
      <div class="card">
        <h2>活動說明</h2>
        <p>活動期間內達到指定消費金額，即可獲得額外驚喜贈品或折扣券。</p>
      </div>

      <div class="card">
        <h2>滿額贈禮規則</h2>

        <ul class="rule-list">
          <li>
            <span class="amount">滿 NT$1,000</span>
            <span class="reward">送 100 元購物金</span>
          </li>

          <li>
            <span class="amount">滿 NT$3,000</span>
            <span class="reward">送 300 元購物金 + 隨機小禮</span>
          </li>

          <li>
            <span class="amount">滿 NT$5,000</span>
            <span class="reward">送 600 元購物金 + 限定好禮</span>
          </li>
        </ul>
      </div>

      <div class="card">
        <h2>注意事項</h2>
        <p>• 活動期間：11/1 - 11/30</p>
        <p>• 贈品數量有限，送完為止</p>
        <p>• 不可與其他優惠併用</p>
      </div>
    </div>
  </CampaignShell>
</template>

<script setup>
import CampaignShell from '@/layouts/EventLayout.vue'
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

/* 主內容 */
.gifts-page {
  display: grid;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

/* 卡片 */
.card {
  background: rgba(255, 255, 255, 0.08);
  padding: 20px;
  border-radius: 12px;
  color: white;
  backdrop-filter: blur(10px);
}

/* 規則列表 */
.rule-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.rule-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
}

.amount {
  font-weight: bold;
}

.reward {
  opacity: 0.9;
}
</style>
