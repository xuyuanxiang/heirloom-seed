/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/4/20
 */
const initialState = { username: '' };

export default (state: SampleQueryParams = initialState, action: Action): SampleQueryParams => {
    switch (action.type) {
        case 'RESET_SAMPLE':
            return initialState;
        default:
            return state;
    }
};
