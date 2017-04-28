FROM node:7.9.0
MAINTAINER xuyuanxiang@wosai-inc.com
WORKDIR /app
ARG BACK_END
ENV PORT 3000
ENV NODE_ENV production
ENV SASS_BINARY_SITE https://npm.taobao.org/mirrors/node-sass/
ADD . /app
RUN yarn install \
    && yarn test \
    && yarn build \
    && chmod +x bin/start.sh
EXPOSE 3000
ENTRYPOINT bin/start.sh