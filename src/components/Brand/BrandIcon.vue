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
  brand: {
    type: Object,
    required: true,
    default: () => ({ name: 'Brand', url: '#', icon: '' }),
  },
})

const iconPath = computed(() => {
  if (props.brand.icon) {
    return `Brands/${props.brand.icon}`
  }
  return ''
})
</script>

<style scoped>
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
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.brand-icon-wrapper img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

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
