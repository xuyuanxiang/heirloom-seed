## 目录结构

```yaml
heirloom-seed/
├── api/---------------------------------------后端不支持跨域的接口透传或RPC接口统一封装
│   └── __mocks__/----------------------------------本地开发调试时，mock接口返回
├── flow-typed/-------------------------------flow js 申明文件
├── scripts/----------------------------------一些辅助测试、构建等工作的脚本或工具
├── modules/----------------------------------项目源码
│   ├── core/------------------------------------公用模块／中间件／UI组件／工具类库...
│   │   ├── apiClient.js----------------------------redux中间件，解析包含API调用参数（url, method, headers）的action。
│   │   ├── NegativeMessage.js----------------------通用错误信息展示组件
│   │   ├── Preloader.js----------------------------通用压力指示计（旋转的小菊花）
│   │   ├── NotFound.js-----------------------------查询结果为空时，展示组件
│   │   ├── TableView.js----------------------------列表视图，含下拉刷新和无限向下滚动加载下一页的交互。
│   │   ├── formatter.js----------------------------一些用于格式化显示数据的函数
│   │   ├── bootstrap.js----------------------------Redux 中间件应用、store设置、ReactDOM render...
│   │   └── debug.js--------------------------------通用浏览器端日志调试组件，生产环境下会关闭（！！严禁使用：console.log等。）
│   └── sample/-----------------------------------业务模块之一
├── public/------------------------------------客户端静态资源
└── index.js-----------------------------------用于生产环境的Node 服务器
```

### `api/`目录

Ajax API路由自动按文件目录映射。

e.g. `NODE_ENV=production`时: `http://localhost:3000/api/v1/sample` => `api/v1/sample.js`

### `api/__mocks__/`目录

本地Mock接口返回数据。

e.g. `NODE_ENV=development`时：`http://localhost:3000/api/v1/sample` => `api/__mocks__/v1/sample.js`

### `public/`目录

浏览器端页面路由按文件目录映射。

e.g. `http://localhost:3000/sample/` => `public/sample/index.html`

### `modules/`目录

可复用的模块／组件／工具／类库... 如有需要可分离为独立的子项目。

在`public/`下可以用这样的姿势引入`modules/sample/SampleApp.js`和`modules/core/bootstrap.js`：
```javascript
import ConnectedSampleApp from 'sample/SampleApp';
import bootstrap from 'core/bootstrap';
```
而不需要以路径模块的形式引入。

## 编写代码

### 推荐的姿势

![姿势](http://cdn.xuyuanxiang.me/79e50381bed4e4059b97247863c8b1d15b6ab7.png)

### `apiClient.js`中间件

![中间件](http://cdn.xuyuanxiang.me/fa407eaa0f0ca6ae96f57ddb79d37d8ced83fe.png)

负责解析API类型的Action，发起请求、统一授权以及接收响应、错误处理等。

长这样的Action，将会被`apiClient`接收并处理:

```javascript
declare type APIClientAction = {
    type: $Subtype<string>,
    payload: {
        url: string,
        method?: 'GET' | 'POST',  // 缺省: 'GET'
        headers?: {},
        body?: any,
    },
}
```

`apiClient`会将一个API类型的Action分解为两个加上`WILL_`和`DID_`前缀的Action：

```javascript
{type: 'GET_SAMPLE', payload: {url: ''}}  // 接收到的原始API Action

{type: 'WILL_GET_SAMPLE'} // 请求之前dispatch

await request...  //  等待Ajax异步请求结束

{type: 'DID_GET_SAMPLE', payload: {code, data, msg...}} // 请求成功后dispatch
// or
{type: 'DID_GET_SAMPLE', error: true, payload: new Error('')} // 请求失败后dispatch
```

`apiClient`支持以瀑布流的方式处理数组类型的Action：

```javascript
[
    {type: 'SHOW_LOADING', payload: '正在保存'},
    {type: 'CREATE_SOMETHING', payload: {url: '...', method: 'POST', body: {data...}}},
    {type: 'ROUTE_POP', payload: '/list'},
]
```

其中，凡是位于**API类型的Action之后**的Action将会在这个异步请求完成后，才会被dispatch。

### 业务模块代码组织方式

```yaml
sample/-----------------------------------Sample
│   ├── assets/---------------------------图片资源
│   ├── component/------------------------小组件
│   ├── action/---------------------------每一个Action Creator作为一个单独的文件
│   └── reducer/--------------------------每一个reducer属性作为一个单独的文件
```
