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

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: '',
  },

  options: {
    type: Array,
    required: true,
    default: () => [],
  },

  placeholder: {
    type: String,
    default: '請選擇',
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  clearable: {
    type: Boolean,
    default: false,
  },

  valueKey: {
    type: String,
    default: 'value',
  },

  labelKey: {
    type: String,
    default: 'label',
  },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  },
})
</script>
