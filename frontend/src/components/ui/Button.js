import React from 'react';
import '../../assets/styles/components/_button.scss'; 
const Button = ({ children, onClick, className = '', ...props }) => (
  <button className={`button ${className}`} onClick={onClick} {...props}>
    {children}
  </button>
);
export default Button;
