FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object
RUN npm install
COPY . .
# 빌드 시 timestamp나 commit hash를 환경변수로 추가
ARG REACT_APP_VERSION=${BUILD_NUMBER:-dev}
ENV REACT_APP_VERSION=$REACT_APP_VERSION
RUN npm run build

FROM nginx:alpine
RUN mkdir -p /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]