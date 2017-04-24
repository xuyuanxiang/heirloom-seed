由一系列heirloom子项目／插件构成的模板工程。

要求使用者需要具备一些基本的[react](https://facebook.github.io/react/)以及[redux](http://redux.js.org/)框架的知识。

整套脚手架遵循**规约重于配置**的策略，最大程度简化前端杂七杂八的框架或工具的学习成本，开发者只需要专注于编写业务逻辑和单元测试。

`规约`大多借鉴自现有的一些标准或知识体系。

## 相关项目

1. [heirloom-core](https://github.com/xuyuanxiang/heirloom-core)
2. [heirloom-api-plugin](https://github.com/xuyuanxiang/heirloom-api-plugin)
3. [heirloom-static-plugin](https://github.com/xuyuanxiang/heirloom-static-plugin)

## 快速开始

全局安装[yeoman](http://yeoman.io/)（如果已安装，请跳过该步骤）:
```bash
npm -g install yo
```

安装[generator-heirloom](https://github.com/xuyuanxiang/generator-heirloom#generator-heirloom):
```bash
npm -g install generator-heirloom
```

新建工程（或者将`example`替换为你的项目名称）：
```bash
yo heirloom example
```

等待一切安装结束后：
```bash
cd example
```

创建并编辑`api/__mocks__/sample.js`文件:
```javascript
// GET请求
exports.get = function (ctx) {
    ctx.body = 'staging';
};
```

创建并编辑`api/sample.js`文件:
```javascript
// GET请求
exports.get = function (ctx) {
    ctx.body = 'production';
};
```

创建并编辑`public/sample/index.js`文件:
```javascript
import 'babel-polyfill';
import 'isomorphic-fetch';

const p = document.createElement('p');
document.body.appendChild(p);

(async function () {
    const response = await fetch('/api/sample');
    if (response.ok) {
        p.innerText = await response.text();
        p.style.color = 'green';
    } else {
        p.innerText = '请求失败！';
        p.style.color = 'red';
    }
})();

```

创建并编辑`public/sample/package.json`文件：
```javascript
{
  "name": "sample"
}
```

在`example`项目根目录下，命令行终端执行：
```bash
yarn dev
```

浏览器访问：
```bash
open http://localhost:3000/sample // staging
```

结束之前执行`yarn dev`所启动的进程，后执行：
```javascript
yarn start
```

浏览器访问：
```bash
open http://localhost:3000/sample // production
```

## 了解更多

+ [基础架构](https://xuyuanxiang.github.io/heirloom-seed/basic)

+ [开始开发一个新功能](https://xuyuanxiang.github.io/heirloom-seed/getting-started)
