<template>
  <slot />
  <Modal v-if="modalStore.isVisible" :title="modalStore.config.title">
    <p>{{ modalStore.config.message }}</p>
    <template #footer>
      <el-button type="danger" @click="modalStore.confirm">確定</el-button>
      <el-button @click="modalStore.close">取消</el-button>
    </template>
  </Modal>
</template>

<script setup>
import { useModalStore } from '@/store/modalStore'
import Modal from '@/components/ui/Modal.vue'

const modalStore = useModalStore()
</script>
