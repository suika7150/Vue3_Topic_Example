# 建立編譯環境
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 建立生產環境的 Nginx 伺服器
FROM nginx:stable-alpine AS production-stage

# 將 nginx.conf 複製到容器內的 Nginx 設定目錄
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 將產生的 dist 資料夾複製到 Nginx 預設網頁目錄
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
