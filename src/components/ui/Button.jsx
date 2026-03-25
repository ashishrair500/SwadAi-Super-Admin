import React from 'react';
import './ui.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  ...props 
}) => {
  const baseClass = 'ui-button';
  const variantClass = `ui-button-${variant}`;
  const sizeClass = `ui-button-${size}`;

  return (
    <button 
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="loader"></span> : children}
    </button>
  );
};
