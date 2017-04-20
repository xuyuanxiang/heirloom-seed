/**
 * @description
 *  redux中间件，
 *  支持`dispatch`以下类型的action:
 *  ```javascript
 *  type Action = {
 *      type: string,
 *      payload: {
 *          url: string,
 *          method: null | ?string,  // 缺省: 'GET'
 *          headers: null | ?Object,
 *          body: null | ?Object,
 *      }
 *  };
 *  ```
 * @author xuyuanxiang
 * @date 2017/2/12
 */
import 'isomorphic-fetch';
import isPlainObject from 'lodash/isPlainObject';
import has from 'lodash/has';

async function callAPI(action) {
    const type = `DID_${action.type}`;
    const { payload, meta } = action;
    const { url, method, body, headers } = payload;
    const options = {
        headers: { Accept: 'application/json; charset=UTF-8' },
        // credentials: 'include',
    };
    if (isPlainObject(headers)) {
        Object.assign(options.headers, headers);
    }
    if (typeof method === 'string' && ['GET', 'POST', 'DELETE', 'UPDATE', 'PATCH'].includes(method.toUpperCase())) {
        options.method = method.toUpperCase();
    }
    if (isPlainObject(body) && options.method === 'POST') {
        options.body = JSON.stringify(body);
        options.headers['Content-Type'] = 'application/json; charset=UTF-8';
    }
    let response;
    try {
        response = await fetch(url, options);
    } catch (error) {
        bughd(
            'notify',
            method || 'GET',
            url,
            {
                request: {
                    ...options,
                },
                response: { error: error.message },
            },
        );
        return {
            type,
            error: true,
            payload: new Error('似乎已断开与互联网的连接。'),
            meta: Object.assign({}, action),
        };
    }
    if (!response.ok) {
        if (typeof bughd === 'function') {
            const text = await response.text();
            bughd(
                'notify',
                method || 'GET',
                url,
                {
                    request: {
                        ...options,
                    },
                    response: {
                        status: response.status,
                        statusText: response.statusText,
                        body: text,
                    },
                },
            );
        }
        return {
            type,
            error: true,
            payload: new Error('系统繁忙！请稍后重试。'),
            meta: Object.assign({}, action),
        };
    }
    const result = { type };
    if (meta) {
        result.meta = meta;
    }
    result.payload = await response.json();
    return result;
}

async function waterfall(actions, next) {
    // eslint-disable-next-line
    for (let action of actions) {
        if (isPlainObject(action) && has(action, 'payload.url')) {
            next({ type: `WILL_${action.type}` });
            next(await callAPI(action)); // eslint-disable-line
        } else {
            next(action);
        }
    }
}

export default () => next => (action) => {
    if (Array.isArray(action)) {
        return waterfall(action, next).then();
    }
    if (isPlainObject(action) && has(action, 'payload.url')) {
        next({ type: `WILL_${action.type}` });
        return callAPI(action).then(next, next);
    }
    return next(action);
};
