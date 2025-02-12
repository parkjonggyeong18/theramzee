FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object
RUN npm install
COPY . .
RUN npm run build
RUN ls -al /app/build

FROM nginx:alpine
RUN mkdir -p /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/html
RUN ls -al /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]