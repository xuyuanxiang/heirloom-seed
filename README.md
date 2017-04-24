# heirloom-seed

使用之前你需要具备一些基本的[react](https://facebook.github.io/react/)以及[redux](http://redux.js.org/)框架的知识。

## 相关项目

1. [heirloom-core](https://github.com/xuyuanxiang/heirloom-core)
2. [heirloom-api-plugin](https://github.com/xuyuanxiang/heirloom-api-plugin)
3. [heirloom-static-plugin](https://github.com/xuyuanxiang/heirloom-static-plugin)

## 快速开始

+ [基础架构](/docs/basic.md)

+ [开始开发一个新功能](/docs/getting-started.md)

## 环境变量

+ **NODE_ENV**:
    + `development`：本地开发调试
    + `test`：跑单元测试
    + `production`：部署到开发、测试以及生产服务器或在Docker容器中运行

+ **PORT**: 服务监听端口，缺省：`3000`；

其他：

+ 例如：**BACK_END**， 后端某个服务的域名

如需在构建静态资源时，将环境变量值传入客户端的JS可使用**heirloom-static-plugin**的构造参数：[define](https://github.com/xuyuanxiang/heirloom-static-plugin#环境变量) 。

## 脚本命令

### 本地开发调试

```npm
npm run dev
```

### 单元测试

```npm
npm test
```

### 服务器或Docker容器中

[Dockerfile](https://github.com/xuyuanxiang/heirloom-seed/blob/develop/Dockerfile)以及[docker-compose.yml](https://github.com/xuyuanxiang/heirloom-seed/blob/develop/docker-compose.yml)

#### 构建

```npm
npm run build
```

#### 启动

```npm
npm start
```
