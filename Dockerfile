FROM node:4.4.4
MAINTAINER xuyuanxiang@wosai-inc.com
ENV NODE_ENV production
WORKDIR /app/bin/site
ADD . /app/bin/site
RUN npm install cnpm -g --registry=https://registry.npm.taobao.org && \
  cnpm install
EXPOSE 4000
ENTRYPOINT npm start