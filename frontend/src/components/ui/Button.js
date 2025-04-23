import React from 'react';
import '../../assets/styles/components/_button.scss'; // Style import for buttons

const Button = ({ children, onClick, className = '', ...props }) => {
  return (
    // Merge the default "button" class with any additional classes passed in the props.
    <button className={`button ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;