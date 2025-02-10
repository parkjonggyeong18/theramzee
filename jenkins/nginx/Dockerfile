FROM nginx:alpine
COPY conf.d/nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/letsencrypt
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]