import React from 'react';

const Icon = ({ name, ...props }) => {
  return <i className={`icon icon--${name}`} {...props} />;
};

export default Icon;
