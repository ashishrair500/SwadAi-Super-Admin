import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`editorial-card ${className}`} {...props}>
      {children}
    </div>
  );
};
