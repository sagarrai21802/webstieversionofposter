'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import { scheduleService, CalendarEntry } from '@/lib/schedule';
import { LoadingSpinner } from '@/components/loading';

interface CalendarData {
  calendars: { id: string; platform: string; duration_days: number; auto_post: boolean; status: string; created_at: string }[];
  entries: CalendarEntry[];
}

export default function CalendarViewPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    try {
      const data = await scheduleService.getCalendar();
      setCalendarData(data);
    } catch {
      setError('Failed to load calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (entryId: string) => {
    try {
      await scheduleService.approveEntry(entryId);
      // Update local state
      if (calendarData) {
        setCalendarData({
          ...calendarData,
          entries: calendarData.entries.map(e => 
            e.id === entryId ? { ...e, status: 'approved' } : e
          ),
        });
      }
    } catch {
      setError('Failed to approve');
    }
  };

  const handleDeny = async (entryId: string) => {
    try {
      await scheduleService.denyEntry(entryId);
      // Update local state
      if (calendarData) {
        setCalendarData({
          ...calendarData,
          entries: calendarData.entries.map(e => 
            e.id === entryId ? { ...e, status: 'denied' } : e
          ),
        });
      }
    } catch {
      setError('Failed to deny');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800',
      approved: 'bg-blue-100 text-blue-800',
      denied: 'bg-red-100 text-red-800',
      posted: 'bg-green-100 text-green-800',
      failed: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (isLoading) {
    return (
      <SubscriptionGate>
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <LoadingSpinner size="lg" className="text-[var(--primary)]" />
        </div>
      </SubscriptionGate>
    );
  }

  // Empty state
  if (!calendarData || calendarData.entries.length === 0) {
    return (
      <SubscriptionGate>
        <div className="min-h-screen bg-[var(--background)]">
          <header className="bg-[var(--primary)] px-4 py-4 flex items-center">
            <Link href="/" className="text-white mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">Content Calendar</h1>
          </header>
          <main className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="w-20 h-20 rounded-full bg-[var(--border)] flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">No scheduled posts yet</h2>
            <p className="text-[var(--muted)] text-center mb-6">Create your first content schedule to get started.</p>
            <Link href="/schedule" className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-medium">
              Set up your schedule
            </Link>
          </main>
        </div>
      </SubscriptionGate>
    );
  }

  // Calculate stats
  const total = calendarData.entries.length;
  const approved = calendarData.entries.filter(e => e.status === 'approved').length;
  const denied = calendarData.entries.filter(e => e.status === 'denied').length;
  const pending = calendarData.entries.filter(e => e.status === 'pending').length;

  return (
    <SubscriptionGate>
      <div className="min-h-screen bg-[var(--background)]">
        <header className="bg-[var(--primary)] px-4 py-4 flex items-center">
          <Link href="/" className="text-white mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-white">Content Calendar</h1>
        </header>

        {/* Stats Bar */}
        <div className="bg-white px-4 py-3 border-b border-[var(--border)]">
          <p className="text-sm text-[var(--muted)]">
            <span className="font-semibold text-[var(--foreground)]">{total}</span> posts scheduled · 
            <span className="text-green-600"> {approved} approved</span> · 
            <span className="text-red-600"> {denied} denied</span>
            {pending > 0 && <span className="text-amber-600"> · {pending} pending</span>}
          </p>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 bg-[var(--error)]/10 rounded-xl">
            <p className="text-[var(--error)] text-sm">{error}</p>
          </div>
        )}

        <main className="p-4">
          <div className="space-y-3">
            {calendarData.entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-xl p-4 border border-[var(--border)]">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg capitalize">{entry.platform}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(entry.status)}`}>
                      {entry.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[var(--foreground)]">{formatDate(entry.scheduled_date)}</p>
                    <p className="text-sm text-[var(--muted)]">{entry.scheduled_time}</p>
                  </div>
                </div>
                <p className="text-[var(--foreground)] mb-3">Topic: {entry.topic}</p>
                {entry.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(entry.id)}
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleDeny(entry.id)}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                    >
                      ✗ Deny
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </SubscriptionGate>
  );
}