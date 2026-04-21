'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { LogOut, Crown, User as UserIcon, Menu, X, ChevronRight } from 'lucide-react';

const desktopNavItems = [
  { path: '/features', label: 'Features' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/', label: 'Home' },
  { path: '/vision', label: 'Vision' },
  { path: '/founders', label: 'Founders' },
];

const mobileNavItems = [
  { path: '/features', label: 'Features' },
  { path: '/', label: 'Home' },
  { path: '/pricing', label: 'Pricing' },
];

const sidebarNavItems = [
  { path: '/vision', label: 'Vision' },
  { path: '/founders', label: 'Founders' },
];

// Google SVG icon
const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [plan, setPlan] = useState<string>('Free');
  const [signingIn, setSigningIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On mount, check for any existing session (including one from a redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserPlan(session.user.id);
    });

    // Listen for auth state changes (e.g., sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserPlan(session.user.id);
      else setPlan('Free');
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar on path change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const fetchUserPlan = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('tier, has_starter_pack')
      .eq('id', userId)
      .single();

    if (data?.tier) {
      const tierLabels: Record<string, string> = {
        'free': 'Free',
        'normal': 'Free',
        'premium': 'Pro',
        'pro': 'Pro',
        'founder': 'Founder',
      };
      setPlan(tierLabels[data.tier] ?? 'Free');
    } else {
      setPlan('Free');
    }
  };

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      // Determine the app URL dynamically based on environment
      const appUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8080' 
        : 'https://app.hemloai.com';
        
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${appUrl}/auth/callback?next=${window.location.origin}${pathname}`,
          queryParams: { prompt: 'select_account' },
        },
      });
    } catch (err) {
      console.error('Sign in error:', err);
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-center px-4 py-3 relative min-h-[64px]">

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 max-w-full overflow-x-auto scrollbar-hide">
          {desktopNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap rounded-full ${
                  isActive ? 'text-black' : 'text-white/70 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation (3 Items) */}
        <nav className="flex md:hidden items-center gap-1 max-w-full overflow-x-auto scrollbar-hide bg-white/5 border border-white/10 rounded-full px-1 py-1">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap rounded-full ${
                  isActive ? 'text-black' : 'text-white/70 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill-mobile"
                    className="absolute inset-0 bg-white rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Corner */}
        <div className="absolute right-4 md:right-8 flex items-center gap-2">

          {/* Desktop: Profile OR Sign-In Dropdown */}
          <div className="hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-white/5 rounded-full p-1 pr-3 transition-colors outline-none"
            >
              {user && (
                <div className="text-right hidden sm:block">
                  <div className="text-white text-sm font-medium leading-none mb-1">{displayName}</div>
                  <div className="text-white/50 text-[10px] uppercase tracking-widest">{plan}</div>
                </div>
              )}
              {user && avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  {user
                    ? <span className="text-white font-bold text-sm">{initial}</span>
                    : <UserIcon className="w-5 h-5 text-white/70" />
                  }
                </div>
              )}
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-64 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50 transform origin-top-right"
                >
                  {user ? (
                    /* ─── LOGGED IN ─── */
                    <div className="px-2">
                      {/* User Info */}
                      <div className="flex items-center gap-3 px-3 py-3 mb-1">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shrink-0">{initial}</div>
                        )}
                        <div className="min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                          <p className="text-white/40 text-xs truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="h-px bg-white/5 mx-2 mb-2" />

                      {/* Plan Badge */}
                      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 mb-2">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-white">Current Plan</span>
                        </div>
                        <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{plan}</span>
                      </div>

                      <a
                        href="https://app.hemloai.com/profile"
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        Account Settings
                      </a>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    /* ─── NOT LOGGED IN ─── */
                    <div className="px-3 py-3">
                      <p className="text-white/40 text-xs mb-3 text-center">Sign in to see your plan & profile</p>
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={signingIn}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <GoogleIcon />
                        {signingIn ? 'Redirecting…' : 'Continue with Google'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
              />
              <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 right-0 bg-white border-b border-black/10 z-[70] md:hidden flex flex-col pt-20 pb-10 px-6 rounded-b-[32px] shadow-2xl"
              >
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-black"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Profile Section in Sidebar */}
                <div className="mb-8 p-4 bg-black/5 border border-black/5 rounded-2xl">
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border border-black/10" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                            {initial}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-black font-semibold truncate max-w-[160px]">{displayName}</span>
                          <span className="text-black/40 text-[10px] uppercase tracking-widest">{plan}</span>
                        </div>
                      </div>
                      <div className="h-px bg-black/5 flex-shrink-0" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-red-600 text-sm font-medium hover:text-red-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={signingIn}
                      className="w-full py-3 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <GoogleIcon />
                      {signingIn ? 'Redirecting…' : 'Sign in with Google'}
                    </button>
                  )}
                </div>

                {/* Nav Links in Sidebar */}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-black/20 font-bold mb-2 ml-1">More</p>
                {sidebarNavItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-black/5 text-black/60 hover:text-black transition-all group"
                    >
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-black/5">
                  <div className="flex items-center gap-2 text-black/10 mb-1">
                    <span className="text-[10px] font-bold tracking-tighter italic">HEMLO</span>
                    <div className="h-px flex-1 bg-black/5" />
                  </div>
                  <p className="text-black/20 text-[10px]">© 2026 Quantitative Intelligence</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
