// src/main.js
// App entry point — boots the right screen based on auth state.
// Created: 23/04/2026 (Lesson 5)

import { supabase } from './lib/supabase.js';
import { renderLogin } from './screens/login.js';

var appRoot = document.querySelector('#app');

if (!appRoot) {
  throw new Error('Missing <div id="app"></div> in index.html');
}

async function boot() {
  var sessionResult = await supabase.auth.getSession();
  var session = sessionResult.data.session;

  if (session) {
    renderLoggedIn(session);
  } else {
    renderLogin(appRoot);
  }
}

function renderLoggedIn(session) {
  appRoot.innerHTML = `
    <div style="max-width: 600px; margin: 80px auto; padding: 32px; font-family: 'Heebo', sans-serif; text-align: right;">
      <h1 style="font-family: 'Frank Ruhl Libre', serif;">ברוך הבא</h1>
      <p>התחברת בתור: <strong style="direction: ltr; display: inline-block;">${session.user.email}</strong></p>
      <p style="color: #666; font-size: 14px;">User ID: <code style="direction: ltr; display: inline-block;">${session.user.id}</code></p>
      <button id="logout-btn"
        style="padding: 10px 20px; background: #c00; color: #fff; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; margin-top: 16px;">
        יציאה
      </button>
    </div>
  `;

  document.querySelector('#logout-btn').addEventListener('click', async function () {
    await supabase.auth.signOut();
    renderLogin(appRoot);
  });
}

supabase.auth.onAuthStateChange(function (event, session) {
  if (event === 'SIGNED_IN' && session) {
    renderLoggedIn(session);
  }
  if (event === 'SIGNED_OUT') {
    renderLogin(appRoot);
  }
});

boot();