<template>
  <div class="page-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h1>
            <el-icon><ShoppingBag /></el-icon> 購買須知
          </h1>
        </div>
      </template>

      <section class="section">
        <h3>
          <el-icon><Pointer /></el-icon> 購物流程
        </h3>
        <el-steps :active="4" align-center class="steps-box">
          <el-step title="選購商品" description="挑選心儀商品加入購物車"></el-step>
          <el-step title="確認訂單" description="核對數量與收件資訊"></el-step>
          <el-step title="完成付款" description="支援信用卡/轉帳/LinePay"></el-step>
          <el-step title="出貨通知" description="商品寄出後簡訊通知"></el-step>
        </el-steps>
      </section>

      <el-divider />

      <section class="section">
        <h3>
          <el-icon><Warning /></el-icon> 注意事項
        </h3>
        <ul class="info-list">
          <li><strong>運送方式：</strong>全館滿 $999 免運，支援宅配、超商取貨。</li>
          <li><strong>出貨時間：</strong>現貨商品於下單後 2-3 個工作天內出貨。</li>
          <li><strong>退換貨：</strong>享有 7 天鑑賞期（非試用期），拆封請錄影存證。</li>
        </ul>
      </section>
    </el-card>
  </div>
</template>

<script setup>
import { ShoppingBag, Pointer, Warning } from '@element-plus/icons-vue'
</script>

<style scoped>
.page-container {
  max-width: 1440px;
  margin: 50 80px;
}
.card-header {
  text-align: center;
}
.box-card {
  border-radius: 12px;
  border: 1px solid #ebeef5;
}
.steps-box {
  margin: 40px 0;
}
.section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #409eff;
}
.info-list {
  margin-left: 20px;
  line-height: 2;
  color: #606266;
}
</style>
