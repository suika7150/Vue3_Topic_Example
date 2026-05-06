<template>
  <div class="canvas-container">
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
const ctx = ref(null)
let animationId = null
let particles = []
let mouse = { x: 0, y: 0, tx: 0, ty: 0 }

// 粒子數
function initParticles(num = 150) {
  particles = []
  for (let i = 0; i < num; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      dx: (Math.random() - 0.5) * 1.2,
      dy: (Math.random() - 0.5) * 1.2,
    })
  }
}

const handleMouse = (e) => {
  mouse.tx = e.clientX
  mouse.ty = e.clientY
}

const resize = () => {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
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
