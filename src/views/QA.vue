<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>
            <el-icon><QuestionFilled /></el-icon> 常見問題 Q & A
          </h2>
        </div>
      </template>

      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="Q1: 下單後可以修改訂單內容嗎？" name="1">
          <div>
            為確保出貨效率，訂單成立後即無法自行修改。若需更改收件地址或取消訂單，請於下單後 1
            小時內聯繫客服人員。
          </div>
        </el-collapse-item>

        <el-collapse-item title="Q2: 提供哪些付款方式？" name="2">
          <div>
            目前支援以下支付方式：
            <ul>
              <li>線上信用卡刷卡（VISA / Master / JCB）</li>
              <li>超商取貨付款</li>
              <li>Line Pay 支付</li>
            </ul>
          </div>
        </el-collapse-item>

        <el-collapse-item title="Q3: 請問多久可以收到商品？" name="3">
          <div>
            一般宅配約 1-2 個工作天，超商取貨約 2-4 個工作天。如遇電商大促期間（如
            11.11）可能會有延遲。
          </div>
        </el-collapse-item>

        <el-collapse-item title="Q4: 如何申請退貨？" name="4">
          <div>
            請至「個人資料維護」>「訂單查詢」中點選該筆訂單申請退貨，我們將派車前往取件，運費由本公司負擔。
          </div>
        </el-collapse-item>
        <el-collapse-item title="Q5: 忘記密碼怎麼辦?" name="5">
          <div>請至登入頁面點選「忘記密碼」，系統將發送重設郵件至您的註冊信箱。</div>
        </el-collapse-item>
      </el-collapse>

      <div class="support-footer">
        <p>還有其他問題嗎？歡迎聯繫我們</p>
        <el-button type="primary" plain>聯繫在線客服</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'

const activeNames = ref(['1']) // 預設展開第一個
</script>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 1440px;

  margin: 0 auto;
}
.card-header h2 {
  margin: 0;
  display: flex;
  align-items: center;
  /* width: 800px; */
  gap: 10px;
}
.support-footer {
  margin-top: 30px;
  text-align: center;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}
@media (max-width: 1024px) {
  .page-container {
    margin: 0 0;
  }
}
</style>
