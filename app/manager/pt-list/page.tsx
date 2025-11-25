'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Mail, Edit, Trash2, Loader2, UserPlus, User } from 'lucide-react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  personalTrainerId: number;
}

export default function PTList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        throw new Error('You must be logged in to view PTs');
      }

      const response = await fetch('https://assignment2.swafe.dk/api/Users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      const trainers = data.filter((user: User) => user.accountType === 'PersonalTrainer');
      setUsers(trainers);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this personal trainer?')) {
      return;
    }

    setDeleteId(id);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        throw new Error('You must be logged in to delete a PT');
      }

      const response = await fetch(`https://assignment2.swafe.dk/api/Users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete trainer');
      }

      setUsers(users.filter(user => user.id !== id));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete trainer');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Personal Trainers</h1>
              <p style={{ color: '#666', marginTop: '8px' }}>Manage your team of personal trainers</p>
            </div>
            <Link
              href="/manager/create-pt"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#3b82f6',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              <UserPlus size={20} />
              Add New PT
            </Link>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              style={{ background: 'none', border: 'none', color: '#b91c1c', fontWeight: 600, cursor: 'pointer' }}
            >
              Dismiss
            </button>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '16px', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '16px',
                paddingTop: '12px',
                paddingBottom: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px' }}>
            <Loader2 size={32} color="#3b82f6" className="spinner" />
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: '#666' }}>
                Showing {filteredUsers.length} of {users.length} personal trainers
              </p>
            </div>

            {filteredUsers.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '48px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '18px' }}>
                  {searchTerm ? 'No personal trainers match your search' : 'No personal trainers found'}
                </p>
                {!searchTerm && (
                  <Link
                    href="/manager/create-pt"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '16px',
                      padding: '12px 20px',
                      background: '#3b82f6',
                      color: 'white',
                      borderRadius: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <UserPlus size={20} />
                    Add Your First PT
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {filteredUsers.map((user) => (
                  <div key={user.id} style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={24} color="#3b82f6" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                            {user.firstName} {user.lastName}
                          </h3>
                          <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 8px', background: '#dbeafe', color: '#1e40af', fontSize: '12px', borderRadius: '12px' }}>
                            ID: {user.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '20px' }}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', color: '#6b7280', marginBottom: '8px' }}>
                          <Mail size={16} style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ fontSize: '14px', wordBreak: 'break-all' }}>{user.email}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Account Type</p>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', margin: 0 }}>{user.accountType}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Trainer ID</p>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', margin: 0 }}>{user.personalTrainerId}</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '16px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
                      <Link
                        href={`/manager/edit-pt/${user.id}`}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          background: 'white',
                          border: '1px solid #d1d5db',
                          color: '#374151',
                          borderRadius: '6px',
                          textDecoration: 'none'
                        }}
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deleteId === user.id}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          background: '#fee2e2',
                          border: '1px solid #fca5a5',
                          color: '#b91c1c',
                          borderRadius: '6px',
                          cursor: deleteId === user.id ? 'not-allowed' : 'pointer',
                          opacity: deleteId === user.id ? 0.5 : 1
                        }}
                      >
                        {deleteId === user.id ? (
                          <Loader2 size={16} className="spinner" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}