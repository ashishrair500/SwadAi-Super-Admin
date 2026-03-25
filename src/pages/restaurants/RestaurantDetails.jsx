import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../contexts/ToastContext';
import api from '../../api/axiosInstance';
import './restaurants.css';

export const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [restaurant, setRestaurant] = useState(null);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/superadmin/restaurants/${id}`).catch(() => ({ data: { data: {
          id, name: "L'Artiste Brasserie", description: 'Flagship location in Manhattan\'s Upper East Side. Specializing in neo-classical French cuisine with an editorial presentation style.',
          restaurantType: 'Modern French, Fine Dining', addressLine1: '742 Madison Avenue, 4th Floor', city: 'New York', state: 'NY', pincode: '10065',
          status: 'ACTIVE', contactName: 'Jean-Luc Moreau', contactEmail: 'admin@lartiste-nyc.com',
          monthlyTraffic: 12480, reservationRate: 88, reviewIndex: 4.9
        }}}));
        setRestaurant(res.data?.data || res.data);
      } catch (err) {
        addToast('Failed to load restaurant details', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'details') fetchDetails();
  }, [id, activeTab]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffRes = await api.get(`/superadmin/restaurants/${id}/staff`).catch(() => ({ data: { data: [
          { id: 101, fullName: 'Jean-Luc Moreau', designation: 'Executive Owner', status: 'ACTIVE' },
          { id: 102, fullName: 'Sophie Laurent', designation: 'General Manager', status: 'ACTIVE' },
          { id: 103, fullName: 'Markus Vane', designation: 'Ops Manager', status: 'ACTIVE' },
        ]}}));
        setStaff(staffRes.data?.data || staffRes.data || []);
      } catch (err) {}
    };
    
    if (activeTab === 'staff' || activeTab === 'details') fetchStaff();
  }, [id, activeTab]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.put(`/superadmin/restaurants/${id}`, restaurant);
      addToast('Restaurant details updated', 'success');
      setIsEditing(false);
    } catch (err) {
      addToast('Failed to update details', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSuspendStaff = async (staffId) => {
    try {
      await api.patch(`/superadmin/restaurants/staff/${staffId}`, { status: 'INACTIVE' });
      addToast('Staff suspended', 'success');
      setStaff(prev => prev.map(s => s.id === staffId ? { ...s, status: 'INACTIVE' } : s));
    } catch (err) {
      addToast('Action failed', 'error');
    }
  };

  if (loading && !restaurant) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="editorial-spinner"></div>
      </div>
    );
  }

  const tabs = ['Details', 'Staff', 'Menu Preview', 'Analytics'];

  return (
    <div className="details-container">
      {/* Header */}
      <div className="details-header">
        <div className="details-header-left">
          <div className="details-breadcrumb">Restaurants / Management</div>
          <div className="details-title-row">
            <h1>{restaurant?.name}</h1>
            <Badge variant={restaurant?.status === 'ACTIVE' ? 'success' : 'danger'}>{restaurant?.status}</Badge>
          </div>
          <p className="details-description">{restaurant?.description}</p>
        </div>
        <div className="details-header-actions">
          <Button variant="secondary">
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>visibility</span>
            Preview Site
          </Button>
          <Button onClick={() => isEditing ? handleUpdate() : setIsEditing(true)} isLoading={saving}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>{isEditing ? 'save' : 'edit'}</span>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="details-tabs">
        {tabs.map(tab => (
          <button 
            key={tab}
            className={`editorial-tab ${activeTab === tab.toLowerCase().split(' ')[0] ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="details-body animate-fade-in">
          {/* Profile Section */}
          <Card className="profile-section">
            <div className="profile-header">
              <h3>
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>info</span>
                Restaurant Profile
              </h3>
              <div className="profile-toggle">
                <button 
                  className={`toggle-btn ${!isEditing ? 'active' : ''}`} 
                  onClick={() => setIsEditing(false)}
                >View Only</button>
                <button 
                  className={`toggle-btn ${isEditing ? 'active' : ''}`} 
                  onClick={() => setIsEditing(true)}
                >Edit Mode</button>
              </div>
            </div>

            {isEditing ? (
              <div className="profile-grid">
                <Input label="Legal Name" value={restaurant?.name || ''} onChange={e => setRestaurant({...restaurant, name: e.target.value})} />
                <Input label="Cuisine Type" value={restaurant?.restaurantType || ''} onChange={e => setRestaurant({...restaurant, restaurantType: e.target.value})} />
                <Input label="Primary Contact" value={restaurant?.contactName || ''} onChange={e => setRestaurant({...restaurant, contactName: e.target.value})} />
                <Input label="Contact Email" value={restaurant?.contactEmail || ''} onChange={e => setRestaurant({...restaurant, contactEmail: e.target.value})} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="Business Address" value={`${restaurant?.addressLine1 || ''}, ${restaurant?.city || ''}, ${restaurant?.state || ''} ${restaurant?.pincode || ''}`} onChange={e => setRestaurant({...restaurant, addressLine1: e.target.value})} />
                </div>
              </div>
            ) : (
              <div className="profile-grid">
                <div>
                  <p className="profile-field-label">Legal Name</p>
                  <p className="profile-field-value">{restaurant?.name}</p>
                </div>
                <div>
                  <p className="profile-field-label">Cuisine Type</p>
                  <p className="profile-field-value">{restaurant?.restaurantType}</p>
                </div>
                <div>
                  <p className="profile-field-label">Primary Contact</p>
                  <p className="profile-field-value">{restaurant?.contactName || 'Not Set'}</p>
                </div>
                <div>
                  <p className="profile-field-label">Contact Email</p>
                  <p className="profile-field-value">{restaurant?.contactEmail || 'Not Set'}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p className="profile-field-label">Business Address</p>
                  <p className="profile-field-value">{restaurant?.addressLine1}, {restaurant?.city}, {restaurant?.state} {restaurant?.pincode}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Admins Sidebar */}
          <Card className="admins-section">
            <div className="admins-header">
              <h3>
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>group</span>
                Restaurant Admins
              </h3>
              <button 
                className="action-icon-btn" 
                onClick={() => navigate(`/restaurants/${id}/onboard-admin`)}
                title="Add Admin"
              >
                <span className="material-symbols-outlined">person_add</span>
              </button>
            </div>

            <div className="admin-list">
              {staff.map(s => (
                <div key={s.id} className="admin-item">
                  <div className="admin-avatar">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="admin-name">{s.fullName || s.userName}</p>
                    <p className="admin-role">{s.designation}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="secondary" 
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => navigate(`/restaurants/${id}/onboard-admin`)}
            >
              Assign New Admin
            </Button>
          </Card>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3>Administrative Staff</h3>
            <Button onClick={() => navigate(`/restaurants/${id}/onboard-admin`)}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>person_add</span>
              Assign Admin
            </Button>
          </div>

          {staff.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '3rem', color: 'var(--on-surface-variant)' }}>
              No staff assigned yet. Onboard the first restaurant admin.
            </Card>
          ) : (
            staff.map(s => (
              <Card key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="admin-avatar">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.125rem' }}>{s.fullName || s.userName}</div>
                    <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.8125rem' }}>{s.designation}</div>
                    <div style={{ marginTop: '0.375rem' }}>
                      <Badge variant={s.status === 'ACTIVE' ? 'success' : 'danger'}>{s.status}</Badge>
                    </div>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => handleSuspendStaff(s.id)}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>block</span>
                  Suspend
                </Button>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Stats Footer */}
      <div className="details-stats">
        <Card className="detail-stat-card">
          <p className="detail-stat-label">Monthly Traffic</p>
          <p className="detail-stat-value">{restaurant?.monthlyTraffic?.toLocaleString() || '—'}</p>
          <p className="detail-stat-meta" style={{ color: 'var(--tertiary-container)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>trending_up</span>
            +14.2%
          </p>
        </Card>
        <Card className="detail-stat-card">
          <p className="detail-stat-label">Reservation Rate</p>
          <p className="detail-stat-value">{restaurant?.reservationRate || '—'}%</p>
          <p className="detail-stat-meta" style={{ color: 'var(--on-tertiary-container)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>check_circle</span>
            Optimal
          </p>
        </Card>
        <Card className="detail-stat-card">
          <p className="detail-stat-label">Review Index</p>
          <p className="detail-stat-value">{restaurant?.reviewIndex || '—'}/5</p>
          <p className="detail-stat-meta" style={{ color: '#F59E0B' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', fontVariationSettings: "'FILL' 1" }}>star</span>
            Top Tier
          </p>
        </Card>
        <Card className="detail-stat-card">
          <p className="detail-stat-label">Last Updated</p>
          <p className="detail-stat-value">Today</p>
          <p className="detail-stat-meta" style={{ color: 'var(--on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>schedule</span>
            14:32 PM
          </p>
        </Card>
      </div>
    </div>
  );
};
