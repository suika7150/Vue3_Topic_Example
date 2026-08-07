<template>
  <slot />
  <AppModal v-if="modalStore.isVisible" :title="modalStore.config.title">
    <p>{{ modalStore.config.message }}</p>
    <template #footer>
      <el-button type="danger" @click="modalStore.confirm">確定</el-button>
      <el-button @click="modalStore.close">取消</el-button>
    </template>
  </AppModal>
</template>

<script setup>
import { useModalStore } from '@/stores/modalStore'
import AppModal from '@/components/ui/AppModal.vue'

const modalStore = useModalStore()
</script>
