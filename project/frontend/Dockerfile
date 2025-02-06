# 빌드 스테이지
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./

# 실행 권한 문제 방지
RUN npm install --unsafe-perm
RUN chmod +x node_modules/.bin/react-scripts  # 실행 파일 권한 부여

COPY . .
RUN /bin/bash -c "npm run build"  # `bash`에서 실행

# 배포 스테이지 (Nginx 활용)
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
