'use client';

import { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUI } from '../../components/ui/UIContext';

interface LoginFormProps {
  onLogin?: (token: string, role: string) => void;
}

export default function LoginPage({ onLogin }: LoginFormProps) {
  const { setShowShell, setTitle } = useUI();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowShell(false);
    setTitle('Login');
  }, [setShowShell, setTitle]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (!res.data?.ok) throw new Error(res.data?.error || 'Login failed');

      const role: string = res.data.role;
      const token: string = res.data.token;

      // keep localStorage for existing client-side code compatibility
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
      } catch {
        // ignore storage errors
      }

      // call optional parent handler
      if (onLogin) onLogin(token, role);

      // navigate to role base
      const base = role === 'Trainer' ? '/trainer' : role === 'Manager' ? '/manager' : '/client';
      router.replace(base);
    } catch (err) {
      console.error(err);
      alert('Invalid credentials or server error');
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

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin} disabled={loading}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}
