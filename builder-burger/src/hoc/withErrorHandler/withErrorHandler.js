import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Auxiliary from '../../hoc/Auxiliary';

//it is ananymous class. It is class factory, withErrorHandler we create class
const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        constructor () {
            super();
            //REQUEST
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            //RESPONSE
            this.resInterceptor = axios.interceptors.response.use(response => response, error => {
                this.setState({error: error});
            });
        }
        state = {
            error: null
        }
        // componentWillMount () {
        //     //make axios request globally
        //     axios.interceptors.request.use(req => {
        //         this.setState({error: null});
        //         return req;
        //     });
        //     axios.interceptors.response.use(response => response, error => {
        //         this.setState({error: error});
        //     });
        // }

        //remove unnecessary old interceptors to prevent Memory leaks
        componentWillUnmount() {
            // console.log('componentWillUnmount', this.reqInterceptor, this.resInterceptor);
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }
        errorConfirmedHandler = () => {
            this.setState({error: null})
        }
        render () {
            return (
                <Auxiliary>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        { this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Auxiliary>
            );
        }
    } 
}

export default withErrorHandler;