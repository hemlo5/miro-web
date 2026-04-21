import { createBrowserClient } from '@supabase/ssr';

/**
 * Uses @supabase/ssr's createBrowserClient which stores the session in client-readable cookies.
 * On production (.hemloai.com), cookies are set with domain=.hemloai.com so they are
 * shared between hemloai.com (landing) and app.hemloai.com (app).
 * Sign in once on either site → stay logged in on both.
 */

const isProd = typeof window !== 'undefined' && window.location.hostname.includes('hemloai.com');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// During build time (prerendering), if these are missing, we provide a placeholder
// to prevent the build from crashing. The actual client logic (useEffect)
// will only fire in the browser where variables should be defined.
export const supabase = createBrowserClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    cookieOptions: {
      ...(isProd
        ? { domain: '.hemloai.com', secure: true }
        : {}),
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    },
  }
);
