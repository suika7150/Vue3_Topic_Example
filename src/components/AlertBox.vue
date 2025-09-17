<!-- <AlertBox
      v-model:visible="show"
      title="刪除確認"
      message="確定要刪除這筆資料嗎？"
      :buttons="[
        { text: '取消', color: 'secondary', onClick: () => console.log('取消') },
        { text: '確認刪除', color: 'danger', onClick: () => console.log('刪除') },
      ]"
      size="small"
      :autoClose="true"
    /> -->
<template>
  <div class="overlay" v-if="visible">
    <div :class="['alert-box', size]">
      <div class="alert-header">
        <h2 class="alert-title">{{ title }}</h2>
      </div>

      <div class="alert-content">
        <p class="alert-message">{{ message }}</p>
      </div>

      <div class="buttons">
        <button
          v-for="(btn, idx) in buttons"
          :key="idx"
          :class="['alert-btn', btn.color || 'secondary']"
          @click="() => handleClick(btn)"
        >
          {{ btn.text }}
        </button>
      </div>

      <button class="close-btn" @click="close">✖</button>
    </div>
  </div>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  visible: Boolean, // 是否顯示
  title: String, // 標題
  message: String, // 訊息
  buttons: {
    type: Array,
    default: () => [],
  },
  size: {
    type: String,
    default: 'medium',
  },
  autoClose: Boolean,
  duration: {
    type: Number,
    default: 3000,
  },
})

const emit = defineEmits(['update:visible'])

let timer = null

function close() {
  emit('update:visible', false)
}

function handleClick(btn) {
  if (typeof btn.onClick === 'function') btn.onClick()
  if (btn.closeOnClick !== false) close()
}

watch(
  () => props.visible,
  (val) => {
    if (val && props.autoClose) {
      clearTimeout(timer)
      timer = setTimeout(close, props.duration)
    }
  },
)

onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.alert-box {
  background: white;
  border-radius: 10px;
  padding-bottom: 20px;
  position: relative;
  min-width: 280px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-family: sans-serif;
  overflow: hidden;
}
.alert-box.small {
  width: 300px;
}
.alert-box.medium {
  width: 500px;
}
.alert-box.large {
  width: 700px;
}

.alert-header {
  background-color: #42b983; /* Vue 主色調 */
  color: white;
  padding: 16px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.alert-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  text-align: center;
}

.alert-content {
  padding: 20px;
}
.alert-message {
  font-size: 16px;
  color: #444;
  line-height: 1.5;
  margin: 0;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 0 20px;
  flex-wrap: wrap;
}
button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #eee;
}
button:hover {
  background-color: #ddd;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  font-size: 18px;
  cursor: pointer;
  border: none;
  color: #fff;
}
.alert-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  transition: background-color 0.2s;
}

.alert-btn.success {
  background-color: #42b983;
}
.alert-btn.success:hover {
  background-color: #369e6b;
}

.alert-btn.danger {
  background-color: #dc3545;
}
.alert-btn.danger:hover {
  background-color: #c82333;
}

.alert-btn.secondary {
  background-color: #6c757d;
}
.alert-btn.secondary:hover {
  background-color: #5a6268;
}
</style>
