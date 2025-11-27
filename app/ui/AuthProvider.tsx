'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '@/lib/api';

type AuthContextValue = {
  token?: string | null;
  setToken: (token?: string | null) => void;
  login: (tokenOrObj: string | { jwt?: string }, role?: string) => void;
  logout: () => void;
  role?: string | null;
  user?: unknown;
  userId?: number | null;

  isTrainer: boolean;
  isManager: boolean;

  // helper to get current user id synchronously
  getUserId: () => number | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // helper: decode base64url JWT payload safely in browser
  const decodeJwtPayload = (tok?: string | null): unknown | null => {
    if (!tok) return null;
    try {
      const parts = tok.split('.');
      if (parts.length < 2) return null;
      let b64 = parts[1];
      // base64url -> base64
      b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
      // pad
      while (b64.length % 4) b64 += '=';
      const json =
        typeof window !== 'undefined'
          ? atob(b64)
          : Buffer.from(b64, 'base64').toString();
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const getPayloadRole = (payload: unknown): string | null => {
    if (!payload || typeof payload !== 'object') return null;
    const p = payload as Record<string, unknown>;
    // try common claim names
    const roleVal = (p['Role'] ?? p['role'] ?? p['roles']) as unknown;
    if (typeof roleVal === 'string') return roleVal;
    return null;
  };

  // helper: extract numeric user id from JWT payload
  const extractUserId = (payload: unknown): number | null => {
    if (!payload || typeof payload !== 'object') return null;
    const p = payload as Record<string, unknown>;

    // deine ID liegt als "UserId" im Token; wir erlauben ein paar Varianten
    const raw = p['UserId'] ?? p['userId'] ?? p['userid'];

    if (raw == null) return null;

    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const readStored = () => {
    if (typeof window === 'undefined')
      return {
        token: null as string | null,
        payload: null as unknown | null,
        role: null as string | null,
      };

    const raw = localStorage.getItem('token');
    if (!raw)
      return { token: null, payload: null, role: null };

    try {
      const parsed = JSON.parse(raw);
      const t = parsed?.jwt ?? raw;
      const payload = decodeJwtPayload(t);
      const inferredRole = payload ? getPayloadRole(payload) : null;
      return { token: t ?? null, payload, role: inferredRole };
    } catch {
      const t = raw;
      const payload = decodeJwtPayload(t);
      const inferredRole = payload ? getPayloadRole(payload) : null;
      return { token: t ?? null, payload, role: inferredRole };
    }
  };

  const _initial = readStored();

  const [token, setTokenState] = useState<string | null>(_initial.token);

  const [role, setRole] = useState<string | null>(() => {
    // prefer payload role, fallback to readable cookie
    if (_initial.role) return _initial.role;
    if (typeof window === 'undefined') return null;
    const match = document.cookie.match(/(?:^|; )role=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  });

  const [user, setUser] = useState<unknown | null>(_initial.payload);

  const [userId, setUserId] = useState<number | null>(() =>
    _initial.payload ? extractUserId(_initial.payload) : null
  );

  useEffect(() => {
    // ensure axios has the Authorization header set whenever token changes
    if (token) setAuthToken(token);
    else setAuthToken(undefined);
  }, [token]);

  const setToken = (t?: string | null) => {
    if (typeof window === 'undefined') return;

    if (t) {
      localStorage.setItem('token', t);
      setTokenState(t);
      setAuthToken(t);

      const payload = decodeJwtPayload(t);

      if (payload) {
        setUser(payload);

        const id = extractUserId(payload);
        setUserId(id);

        // persist id for quick sync-read in other places if needed
        if (id != null) {
          localStorage.setItem('userId', String(id));
        } else {
          localStorage.removeItem('userId');
        }
      } else {
        setUser(null);
        setUserId(null);
        localStorage.removeItem('userId');
      }
    } else {
      localStorage.removeItem('token');
      setTokenState(null);
      setAuthToken(undefined);
      setUser(null);
      setUserId(null);
      localStorage.removeItem('userId');
    }
  };

  const getUserId = () => {
    // prefer state, fall back to localStorage for synchronous access
    if (userId != null) return userId;
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('userId');
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const login = (tokenOrObj: string | { jwt?: string }, roleArg?: string) => {
    const t =
      typeof tokenOrObj === 'string' ? tokenOrObj : tokenOrObj.jwt;
    setToken(t ?? null);

    if (roleArg) {
      setRole(roleArg);
    } else if (typeof window !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )role=([^;]+)/);
      if (match) setRole(decodeURIComponent(match[1]));
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    // role cookie will be cleared by the effect watching `role`
    // Note: server-set HttpOnly token cookie can't be removed from client. You may call a logout API route to clear server cookie.
  };

  // reflect `role` changes into a readable cookie for other clients/middleware conveniences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (role) {
      document.cookie = `role=${encodeURIComponent(
        role
      )}; path=/; max-age=${60 * 60 * 24 * 7}`;
    } else {
      document.cookie = 'role=; path=/; max-age=0';
    }
  }, [role]);

  const isTrainer = useMemo(() => {
    // prefer role claim from token payload, fallback to role cookie
    const payloadRole = getPayloadRole(user);
    const r = (payloadRole || role || '').toString().toLowerCase();
    return r.startsWith('personal') || r.startsWith('trainer');
  }, [role, user]);

  const isManager = useMemo(() => {
    const payloadRole = getPayloadRole(user);
    const r = (payloadRole || role || '').toString().toLowerCase();
    return r.startsWith('manager');
  }, [role, user]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        login,
        logout,
        role,
        user,
        userId,
        isTrainer,
        isManager,
        getUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
