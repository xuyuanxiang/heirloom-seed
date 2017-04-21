/**
 * @flow
 * @author xuyuanxiang
 * @date 2017/3/20
 */
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
