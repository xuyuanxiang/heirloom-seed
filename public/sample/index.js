/**
 * @module
 * @description
 *
 * @author xuyuanxiang
 * @date 2017/3/13
 */
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
const initialState = { search: {} };
if (username) {
    initialState.search.username = username;
}

const container = document.createElement('div');
document.body.appendChild(container);
// 启动应用
bootstrap(ConnectedSampleApp, {
    reducers,
    initialState,
    container,
});
