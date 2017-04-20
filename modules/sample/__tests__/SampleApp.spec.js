/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/4/20
 */
import React from 'react';
import { shallow, mount } from 'enzyme';
import { SampleApp } from '../SampleApp';
import Preloader from '../../core/Preloader';
import NegativeMessage from '../../core/NegativeMessage';
import NotFound from '../../core/NotFound';

describe('SampleApp suite', () => {
    let getSample, resetSample, props;

    beforeEach(() => {
        getSample = jest.fn();
        resetSample = jest.fn();
        props = {
            getSample,
            resetSample,
            loading: false,
            error: '',
            data: {},
            search: {},
        };
    });

    it('should getSample on componentDidMount', () => {
        spyOn(SampleApp.prototype, 'componentDidMount').and.callThrough();
        mount(
            <SampleApp
                {...props}
                search={{ username: 'xuyuanxiang' }}
            />
        );
        expect(SampleApp.prototype.componentDidMount).toHaveBeenCalledTimes(1);
        expect(getSample).toHaveBeenCalledWith({ username: 'xuyuanxiang' });
    });

    it('should resetSample on click button', () => {
        const ele = shallow(
            <SampleApp
                {...props}
                data={{ name: 'xuyuanxiang' }}
            />
        );
        expect(resetSample).toHaveBeenCalledTimes(0);
        ele.find('.content button').simulate('click');
        expect(resetSample).toHaveBeenCalledTimes(1);
    });

    it('should render Preloader', () => {
        const ele = shallow(
            <SampleApp
                {...props}
                loading={true}
            />
        );
        expect(ele.is(Preloader)).toBe(true);
    });

    it('should render NegativeMessage', () => {
        const ele = shallow(
            <SampleApp
                {...props}
                error="something was wrong!"
            />
        );
        expect(ele.is(NegativeMessage)).toBe(true);
        expect(ele.contains(<p>something was wrong!</p>));
    });

    it('should render data', () => {
        const ele = shallow(
            <SampleApp
                {...props}
                data={{ name: 'xuyuanxiang' }}
            />
        );
        expect(ele.find('.content p.text').text()).toBe('xuyuanxiang');
    });

    it('should render NotFound', () => {
        const ele = shallow(
            <SampleApp
                {...props}
                data={{}}
                loading={false}
            />
        );
        expect(ele.childAt(0).is(NotFound)).toBe(true);
        expect(ele.find(NotFound).contains(<p>查询无结果</p>)).toBe(true);
    });

});
