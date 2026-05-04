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
import { ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
const ctx = ref(null)
let animationId = null

const handleMouse = (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

// 共用資料
let particles = []
let mouse = { x: 0, y: 0 }

// 建立粒子
function initParticles(num = 300) {
  particles = []
  for (let i = 0; i < num; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5,
    })
  }
}

// 主動畫
function animate() {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

  particles.forEach((p) => {
    p.x += p.dx
    p.y += p.dy

    if (p.x < 0 || p.x > canvas.value.width) p.dx *= -1
    if (p.y < 0 || p.y > canvas.value.height) p.dy *= -1

    // 點
    ctx.value.beginPath()
    ctx.value.arc(p.x, p.y, 3, 0, Math.PI * 2)
    ctx.value.fillStyle = 'white'
    ctx.value.fill()

    // 滑鼠彈開
    let dx = mouse.x - p.x
    let dy = mouse.y - p.y
    let distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 100) {
      const force = (100 - distance) / 100
      p.x -= dx * force * 0.08
      p.y -= dy * force * 0.08
    }
  })

  // 連線
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x
      let dy = particles[i].y - particles[j].y
      let dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 150) {
        ctx.value.beginPath()
        ctx.value.moveTo(particles[i].x, particles[i].y)
        ctx.value.lineTo(particles[j].x, particles[j].y)
        ctx.value.strokeStyle = `rgba(255,255,255,${1 - dist / 120})`
        ctx.value.stroke()
      }
    }
  }
  animationId = requestAnimationFrame(animate)
}

const resize = () => {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
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
