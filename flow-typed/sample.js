/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/3/23
 */
// 接口返回数据
declare type Sample = {
    id: number,
    site_admin: boolean,
    name: string,
};

// 接口查询参数
declare type SampleQueryParams = {
    username?: string,
};

// Redux 全局 State
declare type SampleState = {
    loading: boolean,
    error: string,
    search: SampleQueryParams,
    data: Sample,
};
