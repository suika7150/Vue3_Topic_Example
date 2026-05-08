<template>
  <div class="toolbar">
    <el-dropdown trigger="hover">
      <span class="filter-item" :class="{ active: local.category }">
        <el-icon><List /></el-icon>
        {{ local.category || '分類' }}
        <el-icon><ArrowDown /></el-icon>
      </span>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="local.category = ''"> 全部 </el-dropdown-item>

          <el-dropdown-item v-for="c in categories" :key="c" @click="local.category = c">
            {{ c }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown trigger="hover">
      <span class="filter-item" :class="{ active: local.sort }">
        <el-icon><List /></el-icon>
        {{ sortLabel || '排序' }}
        <el-icon><ArrowDown /></el-icon>
      </span>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="local.sort = ''"> 最新上架 </el-dropdown-item>

          <el-dropdown-item @click="local.sort = 'price_asc'"> 價格低→高 </el-dropdown-item>

          <el-dropdown-item @click="local.sort = 'price_desc'"> 價格高→低 </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <span v-if="hasFilter" class="clear-btn" @click="clearFilter">
      <el-icon><Close /></el-icon>清除條件
    </span>

    <div class="filter-item" @click="showFilter = true">
      <el-icon><Operation /></el-icon>
      進階篩選
    </div>

    <el-dialog v-model="showFilter" title="篩選條件" size="360px" direction="rtl" append-to-body>
      <ProductFilterBar
        :model-value="local"
        @update:model-value="(val) => Object.assign(local, val)"
        :categories="categories"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { watch } from 'vue'
import { debounce } from 'lodash'
import { List, ArrowDown, Operation, Close } from '@element-plus/icons-vue'
import ProductFilterBar from '@/components/navigation/ProductFilterBar.vue'

const showFilter = ref(false)

const sortLabel = computed(() => {
  if (local.sort === 'price_asc') return '價格低→高'
  if (local.sort === 'price_desc') return '價格高→低'
  return '排序'
})

const hasFilter = computed(() => {
  return (
    local.category !== '' ||
    local.sort !== '' ||
    local.keyword !== '' ||
    local.minPrice !== null ||
    local.maxPrice !== null
  )
})

const hasAdvancedFilter = computed(() => {
  return local.minPrice || local.maxPrice || local.keyword
})

const clearFilter = () => {
  local.category = ''
  local.sort = ''
  local.minPrice = null
  local.maxPrice = null
  local.keyword = ''
  emitUpdate(local)
}

const props = defineProps({
  modelValue: Object,
  categories: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const local = reactive({
  category: '',
  sort: '',
  minPrice: null,
  maxPrice: null,
  keyword: '',
  ...(props.modelValue || {}),
})

const emitUpdate = debounce((val) => {
  emit('update:modelValue', { ...val })
}, 200)

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(local, val)
  },
  { deep: true },
)

watch(
  local,
  (val) => {
    emitUpdate(val)
  },
  { deep: true },
)
</script>

<style scoped>
.toolbar {
  cursor: pointer;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: 0.2s;
  border-radius: 6px;
}

.filter-item {
  cursor: pointer;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  transition: 0.2s;
}

.clear-btn {
  font-size: 14px;
  color: #999;
  cursor: pointer;
  padding: 4px 6px;
  transition: 0.2s;
}
</style>
