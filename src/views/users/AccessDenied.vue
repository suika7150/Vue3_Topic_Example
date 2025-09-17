<template>
  <div class="denied-container">
    <el-card class="denied-card">
      <el-result
        icon="error"
        title="無此頁面使用權限"
        :sub-title="`即將在 ${countdown} 秒後導向登入頁...`"
      >
        <template #extra>
          <el-button type="primary" @click="goLogin()">前往登入</el-button>
          <el-button @click="goHome">回首頁</el-button>
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { goHome, goLogin } = useNavigation()
// 使用 ref 宣告倒數計時器
const countdown = ref(5)
let timer = null

onMounted(() => {
  // 建立一個每秒執行一次的計時器
  timer = setInterval(() => {
    countdown.value -= 1
    // 當倒數計時為 0 時，執行導向邏輯
    if (countdown.value <= 0) {
      clearInterval(timer) // 清除計時器
      goLogin()
    }
  }, 1000) // 1000 毫秒 = 1 秒
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.denied-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
}

.denied-card {
  width: 100%;
  max-width: 560px;
  padding: 16px;
}
</style>
