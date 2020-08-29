import React, { Component } from "react";
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import clasess from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner'
import { withRouter } from 'react-router-dom';
import Input from '../../../components/UI/Form/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
                name: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your name'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                }, 
                street: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Street'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                }, 
                zipcode: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'ZIP Code'
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 5,
                        maxLength: 5
                    },
                    valid: false,
                    touched: false
                }, 
                country: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Country'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                }, 
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'Your E-mail'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                }, 
                deliveryMethod: {
                    elementType: 'select',
                    elementConfig: {
                        options: [
                            {value: 'fastest', displayValue: 'Fastest'},
                            {value: 'cheapest', displayValue: 'Cheapest'}]
                    },
                    value: 'fastest', //by default we set 'fastest' as a value
                    validation: {},
                    valid: true
                }
        },
        formIsValid: false,
        loading: false
    }
    orderHandler = (event) => {
        event.preventDefault();

        this.setState({loading: true});
        //get data from STATE
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier];
        }
        //create order request structure before posting to the sever
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }
        console.log(order);
        // for FireBase project we use .json endpoint but for other may be different
        axios.post('/orders.json', order)
            .then(response => {
                //console.log(response)
                this.setState({ loading: false });
                this.props.history.push('/');
            })
            .catch(error => {
                //console.log(error)
                this.setState({ loading: false });
            })
    }

    checkValidity(value, rules) {
        let isValid = true;

        //check if no validation rules are defined to rules property
        if (!rules) {
            return true;
        }

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;    //check if value is not equual to empty, isValid will be true 
        }
        //for ZIP Code
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid //isValid is true if it was true
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        //copy orderForm *first level
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        //copy orderForm *second level, elements inside
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        //check validation of the form
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        // console.log(updatedFormElement);
        //set the form input is touched = true
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        // console.log(formIsValid);
        //set the new value to the state
        this.setState(
                {orderForm: updatedOrderForm, 
                formIsValid: formIsValid});
    }

    render () {
        const formElementsArray = [];   
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        invalid={!formElement.config.valid}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    />
                ))}
                <Button btnType='Success' disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={clasess.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        ings:state.ingredients,
        price: state.totalPrice
    }
};

export default connect(mapStateToProps)(withRouter(ContactData));