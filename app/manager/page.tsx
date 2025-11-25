'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, UserPlus, BarChart3, Calendar } from 'lucide-react';

export default function ManagerHome() {
  const [stats, setStats] = useState({ totalPTs: 0, totalClients: 0 });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        const response = await fetch('https://assignment2.swafe.dk/api/Users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const users = await response.json();
          const pts = users.filter((u: any) => u.accountType === 'PersonalTrainer').length;
          const clients = users.filter((u: any) => u.accountType === 'Client').length;
          setStats({ totalPTs: pts, totalClients: clients });
        }
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Manager Dashboard</h1>
          <p style={{ color: '#666', marginTop: '8px' }}>Manage personal trainers and track performance</p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Total PTs</p>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a1a', marginTop: '4px' }}>
                  {loading ? '...' : stats.totalPTs}
                </p>
              </div>
              <Users size={48} color="#3b82f6" />
            </div>
          </div>
          
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Total Clients</p>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a1a', marginTop: '4px' }}>
                  {loading ? '...' : stats.totalClients}
                </p>
              </div>
              <BarChart3 size={48} color="#10b981" />
            </div>
          </div>
          
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Total Users</p>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a1a', marginTop: '4px' }}>
                  {loading ? '...' : stats.totalPTs + stats.totalClients}
                </p>
              </div>
              <Calendar size={48} color="#a855f7" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a', marginBottom: '16px' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <Link 
              href="/manager/create-pt"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '8px', 
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.background = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <UserPlus size={32} color="#3b82f6" style={{ marginRight: '16px' }} />
              <div>
                <h3 style={{ fontWeight: 600, color: '#1a1a1a', margin: 0 }}>Add New PT</h3>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Create a new personal trainer account</p>
              </div>
            </Link>
            
            <Link 
              href="/manager/pt-list"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '8px', 
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.background = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Users size={32} color="#3b82f6" style={{ marginRight: '16px' }} />
              <div>
                <h3 style={{ fontWeight: 600, color: '#1a1a1a', margin: 0 }}>View All PTs</h3>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Manage existing personal trainers</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a', marginBottom: '16px' }}>Recent Activity</h2>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '12px' }}>
              <div>
                <p style={{ fontWeight: 500, color: '#1a1a1a', margin: 0 }}>New PT account created</p>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Personal trainer added to system</p>
              </div>
              <span style={{ fontSize: '14px', color: '#999' }}>Recently</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '12px' }}>
              <div>
                <p style={{ fontWeight: 500, color: '#1a1a1a', margin: 0 }}>Profile updated</p>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>PT information modified</p>
              </div>
              <span style={{ fontSize: '14px', color: '#999' }}>Earlier</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 500, color: '#1a1a1a', margin: 0 }}>System active</p>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>All services running normally</p>
              </div>
              <span style={{ fontSize: '14px', color: '#999' }}>Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
