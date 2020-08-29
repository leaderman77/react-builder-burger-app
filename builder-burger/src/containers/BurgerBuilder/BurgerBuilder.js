import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

import axios from '../../axios-orders';

import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.props = {...};
    // }
    state = {
        // ingredients: null,
        // totalPrice: 4,
        // purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }
    componentDidMount () {
        // axios.get('https://react-my-burger-dfcfc.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients : response.data});
        //     })
        //     .catch(error => {
        //         this.setState({error: true});
        //     });
    }
    updatePurchaseState (ingredients) {
        // const ingredients = {
        //     ...this.state.ingredients
        // };
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        // this.setState({purchasable:sum>0});
        return sum > 0;
    }
    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState(
    //         {totalPrice: newPrice, 
    //         ingredients: updatedIngredients});
    //     // call updatePurchaseState for the button order now
    //     this.updatePurchaseState(updatedIngredients);
    // }
    // removerIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if (oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState(
    //         {totalPrice: newPrice, 
    //         ingredients: updatedIngredients});
    //     // call updatePurchaseState for the button order now
    //     this.updatePurchaseState(updatedIngredients);
    // }
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    purchaseContinueHandler = () => {
        console.log(this.props);
        // alert('You continue?')

        this.props.history.push('/checkout');

        // make comments below codes because we now can use reducer.js global state
        // const queryParams = [];
        // for (let i in this.state.ingredients) {
        //     //proprty name equal to value for this property
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');

        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // });
    }
    render() {
        const disabledInfo = {
            // ...this.state.ingredients
            ...this.props.ings
        };
        // key here is a value of ingredients in state
        for (let key in disabledInfo) {
            // check if value of disabledInfo array is less than 0, it returns true for each element
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;

        let burger = this.state.error ? <p>Ingreients can not be loaded!</p> : <Spinner />;
        if (this.props.ings) {
            burger = (
                <Auxiliary>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        price={this.props.price}/>
                </Auxiliary>
            );
            orderSummary = <OrderSummary 
                            ingredients={this.props.ings} 
                            price={this.props.price}
                            purchaseCanceled={this.purchaseCancelHandler}
                            purchaseContinued={this.purchaseContinueHandler}/>;
        }
        if (this.state.loading) {
            orderSummary = <Spinner />;
        }
        //  {salad: treu, meat: false, ...}
        return (
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        )
    }
}
//fetch the Ingredients and totalPrice from our global state
const mapStateToProps = state => {
    return {
        ings: state.ingredients, 
        price: state.totalPrice
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));