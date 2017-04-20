/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/4/7
 */
import React from 'react';
import styles from '../TableView.scss';

export default class TableView extends React.PureComponent {

    handleTouchEnd({directionY}) {
        if (directionY === 1) {
            if (this.props.onScrollToNext) {
                this.props.onScrollToNext();
            }
        } else if (directionY === -1) {
            if (this.props.onPullToRefresh) {
                this.props.onPullToRefresh();
            }
        }
    }

    render() {
        return (
            <div
                className={styles.tableView}
                onTouchEnd={event => this.handleTouchEnd(event)}
            >
                {this.props.dataSource.map((it, idx) => (
                    <div
                        className={styles.tableRow}
                        key={it.id || `row_${idx}`}
                    >
                        {this.props.renderRow(it, idx)}
                    </div>
                ))}
            </div>
        );
    }
}
