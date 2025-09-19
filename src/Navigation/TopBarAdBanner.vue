<template>
  <div
    v-if="show"
    class="topbar-ad-banner"
    :style="{ width }"
    @mouseenter="pauseRotation"
    @mouseleave="startRotation"
  >
    <div class="marquee">
      <span class="ad-text">
        <span v-for="(ad, i) in ads" :key="i">
          {{ ad.text }}<span v-if="i < ads.length - 1"></span>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: true },
  width: { type: String, default: '300px' },
  interval: { type: Number, default: 4000 },
  ads: {
    type: Array,
    default: () => [
      { text: ' 限時 7 折搶購！', link: '/category/life/food' },
      { text: ' 加入會員送紅利！', link: '/category/tech/frontend' },
      { text: ' 新品上架快來逛！', link: '/category/life/travel' },
    ],
  },
})

const currentAdIndex = ref(0)
let timer = null

const startRotation = () => {
  stopRotation()
  if (props.ads.length > 1) {
    timer = setInterval(() => {
      currentAdIndex.value = (currentAdIndex.value + 1) % props.ads.length
    }, props.interval)
  }
}

const pauseRotation = () => {
  stopRotation()
}

const stopRotation = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(startRotation)
onUnmounted(stopRotation)

watch(
  () => props.ads,
  () => {
    currentAdIndex.value = 0
    startRotation()
  },
)
</script>

<style scoped>
.topbar-ad-banner {
  padding: 4px 12px;
  background-color: #1c1a1ac3;
  color: #141612af;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marquee {
  width: 100%;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  padding: 5px 0;
  /* animation: scroll 10s linear infinite; */
}

.ad-text {
  color: #fff;
  display: block;
  text-decoration: none;
  /* position: fixed; */
  top: 0;
  /* z-index: 2000; */
  animation: scroll 10s linear infinite; /*設定動畫持續時間*?
  white-space: nowrap; /* 禁用換行 */
}

@keyframes scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100vw);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
