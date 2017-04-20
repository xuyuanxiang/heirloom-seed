/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/3/16
 */
import React from 'react';
import classNames from 'classnames';
import styles from './Preloader.scss';

export default class Preloader extends React.PureComponent {
    static defaultProps = {
        visible: false,
    };

    props: {
        visible: boolean,
    };

    render() {
        if (this.props.visible === true) {
            return (
                <div className={styles['preloader-container']}>
                    <div className={classNames(styles.preloader, styles.active)}/>
                </div>
            );
        }
        return <div style={{ display: 'none' }}/>;
    }
}
