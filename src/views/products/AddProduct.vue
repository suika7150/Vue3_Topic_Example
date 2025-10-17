<template>
  <div class="page-content" style="padding-top: 100px">
    <div class="max-w-2xl mx-auto mt-10 p-6 border rounded bg-white shadow">
      <h2 class="text-2xl font-bold mb-4">新增商品</h2>

      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="商品名稱" prop="name">
          <el-input v-model="form.name" placeholder="請輸入商品名稱" />
        </el-form-item>

        <el-form-item label="分類" prop="category">
          <el-select v-model="form.category" placeholder="請選擇分類">
            <el-option label="電子產品" value="電子產品" />
            <el-option label="生活用品" value="生活用品" />
            <el-option label="服飾配件" value="服飾配件" />
            <el-option label="加工食品" value="加工食品" />
            <el-option label="交通工具" value="交通工具" />
            <el-option label="廚房清潔" value="廚房清潔" />
          </el-select>
        </el-form-item>

        <el-form-item label="價格" prop="price">
          <el-input-number v-model="form.price" :min="0" :step="100" />
        </el-form-item>

        <el-form-item label="庫存數量" prop="stock">
          <el-input-number v-model="form.stock" :min="0" :step="1" placeholder="請輸入庫存數量" />
        </el-form-item>

        <el-form-item label="商品狀態" prop="states">
          <el-select v-model="form.states" placeholder="請選擇狀態">
            <el-option
              v-for="(state, index) in states"
              :key="index"
              :label="state.label"
              :value="state.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="簡要描述商品..."
          />
        </el-form-item>

        <el-form-item label="上傳圖片" prop="imageBase64">
          <input type="file" accept="image/*" @change="handleFileChange" />
          <div v-if="imagePreview" class="mt-2">
            <img :src="imagePreview" class="h-32 rounded border" />
            <el-button type="danger" @click="removeImage" text>刪除圖片</el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">新增商品</el-button>
          <el-button type="default" @click="resetForm">重設</el-button>
          <el-button type="success" @click="back">返回</el-button>
        </el-form-item>
      </el-form>

      <ConfirmationDialog
        v-model="successDialogVisible"
        title="新增成功"
        message="商品已成功新增。請問您要繼續新增商品嗎？"
        :buttons="successButtons"
      />
    </div>
  </div>
  <div style="height: 50px"></div>
</template>

<script setup>
import ConfirmationDialog from '@/components/ConfirmationDialog.vue' // 引入通用元件
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const formRef = ref()
const { goTo, goBack } = useNavigation()
const successDialogVisible = ref(false)
const imagePreview = ref(null)

const states = ref([
  { label: '上架', value: 'ONSALE' },
  { label: '下架', value: 'OFFSALE' },
])

const form = reactive({
  name: '', //產品名稱
  category: '', //分類
  price: 1000, //價格
  stock: 0, //庫存
  description: '', //描述
  imageBase64: '', //圖片
  imageType: '', //圖片類型
})

const rules = {
  name: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
  category: [{ required: true, message: '請選擇分類', trigger: 'change' }],
  price: [{ required: true, message: '請輸入價格', trigger: 'blur' }],
  stock: [
    { required: true, message: '請輸入庫存數量', trigger: 'blur' },
    { type: 'number', min: 0, message: '庫存數量不能為負數', trigger: 'blur' },
  ],
  imageBase64: [{ required: true, message: '請上傳圖片', trigger: 'change' }],
}

// 新增一個圖片縮放的方法
function resizeImage(img, fileType, targetWidth, targetHeight) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // 設定 Canvas 的固定尺寸
  canvas.width = targetWidth
  canvas.height = targetHeight

  let width = img.width
  let height = img.height

  // 計算縮放比例，以確保圖片能完整顯示在目標尺寸內
  const scale = Math.min(targetWidth / width, targetHeight / height)
  const newWidth = width * scale
  const newHeight = height * scale

  // 計算繪製的起始位置，讓圖片置中
  const xOffset = (targetWidth - newWidth) / 2
  const yOffset = (targetHeight - newHeight) / 2

  // 繪製圖片到 Canvas，不足的部分會是透明（留白）
  ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight)

  return canvas.toDataURL(fileType)
}

/**
 * 處理檔案選擇變化
 * @param {InputEvent} event - Input 事件
 * @description 讀取檔案， resize 圖片，將結果 set 到 form.imageBase64
 */
function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    const img = new Image()
    img.src = reader.result
    img.onload = () => {
      const MAX_WIDTH = 200 // 你希望的圖片最大寬度
      const MAX_HEIGHT = 150 // 你希望的圖片最大高度
      // 呼叫縮圖方法，並將結果賦值給 form
      const resizedImage = resizeImage(img, file.type, MAX_WIDTH, MAX_HEIGHT)
      form.imageBase64 = resizedImage
      form.imageType = file.type // 儲存圖片類型
      imagePreview.value = resizedImage
    }
  }
}

function removeImage() {
  form.imageBase64 = ''
  imagePreview.value = null
  // 清空 input[type=file] 欄位(可用 ref 或下方方法)
  document.querySelector('input[type="file"]').value = ''
}

function resetForm() {
  form.name = ''
  form.category = ''
  form.price = null
  form.stock = 0
  form.description = ''
  form.imageBase64 = ''
  imagePreview.value = null
  formRef.value.resetFields()
}
// 根據需求定義「新增成功」對話框的按鈕
const successButtons = [
  {
    text: '返回列表',
    type: 'default',
    onClick: () => goTo('ProductList'),
  },
  {
    text: '繼續新增',
    type: 'primary',
    onClick: () => resetForm(),
  },
]

function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      await api.addProduct(form)
      ElMessage.success('商品新增成功！')
      // 成功後，呼叫獨立出來的處理函數
      successDialogVisible.value = true
    } catch (error) {
      ElMessage.error('新增失敗，請稍後再試')
    }
    document.querySelector('input[type="file"]').value = ''
  })
}

function back() {
  goBack()
}
</script>
