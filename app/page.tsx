'use client';

import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

 const handleLogin = async () => {
   try {
     const response = await axios.post(
       "https://assignment2.swafe.dk/api/Users/login",
       { email, password }
     );

     const token = response.data.jwt;

     const decoded: any = jwtDecode(token);
     console.log("JWT DECODED:", decoded);

     const role = decoded.Role;  // <- "Client", "Trainer", "Manager"

     localStorage.setItem("token", token);
     localStorage.setItem("role", role);

     if (role === "Client") {
       router.push("/client");
     } else if (role === "Trainer") {
       router.push("/trainer");
     } else if (role === "Manager") {
       router.push("/manager");
     }

   } catch (err) {
     console.error(err);
     alert("Credenciais inválidas!");
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
