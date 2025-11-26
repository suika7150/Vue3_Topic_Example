<template>
  <a :href="brand.url" target="_blank" class="brand-icon-link">
    <div class="brand-icon-wrapper">
      <img :src="iconPath" :alt="`${brand.name} Icon`" v-if="iconPath" />
      <span v-else class="placeholder-text">{{ brand.name.slice(0, 1) }}</span>
    </div>
    <p class="brand-name">{{ brand.name }}</p>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 接收單個品牌物件
  brand: {
    type: Object,
    required: true,
    default: () => ({ name: 'Brand', url: '#', icon: '' }),
  },
})

const iconPath = computed(() => {
  if (props.brand.icon) {
    return `Brands/${props.brand.icon}` // 根據品牌資料決定圖標路徑，請根據您的路徑調整props.brand.icon
  }
  return ''
})
</script>

<style scoped>
/* 圓形圖標的樣式 */
.brand-icon-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  margin: 0 15px;
  transition: transform 0.2s;
}

.brand-icon-link:hover {
  transform: translateY(-5px);
}

.brand-icon-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%; /* 圓形 */
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 確保內容不會溢出圓形 */
}

/* 圖片樣式（如果使用圖片） */
.brand-icon-wrapper img {
  width: 70%;
  height: 70%;
  object-fit: contain; /* 確保圖片縮放良好 */
}

/* 佔位符文字樣式 */
.placeholder-text {
  font-size: 32px;
  font-weight: bold;
  color: #666;
}

.brand-name {
  margin-top: 8px;
  font-size: 14px;
  text-align: center;
}
</style>
