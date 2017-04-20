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
