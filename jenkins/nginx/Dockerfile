FROM nginx:alpine
#COPY nginx.conf /etc/nginx/conf.d/nginx.conf
RUN mkdir -p /etc/letsencrypt
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]