/* eslint-disable no-unused-vars */
import React from 'react';
import '../../assets/styles/components/_button.scss';

const Button = ({ children, onClick, className = '', ...props }) => {
  return (
    <button className={`button ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
