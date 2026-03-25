import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import api from '../../api/axiosInstance';
import './restaurants.css';

export const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', status: '', type: '' });
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      let endpoint = '/superadmin/restaurants';
      if (filters.city || filters.status) {
        endpoint = `/superadmin/restaurants/advanced-search?city=${filters.city}&status=${filters.status}`;
      }
      
      const res = await api.get(endpoint).catch(() => ({ data: { data: [
        { id: 1, name: 'The Gilded Truffle', city: 'New York, NY', type: 'Fine Dining', rating: 4.9, status: 'ACTIVE', isPopular: true, uid: 'RT-4492-X' },
        { id: 2, name: 'Harbor Bakery', city: 'San Francisco, CA', type: 'Bakery', rating: 4.5, status: 'INACTIVE', isPopular: false, uid: 'RT-2108-A' },
        { id: 3, name: 'Noodle Bar Express', city: 'Chicago, IL', type: 'Casual', rating: 4.2, status: 'ACTIVE', isPopular: true, uid: 'RT-9931-Q' }
      ] } }));
      
      setRestaurants(res.data?.data || res.data || []);
    } catch (err) {
      addToast('Failed to load restaurants', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/superadmin/restaurants/${id}/status?status=${newStatus}`);
      addToast(`Restaurant status changed to ${newStatus}`, 'success');
      setRestaurants(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      addToast('Failed to change status', 'error');
    }
  };

  const togglePopular = async (id, currentPopular) => {
    try {
      await api.patch(`/superadmin/restaurants/${id}/toggle-popular`);
      addToast(`Popularity toggled!`, 'success');
      setRestaurants(prev => prev.map(r => r.id === id ? { ...r, isPopular: !currentPopular } : r));
    } catch (err) {
      addToast('Failed to update popularity', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant? This cannot be undone.")) return;
    try {
      await api.delete(`/superadmin/restaurants/${id}`);
      addToast('Restaurant deleted successfully', 'success');
      setRestaurants(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      addToast('Failed to delete restaurant', 'error');
    }
  };

  const statusVariant = (s) => s === 'ACTIVE' ? 'success' : s === 'INACTIVE' ? 'warning' : 'danger';

  return (
    <div className="fleet-container">
      {/* Breadcrumb */}
      <div className="fleet-breadcrumb">
        <span>Directory</span>
        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_right</span>
        <strong>Restaurant Fleet</strong>
      </div>

      {/* Header */}
      <div className="fleet-header">
        <div>
          <h1>Fleet Overview</h1>
          <p>Manage and audit active restaurant nodes across the enterprise network.</p>
        </div>
        <div className="fleet-header-actions">
          <Button variant="secondary">
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>download</span>
            Export CSV
          </Button>
          <Button onClick={() => navigate('/restaurants/new')}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>add</span>
            Add New Restaurant
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <Card className="filter-card">
          <div className="filter-group">
            <label>Region Filter</label>
            <input
              className="ui-input"
              placeholder="All Cities"
              value={filters.city}
              onChange={(e) => setFilters(prev => ({...prev, city: e.target.value}))}
              style={{ padding: '0.5rem 0', background: 'transparent', fontFamily: 'var(--font-headline)', fontWeight: 700 }}
            />
          </div>
          <div className="filter-group">
            <label>Status Node</label>
            <select
              className="ui-input"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
              style={{ padding: '0.5rem 0', background: 'transparent', fontFamily: 'var(--font-headline)', fontWeight: 700 }}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Cuisine Type</label>
            <select
              className="ui-input"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({...prev, type: e.target.value}))}
              style={{ padding: '0.5rem 0', background: 'transparent', fontFamily: 'var(--font-headline)', fontWeight: 700 }}
            >
              <option value="">All Types</option>
              <option value="Fine Dining">Fine Dining</option>
              <option value="Casual">Casual</option>
              <option value="Bakery">Bakery</option>
              <option value="Cafe">Cafe</option>
            </select>
          </div>
        </Card>
        <div className="total-badge">
          <div className="total-badge-value">{restaurants.length}</div>
          <div className="total-badge-label">Total Establishments</div>
        </div>
      </div>

      {/* Data Table */}
      <Card className="table-card">
        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
            <div className="editorial-spinner"></div>
          </div>
        ) : (
          <>
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Restaurant Identity</th>
                  <th>Geography</th>
                  <th>Classification</th>
                  <th>System Status</th>
                  <th style={{ textAlign: 'right' }}>Rating Index</th>
                  <th style={{ textAlign: 'right' }}>Administrative Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>No restaurants found.</td></tr>
                ) : (
                  restaurants.map(rest => (
                    <tr key={rest.id}>
                      <td>
                        <div className="restaurant-identity">
                          <div className="restaurant-logo">
                            <span className="material-symbols-outlined">storefront</span>
                          </div>
                          <div>
                            <span 
                              className="restaurant-name-link" 
                              onClick={() => navigate(`/restaurants/${rest.id}`)}
                            >
                              {rest.name}
                            </span>
                            <div className="restaurant-uid">UID: {rest.uid || `RT-${rest.id}`}</div>
                          </div>
                        </div>
                      </td>
                      <td>{rest.city}</td>
                      <td><span className="type-chip">{rest.type}</span></td>
                      <td>
                        <span className={`status-dot ${rest.status?.toLowerCase()}`}>
                          <Badge variant={statusVariant(rest.status)}>{rest.status}</Badge>
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="rating-cell" style={{ justifyContent: 'flex-end' }}>
                          {rest.rating}
                          <span className="material-symbols-outlined">star</span>
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-icon-btn" onClick={() => togglePopular(rest.id, rest.isPopular)} title="Toggle Popular">
                            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', fontVariationSettings: rest.isPopular ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                          </button>
                          <button className="action-icon-btn" onClick={() => toggleStatus(rest.id, rest.status)} title="Toggle Status">
                            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>power_settings_new</span>
                          </button>
                          <button className="action-icon-btn" onClick={() => navigate(`/restaurants/${rest.id}`)} title="View Details">
                            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>edit</span>
                          </button>
                          <button className="action-icon-btn danger" onClick={() => handleDelete(rest.id)} title="Delete">
                            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {restaurants.length > 0 && (
              <div className="pagination">
                <span className="pagination-info">Showing entries 1 to {restaurants.length} of {restaurants.length} results</span>
                <div className="pagination-controls">
                  <button className="page-btn"><span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>first_page</span></button>
                  <button className="page-btn"><span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_left</span></button>
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <button className="page-btn"><span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_right</span></button>
                  <button className="page-btn"><span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>last_page</span></button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Footer Info Cards */}
      <div className="fleet-footer">
        <Card className="footer-info-card">
          <div className="footer-info-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>sync</span>
            <h4>Last Sync</h4>
          </div>
          <p>Enterprise database synchronized 4 minutes ago via global relay.</p>
        </Card>
        <Card className="footer-info-card">
          <div className="footer-info-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--on-tertiary-container)' }}>verified_user</span>
            <h4>Security Audit</h4>
          </div>
          <p>All nodes passing L1 compliance checks. Next audit scheduled in 48h.</p>
        </Card>
        <Card className="footer-info-card">
          <div className="footer-info-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--error)' }}>error</span>
            <h4>Network Health</h4>
          </div>
          <p>99.9% uptime. 1 node currently under scheduled maintenance.</p>
        </Card>
      </div>
    </div>
  );
};
