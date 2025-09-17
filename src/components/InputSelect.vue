<template>
  <el-select
    v-model="internalValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
  >
    <el-option
      v-for="item in options"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :value="item[valueKey]"
    />
  </el-select>
</template>

<script setup>
import { computed } from 'vue'

// 透過 defineProps 接收外部傳入的屬性
const props = defineProps({
  // 雙向綁定，讓 v-model 可以正常運作
  modelValue: {
    type: [String, Number, Array],
    default: '',
  },
  // 選項陣列，包含 { value, label } 格式的物件
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 顯示在選單上的文字
  placeholder: {
    type: String,
    default: '請選擇',
  },
  // 是否禁用選單
  disabled: {
    type: Boolean,
    default: false,
  },
  // 是否可清除選取
  clearable: {
    type: Boolean,
    default: false,
  },
  // 用於自訂選項物件中代表「值」的鍵名
  valueKey: {
    type: String,
    default: 'value',
  },
  // 用於自訂選項物件中代表「顯示文字」的鍵名
  labelKey: {
    type: String,
    default: 'label',
  },
})

// 透過 defineEmits 宣告會發出的事件
const emit = defineEmits(['update:modelValue'])

// 建立一個計算屬性，用於處理 v-model 的雙向綁定
const internalValue = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  },
})
</script>
