FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --unsafe-perm
COPY . .
RUN npm run build

# 배포 스테이지 (Nginx 활용)
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]