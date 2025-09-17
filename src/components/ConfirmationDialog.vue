<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    :before-close="handleClose"
    center
    :close-on-click-modal="false"
  >
    <div class="text-center text-base">
      <p>{{ message }}</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          v-for="(btn, index) in buttons"
          :key="index"
          :type="btn.type"
          :plain="btn.plain"
          @click="handleButtonClick(btn)"
        >
          {{ btn.text }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '提示',
  },
  message: {
    type: String,
    required: true,
  },
  buttons: {
    type: Array,
    required: true,
  },
  width: {
    type: String,
    default: '300px',
  },
})

const emit = defineEmits(['update:modelValue', 'buttonClick'])

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleButtonClick = (button) => {
  if (button.onClick) {
    button.onClick()
  }
  handleClose()
}
</script>
