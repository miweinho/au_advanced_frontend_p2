'use client';

import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Container } from '@mui/material';
import { useAuth } from '@/app/ui/AuthProvider';
import { api } from '@/lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call backend directly with skip header so interceptor doesn't interfere
      const response = await api.post(
        '/api/Users/login',
        { email, password },
        { headers: { 'X-Skip-Auth-Handler': '1' } }
      );

      const data = response.data;
      const token = data?.token || data?.jwt || data;
      
      // AuthProvider.login() will:
      // - Store token in localStorage
      // - Parse role from JWT
      // - Navigate based on role
      login(token);
    } catch (err: any) {
      const remote = err?.response?.data;
      setError(remote?.title || remote?.message || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Welcome to AU fitness
        </Typography>

        <Typography variant="h6" gutterBottom>
          Please log in to continue:
        </Typography>

        <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit} disabled={loading}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}
