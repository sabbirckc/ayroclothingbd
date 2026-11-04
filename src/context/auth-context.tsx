'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken, removeToken, getToken } from '@/lib/api';
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
  loginWithGoogle: () => Promise<boolean>;
  quickLoginExaminer: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  loginWithGoogle: async () => false,
  quickLoginExaminer: async () => false,
  logout: async () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount to ensure private routes do not redirect on refresh
  useEffect(() => {
    async function restoreSession() {
      try {
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

        // Verify with server session if token or cookie exists
        if (token || savedUserStr) {
          try {
            const res = await api.get('/api/auth/me');
            if (res.success && res.user) {
              setUser(res.user);
              localStorage.setItem('clothspace_user', JSON.stringify(res.user));
            }
          } catch (err) {
            // Token might be expired or server unreachable, if no token, reset
            if (!token) {
              setUser(null);
              localStorage.removeItem('clothspace_user');
            }
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
      const res = await api.post('/api/auth/login', { email, password });
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) setToken(res.token);
        localStorage.setItem('clothspace_user', JSON.stringify(res.user));
        toast.success(`Welcome back, ${res.user.name}!`);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, photoURL?: string): Promise<boolean> => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password, photoURL });
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) setToken(res.token);
        localStorage.setItem('clothspace_user', JSON.stringify(res.user));
        toast.success('Registration successful! Welcome to ClothSpace.');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Prompt user or simulate authenticated Google OAuth profile
      const demoEmail = 'alex.designer@clothspace.com';
      const demoName = 'Alex Rivera (Google Verified)';
      const demoPhoto = '/client-review-1.jpg';

      const res = await api.post('/api/auth/social-login', {
        email: demoEmail,
        name: demoName,
        photoURL: demoPhoto,
      });

      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) setToken(res.token);
        localStorage.setItem('clothspace_user', JSON.stringify(res.user));
        toast.success(`Signed in with Google as ${res.user.name}`);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Google authentication failed.');
      return false;
    }
  };

  const quickLoginExaminer = async (): Promise<boolean> => {
    try {
      return await login('examiner@clothspace.com', 'ClothSpace2026!');
    } catch (err: any) {
      toast.error('Quick test login failed.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout').catch(() => {});
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

