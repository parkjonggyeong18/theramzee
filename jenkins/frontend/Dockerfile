FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object
RUN npm install
COPY . .

# 빌드 실행 + 로그 출력
RUN npm run build && ls -al /app/build

FROM nginx:alpine
RUN mkdir -p /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/html

# 복사 후 파일 확인
RUN ls -al /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]