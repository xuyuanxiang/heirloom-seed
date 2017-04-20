/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/4/17
 */
import React from 'react';
import NotFound from '../NotFound';
import { shallow } from 'enzyme';

describe('NotFound suite', () => {
    it('should be visible', () => {
        const ele = shallow(
            <NotFound visible>
                <p>Empty</p>
            </NotFound>
        );
        expect(ele.find('.notFound img').prop('src')).toBe('NotFound.png');
        expect(ele.find('.notFound p').text()).toBe('Empty');
    });

    it('should be hidden', () => {
        const ele = shallow(
            <NotFound>
                <p>Empty</p>
            </NotFound>
        );
        expect(ele.children().length).toBe(0);
        expect(ele.equals(<div style={{ display: 'none' }}></div>)).toBe(true);
    });
});
