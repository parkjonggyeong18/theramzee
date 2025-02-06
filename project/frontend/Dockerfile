# 빌드 스테이지 (production 빌드)
FROM node:20-alpine AS builder  # **최신 Node.js 20 LTS 버전 Alpine 이미지 사용!**
WORKDIR /app
COPY package*.json ./
RUN npm install --unsafe-perm # --unsafe-perm 옵션 유지 (권한 문제 방지, 필요시 제거 가능)
COPY . .
RUN npm run build  # React production 빌드 실행

# 배포 스테이지 (Nginx - production 환경)
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html  # 빌드 결과물 복사
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]