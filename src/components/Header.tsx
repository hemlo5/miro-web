import { Link, useLocation } from 'react-router-dom';
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

export default function Header() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [plan, setPlan] = useState<string>('Standard');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserPlan(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserPlan(session.user.id);
      else setPlan('Standard');
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar on path change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const fetchUserPlan = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single();
      
      if (data && data.plan) {
        setPlan(data.plan);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.plan) setPlan(user.user_metadata.plan);
        else if (user?.app_metadata?.plan) setPlan(user.app_metadata.plan);
        else setPlan('Standard');
      }
    } catch {
      setPlan('Standard');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const initial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-center px-4 py-3 relative min-h-[64px]">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 max-w-full overflow-x-auto scrollbar-hide">
          {desktopNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
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
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
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

        {/* Right Corner - Desktop Profile / Mobile Hamburger */}
        <div className="absolute right-4 md:right-8 flex items-center gap-2">
          {/* Desktop User Profile */}
          <div className="hidden md:block" ref={dropdownRef}>
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-white/5 rounded-full p-1 pr-3 transition-colors outline-none"
                >
                  <div className="text-right hidden sm:block">
                    <div className="text-white text-sm font-medium leading-none mb-1">
                      {user.user_metadata?.full_name || 'User'}
                    </div>
                    <div className="text-white/50 text-[10px] uppercase tracking-widest">{plan}</div>
                  </div>
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
                      {initial}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50 transform origin-top-right"
                    >
                      <div className="px-2">
                        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 mb-2">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-white">Current Plan</span>
                          </div>
                          <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{plan}</span>
                        </div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                          <UserIcon className="w-4 h-4" />
                          Account Settings
                        </button>
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <UserIcon className="w-5 h-5 text-white/70" />
              </button>
            )}
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
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-[280px] bg-[#050505] border-l border-white/10 z-[70] md:hidden flex flex-col pt-20 pb-10 px-6"
              >
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Profile Section in Sidebar */}
                <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border border-white/20" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
                            {initial}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-white font-semibold truncate max-w-[160px]">
                            {user.user_metadata?.full_name || 'User'}
                          </span>
                          <span className="text-white/40 text-[10px] uppercase tracking-widest">{plan}</span>
                        </div>
                      </div>
                      <div className="h-px bg-white/5 flex-shrink-0" />
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-red-500/80 text-sm font-medium hover:text-red-500 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsSidebarOpen(false);
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }}
                      className="w-full py-3 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <UserIcon className="w-4 h-4" />
                      Sign In
                    </button>
                  )}
                </div>

                {/* Nav Links in Sidebar */}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-2 ml-1">More</p>
                  {sidebarNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all group"
                    >
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>

                <div className="mt-auto pt-10 border-t border-white/5">
                  <div className="flex items-center gap-2 text-white/20 mb-1">
                    <span className="text-[10px] font-bold tracking-tighter italic">HEMLO</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <p className="text-white/20 text-[10px]">© 2026 Quantitative Intelligence</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
  );
}
