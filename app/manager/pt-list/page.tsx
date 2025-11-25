'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Mail, Edit, Trash2, Loader2, UserPlus, User } from 'lucide-react';

interface User {
  id: number;
  name: string;
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
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
      const token = localStorage.getItem('authToken');
      
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
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/manager"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Personal Trainers</h1>
              <p className="text-gray-600 mt-2">Manage your team of personal trainers</p>
            </div>
            <Link
              href="/manager/create-pt"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Add New PT
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-4 text-red-600 hover:text-red-800 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Showing {filteredUsers.length} of {users.length} personal trainers
              </p>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No personal trainers match your search' : 'No personal trainers found'}
                </p>
                {!searchTerm && (
                  <Link
                    href="/manager/create-pt"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add Your First PT
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {user.name}
                            </h3>
                            <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              ID: {user.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start text-gray-600">
                          <Mail className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm break-all">{user.email}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Account Type</p>
                          <p className="text-sm font-medium text-gray-900">{user.accountType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Trainer ID</p>
                          <p className="text-sm font-medium text-gray-900">{user.personalTrainerId}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
                      <Link
                        href={`/manager/edit-pt/${user.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deleteId === user.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteId === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
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