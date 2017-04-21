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
