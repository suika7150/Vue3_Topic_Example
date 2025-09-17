<template>
  <el-carousel height="800px" indicator-position="outside" arrow="hover" :interval="5000">
    <el-carousel-item v-for="(ad, index) in ads" :key="index">
      <a :href="ad.link" target="_self" class="ad-link">
        <img :src="ad.image" :alt="ad.title" class="ad-image" />
      </a>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
const props = defineProps({
  ads: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>

<style scoped>
.ad-link {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ad-link:hover .ad-image {
  transform: scale(1.02);
}
</style>
