<template>
  <el-dialog
    v-model="visible"
    title="裁切商品圖片"
    width="500px"
    @closed="handleClosed"
    :close-on-click-modal="false"
  >
    <div class="cropper-container">
      <vue-cropper
        ref="cropper"
        :img="option.img"
        :outputSize="option.size"
        :outputType="option.outputType"
        :info="true"
        :full="option.full"
        :canMove="option.canMove"
        :canMoveBox="option.canMoveBox"
        :original="option.original"
        :autoCrop="option.autoCrop"
        :fixed="true"
        :fixedNumber="[1, 1]"
        :centerBox="option.centerBox"
        :infoTrue="option.infoTrue"
        :fixedBox="false"
        mode="cover"
      ></vue-cropper>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="finish">確認裁切</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { VueCropper } from 'vue-cropper'

const visible = ref(false)
const cropper = ref(null)
const emit = defineEmits(['on-crop'])

const option = reactive({
  img: '', // 裁切圖片的地址
  size: 1, // 裁切生成圖片的質量
  outputType: 'jpeg', // 裁切生成圖片的格式
  full: false, // 是否輸出原圖比例的截圖
  canMove: true, // 圖片是否可以移動
  fixedNumber: [1, 1], // 截圖框的寬高比例
  canMoveBox: true, // 截圖框能否拖動
  original: false, // 上傳圖片按照原始比例渲染
  autoCrop: true, // 是否默認生成截圖框
  centerBox: true, // 截圖框是否被限制在圖片裡面
  infoTrue: true, // true 為展示真實輸出圖片寬高 false 展示看到的截圖框寬高
})

const open = (fileUrl) => {
  option.img = fileUrl
  visible.value = true
}

const handleClosed = () => {
  option.img = ''
}

const finish = () => {
  // 獲取截圖的 blob 數據
  cropper.value.getCropBlob((data) => {
    emit('on-crop', data)
    visible.value = false
  })
}

defineExpose({ open })
</script>

<style scoped>
.cropper-container {
  width: 100%;
  height: 400px;
  background-color: #f0f0f0;
}
</style>
