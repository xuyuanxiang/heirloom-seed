# heirloom-seed

我的模板工程

## 相关项目

1. [heirloom-core]()
2. [heirloom-api-plugin]()
3. [heirloom-static-plugin]()

## 快速开始

### 安装依赖

```npm
SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ npm install
```

### 启动

```npm
npm run dev
```

### 浏览器访问

```
open http://localhost:3000
```

## 环境变量

+ **NODE_ENV**:
    + `development`：本地开发调试
    + `test`：跑单元测试
    + `production`：部署到开发、测试以及生产服务器或在Docker容器中运行

+ **PORT**: 服务监听端口，缺省：`3000`；

### 其他

例如：

+ **BACK_END_HEIRLOOM_SERVICE**: 后端某个服务的域名

可使用**heirloom-static-plugin**的构造参数：[define](https://github.com/xuyuanxiang/heirloom-static-plugin#环境变量) 传入。

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

#### 构建

```npm
npm run build
```

#### 启动

```npm
npm start
```

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

### 开发一个新功能

#### 新建`sample`模块目录结构：

```yaml
api/--------------------------------------后端不支持跨域的接口透传
└── v1/------------------------------------生产环境
│    └── sample.js----------------------------sample接口
└── __mocks__/-----------------------------本地开发调试，mock接口返回
│    └── v1/----------------------------------路径
│          └── sample.js/------------------------sample接口
flow-typed/-----------------------------------flow JS 申明文件
├── global.js/---------------------------------全局flow type申明文件
├── sample.js/---------------------------------sample模块flow type申明文件
modules/----------------------------------项目源码
├── sample/---------------------------------模块目录
│   ├── __tests__/-------------------------sample模块单元测试
│   │    └── SampleApp.spec.js/---------------SampleApp.js 单元测试
│   ├── action/----------------------------用于存放sample模块的所有action creator
│   │   ├── getSample.js/---------------------Action: getSample
│   │   └── resetSample.js/-------------------Action: resetSample
│   ├── reducer/---------------------------用于存放sample模块的所有reducer
│   │   ├── data.js/--------------------------Reducer: sample数据
│   │   ├── error.js/-------------------------Reducer: 错误信息
│   │   ├── loading.js/-----------------------Reducer: Loading状态
│   │   ├── search.js/------------------------Reducer: sample数据查询条件
│   │   └── index.js/-------------------------导出所有reducer
│   ├── SampleApp.scss------------------------样式
│   └── SampleApp.js--------------------------React Component
public/------------------------------------项目源码
├── sample/---------------------------------模块目录
│   ├── index.js------------------------------入口文件
│   └── package.json--------------------------配置申明，详见heirloom-static-plugin用法。
```

#### 在`flow-typed/global.js`中已经预先定义了以下通用类型：

[如果不知道这是什么鬼，戳这里](https://flowtype.org/docs/getting-started.html#_)

```javascript
declare var API_ROOT: string;
declare type Action = {
    type: $Subtype<string>,
    error?: boolean,
    payload?: {} | ?Error,
    meta?: any,
}
declare type APIClientAction = {
    type: $Subtype<string>,
    payload: {
        url: string,
        header?: {},
        method?: 'GET' | 'POST',
        body?: any,
    },
}
```

#### 编辑`flow-typed/sample.js`

为即将编写的`sample`模块定义一些全局通用的类型：

```javascript
// 接口返回数据
declare type Sample = {
    id: number,
    site_admin: boolean,
    name: string,
};

// 接口查询参数
declare type SampleQueryParams = {
    username: string,
};

// Redux 全局 State
declare type SampleState = {
    loading: boolean,
    sample: ?Sample,
};
```

#### 编辑`modules/sample/action/getSample.js`

定义一个action，注释中含有形如`// flow` 或 类似以下`@flow`的JS文件将会通过flow进行类型检测。

```javascript
/**
 * @flow
 * @author xuyuanxiang
 * @date 2017/3/23
 */
import querystring from 'querystring';

export default (query: SampleQueryParams): APIClientAction => ({
    type: 'GET_SAMPLE',
    payload: {
        url: `${API_ROOT}/v1/sample?${querystring.stringify(query)}`,
    },
});
```

#### 编辑`modules/sample/reducer/data.js`

定义一个名为`data`的reducer，用于处理接口返回的数据：

```javascript
// flow
export default (state: {} | Sample = {}, action: Action): {} | Sample => {
    switch (action.type) {
        case 'DID_GET_SAMPLE':
            if (!action.error) {
                return action.payload;
            }
            return {};
        default:
            return state;
    }
};
```

#### 编辑`modules/sample/reducer/loading.js`

定义一个名为`loading`的reducer，用于在Ajax异步请求过程中在界面上展示菊花：

```javascript
// flow
export default (state: boolean = false, action: Action): boolean => {
    switch (action.type) {
        case 'WILL_GET_SAMPLE':
            return true;
        case 'DID_GET_SAMPLE':
            return false;
        default:
            return state;
    }
};
```

#### 编辑`modules/sample/reducer/index.js`

将`data`和`loading`这两个reducer导出，方便取用：

```javascript
export loading from './loading';
export sample from './sample';
```

#### 编辑: `modules/sample/SampleApp.js`

```javascript
/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/4/20
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import Preloader from '../core/Preloader';
import NegativeMessage from '../core/NegativeMessage';
import NotFound from '../core/NotFound';
import getSample from './action/getSample';
import resetSample from './action/resetSample';
import styles from './SampleApp.scss';

// 从全局State中选取的props
type StateProps = {
    loading: boolean,
    error: string,
    data: Sample,
    search: SampleQueryParams,
};

// 带有dispatch monkey patch函数类型的props
type DispatchProps = {
    getSample: (query: SampleQueryParams) => APIClientAction, // 返回APIClient类型Action的creator函数
    resetSample: () => Action, // 返回常规Action的creator函数
};

// 这里导出class是为了用于稍后的单元测试
export class SampleApp extends React.PureComponent {
    static defaultProps = {
        search: {
            username: 'xuyuanxiang',
        },
    };

    // 组件初次加载时，调用查询接口
    componentDidMount() {
        this.props.getSample(this.props.search);
    }

    // 并集
    props: StateProps & DispatchProps;

    handleReset() {
        this.props.resetSample();
    }

    render() {
        if (this.props.loading) {
            return <Preloader visible/>;
        }
        const error = this.props.error;
        if (error) {
            return (
                <NegativeMessage visible>
                    <p>{error}</p>
                </NegativeMessage>
            );
        }
        const data: Sample = this.props.data;
        return (
            <div className={styles.content}>
                {
                    data && data.name ?
                        <div>
                            <p className={styles.text}>{data.name}</p>
                            <button
                                type="button"
                                onClick={() => this.handleReset()}
                            >
                                Reset
                            </button>
                        </div>
                        :
                        <NotFound visible>
                            <p>查询无结果</p>
                        </NotFound>
                }
            </div>
        );
    }
}

export default connect(
    (state: SampleState): StateProps => ({ ...state }),
    (dispatch: Dispatch<APIClientAction | Action>): DispatchProps =>
        bindActionCreators({ getSample, resetSample }, dispatch),
)(SampleApp);

```

#### 编辑`modules/sample/SampleApp.scss`

`px2rem`来自`../core/mixins`，是基于这篇文章的实现：[《移动端高清、多屏适配方案》](http://div.io/topic/1092?page=1#4713)。

```css
@import '../core/mixins';
@import '../core/base';

.text {
  text-align: center;
  color: #b3b3b3;

  @include px2rem(font-size, 28);
  @include px2rem(line-height, 28);
}

```

#### 编辑`modules/sample/__tests__/SampleApp.spec.js`

SampleApp组件的单元测试（其他文件单元测试文件略）：

```javascript
/**
 * @author xuyuanxiang
 * @date 2017/3/23
 */
import React from 'react';
import { shallow, mount } from 'enzyme';
import { SampleApp } from '../SampleApp';

describe('SampleApp suite', () => {

    let getSample,
        props;

    beforeEach(() => {
        getSample = jest.fn();
        props = {
            loading: false,
            sample: {},
            getSample,
        };
    });

    it('should getSample on component did mount', () => {
        spyOn(SampleApp.prototype, 'componentDidMount').and.callThrough();
        mount(
            <SampleApp {...props}/>
        );
        expect(SampleApp.prototype.componentDidMount).toHaveBeenCalledTimes(1);
        expect(getSample).toHaveBeenCalledTimes(1);
        expect(getSample).toHaveBeenCalledWith({ username: 'xuyuanxiang' });
    });

    it('should render loading', () => {
        const ele = shallow(
            <SampleApp {...props} loading={true}/>
        );
        expect(ele.is('p')).toBe(true);
        expect(ele.text()).toBe('Loading...');
    });

    it('should render sample', () => {
        const sample = {
            id: 1,
            name: 'test',
        };
        const ele = shallow(
            <SampleApp {...props} sample={sample}/>
        );
        expect(ele.is('p')).toBe(true);
        expect(ele.text()).toBe(JSON.stringify(sample));
    });
});

```

#### 编辑`public/sample/index.js`

```javascript
import 'babel-polyfill';
import querystring from 'querystring';
// 因为webpack.config.js中自定义了resolve选项所以可以这样引入，而无需以文件路径的形式引入。
import ConnectedSampleApp from 'sample/SampleApp';
// 因为webpack.config.js中自定义了resolve选项所以可以这样引入，而无需以文件路径的形式引入。
import { loading, error, data, search } from 'sample/reducer';
// 因为webpack.config.js中自定义了resolve选项所以可以这样引入，而无需以文件路径的形式引入。
import bootstrap from 'core/bootstrap';

// 组装redux reduer
const reducers = { loading, error, data, search };

// 从路由中获取query参数：`username`。
const { username } = querystring.parse(location.search.replace('?', ''));

// redux应用初始状态
const initialState = { search: { username } };

// 启动应用
bootstrap(ConnectedSampleApp, {
    reducers,
    initialState,
    container: document.getElementById('container'),
});
```

#### 编辑`public/sample/package.json`

```json
{
  "name": "sample",
  "title": "演示"
}
```

#### 编辑`api/__mocks__/v1/sample.js`

```javascript
require('isomorphic-fetch');

exports.default = function* sampleApi() {
    const response = yield fetch(`https://api.github.com/users/${this.query.username}`);
    if (response.ok) {
        const data = yield response.json();
        this.body = { code: '10000', data, msg: 'succ' };
    } else {
        const text = yield response.text();
        throw new Error(text);
    }
};
```

**其余代码略，完整的`sample`示例代码详见：`feature/example`分支。**

#### 启动

```npm
npm run dev
```

#### 浏览器访问：

```bash
open http://localhost:3000/sample
```


