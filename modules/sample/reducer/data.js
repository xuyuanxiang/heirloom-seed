/**
 * @flow
 * @author xuyuanxiang
 * @date 2017/3/23
 */
export default (state: {} | Sample = {}, action: Action): {} | Sample => {
    switch (action.type) {
        case 'DID_GET_SAMPLE':
            if (!action.error) {
                return action.payload;
            }
            return {};
        case 'RESET_SAMPLE':
            return {};
        default:
            return state;
    }
};
