import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../contexts/ToastContext';
import api from '../../api/axiosInstance';
import '../restaurants/restaurants.css';

export const AssignAdminWizard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeCode: '',
    designation: 'Restaurant Admin',
    phone: '',
    email: '',
    userName: '',
    password: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, restaurantId: id };
      await api.post(`/superadmin/restaurants/staff/onboard-restaurant-admin`, payload);
      
      addToast('Restaurant Admin successfully assigned!', 'success');
      navigate(`/restaurants/${id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to onboard admin', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assign-container">
      <div className="assign-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => navigate(`/restaurants/${id}`)}
            className="action-icon-btn"
            style={{ width: '36px', height: '36px' }}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1>Assign Restaurant Admin</h1>
            <p>Create the primary managerial account for Restaurant #{id}</p>
          </div>
        </div>
      </div>

      <Card className="animate-fade-in" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Employee Code" name="employeeCode" icon="badge" placeholder="e.g., EMP-001" value={formData.employeeCode} onChange={handleChange} required />
            <Input label="Designation" name="designation" icon="work" value={formData.designation} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Email Address" type="email" name="email" icon="mail" placeholder="admin@restaurant.com" value={formData.email} onChange={handleChange} required />
            <Input label="Phone Number" name="phone" icon="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="credentials-section">
            <h3>
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: 'var(--primary)', marginRight: '0.375rem' }}>key</span>
              Login Credentials
            </h3>
            <Input label="Username" name="userName" icon="person" placeholder="Choose a username" value={formData.userName} onChange={handleChange} required />
            <Input label="Temporary Password" type="password" name="password" icon="lock" placeholder="Create a secure password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="assign-actions">
            <Button type="button" variant="secondary" onClick={() => navigate(`/restaurants/${id}`)} style={{ flex: 1 }}>
              Skip for Now
            </Button>
            <Button type="submit" isLoading={loading} style={{ flex: 2 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>person_add</span>
              Onboard Admin
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
};
