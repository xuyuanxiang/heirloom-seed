/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/4/7
 */
import React from 'react';
import IScroll from 'iscroll/build/iscroll-lite';
import { createDebug } from '../core/debug';
import styles from './TableView.scss';

const noop = () => {
};
const debug = createDebug('TableView');

export default class TableView extends React.PureComponent {

    static defaultProps = {
        threshold: 200, // px，向上滑动：滑动到距离底部还有200px，回调onScrollToNext； 下拉：顶部下拉超过200px，回调pullToRefresh。
        dataSource: [],
        onScrollToNext: noop,
        onPullToRefresh: noop,
    };

    componentDidMount() {
        this.iScroll = new IScroll(this.wrapper, {
            disableMouse: true,
            disablePointer: true,
        });
        this.iScroll.on('scrollEnd', this.handleTouchEnd.bind(this));
        debug('height=', this.props.height, 'threshold=', this.props.threshold);
    }

    componentDidUpdate() {
        if (this.iScroll
            && typeof this.iScroll.refresh === 'function') {
            this.iScroll.refresh();
        }
    }

    componentWillUnmount() {
        if (this.iScroll
            && typeof this.iScroll.destroy === 'function') {
            this.iScroll.destroy();
        }
    }

    props: {
        threshold: number,
        height: number,
        dataSource: Array<any>,
        renderRow: (rowData: any, index: number) => React$Element<*>,
        onScrollToNext?: () => void,
        onPullToRefresh?: () => void,
    };
    wrapper: any;
    iScroll: any;

    handleTouchEnd() {
        const { y, maxScrollY, directionY, distY } = this.iScroll;
        const { onScrollToNext, threshold, onPullToRefresh } = this.props;
        if (directionY === 1 && typeof onScrollToNext === 'function') {
            if (Math.abs(y) + Math.abs(threshold) >= Math.abs(maxScrollY)) {
                onScrollToNext();
            }
        } else if (directionY === -1 && typeof onPullToRefresh === 'function') {
            if (y === 0 && distY >= threshold) {
                onPullToRefresh();
            }
        }
    }

    render() {
        const { height, dataSource, renderRow } = this.props;
        return (
            <div
                ref={(ref) => {
                    this.wrapper = ref;
                }}
                style={{ height }}
                className={styles.scrollView}
            >
                <div className={styles.scrollContentContainer}>
                    <ul className={styles.tableView}>
                        {dataSource.map((it: any, idx: number) => (
                            <li
                                key={it.id || `row_${idx}`}
                                className={styles.tableRow}
                            >
                                {renderRow(it, idx)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}
