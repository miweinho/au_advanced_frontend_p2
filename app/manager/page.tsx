'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, UserPlus, BarChart3, Calendar } from 'lucide-react';

export default function ManagerHome() {
  const [stats, setStats] = useState({ totalPTs: 0, totalClients: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage personal trainers and track performance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total PTs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : stats.totalPTs}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : stats.totalClients}
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : stats.totalPTs + stats.totalClients}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/manager/create-pt"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <UserPlus className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Add New PT</h3>
                <p className="text-sm text-gray-600">Create a new personal trainer account</p>
              </div>
            </Link>
            
            <Link 
              href="/manager/pt-list"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <Users className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">View All PTs</h3>
                <p className="text-sm text-gray-600">Manage existing personal trainers</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium text-gray-900">New PT account created</p>
                <p className="text-sm text-gray-600">Personal trainer added to system</p>
              </div>
              <span className="text-sm text-gray-500">Recently</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium text-gray-900">Profile updated</p>
                <p className="text-sm text-gray-600">PT information modified</p>
              </div>
              <span className="text-sm text-gray-500">Earlier</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">System active</p>
                <p className="text-sm text-gray-600">All services running normally</p>
              </div>
              <span className="text-sm text-gray-500">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
