<template>
  <div class="canvas-container" ref="container">
    <canvas ref="canvas"></canvas>

    <div class="content-layer">
      <h1>關於我們</h1>
      <p>這裡可以寫網站介紹 / 品牌理念 / 技術架構</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
const container = ref(null)
const ctx = ref(null)
let animationId = null
let particles = []
let mouse = { x: -1000, y: -1000, tx: -1000, ty: -1000 } // 預設在畫面外，避免初始化時推開左上角粒子

// 粒子數
function initParticles(num = 150) {
  particles = []
  // 確保粒子分佈在當前 Canvas 的範圍內，而不是整個視窗
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
  // 核心修正：取得 Canvas 在網頁上的實際位置，並計算出相對坐標
  const rect = canvas.value.getBoundingClientRect()
  mouse.tx = e.clientX - rect.left
  mouse.ty = e.clientY - rect.top
}

const resize = () => {
  if (!container.value) return
  // 改為抓取父容器的寬高，而不是 window
  canvas.value.width = container.value.clientWidth
  canvas.value.height = container.value.clientHeight
}

// 主動畫
function animate() {
  const canvasEl = canvas.value
  const ctx2 = ctx.value

  ctx2.clearRect(0, 0, canvasEl.width, canvasEl.height)

  mouse.x += (mouse.tx - mouse.x) * 0.1
  mouse.y += (mouse.ty - mouse.y) * 0.1

  // 粒子更新
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]

    p.x += p.dx
    p.y += p.dy

    // 邊界反彈
    if (p.x < 0 || p.x > canvasEl.width) p.dx *= -1
    if (p.y < 0 || p.y > canvasEl.height) p.dy *= -1

    // 畫點
    ctx2.beginPath()
    ctx2.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
    ctx2.fillStyle = 'white'
    ctx2.fill()

    // 推開效果
    const dx = mouse.x - p.x
    const dy = mouse.y - p.y
    const distSq = dx * dx + dy * dy

    if (distSq < 100 * 100) {
      const force = (10000 - distSq) / 10000
      p.x -= dx * force * 0.08
      p.y -= dy * force * 0.08
    }
  }

  const limit = 150
  const limitSq = limit * limit

  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i]

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j]

      const dx = p1.x - p2.x
      const dy = p1.y - p2.y

      // 🔥 改：用平方距離，避免 sqrt
      const distSq = dx * dx + dy * dy

      // 🔥 只畫近距離線
      if (distSq < limitSq) {
        const alpha = 1 - distSq / limitSq

        ctx2.beginPath()
        ctx2.moveTo(p1.x, p1.y)
        ctx2.lineTo(p2.x, p2.y)
        ctx2.strokeStyle = `rgba(255,255,255,${alpha})`
        ctx2.stroke()
      }
    }
  }

  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  resize()
  ctx.value = canvas.value.getContext('2d')

  initParticles()
  animate()

  window.addEventListener('mousemove', handleMouse)
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouse)
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.canvas-container {
  position: relative; /* 確保 canvas 定位在此容器內 */
  width: 100%;
  min-height: calc(100vh - 220px); /* 扣掉 TopBar 的高度 */
  overflow: hidden; /* 防止粒子跑出去 */
  background: radial-gradient(circle at center, #eaf2ff 0%, #dbeafe 40%, #c7d2fe 100%);
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
  color: #0f172a;
  padding: 40px;
}
</style>
