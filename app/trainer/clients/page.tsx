"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/app/ui/AuthProvider';
import Link from 'next/link';
import { Container, Typography, Box, Paper, InputBase } from '@mui/material';
import { Search, Loader2, User } from 'lucide-react';

interface UserItem {
  // API returns `userId` in UserDto
  userId: number;
  // keep `id` as optional alias for older code compatibility
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  personalTrainerId?: number;
}

export default function ClientListPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        // Use the trainer-specific endpoint that returns clients for the logged-in trainer
        const res = await api.get('/api/Users/Clients');
        const data = res.data || [];
        if (!cancelled) setClients(data as UserItem[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load clients');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user]);

  const filtered = clients.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4">Clients</Typography>
          <Typography color="text.secondary">Clients assigned to you</Typography>
        </div>
        <Link href="/trainer/create-client" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#3b82f6', color: 'white', padding: '10px 16px', borderRadius: 6, border: 'none' }}>Create Client</button>
        </Link>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <InputBase placeholder="Search by name or email" sx={{ pl: '40px', width: '100%' }} value={search} onChange={(e) => setSearch(e.target.value)} />
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><Loader2 className="spinner" /></Box>
      ) : error ? (
        <Box sx={{ background: '#fee2e2', p: 2, borderRadius: 1 }}>{error}</Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 3 }}>
          {filtered.map(c => (
            <Box key={c.userId}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: '#e6f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User />
                  </Box>
                  <div style={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>{c.firstName} {c.lastName}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>{c.email}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>ID: {c.userId}</Typography>
                  </div>
                </Box>
              </Paper>
            </Box>
          ))}

          {filtered.length === 0 && (
            <Box>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No clients found.</Typography>
              </Paper>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}
