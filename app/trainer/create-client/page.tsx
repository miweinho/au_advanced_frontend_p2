"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/ui/AuthProvider';
import { Container, Typography, Box, Paper } from '@mui/material';
import Link from 'next/link';
import { Loader2, Save, ArrowLeft } from 'lucide-react';

interface ClientForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CreateClientPage() {
  const router = useRouter();
  const { getUserId } = useAuth();
  const [form, setForm] = useState<ClientForm>({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const trainerId = getUserId() ?? null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      const payload: any = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        accountType: 'Client',
      };
      if (trainerId != null) payload.personalTrainerId = trainerId;

      const res = await api.post('/api/Users', payload);

      // accept any 2xx as success
      if (!(res.status >= 200 && res.status < 300)) {
        throw new Error(`Unexpected response status: ${res.status}`);
      }

      setSuccess(true);
      setForm({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => router.push('/trainer/clients'), 1200);
    } catch (err: any) {
      // prefer backend message if available
      const remote = err?.response?.data;
      if (remote) {
        console.error('Backend error:', remote);
        setError(remote?.title ?? remote?.message ?? JSON.stringify(remote));
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Link href="/trainer" style={{ display: 'inline-flex', alignItems: 'center', color: '#3b82f6', textDecoration: 'none', marginBottom: 8 }}>
          <ArrowLeft size={16} style={{ marginRight: 8 }} /> Back
        </Link>
        <Typography variant="h4">Create Client</Typography>
        <Typography color="text.secondary">Create a client account and assign to you</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {success && <Box sx={{ background: '#d1fae5', p: 2, borderRadius: 1, mb: 2 }}>Client created — redirecting...</Box>}
        {error && <Box sx={{ background: '#fee2e2', p: 2, borderRadius: 1, mb: 2 }}>{error}</Box>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
            <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <input name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} required />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => router.push('/trainer')} style={{ padding: '8px 14px' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ background: '#3b82f6', color: 'white', padding: '8px 14px', border: 'none', borderRadius: 6 }}>
                {loading ? <Loader2 className="spinner" /> : <><Save size={14} style={{ marginRight: 8 }} /> Create</>}
              </button>
            </div>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
