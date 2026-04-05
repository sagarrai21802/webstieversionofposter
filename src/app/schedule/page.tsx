'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import { scheduleService, TrendingTopic } from '@/lib/schedule';
import { PrimaryButton } from '@/components/buttons';
import { LoadingSpinner } from '@/components/loading';

// Platform configuration
const platforms = [
  { id: 'linkedin', name: 'LinkedIn', color: 'from-[#0077B5] to-[#00A0DC]', icon: 'L' },
  { id: 'pinterest', name: 'Pinterest', color: 'from-[#E60023] to-[#F0522F]', icon: 'P' },
  { id: 'youtube', name: 'YouTube', color: 'from-[#FF0000] to-[#E52D27]', icon: 'Y' },
  { id: 'twitter', name: 'X (Twitter)', color: 'from-[#000000] to-[#333333]', icon: 'X' },
];

// Duration options
const durations = [
  { days: 7, label: 'This Week', subtitle: '7 days' },
  { days: 30, label: 'This Month', subtitle: '30 days' },
];

type Step = 1 | 2 | 3 | 4 | 5;

export default function SchedulePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [autoPost, setAutoPost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTopics, setIsFetchingTopics] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const allSelectedTopics = [...selectedTopics, ...customTopics];

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setStep(2);
  };

  const handleDurationSelect = (days: number) => {
    setSelectedDuration(days);
    setStep(3);
    fetchTopics();
  };

  const fetchTopics = async () => {
    setIsFetchingTopics(true);
    setError('');
    try {
      const result = await scheduleService.getTrendingTopics(selectedPlatform, 7);
      setTopics(result.topics);
    } catch {
      setError('Failed to fetch topics. Please try again.');
    } finally {
      setIsFetchingTopics(false);
    }
  };

  const toggleTopic = (title: string) => {
    if (selectedTopics.includes(title)) {
      setSelectedTopics(selectedTopics.filter(t => t !== title));
    } else if (selectedTopics.length < 5) {
      setSelectedTopics([...selectedTopics, title]);
    }
  };

  const addCustomTopic = () => {
    if (customTopic.trim() && !customTopics.includes(customTopic.trim()) && allSelectedTopics.length < 5) {
      setCustomTopics([...customTopics, customTopic.trim()]);
      setCustomTopic('');
    }
  };

  const removeCustomTopic = (topic: string) => {
    setCustomTopics(customTopics.filter(t => t !== topic));
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError('');
    try {
      await scheduleService.createSchedule({
        platform: selectedPlatform,
        duration_days: selectedDuration,
        topics: allSelectedTopics,
        auto_post: autoPost,
      });
      setSuccess(true);
      setTimeout(() => router.push('/schedule/calendar'), 2000);
    } catch {
      setError('Failed to create schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  // Step 1: Platform Selector
  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Choose a Platform</h2>
      <p className="text-[var(--muted)] mb-6">Select where you want to schedule posts</p>
      
      <div className="grid grid-cols-2 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handlePlatformSelect(platform.id)}
            className="relative h-28 rounded-2xl bg-gradient-to-br shadow-lg flex flex-col items-center justify-center transition-transform active:scale-95"
            style={{ background: platform.id === 'twitter' ? '#000000' : undefined }}
          >
            {platform.id !== 'twitter' && (
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${platform.color}`} />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                <span className="text-white text-xl font-bold">{platform.icon}</span>
              </div>
              <span className="text-white font-semibold text-sm">{platform.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 2: Duration Selector
  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">How Long?</h2>
      <p className="text-[var(--muted)] mb-6">Choose your scheduling duration</p>
      
      <div className="space-y-3">
        {durations.map((duration) => (
          <button
            key={duration.days}
            onClick={() => handleDurationSelect(duration.days)}
            className="w-full p-4 bg-white rounded-xl border-2 border-[var(--border)] text-left hover:border-[var(--primary)] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[var(--foreground)]">{duration.label}</p>
                <p className="text-[var(--muted)] text-sm">{duration.subtitle}</p>
              </div>
              <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 3: Topic Selection
  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Select Topics</h2>
      <p className="text-[var(--muted)] mb-4">Choose up to 5 topics ({allSelectedTopics.length}/5 selected)</p>
      
      {isFetchingTopics ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" className="text-[var(--primary)]" />
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-6">
            {topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => toggleTopic(topic.title)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-colors ${
                  selectedTopics.includes(topic.title)
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                    : 'border-[var(--border)] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedTopics.includes(topic.title)
                      ? 'border-[var(--primary)] bg-[var(--primary)]'
                      : 'border-[var(--border)]'
                  }`}>
                    {selectedTopics.includes(topic.title) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[var(--foreground)] text-sm">{topic.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Custom Topic Input */}
          <div className="mb-6">
            <p className="text-[var(--muted)] text-sm mb-2">Add your own topic</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Enter custom topic..."
                className="flex-1 p-3 bg-white border-2 border-[var(--border)] rounded-xl text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && addCustomTopic()}
              />
              <button
                onClick={addCustomTopic}
                disabled={!customTopic.trim() || allSelectedTopics.length >= 5}
                className="px-4 bg-[var(--primary)] text-white rounded-xl font-medium disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Custom Topics Display */}
          {customTopics.length > 0 && (
            <div className="mb-6">
              <p className="text-[var(--muted)] text-sm mb-2">Your topics</p>
              <div className="flex flex-wrap gap-2">
                {customTopics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-[var(--secondary)] text-white text-sm rounded-full flex items-center gap-2"
                  >
                    {topic}
                    <button onClick={() => removeCustomTopic(topic)} className="hover:text-white/70">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-[var(--error)] text-sm mb-4">{error}</p>}

          <PrimaryButton
            text="Build My Calendar"
            onClick={() => setStep(4)}
            disabled={allSelectedTopics.length === 0}
          />
        </>
      )}
    </div>
  );

  // Step 4: Auto-post Toggle + Confirm
  const renderStep4 = () => (
    <div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Posting Mode</h2>
      <p className="text-[var(--muted)] mb-6">Choose how you want to approve posts</p>

      {/* Auto-post Toggle */}
      <div className="bg-white rounded-xl border-2 border-[var(--border)] p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-[var(--foreground)]">Auto-post without asking</span>
          <button
            onClick={() => setAutoPost(!autoPost)}
            className={`w-12 h-6 rounded-full transition-colors ${autoPost ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${autoPost ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <p className="text-[var(--muted)] text-sm">
          {autoPost
            ? 'Posts will go live automatically at the best time. You can pause anytime.'
            : "We'll send you a notification the night before each post for approval"}
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl border-2 border-[var(--border)] p-4 mb-6">
        <h3 className="font-semibold text-[var(--foreground)] mb-3">Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Platform</span>
            <span className="text-[var(--foreground)] capitalize">{selectedPlatform}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Duration</span>
            <span className="text-[var(--foreground)]">{selectedDuration} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Topics</span>
            <span className="text-[var(--foreground)]">{allSelectedTopics.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Mode</span>
            <span className="text-[var(--foreground)]">{autoPost ? 'Auto-post' : 'Approval required'}</span>
          </div>
        </div>
      </div>

      {error && <p className="text-[var(--error)] text-sm mb-4">{error}</p>}

      <PrimaryButton
        text="Confirm & Schedule"
        onClick={handleConfirm}
        isLoading={isLoading}
      />
    </div>
  );

  // Step 5: Success
  const renderStep5 = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-20 h-20 rounded-full bg-[var(--cta)] flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Your content calendar is set!</h2>
      <p className="text-[var(--muted)] text-center mb-6">We'll handle the rest.</p>
      <LoadingSpinner size="lg" className="text-[var(--primary)]" />
    </div>
  );

  return (
    <SubscriptionGate>
      <div className="min-h-screen bg-[var(--background)]">
        {/* Header */}
        <header className="bg-[var(--primary)] px-4 py-4 flex items-center">
          {step > 1 && step < 5 && (
            <button onClick={goBack} className="text-white mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold text-white">Schedule Posts</h1>
        </header>

        {/* Progress Indicator */}
        {step < 5 && (
          <div className="flex items-center px-6 py-3 bg-white border-b border-[var(--border)]">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step >= s ? 'bg-[var(--primary)] text-white' : 'bg-[var(--border)] text-[var(--muted)]'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`w-8 h-0.5 ${step > s ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <main className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </main>
      </div>
    </SubscriptionGate>
  );
}