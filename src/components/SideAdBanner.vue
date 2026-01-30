<template>
  <div
    class="side-ad"
    :class="[position, { 'ad-float': isScrolling }]"
    v-if="isVisible"
    :style="{
      transform: isScrolling ? `translateY(${scrollDirection * 100}px)` : 'translateY(0)',
    }"
  >
    <button class="close-btn" @click="isVisible = false" title="關閉廣告">×</button>
    <a :href="link" target="_blank" class="ad-link">
      <img :src="image" :alt="title" />
    </a>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'

defineProps({
  position: { type: String, default: 'left' },
  image: { type: String, default: '' },
  link: { type: String, default: '#' },
  title: { type: String, default: '活動廣告' },
})

const isVisible = ref(true)
const isScrolling = ref(false)
const scrollDirection = ref(0) //方向
let lastScrollY = window.scrollY
let scrollTimer = null

const handleScroll = () => {
  isScrolling.value = true
  const currentScrollY = window.scrollY

  if (currentScrollY > lastScrollY) {
    scrollDirection.value = 1 // 向下滾動
  } else {
    scrollDirection.value = -1 // 向上滾動
  }

  lastScrollY = currentScrollY

  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    isScrolling.value = false
    scrollDirection.value = 0
  }, 250) // 歸位速度
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.side-ad {
  position: fixed;
  top: 250px;
  width: 12vw;
  height: 25vw;

  max-width: 180px;
  min-width: 100px;

  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform;
  background: #eee;
  z-index: 9999;
  overflow: hidden;
}

.left {
  left: 20px;
}

.right {
  right: 20px;
}

.ad-link {
  display: block;
  width: 100%;
  height: 100%;
}

.side-ad img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  font-size: 20px;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

@media (max-width: 1100px) {
  .side-ad {
    /* display: none; */
    top: 50%;
  }
}
</style>
