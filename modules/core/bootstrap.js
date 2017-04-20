/**
 * @module
 * @description
 *
 * @author xuyuanxiang
 * @date 2017/3/20
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import apiClient from './apiClient';

export default (Component, { reducers, container, initialState = {}, middlewares = [] } = {}) => {
    const parent = typeof container === 'string'
        ? document.querySelector(container) : container;
    const store = createStore(
        combineReducers({ ...reducers }),
        initialState,
        applyMiddleware(apiClient, thunk, createLogger({
            predicate: () => process.env.NODE_ENV === 'development',
            collapsed: true,
            duration: true,
        }), ...middlewares),
    );

    ReactDOM.render((
        <Provider store={store}>
            <Component/>
        </Provider>
    ), parent);
};
