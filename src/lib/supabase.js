// src/lib/supabase.js
// Supabase client — single instance shared across the whole app.
// Created: 23/04/2026 (Lesson 5)
// Updated: 29/04/2026 (Lesson 10A) — production deploy verified working on GitHub Pages

import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase env vars. Check .env.local at project root. ' +
    'Need VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export var supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      lock: function (name, acquireTimeout, fn) { return fn(); },
    },
  }
);