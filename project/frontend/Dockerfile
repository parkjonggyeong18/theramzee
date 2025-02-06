FROM node:22.13-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 배포 스테이지 (Nginx - production 환경)
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html  # 빌드 결과물 복사
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]