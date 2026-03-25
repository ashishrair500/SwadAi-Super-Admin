import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../api/axiosInstance';
import './layout.css';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Restaurants', path: '/restaurants', icon: 'storefront' },
    { label: 'Analytics', path: '/analytics', icon: 'insights' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      try {
        navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
      } catch (err) {
        addToast('Search failed', 'error');
      }
    }
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="layout-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-brand">Editorial Admin</span>
          <span className="sidebar-brand-sub">Restaurant Enterprise</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{user?.fullName?.charAt(0) || 'S'}</div>
            <div className="user-info">
              <span className="user-name">{user?.fullName || 'SuperAdmin'}</span>
              <span className="user-role">Restaurant Enterprise</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="layout-main">
        {/* Top Navbar (Glassmorphism) */}
        <header className="layout-header">
          <div className="global-search">
            <span className="material-symbols-outlined search-icon">search</span>
            <input 
              type="text" 
              placeholder="Search enterprise metrics..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <div className="header-actions">
            <button className="header-action-btn">
              <span className="material-symbols-outlined">help_outline</span>
              <span>Support</span>
            </button>
            <button className="header-action-btn" style={{ position: 'relative' }}>
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-dot"></span>
            </button>
            <div className="header-divider"></div>
            <span className="header-brand">The Editorial Enterprise</span>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="page-content animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
