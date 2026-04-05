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
      href: '/create/linkedin',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: 'from-[#1877F2] to-[#42A5F5]',
      href: '/create/facebook',
      comingSoon: true,
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: 'from-[#E4405F] to-[#FCAF45]',
      href: '/create/instagram',
      comingSoon: true,
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      id: 'threads',
      name: 'Threads',
      color: 'from-[#000000] to-[#333333]',
      href: '/create/threads',
      comingSoon: true,
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.186 14.563c-1.397 0-2.348-.714-2.848-2.141-.5-1.427-.196-2.437.91-3.029 1.105-.592 2.564-.454 4.078.412 1.515.867 2.449 2.141 2.782 3.815.333 1.673-.062 2.928-1.182 3.756-1.119.828-2.741 1.246-4.852 1.246-1.348 0-2.607-.177-3.777-.532-1.17-.354-2.137-.943-2.902-1.767l-1.448 1.837c.942 1.107 2.232 1.89 3.872 2.352 1.639.462 3.426.693 5.363.693 2.596 0 4.766-.512 6.509-1.537 1.742-1.024 3.012-2.456 3.808-4.296.797-1.84 1.195-3.983 1.195-6.429 0-2.446-.398-4.589-1.195-6.429-.796-1.84-2.066-3.272-3.808-4.296C18.938.512 16.768 0 14.172 0c-2.597 0-4.767.512-6.51 1.537C5.921 2.828 4.65 4.26 3.854 6.1c-.063.146-.11.29-.164.433v-3.01L.622 6.59l3.068 3.064c.063-.146.12-.293.185-.44.796-1.838 2.066-3.27 3.81-4.296C10.405 3.756 12.575 3.244 15.17 3.244c2.596 0 4.766.512 6.51 1.537 1.742 1.024 3.012 2.456 3.808 4.296.797 1.84 1.195 3.983 1.195 6.429 0 2.446-.398 4.589-1.195 6.429-.796 1.84-2.066 3.272-3.808 4.296-1.743 1.025-3.914 1.537-6.51 1.537h-.26z" />
        </svg>
      ),
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      color: 'from-[#000000] to-[#333333]',
      href: '/create/twitter',
      comingSoon: true,
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'bluesky',
      name: 'Bluesky',
      color: 'from-[#0285FF] to-[#53B7F5]',
      href: '/create/bluesky',
      comingSoon: true,
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 16.945c-1.077 1.588-3.136 2.421-5.402 2.421-1.588 0-3.136-.337-4.536-1.004l-.833 2.152c1.588.833 3.421 1.252 5.37 1.252 4.202 0 7.588-3.385 7.588-7.588 0-1.077-.251-2.066-.71-2.939l-2.152.833c.667 1.252 1.004 2.685 1.004 4.202 0 .833-.084 1.588-.251 2.321l.882.35zM8.421 13.079c-1.077-.833-1.588-2.066-1.588-3.462 0-1.924 1.588-3.462 3.462-3.462 1.924 0 3.462 1.588 3.462 3.462 0 1.397-.511 2.63-1.588 3.462l-1.748-.35v-.833l1.924-.667v-1.253l-1.924.667-.833-1.253c.833-.667 1.421-1.588 1.421-2.713 0-2.237-1.837-4.032-4.074-4.032-2.237 0-4.032 1.837-4.032 4.074 0 1.124.588 2.066 1.421 2.713l-.833 1.253-1.924-.667v1.253l1.924.667v.833l-1.748.35z" />
        </svg>
      ),
    },
    {
      id: 'mastodon',
      name: 'Mastodon',
      color: 'from-[#6364FF] to-[#8B8FFF]',
      href: '/create/mastodon',
      comingSoon: true,
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.268 5.313c.35-2.578 2.617-4.61 5.304-4.832V.04h-4.293c-2.526 0-4.795 1.426-6.058 3.514l.03.02-3.892.06V3.21H9.616L5.723 6.295c.02.046.046.088.065.134h-3.748v3.567h3.755v1.824H0v-1.824h2.56c-.016-.188-.032-.38-.041-.574v-.004h-2.23v6.485h1.264v3.405c.034.057.071.111.108.166h2.236v3.485h3.755v-2.98l.09-.15c.683.457 1.506.787 2.366.963v3.166l3.892.01v-3.358c1.518-.195 2.69-1.388 2.69-2.973v-.033c0-.013-.003-.026-.004-.04v-.006c-.002-.018-.007-.034-.01-.052-.025-.143-.057-.278-.093-.405l-.025-.085c.232-.19.415-.432.545-.716.097-.2.154-.412.186-.615h.03c.05.16.122.316.213.463.108.174.234.34.375.493l.005.005c.027.028.058.054.088.078l-.032-.01-.03-.01c-.017-.005-.033-.013-.05-.018.232-.234.432-.504.598-.81.197-.362.32-.735.375-1.102.007-.047.013-.095.018-.142l.02-.163-.005-.01c.004-.023.01-.045.014-.068l.005-.015c.004-.021.01-.042.014-.062.045-.2.08-.405.108-.608l.005-.037c.028-.202.05-.405.065-.608V8.294h1.264v1.478c-.004.003-.008.006-.012.01l-.008.006c-.003.002-.007.005-.01.008-.004.002-.007.004-.011.006l-.022.014c-.012.006-.025.013-.038.02-.002 0-.003.002-.005.002l-.01.004-.022.008-.015.005c-.007.002-.014.005-.021.007l-.025.006-.03.006c-.007 0-.015.002-.022.003l-.01.002-.03.003-.01.001c-.008 0-.015.001-.023.001v-.002H22.51v-3.566h.758c.06.002.12.005.178.01zM21.786 9.96c-1.407-.024-2.664.298-3.773.922l-.004-.004c-.622.349-1.274.577-1.982.693v2.94c.708-.093 1.385-.327 2.028-.696.85-.488 1.387-1.165 1.618-2.007.01-.036.018-.073.028-.11.01-.038.016-.076.025-.115l-.017.055c-.02.073-.048.143-.074.21zM18.87 6.588c.643-.02 1.234.12 1.78.417l-.002-.003c.366.204.688.46.986.747l.007.007c.297.287.56.608.782.955l.005.009c.22.346.41.71.573 1.086.163.376.287.77.375 1.178.044.203.074.413.098.623v.004l.006.033c.006.028.014.056.02.084v.004c.007.028.013.056.019.084.007.027.014.054.02.081l.005.024c.003.018.007.036.01.054v.004c.003.016.006.033.01.049v.004l.007.04v.004l.01.062.003.018v.005l.028.22v.003l.032.352.004.016.005.057.01.122v.005l.007.1.003.032c.003.02.006.04.01.06l.004.028.013.11c.003.017.006.034.01.051l.004.027c.004.016.007.033.011.049v.002l.004.016c.004.015.007.03.011.045v.002l.01.038v.003c.003.013.007.027.01.04v.002l.009.03v.002c.003.01.006.02.009.03v.003l.008.023v.002c.006.013.012.027.018.04v.002c.006.012.012.025.018.037l.004.008v.008c.005.01.01.02.015.03l.006.01v.006c.005.008.01.017.015.025l.006.01v.004l.009.013v.004l.015.02c.002.002.004.004.006.006l.006.007v.004l.013.013v.002l.022.02c.002.002.005.003.007.005v.002l.03.023.005.003c.002.002.004.002.006.004l-.008-.003.02.012v.002c.002.001.004.002.006.003v2.934c-1.407-.024-2.664.298-3.773.922-.544.31-1.01.687-1.404 1.105l-.007-.007c-.39.417-.844.783-1.36 1.093-.516.31-1.072.55-1.664.714v2.993c.592-.144 1.146-.407 1.66-.786.515-.38.958-.866 1.325-1.437l.006.006c.366-.57.798-1.074 1.29-1.507l.007.007c.492-.432 1.033-.812 1.617-1.133V10.3c-.585-.32-1.126-.7-1.618-1.133-.492-.432-.924-.936-1.29-1.506v-.006c-.39.417-.844.783-1.36 1.093-.516.31-1.072.55-1.664.714v2.933c1.108-.624 2.366-.946 3.773-.922v-2.94c-.584-.32-1.125-.7-1.617-1.133-.492-.432-.924-.936-1.29-1.506v-.006z" />
        </svg>
      ),
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      color: 'from-[#E60023] to-[#F0522F]',
      href: '/create/pinterest',
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
      href: '/create/youtube',
      comingSoon: true,
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {user?.profile?.profile_picture ? (
              <img 
                src={user.profile.profile_picture} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
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
          <div className="w-full p-5 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] shadow-lg mb-4">
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

        {/* Schedule Posts Button (for Pro users) */}
        <Link href="/schedule">
          <div className="w-full p-4 rounded-2xl bg-white border-2 border-[var(--primary)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-[var(--foreground)] text-base font-bold">Schedule Posts</h2>
              <p className="text-[var(--muted)] text-sm">Create your content calendar</p>
            </div>
            <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
