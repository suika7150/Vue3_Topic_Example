<template>
  <div
    v-if="show"
    class="topbar-ad-banner"
    :style="{ width }"
    @mouseenter="pauseRotation"
    @mouseleave="startRotation"
  >
    <div class="marquee">
      <transition-group name="slide">
        <div class="ad-text" :key="currentAdIndex">
          {{ currentAds[0].text }}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: true },
  width: { type: String, default: '2000px' },
  interval: { type: Number, default: 4000 },
  ads: {
    type: Array,
    default: () => [
      { text: ' 限時 7 折快來搶購！', link: '/category/life/food' },
      { text: ' 加入會員送紅利點數！', link: '/category/tech/frontend' },
      { text: ' 新品上架快來逛，消費滿千免運！', link: '/category/life/travel' },
    ],
  },
})

const currentAdIndex = ref(0)
const currentAds = computed(() => [props.ads[currentAdIndex.value]])

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
  padding: 5px 12px;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  height: 0px;
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
}

/* .topbar-ad-banner:hover .ad-text {
  animation-play-state: paused;
} */

.marquee {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 5px 0;
}

.ad-text {
  color: #fff;
  display: block;
  margin-right: 400px;
  font-size: 15px;
  white-space: nowrap; /* 禁用換行 */
}

/* 垂直滑動動畫 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s ease;
  /* position: absolute; */
  /* width: 100%; */
  /* top: 0; */
  /* left: 0; */
}

.slide-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
