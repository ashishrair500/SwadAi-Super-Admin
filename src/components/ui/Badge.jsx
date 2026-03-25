import React from 'react';

export const Badge = ({ children, variant = 'success', className = '' }) => {
  const variantClass = `ui-badge-${variant}`;
  return (
    <span className={`ui-badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
};
