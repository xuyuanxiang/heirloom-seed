## 开发一个新功能

开始之前确保已安装完成所有依赖：

```bash
SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ npm install
```

### 新建`sample`模块目录结构

```
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

### `flow-typed/global.js`中已经预先定义了以下通用类型

[如果不知道这是什么鬼，戳这里](https://flowtype.org/docs/getting-started.html#_)

```javascript
declare var API_ROOT: string;
declare class Exception extends Error {
    status: number
}
declare type Action = {
    type: $Subtype<string>,
    error?: boolean,
    payload?: {} | ?Exception,
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
declare type ErrorReducer = { status?: number, message?: string };

```

### 编辑`flow-typed/sample.js`

为即将编写的`sample`模块定义一些全局通用的类型：

```javascript
// 接口返回数据
declare type Sample = {
    id: number,
    site_admin: boolean,
    name: string,
    avatar_url: string,
};

// 接口查询参数
declare type SampleQueryParams = {
    username?: string,
};

// Redux 全局 State
declare type SampleState = {
    loading: boolean,
    error: ErrorReducer,
    search: SampleQueryParams,
    data: Sample,
};

```

### 编辑`modules/sample/action/getSample.js`

定义一个Action Creator，注释中出现形如`// flow`或`@flow`的JS文件将会通过flow进行类型检测：

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

### 编辑`modules/sample/reducer/data.js`

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

*如果有多处reducer需要解析较复杂的后端返回数据结构时，可以考虑封装为一个redux的middleware*。

### 编辑`modules/sample/reducer/loading.js`

定义一个名为`loading`的reducer，用于在Ajax异步请求过程中在界面上展示菊花：

```javascript
/**
 * @flow
 * @author xuyuanxiang
 * @date 2017/3/23
 */
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

### 编辑`modules/sample/reducer/error.js`

定义一个名为`error`的reducer，用于处理/翻译错误信息：

```javascript
/**
 * @flow
 * @author xuyuanxiang
 * @date 2017/3/21
 */
type ErrorReducer = { status?: number, message?: string };
export default (state: ErrorReducer = {}, action: Action): ErrorReducer => {
    if (action.error && action.payload instanceof Error) {
        const { status, message } = action.payload;
        return {
            status,
            message: status === 404 ? '查询无结果' : `查询失败：${message}`,
        };
    }
    return {};
};

```

### 编辑`modules/sample/reducer/error.js`

定义一个名为`search`的reducer，用于接收或重置查询参数：

```javascript
/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/4/20
 */
const initialState = { username: '' };

export default (state: SampleQueryParams = initialState, action: Action): SampleQueryParams => {
    switch (action.type) {
        case 'RESET_SAMPLE':
            return initialState;
        default:
            return state;
    }
};

```

### 编辑`modules/sample/reducer/index.js`

将以上reducer导出，方便取用：

```javascript
export loading from './loading';
export error from './error';
export search from './search';
export data from './data';

```

### 编辑: `modules/sample/SampleApp.js`

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

type StateProps = {
    loading: boolean,
    error: ErrorReducer,
    data: Sample,
    search: SampleQueryParams,
};

type DispatchProps = {
    getSample: (query: SampleQueryParams) => APIClientAction,
    resetSample: () => Action,
};

export class SampleApp extends React.PureComponent {

    componentDidMount() {
        this.props.getSample(this.props.search);
    }

    props: StateProps & DispatchProps;

    handleReset() {
        this.props.resetSample();
    }

    render() {
        if (this.props.loading) {
            return <Preloader visible/>;
        }
        const { status, message } = this.props.error;
        if (status || message) {
            if (status === 404) {
                return (
                    <NotFound visible>
                        <p>{message}</p>
                    </NotFound>
                );
            }
            return (
                <NegativeMessage visible>
                    <p>{message}</p>
                </NegativeMessage>
            );
        }
        const data: Sample = this.props.data;
        return (
            <div className={styles.content}>
                {
                    data && data.name ?
                        <div className={styles.contentPadding}>
                            <img
                                src={data.avatar_url}
                                alt="头像"
                            />
                            <p className={styles.text}>{data.name}</p>
                            <button
                                type="button"
                                onClick={() => this.handleReset()}
                            >
                                Reset
                            </button>
                        </div>
                        :
                        null
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

### 编辑`modules/sample/SampleApp.scss`

`px2rem`来自`../core/mixins`，是基于这篇文章的实现：[《移动端高清、多屏适配方案》](http://div.io/topic/1092?page=1#4713)。

```css
@import '../core/mixins';
@import '../core/base';

.text {
  text-align: center;
  color: #000;

  @include px2rem(font-size, 28);
  @include px2rem(line-height, 44);
}

.contentPadding {
  @include px2rem(padding, 15);

  img {
    max-width: 100%;
  }

}

```

### 编辑`modules/sample/__tests__/SampleApp.spec.js`

SampleApp组件的单元测试（其他文件单元测试文件略）,编写过程中可以执行：`npm run test -- --watch`：

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
import { shallow, mount } from 'enzyme';
import { SampleApp } from '../SampleApp';
import Preloader from '../../core/Preloader';
import NegativeMessage from '../../core/NegativeMessage';
import NotFound from '../../core/NotFound';

describe('SampleApp suite', () => {
    let getSample, resetSample, props;

    beforeEach(() => {
        getSample = jest.fn();
        resetSample = jest.fn();
        props = {
            getSample,
            resetSample,
            loading: false,
            error: '',
            data: {},
            search: {},
        };
    });

    it('should getSample on componentDidMount', () => {
        spyOn(SampleApp.prototype, 'componentDidMount').and.callThrough();
        mount(
            <SampleApp
                {...props}
                search={{ username: 'xuyuanxiang' }}
            />
        );
        expect(SampleApp.prototype.componentDidMount).toHaveBeenCalledTimes(1);
        expect(getSample).toHaveBeenCalledWith({ username: 'xuyuanxiang' });
    });

    it('should resetSample on click button', () => {
        const ele = shallow(
            <SampleApp
                {...props}
                data={{ name: 'xuyuanxiang' }}
            />
        );
        expect(resetSample).toHaveBeenCalledTimes(0);
        ele.find('.content button').simulate('click');
        expect(resetSample).toHaveBeenCalledTimes(1);
    });

    it('should render Preloader', () => {
        const ele = shallow(
            <SampleApp
                {...props}
                loading={true}
            />
        );
        expect(ele.is(Preloader)).toBe(true);
    });

    it('should render NegativeMessage', () => {
        const ele = shallow(
            <SampleApp
                {...props}
                error={{ status: 500, message: "something was wrong!" }}
            />
        );
        expect(ele.is(NegativeMessage)).toBe(true);
        expect(ele.contains(<p>something was wrong!</p>));
    });

    it('should render data', () => {
        const ele = shallow(
            <SampleApp
                {...props}
                data={{ name: 'xuyuanxiang' }}
            />
        );
        expect(ele.find('.content p.text').text()).toBe('xuyuanxiang');
    });

    it('should render NotFound', () => {
        const ele = shallow(
            <SampleApp
                {...props}
                error={{ status: 404, message: "查询无结果" }}
            />
        );
        expect(ele.is(NotFound)).toBe(true);
        expect(ele.contains(<p>查询无结果</p>)).toBe(true);
    });

});

```

### 编辑`public/sample/index.js`

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

### 编辑`public/sample/package.json`

```json
{
  "name": "sample",
  "title": "演示",
  "mobile": true
}
```

### 编辑`api/v1/__mocks__/sample.js`

Mock sample接口:

```javascript
/**
 * @module
 * @description
 * @author xuyuanxiang
 * @date 2017/4/21
 */
require('isomorphic-fetch');
const logger = require('log4js').getLogger('api');

exports.get = async function (ctx, next) {
    logger.info(`${ctx.method} ${ctx.originalUrl}`);
    const username = ctx.query.username;
    if (!username) {
        return await next;
    }
    const url = `https://api.github.com/users/${username}`;
    logger.info('Request:', url);
    const response = await fetch(url);
    logger.info(`Response: ${response.status}`);
    if (response.ok) {
        ctx.body = await response.json();
        logger.debug('Respond:', ctx.body);
    } else {
        const text = await response.text();
        logger.error('Unexpected:', ctx.body);
        throw new Error(text);
    }
}

```

### 编辑`api/v1/sample.js`

生产环境 sample接口（效果与之前编写的Mock接口一致，此处为示范ES6 Class的写法，了解更多，请移步：[heirloom-api-plugin](https://github.com/xuyuanxiang/heirloom-api-plugin#heirloom-api-plugin)）：

```javascript
/**
 * @module
 * @description
 * @author xuyuanxiang
 * @date 2017/4/21
 */
require('isomorphic-fetch');
const logger = require('log4js').getLogger('api');

class SampleAPI {

    async get(ctx, next) {
        logger.info(`${ctx.method} ${ctx.originalUrl}`);
        const username = ctx.query.username;
        if (!username) {
            return await next;
        }
        const url = `https://api.github.com/users/${username}`;
        logger.info('Request:', url);
        const response = await fetch(url);
        logger.info(`Response: ${response.status}`);
        if (response.ok) {
            ctx.body = await response.json();
            logger.info('Respond:', ctx.body);
        } else {
            const text = await response.text();
            logger.error('Unexpected:', ctx.body);
            throw new Error(text);
        }
    }
}

module.exports = new SampleAPI();

```

**到此为止，编码结束。完整的`sample`示例代码详见：`feature/example`分支。**

#### 启动

```npm
npm run dev
```

#### 浏览器访问：

```bash
open http://localhost:3000/sample?username=xuyuanxiang
```