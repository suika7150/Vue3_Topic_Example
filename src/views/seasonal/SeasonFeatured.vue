<template>
  <ShowcaseLayout bg="/layoutImages/seasonal/autumn.jpg">
    <el-carousel
      height="1100px"
      indicator-position="outside"
      arrow="hover"
      class="seasonal-carousel"
    >
      <el-carousel-item v-for="item in banners" :key="item.id">
        <div class="banner" :style="{ backgroundImage: `url(${item.img})` }">
          <div class="banner-mask">
            <h2>{{ item.title }}</h2>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <ProductList />
  </ShowcaseLayout>
</template>

<script setup>
import ShowcaseLayout from '@/layouts/ShowcaseLayout.vue'
import ProductList from '@/views/products/ProductList.vue'

const banners = [
  {
    id: 1,
    img: '/seasonal/seasonal-sale.png',
  },
  {
    id: 2,
    img: '/layoutImages/seasonal/spring2.jpg',
  },
  {
    id: 3,
    img: '/layoutImages/seasonal/spring3.jpg',
  },
]
</script>
<style scoped>
.seasonal-carousel .banner {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: cover;
  background-repeat: no-repeat;
}

.banner {
  position: relative;
  background-position: center 30%;
}

.banner-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
  color: white;
  background: rgba(0, 0, 0, 0.3);
}
</style>
