<template>
  <el-sub-menu v-if="item.subs" :index="fullPath">
    <template #title>
      <span class="icon-wrapper">
        <component :is="item.icon" class="icon" />
      </span>
      <span>{{ item.label }}</span>
    </template>
    <MenuItem v-for="sub in item.subs" :key="sub.path" :item="sub" :basePath="basePath" />
  </el-sub-menu>

  <el-menu-item v-else :index="fullPath">
    <component :is="item.icon" class="icon" />
    <span>{{ item.label }}</span>
  </el-menu-item>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: Object,
  basePath: {
    type: String,
    required: true,
  },
})

const fullPath = computed(() => `${props.basePath}/${props.item.path}`)
</script>

<style scoped>
.icon-wrapper {
  display: inline-flex;
  width: 16px;
  margin-right: 8px;
  align-items: center;
  justify-content: center;
}
.icon {
  width: 16px;
  height: 16px;
  fill: cur;
}
</style>
