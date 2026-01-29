<template>
  <div class="canvas-container">
    <canvas ref="canvas"></canvas>

    <!-- 模式切換按鈕 -->
    <div class="button">
      <button @click="mode = 'particles'">粒子模式</button>
      <button @click="mode = 'waves'">波浪模式</button>
      <button @click="mode = 'geometry'">幾何模式</button>
      <button @click="mode = 'starfield'">星空模式</button>
      <button @click="mode = 'matrix'">矩陣數字雨</button>
      <button @click="mode = 'gradient'">流動漸層</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvas = ref(null)
const ctx = ref(null)
const mode = ref('particles')

// 共用資料
let particles = []
let mouse = { x: null, y: null }

// 星空
let stars = []

// 矩陣雨
const letters = '01'.split('')
let fontSize = 16
let columns, drops

// 建立粒子
function initParticles(num = 60) {
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

// 建立星空
function initStars(num = 200) {
  stars = []
  for (let i = 0; i < num; i++) {
    stars.push({
      x: Math.random() * canvas.value.width,
      y: Math.random() * canvas.value.height,
      z: Math.random() * canvas.value.width,
    })
  }
}

// 初始化矩陣雨
function initMatrix() {
  columns = Math.floor(canvas.value.width / fontSize)
  drops = Array(columns).fill(1)
}

// 主動畫
function animate() {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

  if (mode.value === 'particles') {
    // === 粒子模式 ===
    particles.forEach((p) => {
      p.x += p.dx
      p.y += p.dy
      if (p.x < 0 || p.x > canvas.value.width) p.dx *= -1
      if (p.y < 0 || p.y > canvas.value.height) p.dy *= -1

      ctx.value.beginPath()
      ctx.value.arc(p.x, p.y, 3, 0, Math.PI * 2)
      ctx.value.fillStyle = 'white'
      ctx.value.fill()

      // 滑鼠互動
      let dx = mouse.x - p.x
      let dy = mouse.y - p.y
      let distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < 80) {
        p.x -= dx * 0.01
        p.y -= dy * 0.01
      }
    })

    // 連線
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x
        let dy = particles[i].y - particles[j].y
        let dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          ctx.value.beginPath()
          ctx.value.moveTo(particles[i].x, particles[i].y)
          ctx.value.lineTo(particles[j].x, particles[j].y)
          ctx.value.strokeStyle = `rgba(255,255,255,${1 - dist / 120})`
          ctx.value.stroke()
        }
      }
    }
  } else if (mode.value === 'waves') {
    // === 波浪模式 ===
    ctx.value.beginPath()
    ctx.value.moveTo(0, canvas.value.height / 2)
    for (let x = 0; x < canvas.value.width; x++) {
      let y = canvas.value.height / 2 + Math.sin(x * 0.02 + Date.now() * 0.002) * 50
      ctx.value.lineTo(x, y)
    }
    ctx.value.strokeStyle = 'cyan'
    ctx.value.lineWidth = 2
    ctx.value.stroke()
  } else if (mode.value === 'geometry') {
    // === 幾何模式 ===
    for (let i = 0; i < 5; i++) {
      ctx.value.beginPath()
      ctx.value.moveTo(Math.random() * canvas.value.width, Math.random() * canvas.value.height)
      ctx.value.lineTo(Math.random() * canvas.value.width, Math.random() * canvas.value.height)
      ctx.value.lineTo(Math.random() * canvas.value.width, Math.random() * canvas.value.height)
      ctx.value.closePath()
      ctx.value.strokeStyle = 'rgba(255, 200, 100, 0.7)'
      ctx.value.stroke()
    }
  } else if (mode.value === 'starfield') {
    // === 星空模式 ===
    ctx.value.fillStyle = 'black'
    ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height)

    stars.forEach((s) => {
      s.z -= 2
      if (s.z <= 0) s.z = canvas.value.width

      let sx = (s.x - canvas.value.width / 2) * (canvas.value.width / s.z) + canvas.value.width / 2
      let sy =
        (s.y - canvas.value.height / 2) * (canvas.value.width / s.z) + canvas.value.height / 2

      ctx.value.beginPath()
      ctx.value.arc(sx, sy, 2, 0, Math.PI * 2)
      ctx.value.fillStyle = 'white'
      ctx.value.fill()
    })
  } else if (mode.value === 'matrix') {
    // === 矩陣數字雨 ===
    ctx.value.fillStyle = 'rgba(0,0,0,0.05)'
    ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height)

    ctx.value.fillStyle = '#0f0'
    ctx.value.font = fontSize + 'px monospace'

    for (let i = 0; i < drops.length; i++) {
      let text = letters[Math.floor(Math.random() * letters.length)]
      ctx.value.fillText(text, i * fontSize, drops[i] * fontSize)

      if (drops[i] * fontSize > canvas.value.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
  } else if (mode.value === 'gradient') {
    // === 流動漸層 ===
    let gradient = ctx.value.createLinearGradient(0, 0, canvas.value.width, canvas.value.height)
    let time = Date.now() * 0.002
    gradient.addColorStop(0, `hsl(${time % 360}, 80%, 50%)`)
    gradient.addColorStop(1, `hsl(${(time + 120) % 360}, 80%, 50%)`)

    ctx.value.fillStyle = gradient
    ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height)
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  ctx.value = canvas.value.getContext('2d')

  initParticles()
  initStars()
  initMatrix()

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  animate()
})
</script>

<style scoped>
.canvas-container {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: rgb(0, 0, 0);
}
canvas {
  display: block;
}
.controls {
  position: absolute;
  top: 20px;
  left: 20px;
}
.button {
  margin: 5px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
}
</style>
