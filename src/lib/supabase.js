// src/lib/supabase.js
// Supabase client — single instance shared across the whole app.
// Created: 23/04/2026 (Lesson 5)

import { createClient } from '@supabase/supabase-js';

var SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
var SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase env vars. Check .env.local at project root. ' +
    'Need VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    // Disable navigator.locks cross-tab session sync.
    // Fixes getSession() hanging when other tabs hold the auth lock.
    // Safe trade-off: solo-user CRM, no need for multi-tab auth coordination.
    lock: function (name, acquireTimeout, fn) { return fn(); },
  },
});