components/Modal.vue
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
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}
.modal-box {
  background: #fff;
  margin: 100px auto;
  padding: 20px;
  width: 300px;
  border-radius: 8px;
}
</style>
