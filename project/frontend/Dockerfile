# 빌드 스테이지
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN ls -al node_modules/.bin/react-scripts  # `react-scripts` 파일 권한 확인 명령어 (유지)
RUN chmod +x node_modules/react-scripts/bin/react-scripts.js  # **`chmod +x` 명령어 대상 수정! (실제 파일 경로)**
COPY . .
RUN npm run build

# 배포 스테이지 (Nginx 활용)
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]