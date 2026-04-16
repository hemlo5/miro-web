import { createBrowserClient } from '@supabase/ssr';

/**
 * Uses @supabase/ssr's createBrowserClient which stores the session in client-readable cookies.
 * On production (.hemloai.com), cookies are set with domain=.hemloai.com so they are
 * shared between hemloai.com (landing) and app.hemloai.com (app).
 * Sign in once on either site → stay logged in on both.
 */

const isProd = typeof window !== 'undefined' && window.location.hostname.includes('hemloai.com');

export const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    cookieOptions: {
      ...(isProd
        ? { domain: '.hemloai.com', secure: true }
        : {}), // localhost: no domain restriction, works normally
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    },
  }
);
