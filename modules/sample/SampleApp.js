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
    error: ErrorReducer,
    data: Sample,
    search: SampleQueryParams,
};

type DispatchProps = {
    getSample: (query: SampleQueryParams) => APIClientAction,
    resetSample: () => Action,
};

export class SampleApp extends React.PureComponent {

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
        const { status, message } = this.props.error;
        if (status || message) {
            if (status === 404) {
                return (
                    <NotFound visible>
                        <p>{message}</p>
                    </NotFound>
                );
            }
            return (
                <NegativeMessage visible>
                    <p>{message}</p>
                </NegativeMessage>
            );
        }
        const data: Sample = this.props.data;
        return (
            <div className={styles.content}>
                {
                    data && data.name ?
                        <div className={styles.contentPadding}>
                            <img
                                src={data.avatar_url}
                                alt="头像"
                            />
                            <p className={styles.text}>{data.name}</p>
                            <button
                                type="button"
                                onClick={() => this.handleReset()}
                            >
                                Reset
                            </button>
                        </div>
                        :
                        null
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
