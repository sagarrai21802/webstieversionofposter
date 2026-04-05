'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { subscriptionService } from '@/lib/subscription';
import { PrimaryButton } from '@/components/buttons';
import { LoadingSpinner } from '@/components/loading';

export default function SubscribePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError('');
    try {
      await subscriptionService.activate();
      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch {
      setError('Failed to activate subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-[var(--cta)] flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">You're Pro! 🎉</h2>
        <p className="text-[var(--muted)] text-center mb-6">Your subscription is now active. Redirecting to home...</p>
        <LoadingSpinner size="lg" className="text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-[var(--primary)] px-5 py-4 flex items-center">
        <Link href="/" className="text-white mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-white">Upgrade to Pro</h1>
      </header>

      <main className="p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
              <svg className="w-7 h-7 text-[#92400E]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">Dobbie Pro</h2>
              <p className="text-[var(--muted)]">Premium features</p>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-[var(--foreground)]">₹199</span>
            <span className="text-[var(--muted)]">/month</span>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[var(--cta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[var(--foreground)]">Schedule posts on autopilot</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[var(--cta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[var(--foreground)]">Auto-posting with approval flow</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[var(--cta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[var(--foreground)]">Content calendar</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[var(--cta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[var(--foreground)]">Trending topic research</span>
            </li>
          </ul>

          {error && (
            <div className="mb-4 p-3 bg-[var(--error)]/10 rounded-xl flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[var(--error)] text-sm">{error}</p>
            </div>
          )}

          <PrimaryButton text="Subscribe Now" onClick={handleSubscribe} isLoading={isLoading} />
          <p className="text-[var(--muted)] text-xs text-center mt-4">Dummy payment • No real charges</p>
        </div>
      </main>
    </div>
  );
}