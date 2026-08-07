<template>
  <div class="landing-page">
    <section class="hero-section" ref="container">
      <canvas ref="canvas"></canvas>
      <div class="content-layer">
        <h1 class="fade-in-top">關於我們</h1>
        <p class="fade-in-top delay-1">打造現代化、流暢且具視覺衝擊力的網頁體驗</p>
        <div class="scroll-hint fade-in-top delay-2">
          <span>Scroll Down</span>
          <div class="arrow">↓</div>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="section-header reveal-on-scroll">
          <h2>核心展示</h2>
          <p>沉浸式大圖視覺，隨滾動平滑呈現</p>
        </div>

        <div class="showcase-list">
          <div
            v-for="(item, index) in showcaseItems"
            :key="index"
            class="showcase-item reveal-on-scroll"
            :class="{ reverse: index % 2 !== 0 }"
          >
            <div class="large-image-wrapper">
              <img :src="item.image" :alt="item.title" loading="lazy" />
              <div class="image-overlay"></div>
            </div>

            <div class="showcase-info">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 假資料
const showcaseItems = [
  {
    title: '極致效能架構',
    desc: '透過 WebGL 與 Canvas 渲染技術，為使用者提供 60 FPS 流暢無卡頓的動態體驗，將視覺美學與效能完美融合。',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop',
  },
  {
    title: '跨平台響應體驗',
    desc: '無縫適應從行動裝置到 4K 超寬螢幕。靈活的版面配置確保每一幀視覺效果都精準到位。',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop',
  },
  {
    title: '微互動粒子美學',
    desc: '即時計算滑鼠座標與粒子距離，帶來細致的手感反饋，讓靜態頁面轉化為富有生命力的互動舞台。',
    image:
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&auto=format&fit=crop',
  },
]

// Canvas 粒子邏輯
const canvas = ref(null)
const container = ref(null)
const ctx = ref(null)
let animationId = null
let particles = []
let mouse = { x: -1000, y: -1000, tx: -1000, ty: -1000 }

function initParticles(num = 120) {
  particles = []
  const w = canvas.value?.width || window.innerWidth
  const h = canvas.value?.height || window.innerHeight

  for (let i = 0; i < num; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      dx: (Math.random() - 0.5) * 1.2,
      dy: (Math.random() - 0.5) * 1.2,
    })
  }
}

const handleMouse = (e) => {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  mouse.tx = e.clientX - rect.left
  mouse.ty = e.clientY - rect.top
}

const resize = () => {
  if (!container.value) return
  canvas.value.width = container.value.clientWidth
  canvas.value.height = container.value.clientHeight
}

function animate() {
  const canvasEl = canvas.value
  const ctx2 = ctx.value
  if (!canvasEl || !ctx2) return

  ctx2.clearRect(0, 0, canvasEl.width, canvasEl.height)

  mouse.x += (mouse.tx - mouse.x) * 0.1
  mouse.y += (mouse.ty - mouse.y) * 0.1

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    p.x += p.dx
    p.y += p.dy

    if (p.x < 0 || p.x > canvasEl.width) p.dx *= -1
    if (p.y < 0 || p.y > canvasEl.height) p.dy *= -1

    ctx2.beginPath()
    ctx2.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
    ctx2.fillStyle = '#6366f1'
    ctx2.fill()

    const dx = mouse.x - p.x
    const dy = mouse.y - p.y
    const distSq = dx * dx + dy * dy

    if (distSq < 100 * 100) {
      const force = (10000 - distSq) / 10000
      p.x -= dx * force * 0.08
      p.y -= dy * force * 0.08
    }
  }

  const limitSq = 140 * 140
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i]
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j]
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const distSq = dx * dx + dy * dy

      if (distSq < limitSq) {
        const alpha = (1 - distSq / limitSq) * 0.4
        ctx2.beginPath()
        ctx2.moveTo(p1.x, p1.y)
        ctx2.lineTo(p2.x, p2.y)
        ctx2.strokeStyle = `rgba(99, 102, 241, ${alpha})`
        ctx2.stroke()
      }
    }
  }

  animationId = requestAnimationFrame(animate)
}

// 滾動登場效果
let observer = null

const initScrollObserver = () => {
  const options = {
    root: null,
    threshold: 0.15,
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      } else {
        entry.target.classList.remove('is-visible')
      }
    })
  }, options)

  const elements = document.querySelectorAll('.reveal-on-scroll')
  elements.forEach((el) => observer.observe(el))
}

onMounted(() => {
  resize()
  ctx.value = canvas.value.getContext('2d')
  initParticles()
  animate()

  initScrollObserver()

  window.addEventListener('mousemove', handleMouse)
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouse)
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(animationId)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.landing-page {
  background-color: #0f172a;
  color: #f8fafc;
  min-height: 100vh;
}

.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%);
}

canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.content-layer {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  padding: 0 20px;
}

.content-layer h1 {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.content-layer p {
  font-size: 1.25rem;
  color: #94a3b8;
  max-width: 600px;
}

.scroll-hint {
  position: absolute;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.875rem;
}

.scroll-hint .arrow {
  font-size: 1.2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

.content-section {
  padding: 120px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-header h2 {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.section-header p {
  color: #94a3b8;
}

.showcase-list {
  display: flex;
  flex-direction: column;
  gap: 120px;
}

.showcase-item {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 60px;
  align-items: center;
}

.showcase-item.reverse {
  grid-template-columns: 0.8fr 1.2fr;
}

.showcase-item.reverse .large-image-wrapper {
  order: 2;
}

.large-image-wrapper {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #1e293b;
}

.large-image-wrapper img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  display: block;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.large-image-wrapper:hover img {
  transform: scale(1.05);
}

.showcase-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-tag {
  font-size: 0.9rem;
  font-weight: 700;
  color: #818cf8;
  letter-spacing: 2px;
}

.showcase-info h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.3;
}

.showcase-info p {
  font-size: 1.1rem;
  color: #94a3b8;
  line-height: 1.7;
}

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(60px);
  transition:
    opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
    transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 900px) {
  .showcase-item,
  .showcase-item.reverse {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .showcase-item.reverse .large-image-wrapper {
    order: 0;
  }

  .large-image-wrapper img {
    height: 260px;
  }
}
</style>
