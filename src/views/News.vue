<template>
  <div class="news-container">
    <div class="news-header">
      <h1 class="title">最新消息</h1>
    </div>

    <div class="tabs-bar-wrapper">
      <div class="news-tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-btn', { active: currentTab === tab }]"
          @click="currentTab = tab"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <div class="news-grid">
      <div
        v-for="(item, index) in filteredNewsList"
        :key="index"
        class="news-card"
        @click="openDetails(item)"
      >
        <div class="card-image">
          <img :src="item.image" :alt="item.title" />
        </div>

        <div class="card-content">
          <div class="card-meta">
            <span class="date">{{ item.date }}</span>
            <span class="divider">-</span>
            <span class="category">{{ item.category }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const tabs = ['全部', '活動快訊', '服務公告', '商品優惠']
const currentTab = ref('全部')

const newsList = ref([
  {
    title: '物流系統升級：雙11期間 24H 到貨',
    date: '2026.11.03',
    category: '服務公告',
    summary: '為了提供更好的購物體驗，我們優化了全台物流鏈，極速配送不再是夢想。',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: '官方線上商城系統維護通知',
    date: '2026.11.20',
    category: '服務公告',
    summary: '為提升交易安全，商城將於當日凌晨 02:00 - 05:00 進行金流系統升級維護。',
    image:
      'https://plus.unsplash.com/premium_photo-1665203633139-4605a228d93f?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'NVIDIA RTX 50 系列：限定款全球首發',
    date: '2026.11.01',
    category: '活動快訊',
    summary:
      '年度最受矚目的新世代架構顯卡即將解鎖！極致光追與 AI 算力突破天際，搶先預約領取限量優先購買權。',
    image:
      'https://images.unsplash.com/photo-1555618565-9f2b0323a10d?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'ACER Predator 掠奪者系列：極光美學跨界聯名',
    date: '2026.11.05',
    category: '商品優惠',
    summary:
      '與新銳數位藝術家跨界合作，將賽博霓虹的科技美學完美融入高效能機身，限定版優惠驚喜解鎖。',
    image:
      'https://images.unsplash.com/photo-1629751373493-6f8195a105a4?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: '智慧降噪耳機 WH-X1000 預購開跑',
    date: '2026.11.10',
    category: '商品優惠',
    summary: '全新搭載自研音訊晶片，帶來前所未有的靜謐聆聽體驗，首批預購加贈專屬收納包。',
    image:
      'https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?auto=format&fit=crop&q=80&w=880',
  },
  {
    title: '【葬送的芙莉蓮】跨界聯名特展：探索明日科技的魔法可能',
    date: '2026.11.15',
    category: '活動快訊',
    summary: '大片盛開的微風藍色小花、草地，完美重現欣梅爾故鄉的蒼影蘭意象，非常浪漫優雅。',
    image:
      'https://plus.unsplash.com/premium_photo-1754549889413-3a3ad4e5261f?auto=format&fit=crop&q=80&w=880',
  },
])

const filteredNewsList = computed(() => {
  if (currentTab.value === '全部') {
    return newsList.value
  }
  return newsList.value.filter((item) => item.category === currentTab.value)
})

const openDetails = (item) => {
  ElMessage({
    message: `「${item.title}」內容開發中，敬請期待！`,
    type: 'info',
    plain: true,
  })
}
</script>

<style scoped>
.news-container {
  width: 100%;
  padding: 80px 20px;
  box-sizing: border-box;
}

.news-header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: clamp(32px, 5vw, 40px);
  letter-spacing: 1px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #000000;
}

.subtitle {
  color: #666666;
  font-size: 15px;
}

.tabs-bar-wrapper {
  max-width: 1200px;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background-color: #e0e0e0;
  padding: 12px 0;
  margin-bottom: 60px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.85);
}

.news-tabs {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  padding: 0 20px;
  box-sizing: border-box;
}

.tab-btn {
  background: #ffffff;
  color: #555555;
  border: 1px solid #e0e0e0;
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.5s ease;
}

.tab-btn:hover {
  background: #e8e8e8;
}

.tab-btn.active {
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: #ffffff;
  font-weight: 600;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.news-card {
  background: transparent;
  overflow: hidden;
  cursor: pointer;
  border: none;
  transition: opacity 0.3s ease;
}

.card-image {
  position: relative;
  aspect-ratio: 16 / 10;
  height: auto;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 16px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.news-card:hover .card-image img {
  transform: scale(1.04);
}

.card-content {
  padding: 0;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  margin-bottom: 8px;
  font-weight: 500;
}

.card-content h3 {
  color: #000000;
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.card-content p {
  color: #666666;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 36px 20px;
  }
}

@media (max-width: 640px) {
  .news-grid {
    grid-template-columns: 1fr;
    gap: 36px 0;
  }
}
</style>
