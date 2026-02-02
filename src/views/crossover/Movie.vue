<script setup lang="ts">
import { ref } from 'vue'
import { useNavigation } from '@/composables/useNavigation.js'

const { goTo } = useNavigation()

const movieProducts = ref([
  // {
  //   id: 101,
  //   title: '沙丘：第二部 - 弗瑞曼人蒸餾服風衣',
  //   series: 'DUNE: PART TWO',
  //   price: 4580,
  //   image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2070',
  //   isLimited: true,
  //   tag: '年度神作',
  // },
  {
    id: 102,
    title: '蝙蝠俠 - 韋恩企業極簡後背包',
    series: 'THE BATMAN',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1974',
    isLimited: false,
    tag: '暗夜傳奇',
  },
])

const goToDetail = (id: number) => {
  goTo('productDetail', { id })
}
</script>

<template>
  <div class="movie-page">
    <div class="cinema-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="cinema-label">PREMIERE TONIGHT</span>
        <h1 class="glitch-title">電影大聯盟</h1>
        <p class="description">穿上銀幕經典，成為你自己生命中的主角。</p>
        <div class="scroll-indicator">SCROLL TO DISCOVER</div>
      </div>
    </div>

    <div class="movie-content">
      <el-row :gutter="50">
        <el-col :xs="24" :md="12" v-for="product in movieProducts" :key="product.id">
          <div class="movie-card" @click="goToDetail(product.id)">
            <div class="poster-wrap">
              <img :src="product.image" class="poster-img" />
              <div class="movie-tag">{{ product.tag }}</div>
            </div>
            <div class="movie-meta">
              <span class="series-name">{{ product.series }}</span>
              <h2 class="product-title">{{ product.title }}</h2>
              <div class="price-box">
                <span class="currency">TWD</span>
                <span class="amount">{{ product.price }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.movie-page {
  background-color: #0a0a0a;
  color: #fff;
  min-height: 100vh;
}

/* Cinema Hero 視差效果 */
.cinema-hero {
  height: 90vh;
  background-image: url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070'); /* 戲院背景 */
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.glitch-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 900;
  text-transform: uppercase;
  margin: 10px 0;
  letter-spacing: 15px;
  color: #e50914;
}

.description {
  font-size: clamp(1.2rem, 1vw, 4.5rem);
  letter-spacing: 2px;
  opacity: 0.9;
}

/* 電影卡片風格 */
.movie-content {
  max-width: 1300px;
  margin: 0 auto;
  padding: 100px 40px;
}

.movie-card {
  cursor: pointer;
  margin-bottom: 120px;
  transition: all 0.4s ease;
}

.poster-wrap {
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.poster-img {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  filter: grayscale(20%);
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.movie-card:hover .poster-img {
  filter: grayscale(0%);
  transform: scale(1.05);
}

.movie-tag {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #e50914;
  padding: 5px 15px;
  font-weight: bold;
  font-size: 0.8rem;
}

.movie-meta {
  padding-top: 30px;
  border-bottom: 1px solid #333;
  padding-bottom: 20px;
}

.series-name {
  color: #e50914;
  font-weight: 700;
  letter-spacing: 3px;
  font-size: 0.9rem;
}

.product-title {
  font-size: 1.8rem;
  margin: 10px 0;
  font-weight: 400;
}

.price-box {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.amount {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
