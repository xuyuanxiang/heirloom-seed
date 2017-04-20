import isNumber from 'lodash/isNumber';
import isNaN from 'lodash/isNaN';
import parseInt from 'lodash/parseInt';
import { formatMoney } from 'accounting';

export const parseNumber = (value) => {
    if (isNumber(value) && !isNaN(value)) {
        return value;
    }
    const rtn = parseInt(value);
    if (isNaN(rtn)) {
        return 0;
    }
    return rtn;
};

export const currency = (value, options = {
    symbol: '', // '¥'
    thousand: ',',
    decimal: '.',
    precision: 2,
    format: '%s%v',
}) => formatMoney(parseNumber(value), options);
