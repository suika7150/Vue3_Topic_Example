<template>
  <CampaignShell theme="dark" bgImage="/layoutImages/campaign-double-eleven.png">
    <div class="light-wheel-page">
      <div class="hero-block">
        <h2 class="title">幸運抽獎機</h2>
        <p>燈光停下來的那一格，就是你的獎</p>
      </div>

      <div class="grid">
        <div
          v-for="(item, index) in prizes"
          :key="index"
          class="cell"
          :class="{ active: index === activeIndex }"
        >
          {{ item }}
        </div>
      </div>

      <el-button type="danger" class="spin-btn" :loading="isSpinning" @click="startSpin">
        {{ isSpinning ? '抽獎中...' : '開始抽獎' }}
      </el-button>

      <div v-if="result" class="result">
        🎉 恭喜獲得：<span>{{ result }}</span>
      </div>
    </div>
  </CampaignShell>
</template>

<script setup>
import { ref } from 'vue'
import CampaignShell from '@/layouts/EventLayout.vue'

const prizes = ['9折券', '免運券', '50元', '85折', '100元', '再接再厲']

const activeIndex = ref(0)
const isSpinning = ref(false)
const result = ref('')

const startSpin = () => {
  if (isSpinning.value) return

  isSpinning.value = true
  result.value = ''

  const totalSteps = 30 + Math.floor(Math.random() * 15)
  let step = 0

  const timer = setInterval(() => {
    activeIndex.value = step % prizes.length
    step++

    if (step > totalSteps) {
      clearInterval(timer)
      isSpinning.value = false
      result.value = prizes[activeIndex.value]
    }
  }, 80)
}
</script>

<style scoped>
.light-wheel-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 20px;
  color: white;
}

.hero-block {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 34px;
  font-weight: bold;
  color: #fff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 110px);
  gap: 15px;
  margin-bottom: 40px;
}

.cell {
  width: 110px;
  height: 110px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);

  font-weight: bold;
  transition: 0.2s;
}

.cell.active {
  background: #f1c40f;
  color: #000;

  transform: scale(1.08);
  box-shadow: 0 0 25px #f1c40f;
}

.spin-btn {
  margin-top: 10px;
  padding: 18px 50px;
  font-size: 18px;
  font-weight: bold;
}

.result {
  margin-top: 20px;
  font-size: 20px;
}

.result span {
  color: #f1c40f;
  font-weight: bold;
}
</style>
