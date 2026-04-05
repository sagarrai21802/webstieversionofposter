'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/input';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { authService } from '@/lib/auth';
import { API_CONFIG } from '@/lib/api-config';

const API_BASE_URL = API_CONFIG.baseUrl || 'http://localhost:8000';

function GoogleSignUpButton() {
  const handleGoogleSignUp = () => {
    // Redirect to backend OAuth authorize endpoint (BFF pattern)
    window.location.href = `${API_BASE_URL}/api/v1/auth/google/authorize`;
  };

  return (
    <SecondaryButton
      text="Continue with Google"
      onClick={handleGoogleSignUp}
    />
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(email, password, fullName);
      await authService.login(email, password);
      router.push('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        setError(axiosErr.response?.data?.detail || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="p-6">
        <Link href="/auth" className="text-[var(--primary)]">
          ← Back
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Create Account</h1>
          <p className="text-[var(--muted)] mb-8">Join Dobbie to automate your LinkedIn</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={fullName}
              onChange={setFullName}
              placeholder="Full Name"
              label="Full Name"
              required
            />

            <Input
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Email"
              label="Email"
              required
            />

            <Input
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Password"
              label="Password"
              required
            />

            <Input
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm Password"
              label="Confirm Password"
              required
            />

            {error && (
              <p className="text-[var(--error)] text-sm text-center">{error}</p>
            )}

            <PrimaryButton
              text="Sign Up"
              onClick={() => {}}
              isLoading={isLoading}
            />
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[var(--background)] text-[var(--muted)]">or</span>
            </div>
          </div>

          <GoogleSignUpButton />

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[var(--primary)] font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}