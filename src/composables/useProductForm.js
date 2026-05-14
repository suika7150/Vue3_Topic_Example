import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

export function useProductForm() {
  const formRef = ref(null)
  const fileInputRef = ref(null)
  const cropperRef = ref(null)
  const imagePreview = ref(null)

  const form = reactive({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    status: '',
    description: '',
    imageBase64: '',
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

  // 圖片選取處理
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      cropperRef.value.open(reader.result)
    }
  }

  // 裁切回傳處理
  const handleCropped = (blob) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      form.imageBase64 = reader.result
      imagePreview.value = reader.result
      ElMessage.success('圖片裁切完成')
    }
  }

  const removeImage = () => {
    form.imageBase64 = ''
    imagePreview.value = null
    if (fileInputRef.value) fileInputRef.value.value = ''
  }

  const resetFormFields = () => {
    Object.assign(form, {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      status: '',
      description: '',
      imageBase64: '',
    })
    imagePreview.value = null
    if (fileInputRef.value) fileInputRef.value.value = ''
    if (formRef.value) formRef.value.resetFields()
  }

  return {
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
  }
}
