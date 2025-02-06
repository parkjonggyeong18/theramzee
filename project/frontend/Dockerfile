# 빌드 스테이지
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --unsafe-perm  # --unsafe-perm 옵션 유지 (npm 권한 관련 문제 방지)
RUN chmod +x -R node_modules/.bin  # `node_modules/.bin` 디렉토리 전체 실행 권한 부여 (유지)
COPY . .
RUN npm run build  # **`/bin/bash -c` 부분 제거! - `sh` 쉘 또는 직접 실행**
# RUN sh -c "npm run build"  # `sh -c` 를 명시적으로 사용해도 OK (선택 사항)

# 배포 스테이지 (Nginx 활용)
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]