import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../contexts/ToastContext';
import api from '../../api/axiosInstance';
import './restaurants.css';

const STEPS = [
  { num: 1, label: 'Basic Info' },
  { num: 2, label: 'Address & Location' },
  { num: 3, label: 'Metadata' },
  { num: 4, label: 'Admin Setup' },
];

export const RestaurantWizard = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    restaurantType: 'Fine Dining',
    cuisineFocus: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/superadmin/restaurants', formData);
      const newId = data?.data?.id || data?.id || 123;
      addToast('Restaurant successfully created', 'success');
      navigate(`/restaurants/${newId}/onboard-admin`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create restaurant', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wizard-container">
      {/* Top Bar */}
      <div className="wizard-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => navigate('/restaurants')}
            className="action-icon-btn"
            style={{ width: '36px', height: '36px' }}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1>Add New Restaurant</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="action-icon-btn" title="Wizard Guide">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.875rem' }}>SuperAdmin</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>Editorial Enterprise</div>
          </div>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '50%', 
            background: 'var(--primary)', color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.8125rem'
          }}>SA</div>
        </div>
      </div>

      {/* Stepper */}
      <div className="wizard-stepper">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.num}>
            <div className="step-item">
              <div className={`step-circle ${step === s.num ? 'active' : step > s.num ? 'completed' : 'pending'}`}>
                {step > s.num ? (
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>check</span>
                ) : s.num}
              </div>
              <span className={`step-label ${step === s.num ? 'active' : ''}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-connector ${step > s.num ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Body (two-column: form + sidebar) */}
      <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
        <div className="wizard-body">
          {/* Form Section */}
          <div className="wizard-form-section">
            {step === 1 && (
              <Card style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2>Restaurant Identity</h2>
                    <p>Define the core presence of your establishment.</p>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: 'var(--outline-variant)', fontSize: '1.5rem' }}>store</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <Input label="Restaurant Name" name="name" placeholder="e.g., L'Etoile Gastronomique" value={formData.name} onChange={handleChange} required />
                  
                  <div className="wizard-form-grid">
                    <div className="ui-input-wrapper">
                      <label className="ui-label">Establishment Type</label>
                      <select name="restaurantType" value={formData.restaurantType} onChange={handleChange} className="ui-input" required>
                        <option value="Fine Dining">Fine Dining</option>
                        <option value="Casual Dining">Casual Dining</option>
                        <option value="Cafe">Cafe</option>
                        <option value="Fast Food">Fast Food</option>
                        <option value="Cloud Kitchen">Cloud Kitchen</option>
                      </select>
                    </div>
                    <Input label="Cuisine Focus" name="cuisineFocus" placeholder="e.g., Modern French" value={formData.cuisineFocus} onChange={handleChange} />
                  </div>

                  <Input label="Brand Description" name="description" placeholder="Describe the restaurant's editorial narrative and dining experience..." value={formData.description} onChange={handleChange} required />
                </div>
              </Card>
            )}

            {step === 2 && (
              <Card style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>location_on</span>
                  <h2 style={{ margin: 0 }}>Location Integrity</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <Input label="Full Professional Address" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required />
                  <Input label="Address Line 2 (Optional)" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                    <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
                    <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input label="Latitude" name="latitude" icon="explore" type="number" step="any" value={formData.latitude} onChange={handleChange} />
                    <Input label="Longitude" name="longitude" icon="explore" type="number" step="any" value={formData.longitude} onChange={handleChange} />
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="wizard-sidebar">
            <div className="wizard-preview">
              <h3>
                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>image</span>
                Editorial Preview
              </h3>
              <div className="wizard-preview-upload">
                <span className="material-symbols-outlined">add_a_photo</span>
                <p>Upload Hero Image</p>
                <small>RECOMMENDED: 2400 x 1600 PX</small>
              </div>
              <div className="wizard-preview-meta">
                <span>Status</span>
                <Badge variant="warning">DRAFT</Badge>
              </div>
              <div className="wizard-preview-meta" style={{ marginTop: '0.5rem' }}>
                <span>Visibility</span>
                <span style={{ fontWeight: 700 }}>Enterprise Internal</span>
              </div>
            </div>

            <div className="wizard-tip">
              <h4>💡 Architect's Tip</h4>
              <p>The "Description" field is crucial for the automated SEO generation. Ensure you capture the unique atmosphere and signature dishes. Lat/Long coordinates will be verified against our global database in the next step.</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="wizard-footer">
          <button 
            type="button" 
            onClick={() => navigate('/restaurants')} 
            className="ui-button ui-button-ghost ui-button-md"
            style={{ gap: '0.375rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>close</span>
            Cancel & Exit
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {step > 1 && (
              <Button type="button" variant="secondary" onClick={prevStep}>Previous</Button>
            )}
            <Button type="button" variant="secondary">Save as Draft</Button>
            {step < 2 ? (
              <Button type="submit">
                Next: Location Details
                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>chevron_right</span>
              </Button>
            ) : (
              <Button type="submit" isLoading={loading}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>check</span>
                Create Restaurant
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
