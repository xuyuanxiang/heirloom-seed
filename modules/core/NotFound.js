/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/4/17
 */
import React from 'react';
import styles from './NotFound.scss';
import ASSETS_NOT_FOUND from './NotFound.png';

export default class NotFound extends React.PureComponent {
    static defaultProps = {
        visible: false,
        children: null,
    };

    props: {
        visible?: boolean,
        children?: null | React$Element<*>,
    };

    render() {
        if (this.props.visible) {
            return (
                <div className={styles.notFound}>
                    <img src={ASSETS_NOT_FOUND} alt="Not Found"/>
                    {this.props.children}
                </div>
            );
        }
        return <div style={{ display: 'none' }}/>;
    }
}
