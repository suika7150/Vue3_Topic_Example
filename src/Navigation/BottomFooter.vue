<template>
  <footer class="bottom-footer">
    <div class="footer-content">
      <div class="footer-left">
        <p>© 2025 公司名稱 All Rights Reserved.</p>
        <p>地址：台北市中正區XXX路123號</p>
        <p>電話：02-1234-5678 | Email: info@company.com</p>
      </div>
      <div class="footer-right">
        <p>追蹤我們：</p>
        <a href="https://www.facebook.com/?locale=zh_TW" target="_blank" rel="noopener">
          <el-button type="text"><Icon icon="logos:facebook" /></el-button>
        </a>
        <a href="https://www.line.me/tw/" targer="_blank">
          <el-button type="text">
            <Icon icon="streamline-logos:line-app-logo-block" color="#00c300" />
          </el-button>
        </a>
        <a href="https://www.instagram.com/" target="_blank">
          <el-button type="text"><Icon icon="skill-icons:instagram" /></el-button>
        </a>
        <a href="https://x.com/" target="_blank">
          <el-button type="text"><Icon icon="skill-icons:twitter" /></el-button>
        </a>
        <a href="https://www.youtube.com/" target="_blank">
          <el-button type="text"><Icon icon="logos:youtube-icon" /></el-button>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 如果需要 props 或 store 可再加
</script>

<style scoped>
.bottom-footer {
  position: relative; /* 改成 relative，自然在內容下方 */
  width: 100%;
  background-color: #001529;
  color: #fff;
  padding: 30px 15px;
  /* box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); */
  box-sizing: border-box; /* 避免 padding 推寬度 */
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer-left p {
  margin: 4px 0;
  height: 18px;
}

.footer-right p {
  margin-bottom: 8px;
  height: 5px;
}

.footer-right .el-button {
  color: #fff;
  font-size: 18px;
  margin-right: 8px;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: flex-start;
  }
  .footer-right {
    margin-top: 16px;
  }
}
</style>
