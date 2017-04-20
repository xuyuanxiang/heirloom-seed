/**
 * @flow
 * @author xuyuanxiang
 * @date 2017/3/23
 */
import querystring from 'querystring';

export default (query: SampleQueryParams): APIClientAction => ({
    type: 'GET_SAMPLE',
    payload: {
        url: `${API_ROOT}/v1/sample?${querystring.stringify(query)}`,
    },
});
