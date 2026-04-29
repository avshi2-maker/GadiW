// src/screens/login.js
// Login screen — Hebrew RTL form, email + password auth against Supabase.
// Created: 23/04/2026 (Lesson 5)
// Updated: 26/04/2026 — Lesson 9B Phase B: added data-screen="login" marker for mobile CSS
// Updated: 29/04/2026 — Lesson 10B: branded for Gadi Wisfeld Law Office (navy theme, firm header, contact footer)

import { supabase } from '../lib/supabase.js';

var BRAND_NAVY = '#1E2D5C';
var BRAND_NAVY_DARK = '#152244';

export function renderLogin(container) {
  container.innerHTML = `
    <div data-screen="login" style="min-height: 100vh; background: #f5f6fa; padding: 24px 16px; font-family: 'Heebo', sans-serif;">

      <!-- Brand header card -->
      <div style="max-width: 420px; margin: 40px auto 16px; background: ${BRAND_NAVY}; color: #fff; padding: 28px 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="font-family: 'Frank Ruhl Libre', serif; font-size: 32px; font-weight: 900; margin: 0 0 4px; letter-spacing: 0.5px;">גד ויספלד</h1>
        <p style="font-size: 15px; margin: 0; opacity: 0.9;">משרד עורכי דין ונוטריון</p>
      </div>

      <!-- Login form card -->
      <div style="max-width: 420px; margin: 0 auto; padding: 32px 24px 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; background: #fff;">
        <h2 style="font-family: 'Frank Ruhl Libre', serif; font-size: 22px; margin: 0 0 8px; text-align: right; color: ${BRAND_NAVY};">כניסה למערכת</h2>
        <p style="color: #666; margin: 0 0 24px; text-align: right; font-size: 14px;">הזן את פרטי הכניסה שלך</p>

        <form id="login-form" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label for="email" style="display: block; margin-bottom: 6px; text-align: right; font-weight: 500; color: #333;">אימייל</label>
            <input type="email" id="email" name="email" required
              style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; direction: ltr; box-sizing: border-box;" />
          </div>
          <div>
            <label for="password" style="display: block; margin-bottom: 6px; text-align: right; font-weight: 500; color: #333;">סיסמה</label>
            <input type="password" id="password" name="password" required
              style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; direction: ltr; box-sizing: border-box;" />
          </div>
          <button type="submit" id="login-submit"
            style="padding: 12px; background: ${BRAND_NAVY}; color: #fff; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer; margin-top: 8px;">
            כניסה
          </button>
          <div id="login-message" style="min-height: 24px; text-align: right; font-size: 14px;"></div>
        </form>
      </div>

      <!-- Contact footer card -->
      <div style="max-width: 420px; margin: 16px auto 0; padding: 16px 20px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center; font-size: 13px; color: #555; line-height: 1.7;">
        <div style="color: ${BRAND_NAVY}; font-weight: 700; margin-bottom: 6px;">בית אמות משפט · שדרות שאול המלך 8, תל אביב-יפו</div>
        <div>טל׳: 03-6919797 · 03-5552970 · פקס: 03-6916262</div>
        <div style="direction: ltr; margin-top: 4px;">gadlawnotary@gmail.com</div>
      </div>

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
