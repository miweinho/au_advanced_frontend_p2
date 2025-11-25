'use client';

// ...existing code...
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from './auth/login';

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // check existing session from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    if (token && role) {
      // immediate redirect if already logged in
      if (role === "Client") router.push("/client");
      else if (role === "Trainer") router.push("/trainer");
      else if (role === "Manager") router.push("/manager");
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (token: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    console.log(token, role)

    if (role === "Client") router.push("/client");
    else if (role === "Trainer") router.push("/trainer");
    else if (role === "Manager") router.push("/manager");
  };

  if (checking) {
    return <div />; // or a small spinner
  }

  return <LoginPage onLogin={handleLogin} />;
}
// ...existing code...