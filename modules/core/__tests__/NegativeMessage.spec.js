/**
 * @module
 * @description
 *
 * @author xuyuanxiang
 * @date 2017/3/16
 */
import React from 'react';
import { shallow } from 'enzyme';
import NegativeMessage from '../NegativeMessage';

describe('NegativeMessage suite', () => {
    it('should be hidden', () => {
        const ele = shallow(
            <NegativeMessage>
                <p>Something was wrong!</p>
            </NegativeMessage>
        );
        expect(ele.is('div')).toBe(true);
        expect(ele.prop('style')).toEqual({ display: 'none' });
        expect(ele.children().length).toBe(0);
    });

    it('should be children', () => {
        const ele = shallow(
            <NegativeMessage visible>
                <p>Something was wrong!</p>
            </NegativeMessage>
        );
        expect(ele.find('.negative img').prop('src')).toBe('Negative.png');
        expect(ele.contains(<p>Something was wrong!</p>));
    });
});

