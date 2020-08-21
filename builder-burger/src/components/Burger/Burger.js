import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                return <BurgerIngredient key={igKey + i} type={igKey}/>
            });
        })
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []); //we install all elements into one array instead of 4 arrays
    console.log(transformedIngredients);
        //adding text if there is no any ingredient
        if (transformedIngredients.length === 0) {
            transformedIngredients = <p>Please start adding ingredients!</p>
        }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;