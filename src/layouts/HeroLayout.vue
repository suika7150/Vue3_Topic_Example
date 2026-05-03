/* 共用頁面版型 */

<template>
  <div class="hero-banner">
    <video :key="video" autoplay muted loop playsinline class="video-background">
      <source :src="video" type="video/mp4" />
    </video>

    <div class="overlay"></div>

    <div class="hero-content">
      <span class="category-tag">{{ tag }}</span>
      <h1 class="main-title">{{ title }}</h1>
      <p class="sub-title">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  video: String,
  title: String,
  subtitle: String,
  tag: String,
})
</script>
<style scoped>
.hero-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 110vh;
  width: 100%;
  margin-top: -80px;
}

.video-background {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6));
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 0 20px;
}

.main-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: 12px;
  margin: 25px 0;
  text-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.sub-title {
  font-size: clamp(1.2rem, 1vw, 4.5rem);
  letter-spacing: 2px;
}

.explore-btn {
  margin-top: 40px;
  padding: 25px 50px;
  font-size: 1rem;
  letter-spacing: 2px;
  background: transparent;
  color: white;
  border: 2px solid white;
  transition: all 0.3s;
}

.explore-btn:hover {
  background: white;
  color: black;
}

.category-tag {
  letter-spacing: 5px;
  font-size: 0.9rem;
  border-bottom: 2px solid #1bbfce;
  padding-bottom: 8px;
}

/* 商品內容區 */
.content-wrapper {
  max-width: 100%;
  margin: 0 auto;
}

.large-product-box {
  cursor: pointer;
  margin-bottom: 100px;
}

.img-container {
  width: 100%;
  aspect-ratio: 16/10;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  background-color: #f5f5f5;
}

.zoom-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.large-product-box:hover .zoom-img {
  transform: scale(1.1);
}

.product-info {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.product-info h3 {
  font-size: 1.6rem;
  margin: 0;
  font-weight: 600;
  color: #1a1a1a;
}

.product-info p {
  color: #666;
  margin: 8px 0 0 0;
  font-size: 1rem;
}

.price-tag {
  font-size: 1.4rem;
  font-weight: 700;
  color: #d44b4b;
}

.status-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #000;
  color: #fff;
  padding: 6px 18px;
  font-weight: bold;
  font-size: 0.75rem;
  letter-spacing: 2px;
  border-radius: 2px;
}

@media (max-width: 1024px) {
  .hero-banner {
    min-height: 50vh;
    margin-top: 0px;
    top: 0px;
  }
  .main-title {
    letter-spacing: 5px;
  }
  .content-wrapper {
    padding: 0 20px;
  }
}
</style>
