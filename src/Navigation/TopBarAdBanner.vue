<template>
  <div
    v-if="show"
    class="topbar-ad-banner"
    :style="{ width }"
    @mouseenter="pauseRotation"
    @mouseleave="startRotation"
  >
    <a :href="ads[currentAdIndex].link" target="_self" class="ad-text" :key="currentAdIndex">
      <transition name="fade" mode="out-in">
        <span>{{ ads[currentAdIndex].text }}</span>
      </transition>
    </a>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: true },
  width: { type: String, default: '500px' },
  interval: { type: Number, default: 4000 },
  ads: {
    type: Array,
    default: () => [
      { text: '🔥 限時 7 折搶購！', link: '/category/life/food' },
      { text: '🚀 加入會員送紅利！', link: '/category/tech/frontend' },
      { text: '🎉 新品上架快來逛！', link: '/category/life/travel' },
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
  background-color: #ffd04b;
  color: #333;
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

.ad-text {
  display: block;
  color: inherit;
  text-decoration: none;
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
