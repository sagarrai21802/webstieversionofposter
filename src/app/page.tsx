'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { User } from '@/lib/auth';

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  href: string;
  comingSoon?: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.push('/auth/signin');
          return;
        }
        setUser(currentUser);
      } catch {
        router.push('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 2500);
  };

  const platforms: Platform[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: 'from-[#0077B5] to-[#00A0DC]',
      href: '/create',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      color: 'from-[#E60023] to-[#F0522F]',
      href: '/pinterest',
      comingSoon: true,
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.548.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      id: 'youtube',
      name: 'YouTube',
      color: 'from-[#FF0000] to-[#E52D27]',
      href: '/youtube',
      comingSoon: true,
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      color: 'from-[#000000] to-[#333333]',
      href: '/twitter',
      comingSoon: true,
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  const handlePlatformClick = (platform: Platform) => {
    if (platform.comingSoon) {
      showToast('Coming soon! This feature is under development.');
    } else {
      router.push(platform.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Toast notification */}
      {toast.visible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-[var(--foreground)] text-white rounded-xl shadow-lg animate-fade-in">
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      <header className="bg-[var(--primary)] px-5 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Dobbie</h1>
        <Link href="/account">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </Link>
      </header>

      <main className="p-5">
        <p className="text-[var(--muted)] mb-5 text-base">
          Welcome back, <span className="font-semibold text-[var(--foreground)]">{user?.full_name || 'User'}</span>
        </p>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handlePlatformClick(platform)}
              className="relative h-36 rounded-2xl bg-gradient-to-br shadow-lg flex flex-col items-center justify-center transition-transform active:scale-95"
              style={{ background: platform.id === 'twitter' ? '#000000' : undefined }}
            >
              {/* Background gradient overlay for non-twitter */}
              {platform.id !== 'twitter' && (
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${platform.color}`} />
              )}
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  {platform.icon}
                </div>
                <span className="text-white font-semibold text-base">{platform.name}</span>
                <span className="text-white/70 text-xs mt-1">Post now</span>
              </div>

              {/* Coming Soon badge */}
              {platform.comingSoon && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/20 rounded-full">
                  <span className="text-white text-xs font-medium">Soon</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Subscription Upgrade Card */}
        <Link href="/subscribe">
          <div className="w-full p-5 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#92400E]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-lg font-bold">Dobbie Pro</h2>
                  <span className="px-2 py-0.5 bg-yellow-400 text-[#92400E] text-xs font-bold rounded-full">NEW</span>
                </div>
                <p className="text-white/80 text-sm">Schedule posts on autopilot</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-white/90 text-sm">
                ₹199<span className="text-white/60">/month</span>
              </p>
            </div>
          </div>
        </Link>
      </main>

      {/* Fade in animation for toast */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
