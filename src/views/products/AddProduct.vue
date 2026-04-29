<template>
  <div class="list-container">
    <div class="list-header">
      <h2 class="title">新增商品</h2>
    </div>

    <div class="main-content-wrapper">
      <el-form :model="form" :rules="rules" ref="formRef" class="form-leftside">
        <div class="list-item">
          <el-form-item label="商品名稱" prop="name">
            <el-input v-model="form.name" placeholder="請輸入商品名稱" />
          </el-form-item>
        </div>

        <div class="list-item">
          <el-form-item label="類別" prop="category">
            <el-select v-model="form.category" placeholder="請選擇類別">
              <el-option label="電子產品" value="電子產品" />
              <el-option label="生活用品" value="生活用品" />
              <el-option label="服飾配件" value="服飾配件" />
              <el-option label="加工食品" value="加工食品" />
              <el-option label="交通工具" value="交通工具" />
              <el-option label="清潔用品" value="清潔用品" />
              <el-option label="影音娛樂" value="影音娛樂" />
            </el-select>
          </el-form-item>
        </div>

        <div class="list-item">
          <el-form-item label="價格" prop="price">
            <el-input-number v-model="form.price" :min="0" :step="100" />
          </el-form-item>
        </div>

        <div class="list-item">
          <el-form-item label="庫存數量" prop="stock">
            <el-input-number v-model="form.stock" :min="0" :step="1" placeholder="請輸入庫存數量" />
          </el-form-item>
        </div>

        <div class="list-item">
          <el-form-item label="商品狀態" prop="status">
            <el-select v-model="form.status" placeholder="請選擇狀態">
              <el-option
                v-for="(status, index) in statusOptions"
                :key="index"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="list-item">
          <el-form-item label="商品描述">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="簡要描述商品..."
            />
          </el-form-item>
        </div>

        <div class="list-item">
          <el-form-item label="上傳圖片" prop="imageBase64">
            <input type="file" accept="image/*" @change="handleFileChange" />
          </el-form-item>
        </div>

        <div class="list-footer">
          <el-form-item>
            <el-button type="primary" @click="submitForm">新增商品</el-button>
            <el-button type="default" @click="resetForm">重設</el-button>
            <el-button type="success" @click="back">返回</el-button>
          </el-form-item>
        </div>
      </el-form>

      <div class="right-preview-aside">
        <div class="sticky-image-container">
          <p class="preview-title-text">圖片預覽</p>
          <img v-if="imagePreview" :src="imagePreview" class="main-preview-img rounded shadow-sm" />
          <div v-else class="empty-preview">
            <div class="text-gray-400">尚未上傳圖片</div>
          </div>
          <el-button
            v-if="imagePreview"
            type="danger"
            @click="removeImage"
            class="delete-btn"
            plain
          >
            刪除圖片
          </el-button>
        </div>
      </div>
    </div>

    <ConfirmationDialog
      v-model="successDialogVisible"
      title="新增成功"
      message="商品已成功新增。請問您要繼續新增商品嗎？"
      :buttons="successButtons"
    />
  </div>
</template>

<script setup>
import api from '@/service/api'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { useNavigation } from '@/composables/useNavigation'
import ImageCropper from '@/components/ImageCropper.vue'

const formRef = ref()
const { goTo, goBack } = useNavigation()
const successDialogVisible = ref(false)
const imagePreview = ref(null)
const cropperRef = ref(null)

const statusOptions = ref([
  { label: '上架', value: 'ON_SALE' },
  { label: '下架', value: 'OFF_SALE' },
])

const form = reactive({
  name: '', //產品名稱
  category: '', //分類
  price: '', //價格
  stock: 0, //庫存
  status: '', //狀態
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
  status: [{ required: true, message: '請選擇狀態', trigger: 'change' }],
  imageBase64: [{ required: true, message: '請上傳圖片', trigger: 'change' }],
}

// 圖片縮放
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
    // 呼叫裁切組件並傳入原始圖片
    cropperRef.value.open(reader.result)
  }
}

// 接收裁切後的結果
function handleCropped(blob) {
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onloadend = () => {
    form.imageBase64 = reader.result
    imagePreview.value = reader.result
    ElMessage.success('圖片裁切完成')
  }
}

function removeImage() {
  form.imageBase64 = ''
  imagePreview.value = null
  document.querySelector('input[type="file"]').value = ''
}

function resetForm() {
  form.name = ''
  form.category = ''
  form.price = null
  form.stock = 0
  form.status = ''
  form.description = ''
  form.imageBase64 = ''
  imagePreview.value = null
  formRef.value.resetFields()
}

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
<style scoped>
.list-container {
  max-width: 1200px;
  margin: 20px 120px;
  background-color: #fff;
  padding: 30px;
}

.main-content-wrapper {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

.form-leftside :deep(.el-form-item__label) {
  width: 120px;
  flex-shrink: 0;
  justify-content: flex-end;
  padding-right: 12px;
}

/* 頁面標題 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

/* --- 左側表單 --- */
.form-leftside {
  flex: 1;
}

/* 清單項目 */
.list-item {
  padding: 12px 0;
}

/* 輸入框 (名稱、類別、狀態、描述) */
:deep(.el-input),
:deep(.el-select),
:deep(.el-textarea) {
  max-width: 500px;
  width: 100%;
}

/* 輸入框 (價格、庫存) */
:deep(.el-input-number) {
  width: 200px;
}

/* 表單標籤 */
:deep(.el-form-item__label) {
  font-weight: bold;
  color: #606266;
}

/* 移除 ElementPlus 原生項目間距 */
:deep(.el-form-item) {
  margin-bottom: 0;
}

/* 表單底部按鈕 */
.list-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  gap: 12px;
}

/* 表單底部按鈕 */
.list-footer :deep(.el-form-item) {
  width: 100%;
}

/* 表單底部按鈕 */
.list-footer :deep(.el-form-item__content) {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
}

/* 圖片預覽區塊 */
.right-preview-aside {
  width: 450px;
}

/* 圖片預覽容器 */
.sticky-image-container {
  position: sticky;
  top: 120px;
  padding: 15px;
  text-align: center;
}

/* 圖片預覽標題文字 */
.preview-title-text {
  display: block;
  position: relative;
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

/* 主預覽圖片 */
.main-preview-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 10px;
}

/* 尚未上傳圖片狀態 */
.empty-preview {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dcdfe6;
}

/* 刪除圖片按鈕 */
.delete-btn {
  margin-top: 20px;
  width: 30%;
  letter-spacing: 1px;
  font-weight: 500;
  border-radius: 8px;
}

/* --- RWD  --- */
@media (max-width: 1024px) {
  .list-container {
    margin: 20px 0px;
    width: 100%;
    padding: 20px;
  }

  .main-content-wrapper {
    flex-direction: column-reverse;
    gap: 30px;
  }

  .form-leftside,
  .right-preview-aside {
    width: 100%;
  }

  .sticky-image-container {
    position: static;
    padding: 0;
  }

  .main-preview-img,
  .empty-preview {
    max-width: 400px;
    margin: 0 auto;
  }

  :deep(.el-form-item) {
    display: flex;
    flex-direction: row;
    align-items: center;
    transform: translateX(-30px);
  }

  /* 表單標籤 */
  :deep(.el-form-item__label) {
    display: flex;
    text-align: left;
    width: 100%;
    margin-right: 15px;
  }

  :deep(.el-form-item__content) {
    margin-left: 0;
    width: 100%;
  }

  /* 所有輸入框 */
  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-textarea) {
    max-width: 100%;
    width: 100%;
  }

  :deep(.el-input-number) {
    width: 80%;
  }

  /* 表單底部按鈕 */
  .list-footer :deep(.el-form-item__content) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-left: 0;
    width: 100%;
  }

  .list-footer :deep(.el-form-item) {
    transform: translateX(0);
  }

  .list-footer .el-button {
    margin-left: 0;
    width: auto;
    padding: 10px 20px;
  }
}
</style>
