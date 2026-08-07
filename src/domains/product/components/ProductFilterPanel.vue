<template>
  <div class="panel">
    <div class="section">
      <div class="label">分類</div>
      <el-select v-model="local.category" placeholder="請選擇">
        <el-option label="全部" value="" />
        <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
      </el-select>
    </div>

    <div class="section">
      <div class="label">排序</div>
      <el-select v-model="local.sort">
        <el-option label="價格低→高" value="price_asc" />
        <el-option label="價格高→低" value="price_desc" />
      </el-select>
    </div>

    <div class="section">
      <div class="label">價格區間</div>
      <el-slider v-model="priceRange" range :min="0" :max="100000" @change="updatePrice" />
    </div>

    <div class="actions">
      <el-button @click="reset">清除</el-button>
      <el-button type="primary" @click="apply">套用</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  modelValue: Object,
  categories: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const local = reactive({
  category: '',
  sort: '',
  minPrice: null,
  maxPrice: null,
  ...(props.modelValue || {}),
})

const priceRange = ref([0, 100000])

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(local, val || {})
    priceRange.value = [val?.minPrice ?? 0, val?.maxPrice ?? 100000]
  },
  { deep: true, immediate: true },
)

const updatePrice = () => {
  local.minPrice = priceRange.value[0]
  local.maxPrice = priceRange.value[1]
}

const apply = () => {
  updatePrice()
  const emittedLocal = { ...local }
  if (emittedLocal.minPrice === 0) emittedLocal.minPrice = null
  if (emittedLocal.maxPrice === 100000) emittedLocal.maxPrice = null
  emit('update:modelValue', emittedLocal)
  emit('close')
}

const reset = () => {
  local.category = ''
  local.sort = ''
  local.minPrice = null
  local.maxPrice = null
  priceRange.value = [0, 100000]

  emit('update:modelValue', { ...local })
}
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 13px;
  color: #666;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
