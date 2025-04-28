import React from 'react';
import '../../assets/styles/components/_icons.scss';

const Icon = ({ name, ...props }) => {
  return <i className={`icon icon--${name}`} {...props}></i>;
};

export default Icon;
