<template>
  <div>
    <h2>設定</h2>
    <p>功能尚未完成，敬請期待!</p>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import { onMounted } from 'vue'

onMounted(() => {
  alert('正在施工中，敬請期待!')
  const { goHome } = useNavigation()
  goHome()
})
</script>

<style scoped></style>
