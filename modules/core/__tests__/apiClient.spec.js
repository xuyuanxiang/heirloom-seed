import apiClient from '../apiClient';
import isEqual from 'lodash/isEqual';

jest.mock('../debug');
jest.mock('isomorphic-fetch');
global.bughd = jest.fn();
global.Promise = require('promise');
global.fetch = async (url, { method, body, headers }) => {
    if (url === '/api/fetch/fail') {
        throw new Error('Fetch failed.');
    }
    if (url === '/api/test' && method === 'POST' && isEqual(body, JSON.stringify({ id: '123' }))) {
        return {
            ok: true,
            json: async () => ({ code: 10000, data: 'success' }),
        };
    }
    if (url === '/api/test') {
        return {
            ok: true,
            json: async () => ({ code: 10000, data: 'test' }),
        };
    }
    if (url === '/api/fetch/exception') {
        return {
            ok: true,
            json: async () => ({ code: 500, msg: 'something was wrong!' }),
        }
    }
    if (url === '/api/test/authorization') {
        if (headers.Authorization) {
            return {
                ok: true,
                json: async () => ({ code: 10000, data: 'success' }),
            }
        } else {
            return {
                ok: true,
                json: async () => ({ code: 401, msg: 'Un-Authorized' }),
            }
        }
    }
    if (url === '/api/error') {
        return {
            ok: false,
            status: 500,
            statusText: 'Inner Error',
            text: async () => '<html></html>',
        };
    }
    return {
        ok: false,
        text: async () => '<html></html>',
    };
}

describe('apiClient middleware', () => {

    let dispatch, next, store = {
        getState: () => ({}),
        dispatch: (action) => {
            return action;
        }
    };

    beforeEach(() => {
        next = jest.fn();
        dispatch = apiClient(store)(next);
    });

    it('should ignore action', () => {
        const action = { type: 'FOO', payload: { data: { id: '22' } } };
        dispatch(action);
        expect(next).toHaveBeenCalledWith(action);
    });

    it('should "GET" api', async () => {
        const action = { type: 'FOO', payload: { url: '/api/test' } };
        await dispatch(action);
        expect(next).toHaveBeenCalledTimes(2);
        expect(next.mock.calls[0][0]).toEqual({
            type: 'WILL_FOO',
        });
        expect(next.mock.calls[1][0]).toEqual({
            type: 'DID_FOO',
            payload: { code: 10000, data: 'test' },
        });
    });

    it('should "POST" to api', async () => {
        const action = {
            type: 'FOO',
            payload: { url: '/api/test', method: 'POST', body: { id: '123' } },
            meta: { page: 1, pageSize: 10 },
        };
        await dispatch(action);
        expect(next.mock.calls[0][0]).toEqual({
            type: 'WILL_FOO',
        });
        expect(next.mock.calls[1][0]).toEqual({
            type: 'DID_FOO',
            payload: { code: 10000, data: 'success' },
            meta: { page: 1, pageSize: 10 },
        });
    });

    it('should assign custom header', async () => {
        const action = {
            type: 'FOO',
            payload: { url: '/api/test/authorization', headers: { Authorization: '111' } },
        };
        await dispatch(action);
        expect(next.mock.calls[0][0]).toEqual({
            type: 'WILL_FOO',
        });
        expect(next.mock.calls[1][0]).toEqual({
            type: 'DID_FOO',
            payload: { code: 10000, data: 'success' },
        });
    });

    it('should transform unexpected response statusCode to error action', async () => {
        const action = {
            type: 'FOO',
            payload: { url: '/api/error' },
            meta: { page: 1, pageSize: 10 },
        };
        await dispatch(action);
        let nextAction = next.mock.calls[1][0];
        const error = new Error('Inner Error');
        error.status = 500;
        expect(nextAction).toEqual({
            type: 'DID_FOO',
            error: true,
            payload: error,
            meta: action,
        });
    });

    it('should transform request failed error to error action', async () => {
        const action = {
            type: 'FOO',
            payload: { url: '/api/fetch/fail' },
            meta: { page: 1, pageSize: 10 },
        };
        await dispatch(action);
        let nextAction = next.mock.calls[1][0];
        expect(nextAction).toEqual({
            type: 'DID_FOO',
            error: true,
            payload: new Error('似乎已断开与互联网的连接。'),
            meta: action,
        });
    });

    it('should dispatch waterfall actions', async () => {
        const actions = [
            {
                type: 'ASYNC',
                payload: { url: '/api/test', method: 'POST', body: { id: '123' } },
                meta: { page: 1, pageSize: 10 },
            },
            (dispatch) => {
                dispatch({ type: 'THUNK', payload: "" });
            },
            {
                type: 'PLAIN',
                payload: ""
            },
        ];
        await dispatch(actions);
        let nextAction = next.mock.calls;
        expect(nextAction[0][0]).toEqual({
            type: 'WILL_ASYNC',
        });
        expect(nextAction[1][0]).toEqual({
            type: 'DID_ASYNC',
            payload: { code: 10000, data: 'success' },
            meta: { page: 1, pageSize: 10 },
        });
        const mockDispatch = jest.fn();
        nextAction[2][0](mockDispatch);
        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'THUNK',
            payload: "",
        });
        expect(nextAction[3][0]).toEqual({
            type: 'PLAIN',
            payload: "",
        });
    });
});
