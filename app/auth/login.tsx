'use client';

import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

interface LoginFormProps {
  onLogin: (token: string, role: string) => void;
}

export default function LoginPage({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 const handleLogin = async () => {
   try {
    setLoading(true);
     const response = await axios.post(
       "https://assignment2.swafe.dk/api/Users/login",
       { email, password }
     );

      const token: string = response.data.jwt;
      const decoded: any = jwtDecode(token);
      const role: string = decoded.Role;

      // don't handle routing here — bubble token/role up
      onLogin(token, role);
    } catch (err) {
      console.error(err);
      alert("Credenciais inválidas!");
    } finally {
      setLoading(false);
    }
  };



  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Entrar
        </Button>
      </Box>
    </Container>
  );
}
