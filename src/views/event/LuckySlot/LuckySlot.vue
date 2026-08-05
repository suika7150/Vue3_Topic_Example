<template>
  <CampaignShell theme="dark" bgImage="/layoutImages/campaign-double-eleven.png">
    <div class="slot-machine-page">
      <div class="hero-block">
        <h2 class="title">幸運拉霸機</h2>
      </div>

      <div class="chance-badge">
        今日剩餘抽獎次數：<span>{{ chancesLeft }}</span> 次
      </div>

      <!-- 遊戲主要區域 -->
      <div class="game-stage-container">
        <!-- 即時中獎名單區塊 -->
        <div class="stage-side left-side">
          <div class="winner-board">
            <div class="board-header">
              <span class="pulse-dot"></span>
              <h3>即時中獎榜</h3>
            </div>
            <div class="winner-list-wrapper">
              <transition-group name="list-slide" tag="ul" class="winner-list">
                <li v-for="item in winnerList" :key="item.id" class="winner-item">
                  <span class="user">{{ item.user }}</span>
                  <span class="prize">獲得 {{ item.prize }}</span>
                </li>
              </transition-group>
            </div>
          </div>
        </div>

        <!-- 拉霸機區塊 -->
        <div class="stage-center">
          <div class="machine-wrapper-pixel" :class="{ shake: isSpinning }">
            <!-- 文字滾動 -->
            <div class="slot-container-pixel" :class="{ 'neon-active': isSpinning }">
              <div v-for="(reel, reelIndex) in reels" :key="reelIndex" class="reel-window-pixel">
                <div
                  class="reel-strip"
                  :class="{ 'fast-spin': reel.mode === 'fast' }"
                  :style="{
                    transform: reel.mode === 'fast' ? 'none' : `translateY(${reel.translateY}px)`,
                    transition:
                      reel.mode === 'stopping'
                        ? `transform ${reel.duration}s cubic-bezier(0.08, 0.82, 0.17, 1)`
                        : 'none',
                  }"
                >
                  <div
                    v-for="(item, itemIndex) in reelItems"
                    :key="itemIndex"
                    class="slot-cell-pixel"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 拉霸機身 -->
            <div class="pixel-cabinet-main"></div>

            <!-- 拉桿 -->
            <div class="pixel-lever-wrapper" :class="{ 'arm-pull': isSpinning }" @click="startSpin">
              <img src="/event/lucky-slot-lever.png" class="pixel-lever-image" />
            </div>
          </div>
        </div>

        <!-- 中獎結果區塊 -->
        <div class="stage-side right-side">
          <transition name="fade-scale">
            <div v-if="result" class="result-board">
              <div class="result-header">
                <span class="sparkle-icon"></span>
                <h3>抽獎結果</h3>
              </div>
              <div class="result-content">
                <p class="congrats-text">
                  {{ result === '再接再厲' ? '很遺憾' : '恭喜您獲得' }}
                </p>
                <div class="prize-display" :class="{ 'no-prize': result === '再接再厲' }">
                  {{ result }}
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <button
        class="pixel-square-btn"
        :disabled="chancesLeft <= 0 || isSpinning"
        @click="startSpin"
      >
        <span class="btn-text">
          {{ isSpinning ? '開獎中' : chancesLeft <= 0 ? '次數已用完' : '啟動' }}
        </span>
      </button>

      <!-- 活動說明與獎項清單區塊 -->
      <div class="info-container">
        <div class="info-card">
          <h3>活動規則說明</h3>
          <ul>
            <li>每位會員每天登入皆可獲得 <strong class="highlight">3 次</strong> 免費抽獎機會。</li>
            <li>點擊「拉動拉桿」或直接點擊拉霸機右側搖桿即可開始遊戲。</li>
            <li>當三個滾輪停在相同獎項時，即可獲得該項好禮！</li>
            <li>優惠券獎項將於中獎後 5 分鐘內自動歸戶，請至「我的優惠券」查看。</li>
          </ul>
        </div>

        <div class="info-card">
          <h3>獎項一覽</h3>
          <div class="prize-grid">
            <div v-for="prize in basePrizes" :key="prize" class="prize-tag">
              {{ prize }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </CampaignShell>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CampaignShell from '@/layouts/EventLayout.vue'

const basePrizes = ['9折券', '免運券', '50元', '85折', '100元', '再接再厲']
const CELL_HEIGHT = 150
const chancesLeft = ref(3)

const winnerList = ref([
  { id: 1, user: 'user_88***', prize: '100元' },
  { id: 2, user: 'jack_***', prize: '9折券' },
  { id: 3, user: 'mary9***', prize: '免運券' },
  { id: 4, user: 'lucky_***', prize: '85折' },
  { id: 5, user: 'chen_***', prize: '100元' },
  { id: 6, user: 'alex_***', prize: '50元' },
])

let winnerTimer = null
onMounted(() => {
  winnerTimer = setInterval(() => {
    const randomUser = `user_${Math.floor(100 + Math.random() * 900)}***`
    const validPrizes = basePrizes.filter((p) => p !== '再接再厲')
    const randomPrize = validPrizes[Math.floor(Math.random() * validPrizes.length)]

    winnerList.value.unshift({
      id: Date.now(),
      user: randomUser,
      prize: randomPrize,
    })

    if (winnerList.value.length > 6) {
      winnerList.value.pop()
    }
  }, 4000)
})

onUnmounted(() => {
  if (winnerTimer) clearInterval(winnerTimer)
})

const reelItems = computed(() => {
  return [...basePrizes, ...basePrizes, ...basePrizes, ...basePrizes, ...basePrizes]
})

// 滾輪狀態管理
const reels = ref([
  { translateY: 0, mode: 'idle', duration: 1.2 },
  { translateY: 0, mode: 'idle', duration: 1.2 },
  { translateY: 0, mode: 'idle', duration: 1.2 },
])

const isSpinning = ref(false)
const result = ref('')

const startSpin = () => {
  if (isSpinning.value || chancesLeft.value <= 0) return

  isSpinning.value = true
  result.value = ''
  chancesLeft.value--

  setTimeout(() => {
    spinReelsSequence()
  }, 250)
}

// 處理 Delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const stopSingleReel = (reelIndex, finalIndex) => {
  return new Promise((resolve) => {
    const reel = reels.value[reelIndex]

    reel.mode = 'stopping'
    const target = basePrizes.length * 3 + finalIndex
    reel.translateY = -(target * CELL_HEIGHT)

    setTimeout(() => {
      reel.mode = 'idle'
      reel.translateY = -(finalIndex * CELL_HEIGHT)
      resolve()
    }, reel.duration * 1000)
  })
}

// 階梯式開獎
const spinReelsSequence = async () => {
  const finalIndex = Math.floor(Math.random() * basePrizes.length)

  reels.value.forEach((reel) => {
    reel.mode = 'fast'
    reel.translateY = 0
  })

  // 第一格滾動
  await sleep(800)
  await stopSingleReel(0, finalIndex)

  // 第二格滾動
  await sleep(300)
  await stopSingleReel(1, finalIndex)

  // 第三格滾動
  await sleep(400)
  await stopSingleReel(2, finalIndex)

  // 結算結果
  const prizeWon = basePrizes[finalIndex]
  result.value = prizeWon
  isSpinning.value = false

  if (prizeWon !== '再接再厲') {
    winnerList.value.unshift({
      id: Date.now(),
      user: '您',
      prize: prizeWon,
    })
    if (winnerList.value.length > 6) winnerList.value.pop()
  }
}
</script>

<style scoped>
@import '@/views/event/LuckySlot/LuckySlot.css';
</style>
