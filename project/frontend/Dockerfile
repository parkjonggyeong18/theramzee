FROM node:22.13-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# nginx의 html 디렉토리 생성
RUN mkdir -p /usr/share/nginx/html
# 빌드 결과물 복사
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]