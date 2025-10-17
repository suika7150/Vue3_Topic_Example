<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 border rounded bg-white shadow">
    <h2 class="text-2xl font-bold mb-4">編輯商品</h2>

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
          <el-option label="清潔用品" value="清潔用品" />
          <el-option label="影音娛樂" value="影音娛樂" />
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
      <el-form-item label="上傳圖片">
        <input type="file" accept="image/*" @change="handleFileChange" />
        <div v-if="imagePreview" class="mt-2">
          <img :src="imagePreview" class="h-32 rounded border" />
          <el-button type="danger" @click="removeImage" text>刪除圖片</el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">更新商品</el-button>
        <el-button @click="resetForm" type="default">重設</el-button>
        <el-button @click="cancelEdit" type="success">取消變更</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref, inject } from 'vue'
import { useRoute } from 'vue-router'
import InputSelect from '@/components/InputSelect.vue'

const productId = ref(null) // 新增一個 ref 來儲存 id

const route = useRoute()
const { goTo } = useNavigation()
const formRef = ref()
const form = reactive({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  states: '',
  description: '',
  imageBase64: '', // 改成 Base64 字串
})
const imagePreview = ref(null)

const states = ref([])
const category = ref([])
// 編輯模式的驗證規則 (圖片非必填)
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

/**
 * 移除圖片
 * @description 將 form.imageBase64 清空
 * @description 將 imagePreview.value 清空
 * @description 清空 input[type=file]
 */
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
  form.states = ''
  form.description = ''
  form.imageBase64 = ''
  imagePreview.value = null
  formRef.value.resetFields()
}

function cancelEdit() {
  goTo('ProductList')
}

const filterOptions = (allOptions, listNamen) => {
  return allOptions
    .filter((option) => option.listName === listNamen)
    .map((option) => {
      return { label: option.key, value: option.value }
    })
}

/**
 * 編輯模式載入商品資料
 * @description 將商品資料載入到表單中
 *
 */
onMounted(async () => {
  productId.value = route.params?.id
  if (productId.value) {
    try {
      const allOptions = inject('allOptions')
      states.value = filterOptions(allOptions, 'order_status')
      category.value = filterOptions(allOptions, 'category')

      const res = await api.getProductById(productId.value)
      if (res.code === '0000') {
        const product = res.result
        // 載入資料到表單
        Object.assign(form, product)
        imagePreview.value = product.imageBase64
      }
    } catch (error) {
      ElMessage.error('載入商品資料失敗')
    }
  }
})

/**
 * 表單提交
 * @description 當表單驗證通過時，執行更新操作
 */
function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      await api.updateProduct(productId.value, form)
      ElMessage.success('商品更新成功！')
      // 更新後可以導航回商品列表
      goTo('ProductList')
    } catch (error) {
      ElMessage.error('更新失敗，請稍後再試')
    }
  })
}
</script>
