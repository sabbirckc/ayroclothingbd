'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken, removeToken, getToken } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, photoURL?: string) => Promise<boolean>;
  loginWithGoogle: (callbackUrl?: string) => Promise<boolean>;
  quickLoginExaminer: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
}

interface BetterAuthPayload {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  session?: {
    id?: string;
    token?: string;
  };
  token?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  loginWithGoogle: async () => false,
  quickLoginExaminer: async () => false,
  logout: async () => { },
  updateUser: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('clothspace_user');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Reactive Better-Auth session hook
  const session = authClient.useSession();

  // Sync Better-Auth session reactively (e.g. after Google OAuth redirect)
  useEffect(() => {
    if (session.data?.user) {
      const baUser = session.data.user;
      const userObj: User = {
        id: baUser.id,
        name: baUser.name,
        email: baUser.email,
        photoURL: baUser.image || '/client-review-1.jpg',
        role: 'designer',
      };

      const sessionPayload = session.data as unknown as BetterAuthPayload;
      const authToken =
      sessionPayload?.session?.token ||
        sessionPayload?.token ||
        sessionPayload?.session?.id;

      if (authToken) {
        setToken(authToken);
      }

      fetch('/api/auth/token')
        .then((r) => r.json())
        .then((data) => {
          if (data?.token) setToken(data.token);
        })
        .catch(() => { });

      localStorage.setItem('clothspace_user', JSON.stringify(userObj));

      // Asynchronous state synchronization to avoid cascading renders
      queueMicrotask(() => {
        setUser((prev) => {
          if (prev?.id === userObj.id && prev?.email === userObj.email) return prev;
          return userObj;
        });
        setLoading(false);
      });
    }
  }, [session.data]);

  // Restore session on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        // 1. Fetch Better-Auth token & user from same-origin route
        try {
          const tokenRes = await fetch('/api/auth/token').then((r) => r.json());
          if (tokenRes?.token) {
            setToken(tokenRes.token);
            if (tokenRes.user) {
              const userObj: User = {
                id: tokenRes.user.id,
                name: tokenRes.user.name,
                email: tokenRes.user.email,
                photoURL: tokenRes.user.image || '/client-review-1.jpg',
                role: 'designer',
              };
              setUser(userObj);
              localStorage.setItem('clothspace_user', JSON.stringify(userObj));
              setLoading(false);
              return;
            }
          }
        } catch (tokenErr) {
          console.warn('Same-origin token fetch:', tokenErr);
        }

        // 2. Check authClient.getSession()
        try {
          const sessionRes = await authClient.getSession();
          if (sessionRes?.data?.user) {
            const baUser = sessionRes.data.user;
            const userObj: User = {
              id: baUser.id,
              name: baUser.name,
              email: baUser.email,
              photoURL: baUser.image || '/client-review-1.jpg',
              role: 'designer',
            };
            setUser(userObj);
            const sessionPayload = sessionRes.data as unknown as BetterAuthPayload;
            const authToken =
            sessionPayload?.session?.token ||
              sessionPayload?.token ||
              sessionPayload?.session?.id;
            if (authToken) {
              setToken(authToken);
            }
            localStorage.setItem('clothspace_user', JSON.stringify(userObj));
            setLoading(false);
            return;
          }
        } catch (baErr) {
          console.warn('Better-Auth getSession check:', baErr);
        }

        // 3. Fallback to cached token/session verification with backend
        const savedUserStr = localStorage.getItem('clothspace_user');
        const token = getToken();

        if (savedUserStr) {
          try {
            const parsed = JSON.parse(savedUserStr);
            setUser(parsed);
          } catch (e) {
            console.error('Failed to parse cached user:', e);
          }
        }

        if (token || savedUserStr) {
          try {
            const res = await api.get('/api/auth/me');
            if (res.success && res.user) {
              setUser(res.user);
              localStorage.setItem('clothspace_user', JSON.stringify(res.user));
            }
          } catch {
            // Keep state intact
          }
        }
      } catch (err) {
        console.warn('Session restoration failed:', err);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 1. Try Better-Auth email sign-in first
      try {
        const res = await authClient.signIn.email({
          email: email.trim().toLowerCase(),
          password,
        });

        if (res && !res.error && res.data?.user) {
          const baUser = res.data.user;
          const userObj: User = {
            id: baUser.id,
            name: baUser.name,
            email: baUser.email,
            photoURL: baUser.image || '/client-review-1.jpg',
            role: 'designer',
          };
          setUser(userObj);
          const dataPayload = res.data as unknown as BetterAuthPayload;
          const authToken =
          dataPayload?.token ||
            dataPayload?.session?.token ||
            dataPayload?.session?.id;
          if (authToken) {
            setToken(authToken);
          } else {
            fetch('/api/auth/token')
              .then((r) => r.json())
              .then((d) => {
                if (d?.token) setToken(d.token);
              })
              .catch(() => { });
          }
          localStorage.setItem('clothspace_user', JSON.stringify(userObj));
          toast.success(`Welcome back, ${userObj.name}!`);
          return true;
        }
      } catch {
        // Fallback to backend API
      }

      // 2. Fallback to backend /api/auth/login
      const res = await api.post('/api/auth/login', { email, password });
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) setToken(res.token);
        localStorage.setItem('clothspace_user', JSON.stringify(res.user));
        toast.success(`Welcome back, ${res.user.name}!`);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      toast.error(message);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    photoURL?: string
  ): Promise<boolean> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const defaultPhoto = photoURL || '/client-review-1.jpg';

      // 1. Try Better-Auth email sign-up
      try {
        const res = await authClient.signUp.email({
          name: name.trim(),
          email: normalizedEmail,
          password,
          image: defaultPhoto,
        });

        if (res && !res.error && res.data?.user) {
          const baUser = res.data.user;
          const userObj: User = {
            id: baUser.id,
            name: baUser.name,
            email: baUser.email,
            photoURL: baUser.image || defaultPhoto,
            role: 'designer',
          };
          setUser(userObj);
          const dataPayload = res.data as unknown as BetterAuthPayload;
          const authToken =
          dataPayload?.token ||
            dataPayload?.session?.token ||
            dataPayload?.session?.id;
          if (authToken) {
            setToken(authToken);
          } else {
            fetch('/api/auth/token')
              .then((r) => r.json())
              .then((d) => {
                if (d?.token) setToken(d.token);
              })
              .catch(() => { });
          }
          localStorage.setItem('clothspace_user', JSON.stringify(userObj));

          // Also notify backend registration so legacy collections stay in sync
          await api.post('/api/auth/register', {
            name: name.trim(),
            email: normalizedEmail,
            password,
            photoURL: defaultPhoto,
          }).catch(() => { });

          toast.success('Registration successful! Welcome to ClothSpace.');
          return true;
        }
      } catch {
        // Continue to server fallback
      }

      // 2. Fallback to backend /api/auth/register
      const res = await api.post('/api/auth/register', {
        name,
        email: normalizedEmail,
        password,
        photoURL: defaultPhoto,
      });

      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) setToken(res.token);
        localStorage.setItem('clothspace_user', JSON.stringify(res.user));
        toast.success('Registration successful! Welcome to ClothSpace.');
        return true;
      }
      return false;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      toast.error(message);
      return false;
    }
  };

  const loginWithGoogle = async (callbackUrl: string = '/'): Promise<boolean> => {
    try {
      const origin =
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const cleanCallback = callbackUrl.startsWith('http')
        ? callbackUrl
        : `${origin}${callbackUrl.startsWith('/') ? callbackUrl : `/${callbackUrl}`}`;

    await authClient.signIn.social({
      provider: 'google',
      callbackURL: cleanCallback,
    });
    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Google authentication failed.';
    toast.error(message);
    return false;
  }
};

const quickLoginExaminer = async (): Promise<boolean> => {
  try {
    return await login('examiner@clothspace.com', 'ClothSpace2026!');
  } catch {
    toast.error('Quick test login failed.');
    return false;
  }
};

    const logout = async () => {
      try {
        try {
          await authClient.signOut();
        } catch (baSignOutErr) {
          console.warn('Better-Auth signOut error:', baSignOutErr);
        }
        await api.post('/api/auth/logout').catch(() => { });
      } finally {
        setUser(null);
        removeToken();
        toast.success('You have been signed out.');
      }
};

const updateUser = (updated: Partial<User>) => {
  if (user) {
    const next = { ...user, ...updated };
    setUser(next);
    localStorage.setItem('clothspace_user', JSON.stringify(next));
  }
};

return (
  <AuthContext.Provider
    value={{
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      quickLoginExaminer,
      logout,
      updateUser,
    }}
  >
    {children}
  </AuthContext.Provider>
);
}

export function useAuth() {
  return useContext(AuthContext);
}
