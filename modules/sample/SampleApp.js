/**
 * @module
 * @description
 *
 * @flow
 * @author xuyuanxiang
 * @date 2017/4/20
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import Preloader from '../core/Preloader';
import NegativeMessage from '../core/NegativeMessage';
import NotFound from '../core/NotFound';
import getSample from './action/getSample';
import resetSample from './action/resetSample';
import styles from './SampleApp.scss';

type StateProps = {
    loading: boolean,
    error: string,
    data: Sample,
    search: SampleQueryParams,
};

type DispatchProps = {
    getSample: (query: SampleQueryParams) => APIClientAction,
    resetSample: () => Action,
};

export class SampleApp extends React.PureComponent {
    static defaultProps = {
        search: {
            username: 'xuyuanxiang',
        },
    };

    componentDidMount() {
        this.props.getSample(this.props.search);
    }

    props: StateProps & DispatchProps;

    handleReset() {
        this.props.resetSample();
    }

    render() {
        if (this.props.loading) {
            return <Preloader visible/>;
        }
        const error = this.props.error;
        if (error) {
            return (
                <NegativeMessage visible>
                    <p>{error}</p>
                </NegativeMessage>
            );
        }
        const data: Sample = this.props.data;
        return (
            <div className={styles.content}>
                {
                    data && data.name ?
                        <div>
                            <p className={styles.text}>{data.name}</p>
                            <button
                                type="button"
                                onClick={() => this.handleReset()}
                            >
                                Reset
                            </button>
                        </div>
                        :
                        <NotFound visible>
                            <p>查询无结果</p>
                        </NotFound>
                }
            </div>
        );
    }
}

export default connect(
    (state: SampleState): StateProps => ({ ...state }),
    (dispatch: Dispatch<APIClientAction | Action>): DispatchProps =>
        bindActionCreators({ getSample, resetSample }, dispatch),
)(SampleApp);
