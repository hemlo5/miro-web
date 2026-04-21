'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../src/lib/supabase';
import type { User } from '@supabase/supabase-js';

const APP_CHECKOUT_URL = 'https://app.hemloai.com/api/checkout';

const PLANS = [
  { id: 'free', name: 'Free', price: '$0', period: '', description: 'Explore the platform at no cost.', cta: 'Get Started', features: ['2 simulations total', 'Basic simulation modes', 'Standard agent count'] },
  { id: 'starter', name: 'Starter Pack', price: '$5', period: '', description: 'A one-time boost to get started.', cta: 'Buy Now', isOneTime: true, features: ['5 simulations total', 'One-time purchase', 'No recurring fees'] },
  { id: 'pro', name: 'Pro', price: '$23.99', period: '/mo', description: 'The core product. Built for daily use.', cta: 'Upgrade to Pro', highlight: true, features: ['50 simulations / month', 'All simulation modes', '10,000 agents per run', 'Deep analysis & export'] },
  { id: 'founder', name: 'Founder', price: '$79.00', period: '/mo', description: 'For power users and integrators.', cta: 'Become a Founder', features: ['200 simulations / month', 'Full API Access', 'Priority AI Compute', 'Dedicated Support'] },
];

export default function PricingClient() {
  const [user, setUser] = useState<User | null>(null);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [hasStarterPack, setHasStarterPack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        supabase.from('profiles').select('tier, has_starter_pack').eq('id', u.id).single().then(({ data }) => {
          if (data?.tier) setUserTier(data.tier);
          if (data?.has_starter_pack) setHasStarterPack(true);
          setLoading(false);
        });
      } else { setLoading(false); }
    });
  }, []);

  const isOwned = (planId: string) => {
    if (!user || loading) return false;
    const tier = userTier || 'free';
    if (planId === 'free' && !['pro', 'premium', 'founder'].includes(tier)) return true;
    if (planId === 'pro' && (tier === 'pro' || tier === 'premium')) return true;
    if (planId === 'founder' && tier === 'founder') return true;
    if (planId === 'starter' && hasStarterPack) return true;
    return false;
  };

  const handleUpgrade = async (planId: string) => {
    if (isOwned(planId)) return;
    if (!user) { window.location.href = 'https://app.hemloai.com/pricing'; return; }
    setCheckingOut(planId);
    try {
      const res = await fetch(APP_CHECKOUT_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, email: user.email, plan: planId }) });
      const data = await res.json();
      if (data.checkoutUrl) { window.location.href = data.checkoutUrl; return; }
    } catch { /* fall through */ }
    window.location.href = `https://app.hemloai.com/pricing?checkout=${planId}`;
    setCheckingOut(null);
  };

  const getLabel = (plan: typeof PLANS[0]) => {
    if (checkingOut === plan.id) return 'Redirecting…';
    if (isOwned(plan.id)) return plan.id === 'starter' ? 'Purchased' : 'Current Plan';
    return plan.cta;
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-20">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-5">Pricing</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">Simple, honest pricing.</h1>
          <p className="text-white/40 text-base max-w-lg leading-relaxed">Start free. Upgrade when the stakes get real.</p>
          {!loading && !user && <p className="text-white/20 text-xs mt-4 uppercase tracking-widest">Sign in to see your current plan</p>}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan, i) => {
            const owned = isOwned(plan.id);
            return (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} className={`relative flex flex-col p-8 border ${plan.highlight ? 'bg-white text-black border-white' : 'bg-white/[0.03] text-white border-white/10'}`}>
                {plan.highlight && (<>
                  <span className="absolute -left-px -top-px block size-2 border-l-2 border-t-2 border-black/20" />
                  <span className="absolute -right-px -top-px block size-2 border-r-2 border-t-2 border-black/20" />
                  <span className="absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 border-black/20" />
                  <span className="absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 border-black/20" />
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 whitespace-nowrap">Most Popular</span>
                </>)}
                {plan.isOneTime && !plan.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white/5 border border-white/10 text-white/50 text-[9px] font-bold uppercase tracking-widest px-3 py-1 whitespace-nowrap">One‑Time</span>}
                <p className={`text-[10px] uppercase tracking-widest mb-4 ${plan.highlight ? 'text-black/30' : 'text-white/30'}`}>{plan.name}</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                  {plan.period && <span className={`text-base font-normal ml-1 ${plan.highlight ? 'text-black/40' : 'text-white/30'}`}>{plan.period}</span>}
                </div>
                <p className={`text-sm mb-8 leading-relaxed min-h-[40px] ${plan.highlight ? 'text-black/50' : 'text-white/40'}`}>{plan.description}</p>
                {owned ? (
                  <div className={`w-full py-3 text-center text-sm font-semibold border mb-8 opacity-50 cursor-default ${plan.highlight ? 'border-black/20 text-black' : 'border-white/10 text-white'}`}>{getLabel(plan)}</div>
                ) : plan.id === 'free' ? (
                  <a href={user ? 'https://app.hemloai.com/home' : 'https://app.hemloai.com/sign-up'} className="w-full py-3 text-center text-sm font-semibold transition-all duration-200 mb-8 inline-block active:scale-95 bg-transparent border border-white/20 hover:bg-white/5 text-white">
                    {user ? 'Go to Dashboard' : 'Get Started'}
                  </a>
                ) : (
                  <button onClick={() => handleUpgrade(plan.id)} disabled={!!checkingOut} className={`w-full py-3 text-center text-sm font-semibold transition-all duration-200 mb-8 active:scale-95 ${plan.highlight ? 'bg-black text-white hover:bg-black/80' : 'bg-white text-black hover:bg-white/90'} ${checkingOut ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                    {getLabel(plan)}
                  </button>
                )}
                <ul className="flex flex-col gap-3 mt-auto">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <svg className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'opacity-60' : 'opacity-40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                      <span className={`text-sm leading-relaxed ${plan.highlight ? 'text-black/70' : 'text-white/60'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-white/30 text-xs">Secure checkout via Dodo Payments. Cancel anytime.</p>
          <a href="https://app.hemloai.com/pricing" className="text-white/30 text-xs uppercase tracking-widest hover:text-white transition-colors">Manage your plan →</a>
        </motion.div>
      </div>
    </div>
  );
}
