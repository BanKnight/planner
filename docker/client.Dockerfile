FROM node:latest as build-stage

WORKDIR /app

COPY client/package*.json ./

RUN npm install --registry=https://registry.npm.taobao.org

COPY client/ .

RUN npm run build

# ======================== 上：npm打包  下：nginx运行 ========================

FROM nginx:alpine as production

# 移除nginx容器的default.conf文件、nginx配置文件
RUN rm /etc/nginx/conf.d/default.conf && rm /etc/nginx/nginx.conf

# 把主机的nginx.conf文件复制到nginx容器的/etc/nginx文件夹下
COPY docker/nginx.conf.template /etc/nginx/

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

EXPOSE 80

COPY docker-entrypoint.sh /

# 使用daemon off的方式将nginx运行在前台保证镜像不至于退出
CMD ["nginx", "-g", "daemon off;"]




