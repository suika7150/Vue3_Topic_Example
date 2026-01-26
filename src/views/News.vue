<template>
  <div class="news-container">
    <div class="news-header">
      <h1 class="title">最新<span class="gold-text">情報</span></h1>
      <p class="subtitle">掌握盛典動態，鎖定第一手折扣情報</p>
    </div>

    <div class="news-grid">
      <div
        v-for="(item, index) in newsList"
        :key="index"
        class="news-card"
        @click="openDetails(item)"
      >
        <div class="card-image">
          <img :src="item.image" :alt="item.title" />
          <div class="category-tag">{{ item.category }}</div>
        </div>

        <div class="card-content">
          <span class="date">{{ item.date }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
          <div class="read-more">
            READ MORE <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const newsList = ref([
  {
    title: '雙11盛典：限定款全球首發',
    date: '2026.11.01',
    category: '活動快訊',
    summary: '年度最受矚目的曜黑系列即將解鎖，搶先預約領取限量優先購買權。',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: '物流系統升級：雙11期間 24H 到貨',
    date: '2026.11.03',
    category: '服務公告',
    summary: '為了提供更好的購物體驗，我們優化了全台物流鏈，極速配送不再是夢想。',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: '設計師聯名系列：光影之巔正式開售',
    date: '2026.11.05',
    category: '新卡登場',
    summary: '與知名數位藝術家跨界合作，將科技美學融入日常生活。',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
  },
])

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
  min-height: 100vh;
  background-color: #0a0a0a; /* 極黑背景 */
  padding: 80px 20px;
  color: #fff;
}

.news-header {
  text-align: center;
  margin-bottom: 60px;
}

.title {
  font-size: clamp(32px, 5vw, 48px);
  letter-spacing: -1px;
  font-weight: 800;
  margin-bottom: 10px;
}

.gold-text {
  background: linear-gradient(90deg, #ffd700, #b8860b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #888;
  font-size: 16px;
}

/* 響應式網格 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 新聞卡片質感 */
.news-card {
  background: #1a1a1a;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  border: 1px solid #333;
}

.news-card:hover {
  transform: translateY(-10px);
  border-color: #ffd700;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.1);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.news-card:hover .card-image img {
  transform: scale(1.1);
}

.category-tag {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(255, 215, 0, 0.9);
  color: #000;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: bold;
}

.card-content {
  padding: 25px;
}

.date {
  color: #ffd700;
  font-size: 14px;
  font-weight: 500;
  display: block;
  margin-bottom: 10px;
}

.card-content h3 {
  font-size: 20px;
  margin-bottom: 15px;
  line-height: 1.4;
}

.card-content p {
  color: #aaa;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  font-size: 12px;
  color: #ffd700;
  letter-spacing: 1px;
}

/* RWD 調整 */
@media (max-width: 768px) {
  .news-container {
    padding: 40px 15px;
  }
  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>
