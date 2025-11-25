'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface PTFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: string;
  personalTrainerId: number;
}

export default function CreatePT() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState<PTFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'PersonalTrainer',
    personalTrainerId: 0
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'personalTrainerId') {
        return { ...prev, personalTrainerId: parseInt(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        throw new Error('You must be logged in to create a PT');
      }

      const { confirmPassword, ...apiData } = formData;

      const response = await fetch('https://assignment2.swafe.dk/api/Users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        console.error('Status:', response.status);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `Error ${response.status}: ${errorText}`);
        } catch {
          throw new Error(`Error ${response.status}: ${errorText || 'Failed to create PT'}`);
        }
      }

      setSuccess(true);
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: 'PersonalTrainer',
        personalTrainerId: 0
      });
      
      setTimeout(() => {
        router.push('/manager/pt-list');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '8px'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link 
            href="/manager"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              color: '#3b82f6', 
              textDecoration: 'none',
              marginBottom: '16px'
            }}
          >
            <ArrowLeft size={16} style={{ marginRight: '8px' }} />
            Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Add New Personal Trainer</h1>
          <p style={{ color: '#666', marginTop: '8px' }}>Fill in the details to create a new PT account</p>
        </div>

        {success && (
          <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', color: '#047857', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            PT created successfully! Redirecting to PT list...
          </div>
        )}

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="firstName" style={labelStyle}>First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="John"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="lastName" style={labelStyle}>Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Smith"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john.smith@fitness.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="password" style={labelStyle}>Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Re-enter password"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="accountType" style={labelStyle}>Account Type *</label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
                disabled
                style={{ ...inputStyle, background: '#f9fafb', color: '#6b7280' }}
              >
                <option value="PersonalTrainer">Personal Trainer</option>
              </select>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Account type is set to Personal Trainer</p>
            </div>

            <div>
              <label htmlFor="personalTrainerId" style={labelStyle}>Personal Trainer ID</label>
              <input
                type="number"
                id="personalTrainerId"
                name="personalTrainerId"
                value={formData.personalTrainerId}
                onChange={handleChange}
                min="0"
                placeholder="0"
                style={inputStyle}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Leave as 0 for personal trainers</p>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Link
              href="/manager"
              style={{
                padding: '10px 24px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                color: '#374151',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 24px',
                background: loading ? '#93c5fd' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create PT
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}