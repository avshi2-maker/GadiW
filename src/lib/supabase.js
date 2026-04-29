// src/lib/supabase.js
// Supabase client — single instance shared across the whole app.
// Created: 23/04/2026 (Lesson 5)
// Updated: 29/04/2026 (Lesson 10A) — diagnostic logs before createClient

import { createClient } from '@supabase/supabase-js';

var URL_VAL = import.meta.env.VITE_SUPABASE_URL;
var KEY_VAL = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[SUPABASE DIAG] URL value:', URL_VAL);
console.log('[SUPABASE DIAG] URL type:', typeof URL_VAL);
console.log('[SUPABASE DIAG] URL length:', String(URL_VAL || '').length);
console.log('[SUPABASE DIAG] KEY type:', typeof KEY_VAL);
console.log('[SUPABASE DIAG] KEY length:', String(KEY_VAL || '').length);
console.log('[SUPABASE DIAG] MODE:', import.meta.env.MODE);
console.log('[SUPABASE DIAG] PROD:', import.meta.env.PROD);

if (!URL_VAL || !KEY_VAL) {
  throw new Error(
    'Missing Supabase env vars. Check .env.local at project root. ' +
    'Need VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export var supabase = createClient(
  URL_VAL,
  KEY_VAL,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      lock: function (name, acquireTimeout, fn) { return fn(); },
    },
  }
);