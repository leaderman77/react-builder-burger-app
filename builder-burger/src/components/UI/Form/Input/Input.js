import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let inputElemenet = null;
    const inputClasses = [classes.InputElement];

    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    } 

    switch (props.elementType) {
        case ('input') :
            inputElemenet = <input 
                className={inputClasses.join(' ')} 
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}/>;
            break;
        case ('textarea') :
            inputElemenet = <textarea 
                className={inputClasses.join(' ')} 
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}/>;
            break;
        case ('select') :
            inputElemenet = (
                <select 
                    className={inputClasses.join(' ')} 
                    value={props.value}
                    onChange={props.changed}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.displayValue}
                        </option>
                    ))}
                </select>);
            break;
        default:
            inputElemenet = <input 
                className={classes.InputElement} 
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}/>;
    }
    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElemenet}
        </div>
    );
};
export default input;