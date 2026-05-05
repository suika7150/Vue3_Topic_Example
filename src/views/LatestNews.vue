<template>
  <div class="latest-news">
    <h1 class="title">最新活動</h1>

    <div class="news-list">
      <div v-for="item in newsList" :key="item.id" class="news-card" @click="goDetail(item.id)">
        <img :src="item.image" class="news-img" />

        <div class="content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <span class="date">{{ item.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const newsList = [
  {
    id: 1,
    title: '雙11限時優惠',
    desc: '全館商品最低 5 折起',
    date: '2026-11-01',
    image: 'https://via.placeholder.com/120',
  },
  {
    id: 2,
    title: '新品上市活動',
    desc: '最新商品全面上架',
    date: '2026-10-25',
    image: 'https://via.placeholder.com/120',
  },
]

const goDetail = (id) => {
  router.push({ name: 'newsDetail', params: { id } })
}
</script>

<style scoped>
.latest-news {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  border: 1px solid #eee;
}

.news-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.news-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.content h3 {
  margin: 0;
  font-size: 16px;
}

.content p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.date {
  font-size: 12px;
  color: #999;
}
</style>
