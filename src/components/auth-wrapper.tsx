'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/auth';
import { setAccessToken } from '@/lib/api';
import { LoadingScreen } from '@/components/loading';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setIsAuthenticated(!!user);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isChecking) return;

    const publicPaths = ['/auth/signin', '/auth/signup', '/auth/google/callback', '/auth/linkedin/callback'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!isAuthenticated && !isPublicPath) {
      router.push('/auth/signin');
    } else if (isAuthenticated && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
      router.push('/');
    }
  }, [isChecking, isAuthenticated, pathname, router]);

  if (isChecking) {
    return <LoadingScreen message="Loading..." />;
  }

  return <>{children}</>;
}

export async function silentRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}