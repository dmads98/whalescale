import React from 'react';
import './Button.css';

const STYLES = ['btn--primary', 'btn--outline'] //styles available per button

const SIZES = ['btn--medium', 'btn--large', 'btn--mobile', 'btn--wide'] //sizes available per button

const COLOR = ['primary', 'red','navy', 'neutral'] //color available per button


/*

This function returns a Button with various style components and children.
*/
export const Button = ({
    children, 
    type, 
    onClick, 
    buttonStyle, 
    buttonSize, 
    buttonColor}) => {
        const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

        const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

        const checkButtonColor = COLOR.includes(buttonColor) ? buttonColor : null;

        return (
        <button className = {`btn ${checkButtonStyle} ${checkButtonSize} ${checkButtonColor}`} onClick={onClick} 
        type={type}>
            {children}
        </button>
    )}