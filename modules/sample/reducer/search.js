/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/4/20
 */
export default (state: SampleQueryParams, action: Action): SampleQueryParams => {
    switch (action.type) {
        case 'RESET_SAMPLE':
            return { search: '' };
        default:
            return state;
    }
};
