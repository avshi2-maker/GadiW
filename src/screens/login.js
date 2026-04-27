// src/screens/login.js
// Login screen — Hebrew RTL form, email + password auth against Supabase.
// Created: 23/04/2026 (Lesson 5)
// Updated: 26/04/2026 — Lesson 9B Phase B: added data-screen="login" marker for mobile CSS

import { supabase } from '../lib/supabase.js';

export function renderLogin(container) {
  container.innerHTML = `
    <div data-screen="login" style="max-width: 420px; margin: 80px auto; padding: 32px; border: 1px solid #ddd; border-radius: 8px; background: #fff; font-family: 'Heebo', sans-serif;">
      <h1 style="font-family: 'Frank Ruhl Libre', serif; font-size: 28px; margin: 0 0 8px; text-align: right;">כניסה למערכת</h1>
      <p style="color: #666; margin: 0 0 24px; text-align: right;">הזן את פרטי הכניסה שלך</p>

      <form id="login-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label for="email" style="display: block; margin-bottom: 6px; text-align: right; font-weight: 500;">אימייל</label>
          <input type="email" id="email" name="email" required
            style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; direction: ltr; box-sizing: border-box;" />
        </div>

        <div>
          <label for="password" style="display: block; margin-bottom: 6px; text-align: right; font-weight: 500;">סיסמה</label>
          <input type="password" id="password" name="password" required
            style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; direction: ltr; box-sizing: border-box;" />
        </div>

        <button type="submit" id="login-submit"
          style="padding: 12px; background: #1a5490; color: #fff; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer; margin-top: 8px;">
          כניסה
        </button>

        <div id="login-message" style="min-height: 24px; text-align: right; font-size: 14px;"></div>
      </form>
    </div>
  `;

  var form = container.querySelector('#login-form');
  var emailInput = container.querySelector('#email');
  var passwordInput = container.querySelector('#password');
  var submitBtn = container.querySelector('#login-submit');
  var messageEl = container.querySelector('#login-message');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'מתחבר...';
    messageEl.textContent = '';
    messageEl.style.color = '';

    var email = emailInput.value.trim();
    var password = passwordInput.value;

    var result = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (result.error) {
      messageEl.textContent = 'שגיאה בהתחברות: ' + result.error.message;
      messageEl.style.color = '#c00';
      submitBtn.disabled = false;
      submitBtn.textContent = 'כניסה';
      return;
    }

    messageEl.textContent = 'התחברת בהצלחה!';
    messageEl.style.color = '#080';
  });
}