import './lib/mobile.css';
// src/main.js
// App entry point — boots the right screen based on auth state.
// Created: 23/04/2026 (Lesson 5)
// Updated: 23/04/2026 (Lesson 6 — route to fileList + hardened session handling)

import { supabase } from './lib/supabase.js';
import { renderLogin } from './screens/login.js';
import { renderFileList } from './screens/fileList.js';

var appRoot = document.querySelector('#app');

if (!appRoot) {
  throw new Error('Missing <div id="app"></div> in index.html');
}

async function boot() {
  // Read stored session directly from localStorage — bypasses broken getSession()
  var storageKey = 'sb-pslwvkymccbngtyvgagj-auth-token';
  var stored = null;
  try {
    var raw = localStorage.getItem(storageKey);
    if (raw) { stored = JSON.parse(raw); }
  } catch (e) {
    console.warn('[boot] could not parse stored session, showing login', e);
  }

  if (!stored || !stored.access_token || !stored.refresh_token) {
    console.log('[boot] no stored session, showing login');
    renderLogin(appRoot);
    return;
  }

  // Check if token is expired (expires_at is in seconds, Date.now() is ms)
  var nowSec = Math.floor(Date.now() / 1000);
  var isExpired = stored.expires_at && stored.expires_at <= nowSec;

  if (isExpired) {
    console.log('[boot] stored session expired, clearing and showing login');
    try { localStorage.removeItem(storageKey); } catch (e) {}
    renderLogin(appRoot);
    return;
  }

  console.log('[boot] valid stored session found, rendering file list');
  await renderFileList(appRoot, stored);
}

supabase.auth.onAuthStateChange(async function (event, session) {
  if (event === 'SIGNED_IN' && session) {
    await renderFileList(appRoot, session);
  }
  if (event === 'SIGNED_OUT') {
    renderLogin(appRoot);
  }
});

boot();