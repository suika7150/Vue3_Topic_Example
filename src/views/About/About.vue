<template>
  <div class="about-page">
    <section class="about-hero" ref="container">
      <canvas class="about-hero__canvas" ref="canvas"></canvas>
      <div class="about-hero__content">
        <h1 class="about-hero__title">關於我們</h1>
        <p class="about-hero__desc">打造現代化、流暢且具視覺衝擊力的網頁體驗</p>
        <div class="about-hero__hint">
          <span>Scroll Down</span>
          <div class="about-hero__arrow">↓</div>
        </div>
      </div>
    </section>

    <section class="about-section">
      <div class="about-section__container">
        <div class="about-section__header about-reveal">
          <h2 class="about-section__heading">核心展示</h2>
          <p class="about-section__subtext">沉浸式大圖視覺，隨滾動平滑呈現</p>
        </div>

        <div class="about-showcase">
          <div
            v-for="(item, index) in showcaseItems"
            :key="index"
            class="about-showcase__item about-reveal"
            :class="{ 'about-showcase__item--reverse': index % 2 !== 0 }"
          >
            <div class="about-showcase__image-wrapper">
              <img :src="item.image" :alt="item.title" loading="lazy" class="about-showcase__img" />
              <div class="about-showcase__overlay"></div>
            </div>

            <div class="about-showcase__info">
              <h3 class="about-showcase__title">{{ item.title }}</h3>
              <p class="about-showcase__desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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
  if (!container.value || !canvas.value) return
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

let observer = null

const initScrollObserver = () => {
  const options = { root: null, threshold: 0.15 }
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      } else {
        entry.target.classList.remove('is-visible')
      }
    })
  }, options)

  const elements = document.querySelectorAll('.about-reveal')
  elements.forEach((el) => observer.observe(el))
}

onMounted(() => {
  resize()
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
  }
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
@import '@/views/About/About.scss';
</style>
