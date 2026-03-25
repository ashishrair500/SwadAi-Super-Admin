import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../api/axiosInstance';
import './auth.css';

export const Signup = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    fullName: '', 
    email: '', 
    phone: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/superadmin/signup', formData);
      const token = data?.data?.accessToken || data?.accessToken;
      const refresh = data?.data?.refreshToken || data?.refreshToken;
      const user = data?.data?.user || data?.user || { roles: ['ROLE_SUPER_ADMIN'] };
      
      login(user, token, refresh);
      addToast('Registration successful', 'success');
      navigate('/dashboard');
    } catch (error) {
      addToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
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
        <p className="auth-brand-subtitle">SuperAdmin Registration</p>
      </div>

      {/* Signup Card */}
      <Card className="auth-card auth-card-wide animate-fade-in">
        <div className="auth-card-header">
          <h2>Create Administrator Account</h2>
          <p>Authorize a new Control Tower administrator for the enterprise.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-grid">
            <Input label="Full Name" name="fullName" icon="person" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required />
            <Input label="Username" name="username" icon="badge" placeholder="johndoe" value={formData.username} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" icon="mail" placeholder="john@editorial.com" value={formData.email} onChange={handleChange} required />
            <Input label="Phone" name="phone" icon="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} required />
            <div className="auth-grid-full">
              <Input label="Password" name="password" type="password" icon="lock" placeholder="Create a secure password" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} style={{ width: '100%', padding: '0.875rem', marginTop: '0.5rem' }}>
            <span>Complete Setup</span>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>arrow_forward</span>
          </Button>
        </form>

        <div className="auth-switch-text">
          Already have an account? <Link to="/auth/login">Sign in</Link>
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
