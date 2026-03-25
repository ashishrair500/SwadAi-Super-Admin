import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || Math.random().toString(36).substring(7);
  const hasIcon = !!icon;

  return (
    <div className={`ui-input-wrapper ${className}`}>
      {label && <label htmlFor={inputId} className="ui-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        {hasIcon && (
          <span className="material-symbols-outlined ui-input-icon">{icon}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`ui-input ${hasIcon ? 'ui-input-with-icon' : ''} ${error ? 'ui-input-error' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="ui-error-text animate-fade-in">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
