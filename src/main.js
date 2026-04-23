// src/main.js
// App entry point — boots the right screen based on auth state.
// Created: 23/04/2026 (Lesson 5)
// Updated: 23/04/2026 (Lesson 6 — route to fileList after login)

import { supabase } from './lib/supabase.js';
import { renderLogin } from './screens/login.js';
import { renderFileList } from './screens/fileList.js';

var appRoot = document.querySelector('#app');

if (!appRoot) {
  throw new Error('Missing <div id="app"></div> in index.html');
}

async function boot() {
  var sessionResult = await supabase.auth.getSession();
  var session = sessionResult.data.session;

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