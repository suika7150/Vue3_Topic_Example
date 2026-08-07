<template>
  <div class="modal-overlay">
    <div class="modal-box">
      <h3>{{ title }}</h3>
      <div class="modal-content">
        <slot />
      </div>
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ title: String })
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box {
  background: #fff;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  color: #333;
}

.modal-content {
  margin-bottom: 24px;
  color: #666;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 確定 & 取消按鈕 */
.modal-footer :deep(button) {
  border-radius: 10px;
  padding: 10px 20px;
}
</style>
