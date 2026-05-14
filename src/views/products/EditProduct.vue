<template>
  <div class="list-container">
    <div class="list-header">
      <h2 class="title">編輯商品資訊</h2>
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
              <el-option
                v-for="item in PRODUCT_CATEGORIES"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="list-item">
          <el-form-item label="銷售價格" prop="price">
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
                v-for="status in PRODUCT_STATUS_OPTIONS"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="list-item">
          <el-form-item label="詳細描述">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="簡要描述商品..."
            />
          </el-form-item>
        </div>

        <div class="list-item noborder">
          <el-form-item label="上傳圖片">
            <input type="file" accept="image/*" @change="handleFileChange" ref="fileInputRef" />
          </el-form-item>
        </div>

        <div class="list-footer">
          <el-form-item>
            <el-button type="primary" @click="submitForm">更新商品</el-button>
            <el-button @click="resetForm" type="default">重設</el-button>
            <el-button @click="cancelEdit" type="success">取消變更</el-button>
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
  </div>

  <ImageCropper ref="cropperRef" @on-crop="handleCropped" />
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/services/api'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { PRODUCT_CATEGORIES, PRODUCT_STATUS_OPTIONS } from '@/constants/productConstants'
import { useProductForm } from '@/composables/useProductForm'
import ImageCropper from '@/components/ImageCropper.vue'

const route = useRoute()
const { goTo } = useNavigation()
const productId = ref(route.params?.id)
const {
  form,
  rules,
  formRef,
  fileInputRef,
  cropperRef,
  imagePreview,
  handleFileChange,
  handleCropped,
  removeImage,
  resetFormFields,
} = useProductForm()

// 表單操作邏輯
function resetForm() {
  resetFormFields()
}

function cancelEdit() {
  goTo('productManage')
}

/**
 * 編輯模式載入商品資料
 * @description 將商品資料載入到表單中
 *
 */
onMounted(async () => {
  if (productId.value) {
    try {
      const res = await api.getProductById(productId.value)
      if (res.code === '0000') {
        Object.assign(form, res.result)
        imagePreview.value = res.result.imageBase64
      }
    } catch (error) {
      console.debug('載入失敗:', error)
      ElMessage.error('載入商品資料失敗')
    }
  }
})

/**
 * 表單提交
 * @description 當表單驗證通過時，執行更新操作
 */
async function submitForm() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await api.updateProduct(productId.value, form)
    ElMessage.success('商品更新成功！')
    goTo('productManage')
  } catch (error) {
    ElMessage.error('更新失敗')
  }
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
