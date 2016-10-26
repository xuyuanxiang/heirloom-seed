#FROM registry.wosai-inc.com/node:4.4.4
FROM node:4.4.4
MAINTAINER xuyuanxiang@wosai-inc.com
ENV NODE_ENV production
WORKDIR /app/bin/site
ADD . /app/bin/site
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 3000
ENTRYPOINT npm run serve