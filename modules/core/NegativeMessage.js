/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/3/16
 */
import React from 'react';
import styles from './NegativeMessage.scss';
import IMAGE_NEGATIVE from './Negative.png';

export default class NegativeMessage extends React.PureComponent {

    static defaultProps = {
        visible: false,
        children: null,
    };

    props: {
        children?: null | any,
        visible: boolean,
    };

    render() {
        if (this.props.visible === true) {
            return (
                <div className={styles.negative}>
                    <img
                        src={IMAGE_NEGATIVE}
                        alt="提示"
                    />
                    {this.props.children}
                </div>
            );
        }
        return <div style={{ display: 'none' }}/>;
    }
}
