/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/4/19
 */
import React from 'react';
import { mount } from 'enzyme';
import TableView from '../TableView';
jest.mock('iscroll/build/iscroll-lite', () => {
    function IScroll() {
    }

    IScroll.prototype.on = function (event, handler) {
        if (event === 'scrollEnd') {
            this.handler = handler;
        }
    }

    IScroll.prototype.refresh = function () {

    };

    IScroll.prototype.destroy = function () {

    };

    return IScroll;
});

describe('TableView suite', () => {
    let renderRow,
        onScrollToNext,
        onPullToRefresh,
        props;

    beforeEach(() => {
        renderRow = jest.fn();
        onScrollToNext = jest.fn();
        onPullToRefresh = jest.fn();
        props = {
            renderRow,
            onScrollToNext,
            onPullToRefresh,
            height: 480,
            threshold: 200,
            dataSource: [],
        }
    });

    it('should call renderRow', () => {
        mount(
            <TableView {...props} dataSource={[{ id: '1' }, { id: '2' }]}/>
        );
        expect(renderRow).toHaveBeenCalledTimes(2);
        expect(renderRow.mock.calls[0][0]).toEqual({ id: '1' });
        expect(renderRow.mock.calls[0][1]).toBe(0);
        expect(renderRow.mock.calls[1][0]).toEqual({ id: '2' });
        expect(renderRow.mock.calls[1][1]).toBe(1);
    });

    it('should scroll to next', () => {
        spyOn(TableView.prototype, 'handleTouchEnd').and.callThrough();
        const ele = mount(
            <TableView
                {...props}
            />
        );
        const iScroll = ele.instance().iScroll;
        iScroll.y = -200;
        iScroll.maxScrollY = -300;
        iScroll.directionY = 1;
        iScroll.handler();
        expect(TableView.prototype.handleTouchEnd).toHaveBeenCalledTimes(1);
        expect(onScrollToNext).toHaveBeenCalledTimes(1);
    });

    it('should pull to refresh', () => {
        spyOn(TableView.prototype, 'handleTouchEnd').and.callThrough();
        const ele = mount(
            <TableView
                {...props}
            />
        );
        const iScroll = ele.instance().iScroll;
        iScroll.y = 0;
        iScroll.directionY = -1;
        iScroll.distY = 201;
        iScroll.handler();
        expect(TableView.prototype.handleTouchEnd).toHaveBeenCalledTimes(1);
        expect(onPullToRefresh).toHaveBeenCalledTimes(1);
    });

    it('should refresh iScroll on componentDidUpdate', () => {
        spyOn(TableView.prototype, 'componentDidUpdate').and.callThrough();
        const ele = mount(<TableView {...props} dataSource={[{ id: '0' }]}/>);
        const iScroll = ele.instance().iScroll;
        spyOn(iScroll, 'refresh');
        ele.setProps(Object.assign({}, props, { dataSource: [{ id: '0' }, { id: '1' }] }));
        expect(TableView.prototype.componentDidUpdate).toHaveBeenCalledTimes(1);
        expect(iScroll.refresh).toHaveBeenCalledTimes(1);
    });

    it('should destroy iScroll on componentWillUnmount', () => {
        spyOn(TableView.prototype, 'componentWillUnmount').and.callThrough();
        const ele = mount(<TableView {...props} dataSource={[{ id: '0' }]}/>);
        const iScroll = ele.instance().iScroll;
        spyOn(iScroll, 'destroy');
        ele.unmount();
        expect(TableView.prototype.componentWillUnmount).toHaveBeenCalledTimes(1);
        expect(iScroll.destroy).toHaveBeenCalledTimes(1);
    });
});
