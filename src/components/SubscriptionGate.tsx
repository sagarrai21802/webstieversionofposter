'use client';

import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { subscriptionService } from '@/lib/subscription';
import { LoadingSpinner } from './loading';

interface SubscriptionGateProps {
  children: ReactNode;
}

export function SubscriptionGate({ children }: SubscriptionGateProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const status = await subscriptionService.getStatus();
        setIsPro(status.subscription_status === 'pro');
      } catch {
        setIsPro(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner size="lg" className="text-[var(--primary)]" />
      </div>
    );
  }

  if (isPro) {
    return <>{children}</>;
  }

  // Locked UI - show upgrade prompt
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-[var(--primary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
          This is a Pro feature
        </h2>
        <p className="text-[var(--muted)] text-center mb-6">
          Upgrade to Dobbie Pro to unlock scheduled posting and auto-posting features.
        </p>
        <Link href="/subscribe">
          <button className="w-full h-14 rounded-xl font-semibold text-white bg-[var(--primary)] hover:bg-[var(--secondary)] active:bg-[var(--primary)] transition-colors flex items-center justify-center">
            Upgrade to Pro
          </button>
        </Link>
      </div>
    </div>
  );
}
