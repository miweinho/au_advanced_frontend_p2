'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { setAuthToken } from '@/lib/api';
import { api } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
    if (_initial.role) return _initial.role;
    return null;
  });

  const [user, setUser] = useState<unknown | null>(_initial.payload);

  const [userId, setUserId] = useState<number | null>(() =>
    _initial.payload ? extractUserId(_initial.payload) : null
  );

  const writeCookie = (name: string, value?: string | null) => {
    if (typeof document === 'undefined') return;
    const base = '; path=/; SameSite=Lax';
    if (value) {
      document.cookie = `${name}=${encodeURIComponent(value)}${base}`;
    } else {
      document.cookie = `${name}=; Max-Age=0${base}`;
    }
  };

  // guard to avoid redirect loop
  const redirectRef = useRef(false);
  const hasAutoNavigatedRef = useRef(false);

  // make logout stable and available
  const logout = useCallback(() => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    } catch {}
    try {
      writeCookie('token', null);
      writeCookie('role', null);
    } catch {}
    setTokenState(null);
    setUser(null);
    setUserId(null);
    setRole(null);
    setAuthToken(undefined);
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const validatingRef = useRef(false);

  const parseJwt = (token?: string | null) => {
    if (!token) return null;
    try {
      const base = token.split('.')[1];
      const json = decodeURIComponent(
        atob(base.replace(/-/g, '+').replace(/_/g, '/'))
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const isJwtExpired = (token?: string | null) => {
    const payload = parseJwt(token);
    if (!payload) return true;
    const exp = Number(payload.exp || payload.Exp || 0);
    if (!exp) return true;
    return Date.now() / 1000 >= exp;
  };

  // Auto-navigate on mount if token exists (page refresh scenario)
  useEffect(() => {
    if (hasAutoNavigatedRef.current) return;
    if (!token || !role) return;

    hasAutoNavigatedRef.current = true;

    // Only auto-navigate if we're on the root page
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const roleLower = role.toLowerCase();
      if (roleLower.includes('manager')) {
        router.push('/manager');
      } else if (roleLower.includes('trainer') || roleLower.includes('personal')) {
        router.push('/trainer');
      } else if (roleLower.includes('client')) {
        router.push('/client');
      }
    }
  }, [token, role, router]);

  // global axios response interceptor (simplified & guarded)
  useEffect(() => {
    if (!api) return;
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error?.response?.status;
        const cfg = error?.config || {};
        
        // skip handling if request explicitly opted out (login/auth endpoints)
        const skipHeader = cfg.headers?.['X-Skip-Auth-Handler'] || cfg.headers?.['x-skip-auth-handler'];
        if (skipHeader) return Promise.reject(error);
        
        if (status !== 401) return Promise.reject(error);
        if (validatingRef.current) return Promise.reject(error);
        validatingRef.current = true;
        try {
          const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          const expired = isJwtExpired(localToken);
          if (expired) {
            // clear auth
            try { logout(); } catch (e) { console.error(e); }

            // only redirect once and only if we are not already on a safe auth route
            // avoid redirecting when the app is already on '/' (login handled there)
            const safePrefixes = ["/", "/auth", "/login", "/signup"];
            const isSafe = safePrefixes.some((p) => pathname?.startsWith(p));
            if (!isSafe && !redirectRef.current) {
              redirectRef.current = true;
              try { router.replace("/"); } catch {}
              // reset guard after short delay so subsequent real navigations still work
              setTimeout(() => { redirectRef.current = false; }, 1000);
            }
          }
          return Promise.reject(error);
        } finally {
          validatingRef.current = false;
        }
      }
    );
    return () => {
      try { api.interceptors.response.eject(interceptor); } catch {}
    };
  }, [logout, router, pathname]);

  useEffect(() => {
    // ensure axios has the Authorization header set whenever token changes
    if (token) setAuthToken(token);
    else setAuthToken(undefined);
  }, [token]);

  const setToken = (t?: string | null) => {
    if (typeof window === 'undefined') return;

    writeCookie('token', t);

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
    const t = typeof tokenOrObj === 'string' ? tokenOrObj : tokenOrObj.jwt;
    setToken(t ?? null);

    // derive role from token payload or arg
    const payload = decodeJwtPayload(t);
    const finalRole = roleArg || getPayloadRole(payload) || '';
    setRole(finalRole);

    // keep middleware cookies aligned with client state
    writeCookie('role', finalRole || null);

    // AUTO-NAVIGATE based on role
    const roleLower = finalRole.toLowerCase();
    if (roleLower.includes('manager')) {
      router.push('/manager');
    } else if (roleLower.includes('trainer') || roleLower.includes('personal')) {
      router.push('/trainer');
    } else {
      router.push('/client');
    }
  };



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
