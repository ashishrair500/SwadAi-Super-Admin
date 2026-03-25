import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import './dashboard.css';

export const Dashboard = () => {
  const [stats, setStats] = useState({ totalRestaurants: 0, activeRestaurants: 0, newThisMonth: 0 });
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get('/superadmin/restaurants/stats').catch(() => ({ data: { data: { totalRestaurants: 1248, activeRestaurants: 1102, newThisMonth: 312 } } }));
        const popularRes = await api.get('/superadmin/restaurants/popular').catch(() => ({ data: { data: [
          { id: 1, name: 'The Sapphire Room', city: 'New York', rating: 4.9, status: 'ACTIVE', description: 'Michelin-star modern fusion with a focus on seasonal sustainability.', monthlyOrders: 12402, growth: '+14.2%' },
          { id: 2, name: 'Urban Harvest', city: 'London', rating: 4.7, status: 'ACTIVE', description: 'High-volume artisan deli and cafe serving the central business district.', monthlyOrders: 8950, growth: '+6.8%' },
          { id: 3, name: 'Azure Bay Grill', city: 'Sydney', rating: 4.8, status: 'ACTIVE', description: 'Upscale seafood destination known for its coastal-chic atmosphere.', monthlyOrders: 15120, growth: '+21.5%' }
        ] } }));
        
        setStats(statsRes.data?.data || statsRes.data);
        setPopularRestaurants(popularRes.data?.data || popularRes.data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const inactivePending = stats.totalRestaurants - (stats.activeRestaurants || 0);

  // Mock new entries data
  const newEntries = [
    { name: 'Le Bistro Modern', location: 'Paris, France', status: 'ACTIVE' },
    { name: 'Sakura Heights', location: 'Tokyo, JP', status: 'PENDING' },
    { name: 'Trattoria del Sole', location: 'Rome, IT', status: 'ACTIVE' },
    { name: 'Verde Garden', location: 'London, UK', status: 'ACTIVE' },
  ];

  const chartData = [
    { label: 'Mon', height: '40%', value: '12k' },
    { label: 'Tue', height: '65%', value: '18k' },
    { label: 'Wed', height: '85%', value: '24k' },
    { label: 'Thu', height: '55%', value: '15k' },
    { label: 'Fri', height: '75%', value: '21k' },
    { label: 'Sat', height: '95%', value: '29k' },
    { label: 'Sun', height: '60%', value: '17k' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="editorial-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Executive Overview</h1>
          <p>Real-time portfolio performance across global restaurant partners.</p>
        </div>
        <div className="dashboard-header-actions">
          <Button variant="secondary">Download Report</Button>
          <Button onClick={() => navigate('/restaurants/new')}>Add Restaurant</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--secondary-container)', color: 'var(--primary)' }}>
              <span className="material-symbols-outlined">restaurant</span>
            </div>
            <span className="stat-card-change" style={{ color: 'var(--tertiary-container)' }}>+12%</span>
          </div>
          <p className="stat-card-label">Total Restaurants</p>
          <p className="stat-card-value">{stats.totalRestaurants?.toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--tertiary-container)', color: 'var(--on-tertiary-container)' }}>
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <span className="stat-card-change" style={{ color: 'var(--tertiary-container)' }}>+4%</span>
          </div>
          <p className="stat-card-label">Active Units</p>
          <p className="stat-card-value">{stats.activeRestaurants?.toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--error-container)', color: 'var(--error)' }}>
              <span className="material-symbols-outlined">cancel</span>
            </div>
            <span className="stat-card-change" style={{ color: 'var(--error)' }}>-2%</span>
          </div>
          <p className="stat-card-label">Inactive/Pending</p>
          <p className="stat-card-value">{inactivePending.toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--secondary-container)', color: 'var(--primary)' }}>
              <span className="material-symbols-outlined">star</span>
            </div>
            <span className="stat-card-change" style={{ color: 'var(--tertiary-container)' }}>+28%</span>
          </div>
          <p className="stat-card-label">Popular Assets</p>
          <p className="stat-card-value">{stats.newThisMonth?.toLocaleString()}</p>
        </div>
      </div>

      {/* Bento Grid: Chart + New Entries */}
      <div className="dashboard-bento">
        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-header">
            <h3>Revenue & Order Velocity</h3>
            <div className="chart-toggle">
              <button className="chart-toggle-btn active">Weekly</button>
              <button className="chart-toggle-btn">Monthly</button>
            </div>
          </div>
          <div className="chart-bars">
            {chartData.map((bar, i) => (
              <div 
                key={i}
                className="chart-bar"
                style={{ 
                  height: bar.height,
                  background: i === 5 ? 'var(--primary)' : i === 2 ? 'var(--primary-container)' : 'var(--surface-container-high)',
                }}
              >
                <div className="chart-bar-tooltip">{bar.value}</div>
              </div>
            ))}
          </div>
          <div className="chart-labels">
            {chartData.map((bar, i) => (
              <span key={i} className="chart-label">{bar.label}</span>
            ))}
          </div>
        </div>

        {/* New Entries Sidebar */}
        <div className="entries-section">
          <div className="entries-header">
            <h3>New Entries</h3>
            <a href="#" style={{ fontSize: '0.75rem', fontWeight: 700 }}>View All</a>
          </div>
          <div className="entries-list">
            {newEntries.map((entry, i) => (
              <div key={i} className="entry-item">
                <div className="entry-avatar">
                  <span className="material-symbols-outlined">storefront</span>
                </div>
                <div className="entry-info">
                  <p className="entry-name">{entry.name}</p>
                  <p className="entry-location">{entry.location}</p>
                </div>
                <Badge variant={entry.status === 'ACTIVE' ? 'success' : 'warning'}>
                  {entry.status}
                </Badge>
              </div>
            ))}
          </div>
          <div className="onboarding-target">
            <p className="onboarding-label">Onboarding Target</p>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: '75%' }}></div>
            </div>
            <p className="onboarding-value">75% <span>of monthly goal met</span></p>
          </div>
        </div>
      </div>

      {/* Performance Leaders */}
      <div className="leaders-section">
        <div className="leaders-header">
          <h3>Performance Leaders</h3>
          <div className="leaders-nav">
            <button className="leaders-nav-btn">
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>chevron_left</span>
            </button>
            <button className="leaders-nav-btn">
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>chevron_right</span>
            </button>
          </div>
        </div>
        <div className="leaders-grid">
          {popularRestaurants.map((rest, i) => (
            <div key={rest.id} className="leader-card" onClick={() => navigate(`/restaurants/${rest.id}`)}>
              <div className="leader-image">
                <div className="leader-image-placeholder">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
                {i === 0 && <div className="leader-tag">TOP PERFORMER</div>}
              </div>
              <div className="leader-body">
                <div className="leader-title-row">
                  <h4>{rest.name}</h4>
                  <div className="leader-rating">
                    <span className="material-symbols-outlined">star</span>
                    <span>{rest.rating}</span>
                  </div>
                </div>
                <p className="leader-desc">{rest.description}</p>
                <div className="leader-stats">
                  <div>
                    <p className="leader-stat-label">Monthly Orders</p>
                    <p className="leader-stat-value">{rest.monthlyOrders?.toLocaleString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="leader-stat-label">Growth</p>
                    <p className="leader-stat-growth">{rest.growth}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
