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
  var timeoutMs = 5000;
  var sessionPromise = supabase.auth.getSession();
  var timeoutPromise = new Promise(function (resolve) {
    setTimeout(function () { resolve({ timedOut: true }); }, timeoutMs);
  });

  var raceResult = await Promise.race([sessionPromise, timeoutPromise]);

  if (raceResult.timedOut) {
    console.warn('[boot] getSession timed out after ' + timeoutMs + 'ms — clearing stored session and showing login');
    await supabase.auth.signOut().catch(function () {});
    try { localStorage.clear(); } catch (e) {}
    renderLogin(appRoot);
    return;
  }

  var session = raceResult.data ? raceResult.data.session : null;

  if (session) {
    await renderFileList(appRoot, session);
  } else {
    renderLogin(appRoot);
  }
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