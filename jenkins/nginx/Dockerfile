FROM nginx:alpine
COPY --from=murhyun2/theramzee-frontend:latest /usr/share/nginx/html /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# nginx.conf 파일을 템플릿 파일로 복사 (플레이스홀더가 그대로 남아 있음)
COPY nginx.conf /etc/nginx/nginx.conf.template
RUN mkdir -p /etc/letsencrypt
EXPOSE 80 443
# 컨테이너 시작 시 envsubst로 치환 후 nginx 실행
CMD ["/bin/bash", "-c", "envsubst '$DEPLOY_COLOR' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
