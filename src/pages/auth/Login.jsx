import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../api/axiosInstance';
import './auth.css';

export const Login = () => {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/superadmin/login', formData);
      const token = data?.data?.accessToken || data?.accessToken;
      const refresh = data?.data?.refreshToken || data?.refreshToken;
      const user = data?.data?.user || data?.user || { roles: ['ROLE_SUPER_ADMIN'] };
      
      login(user, token, refresh);
      addToast('Login successful', 'success');
      navigate('/dashboard');
    } catch (error) {
      addToast(error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-blob-top"></div>

      {/* Logo Section */}
      <div className="auth-logo-section">
        <div className="auth-logo-icon">
          <span className="material-symbols-outlined">restaurant_menu</span>
        </div>
        <h1 className="auth-brand-title">The Editorial Enterprise</h1>
        <p className="auth-brand-subtitle">SuperAdmin Portal</p>
      </div>

      {/* Login Card */}
      <Card className="auth-card animate-fade-in">
        <div className="auth-card-header">
          <h2>Welcome back</h2>
          <p>Enter your credentials to access the enterprise dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input 
            label="Username or Email" 
            icon="alternate_email"
            placeholder="admin@editorial.com"
            value={formData.usernameOrEmail}
            onChange={(e) => setFormData({...formData, usernameOrEmail: e.target.value})}
            required
          />

          <div>
            <div className="auth-form-row" style={{ marginBottom: '0.375rem' }}>
              <label className="ui-label">Password</label>
              <a href="#" className="auth-forgot-link">Forgot Password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined ui-input-icon">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="ui-input ui-input-with-icon"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)',
                  display: 'flex', padding: 0,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="auth-remember">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Stay signed in for 30 days</label>
          </div>

          <Button type="submit" isLoading={isLoading} style={{ width: '100%', padding: '0.875rem' }}>
            <span>Sign In</span>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>login</span>
          </Button>
        </form>

        <div className="auth-switch-text">
          <Link to="/auth/signup">Create a new account</Link>
        </div>
      </Card>

      {/* Footer */}
      <div className="auth-footer">
        <p>Protected by enterprise-grade 256-bit encryption.</p>
        <div className="auth-footer-links">
          <a href="#">Security Policy</a>
          <div className="auth-footer-dot"></div>
          <a href="#">Support Center</a>
        </div>
      </div>
    </div>
  );
};
