// src/hooks/use-auth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { loginUser, logoutUser, clearError } from '@/store/auth-slice';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      setIsChecking(false);
      
      // If no token and we're on a protected route, redirect to login
      if (!token && window.location.pathname !== '/login' && !window.location.pathname.startsWith('/auth/')) {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Login function
  const login = async (email: string, password: string) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      router.push('/');
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    dispatch(logoutUser());
    router.push('/login');
  };

  // Clear any auth errors
  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    isChecking,
    login,
    logout,
    clearAuthError,
  };
}