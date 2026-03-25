import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="animate-fade-in"
            style={{ 
              minWidth: '320px',
              padding: '1rem 1.25rem',
              background: 'var(--surface-container-lowest)', 
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-xl)',
              borderLeft: `4px solid ${toast.type === 'error' ? 'var(--error)' : 'var(--on-tertiary-container)'}`, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              fontFamily: 'var(--font-body)',
              color: 'var(--on-surface)',
            }}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ 
                fontSize: '1.25rem',
                color: toast.type === 'error' ? 'var(--error)' : 'var(--on-tertiary-container)' 
              }}
            >
              {toast.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
