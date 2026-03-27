<!-- 提供給Login.vue使用 -->
<template>
  <div class="login-ad-section" :style="{ background: currentAd.bg }">
    <div class="ad-content" :key="activePromo">
      <h3>{{ currentAd.title }}</h3>
      <p>{{ currentAd.desc }}</p>

      <div class="ad-placeholder">
        <qrcode-vue
          :value="currentAd.qrUrl"
          :size="160"
          level="H"
          background="transparent"
          foreground="#ffffff"
        />
      </div>
      <p class="qr-tip">手機掃描領取限定優惠</p>
    </div>

    <div class="ad-dots">
      <span
        v-for="key in promoKeys"
        :key="key"
        :class="{ active: activePromo === key }"
        @click="handleDotClick(key)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import QrcodeVue from 'qrcode.vue'

const PROMOS = {
  'double-11': {
    title: '年度盛典正式開啟',
    desc: '立即登入領取雙 11 限定優惠券',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
    qrUrl: 'https://your-store.com/promo/double-11',
  },
  new_user: {
    title: '新會員專屬禮遇',
    desc: '掃描領取開學季首購折價券',
    bg: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
    qrUrl: 'https://your-store.com/promo/welcome',
  },
  flash_sale: {
    title: '限時閃購倒數',
    desc: '全站商品 5 折起，錯過再等一年',
    bg: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
    qrUrl: 'https://your-store.com/promo/flash',
  },
  member_day: {
    title: '專屬會員日',
    desc: '點數雙倍送，等級升級更快速',
    bg: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    qrUrl: 'https://your-store.com/promo/member',
  },
}

const activePromo = ref('double-11')
let timer = null
const AUTOPLAY_INTERVAL = 5000 // 自動切換時間：5秒

const currentAd = computed(() => PROMOS[activePromo.value] || PROMOS['double-11'])
const promoKeys = computed(() => Object.keys(PROMOS))

// 自動輪播
const startTimer = () => {
  stopTimer() // 確保沒有重複的 timer
  const keys = promoKeys.value
  let currentIndex = keys.indexOf(activePromo.value)

  timer = setInterval(() => {
    currentIndex = (currentIndex + 1) % keys.length
    activePromo.value = keys[currentIndex]
  }, AUTOPLAY_INTERVAL)
}

// 停止自動輪播
const stopTimer = () => {
  if (timer) clearInterval(timer)
}

// 手動點擊小點點
const handleDotClick = (key) => {
  activePromo.value = key
  startTimer() // 點擊後重設計時器，避免立刻又切換
}

// 4. 生命週期
onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.login-ad-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  color: white;
  padding: 40px;
  position: relative;
  transition: background 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.ad-content {
  animation: fadeIn 0.6s ease-in-out;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.ad-content h3 {
  font-size: 28px;
  margin-bottom: 12px;
  letter-spacing: 2px;
  font-weight: 600;
}

.ad-placeholder {
  margin: 30px auto 10px;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  transition: all 0.4s ease-in-out;
  cursor: pointer;
}

.ad-placeholder:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.qr-tip {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 10px;
}

/* 導航點點樣式 */
.ad-dots {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.ad-dots span {
  width: 9px;
  height: 9px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ad-dots span.active {
  border-radius: 5px;
  background: #ffffff;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .login-ad-section {
    display: none;
  }
}
</style>
