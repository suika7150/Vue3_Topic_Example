<!-- components/ModalProvider.vue -->
<template>
  <div>
    <slot />
    <!-- 所有內容插進來 -->
    <Modal v-if="modals.confirm" title="確認視窗">
      <template #default>
        <p>你確定要刪除嗎？</p>
      </template>
      <template #footer>
        <button @click="close('confirm')">取消</button>
        <button @click="confirmAction">確定</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { provide, reactive } from 'vue'
import Modal from './Modal.vue'

const modals = reactive({
  confirm: false,
})

function open(name) {
  modals[name] = true
}
function close(name) {
  modals[name] = false
}
function confirmAction() {
  alert('確定刪除！')
  close('confirm')
}

provide('modal', { open, close, modals })
</script>
