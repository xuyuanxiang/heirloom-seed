/**
 * @flow
 * @author xuyuanxiang
 * @date 2017/3/21
 */
export default (state: string = '', action: Action): string => {
    switch (action.type) {
        case 'DID_GET_SAMPLE':
            if (action.error && action.payload instanceof Error) {
                return action.payload.message;
            }
            return '';
        default:
            return '';
    }
};
