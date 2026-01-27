<template>
  <div class="lucky-wheel-container">
    <h2 class="wheel-title">幸運大轉盤</h2>

    <div class="wheel-wrapper">
      <div class="wheel-pointer"></div>

      <div class="wheel-main" :style="wheelStyle">
        <div
          v-for="(prize, index) in prizes"
          :key="index"
          class="prize-item"
          :style="getItemStyle(index)"
        >
          <span class="prize-text">{{ prize.name }}</span>
        </div>
      </div>
    </div>

    <el-button
      type="danger"
      size="large"
      class="spin-button"
      :loading="isSpinning"
      @click="startSpin"
    >
      {{ isSpinning ? '抽獎中...' : '開始抽獎' }}
    </el-button>

    <p v-if="result" class="result-msg">
      恭喜獲得：<span>{{ result }}</span>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import { ElMessage } from 'element-plus'
// import Alertbox from '@/components/AlertBox.vue'

const prizes = [
  { name: '9折券', color: '#1a1a1a' },
  { name: '免運券', color: '#2c2c2c' },
  { name: '50元', color: '#1a1a1a' },
  { name: '85折', color: '#2c2c2c' },
  { name: '100元', color: '#1a1a1a' },
  { name: '再接再厲', color: '#d62828' },
]

const isSpinning = ref(false)
const rotation = ref(0)
const result = ref('')

const wheelStyle = computed(() => ({
  transform: `rotate(${rotation.value}deg)`,
  transition: isSpinning.value ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
}))

const getItemStyle = (index) => {
  const angle = 360 / prizes.length
  return {
    transform: `rotate(${index * angle}deg) skewY(${90 - angle}deg)`,
    backgroundColor: prizes[index].color,
  }
}

const startSpin = () => {
  if (isSpinning.value) return

  isSpinning.value = true
  result.value = ''

  // 隨機旋轉 5~10 圈 + 隨機角度
  const randomDeg = Math.floor(Math.random() * 360)
  const totalDeg = rotation.value + 360 * 8 + randomDeg
  rotation.value = totalDeg

  setTimeout(() => {
    isSpinning.value = false
    // 計算中獎結果
    const actualDeg = totalDeg % 360
    const step = 360 / prizes.length
    const offset = step / 2
    const index = Math.floor(((360 - actualDeg + 210 + offset) % 360) / step)
    result.value = prizes[index].name

    alert(`恭喜！您獲得了 ${result.value}`)
  }, 4000)
}
</script>

<style scoped>
.lucky-wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  background: radial-gradient(circle, #2c2c2c 0%, #000000 100%);
  width: 100%;
}

.wheel-title {
  color: #f1c40f;
  font-size: 32px;
  margin-bottom: 40px;
  text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
}

.wheel-wrapper {
  position: relative;
  width: 450px;
  height: 450px;
  border: 12px solid #333;
  border-radius: 50%;
  box-shadow:
    0 0 30px rgba(0, 0, 0, 0.8),
    0 0 10px #f1c40f;
}

.wheel-main {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  border: 2px solid #444;
}

.prize-item {
  position: absolute;
  width: 50%;
  height: 50%;
  left: 50%;
  top: 50%;
  font-size: 30px;
  transform-origin: 0 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.prize-text {
  position: absolute;
  left: 20px;
  top: 40px;
  width: 100px;
  color: #fff;
  font-weight: bold;
  transform: skewY(-30deg) rotate(30deg);
  text-align: center;
}

.wheel-pointer {
  position: absolute;
  border: #d62828 solid 8px;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: #d62828;
  clip-path: polygon(50% 100%, 0 0, 100% 0);
  z-index: 10;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
}

.spin-button {
  text-align: center;
  margin-top: 60px;
  padding: 40px 60px;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 15px;
  background: linear-gradient(135deg, #d62828 0%, #a81c1c 100%);
  border: none;
  box-shadow: 0 5px 15px rgba(214, 40, 40, 0.4);
}

.result-msg {
  margin-top: 30px;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}
.result-msg span {
  color: #f1c40f;
  font-weight: bold;
}

@media (max-width: 768px) {
  .lucky-wheel-container {
    padding: 30px 10px;
  }

  .wheel-title {
    font-size: 24px;
    margin-bottom: 30px;
  }

  .wheel-wrapper {
    width: 300px;
    height: 300px;
    border-width: 8px;
  }

  .prize-text {
    left: 10px;
    top: 35px;
    width: 80px;
    font-size: 13px;
  }

  .wheel-pointer {
    width: 30px;
    height: 40px;
    top: -15px;
  }

  .spin-button {
    margin-top: 30px;
    padding: 30px 40px;
    width: 200px;
    font-size: 20px;
  }

  .result-msg {
    font-size: 18px;
  }
}

@media (max-width: 360px) {
  .wheel-wrapper {
    width: 260px;
    height: 260px;
  }
}
</style>
