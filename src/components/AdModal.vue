<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isVisible" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <button class="close-btn" @click="close">&times;</button>

          <a href="/promo-link">
            <img src="/Banner/ShoppingFestival.png" alt="大促銷廣告" />
          </a>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

const close = () => {
  isVisible.value = false
}

// 刻意延遲，避免使用者嚇到
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 800)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 確保在最上層 */
}

.modal-content {
  position: relative;
  max-width: 60%;
  max-height: 80%;
}

.modal-content img {
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
}

.close-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -10px;
  right: -10px;
  width: 42px;
  height: 42px;
  background: transparent;
  background-color: rgba(0, 0, 0, 1);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 50px;
  cursor: pointer;
}

.close-btn:hover {
  transform: scale(1.2);
  background-color: black;
}

/* 進入與離開的動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
