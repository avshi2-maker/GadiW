// src/screens/login.js
// Login screen — Hebrew RTL, EMAIL OTP authentication (Path 3).
// Created: 23/04/2026 (Lesson 5)
// Updated: 26/04/2026 — Lesson 9B Phase B: data-screen marker for mobile CSS
// Updated: 29/04/2026 — Lesson 10B: branded for Gadi Wisfeld Law Office
// Updated: 30/04/2026 — Session 2: replaced password with email OTP (signInWithOtp + verifyOtp)

import { supabase } from '../lib/supabase.js';

var BRAND_NAVY = '#1E2D5C';

// Module-level state — survives across renders within one login attempt
var currentEmail = '';
var hostContainer = null;

// =============================================================================
// PUBLIC ENTRY POINT
// =============================================================================
export function renderLogin(container) {
  hostContainer = container;
  currentEmail = '';
  renderEmailEntry();
}

// =============================================================================
// SCREEN 1: EMAIL ENTRY
// =============================================================================
function renderEmailEntry() {
  hostContainer.innerHTML = `
    <div data-screen="login" style="min-height: 100vh; background: #f5f6fa; padding: 24px 16px; font-family: 'Heebo', sans-serif;">

      <div style="max-width: 420px; margin: 40px auto 16px; background: ${BRAND_NAVY}; color: #fff; padding: 28px 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="font-family: 'Frank Ruhl Libre', serif; font-size: 32px; font-weight: 900; margin: 0 0 4px; letter-spacing: 0.5px;">גד ויספלד</h1>
        <p style="font-size: 15px; margin: 0; opacity: 0.9;">משרד עורכי דין ונוטריון</p>
      </div>

      <div style="max-width: 420px; margin: 0 auto; padding: 32px 24px 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; background: #fff;">
        <h2 style="font-family: 'Frank Ruhl Libre', serif; font-size: 22px; margin: 0 0 8px; text-align: right; color: ${BRAND_NAVY};">כניסה למערכת</h2>
        <p style="color: #666; margin: 0 0 24px; text-align: right; font-size: 14px;">הזן את כתובת המייל שלך — נשלח לך קוד כניסה</p>

        <form id="email-form" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label for="email" style="display: block; margin-bottom: 6px; text-align: right; font-weight: 500; color: #333;">אימייל</label>
            <input type="email" id="email" name="email" required autocomplete="email"
              style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; direction: ltr; box-sizing: border-box;" />
          </div>
          <button type="submit" id="email-submit"
            style="padding: 12px; background: ${BRAND_NAVY}; color: #fff; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer; margin-top: 8px;">
            שלח לי קוד
          </button>
          <div id="status-message" style="min-height: 24px; text-align: right; font-size: 14px;"></div>
        </form>
      </div>

      ${renderContactFooter()}

    </div>
  `;

  var form = hostContainer.querySelector('#email-form');
  var emailInput = hostContainer.querySelector('#email');
  var submitBtn = hostContainer.querySelector('#email-submit');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = emailInput.value.trim().toLowerCase();
    if (!email) return;
    await handleSendCode(email, submitBtn);
  });
}

// =============================================================================
// SCREEN 2: CODE ENTRY
// =============================================================================
function renderCodeEntry() {
  hostContainer.innerHTML = `
    <div data-screen="login" style="min-height: 100vh; background: #f5f6fa; padding: 24px 16px; font-family: 'Heebo', sans-serif;">

      <div style="max-width: 420px; margin: 40px auto 16px; background: ${BRAND_NAVY}; color: #fff; padding: 28px 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="font-family: 'Frank Ruhl Libre', serif; font-size: 32px; font-weight: 900; margin: 0 0 4px; letter-spacing: 0.5px;">גד ויספלד</h1>
        <p style="font-size: 15px; margin: 0; opacity: 0.9;">משרד עורכי דין ונוטריון</p>
      </div>

      <div style="max-width: 420px; margin: 0 auto; padding: 32px 24px 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; background: #fff;">
        <h2 style="font-family: 'Frank Ruhl Libre', serif; font-size: 22px; margin: 0 0 8px; text-align: right; color: ${BRAND_NAVY};">הזן את הקוד</h2>
        <p style="color: #666; margin: 0 0 8px; text-align: right; font-size: 14px;">שלחנו קוד בן 6 ספרות לכתובת:</p>
        <p style="color: #333; margin: 0 0 24px; text-align: right; font-size: 14px; font-weight: 500; direction: ltr;">${currentEmail}</p>

        <form id="code-form" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label for="code" style="display: block; margin-bottom: 6px; text-align: right; font-weight: 500; color: #333;">קוד כניסה</label>
            <input type="text" id="code" name="code" required maxlength="6" autocomplete="one-time-code" inputmode="numeric" pattern="[0-9]*"
              style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 22px; text-align: center; letter-spacing: 8px; font-family: 'Courier New', monospace; direction: ltr; box-sizing: border-box;" />
          </div>
          <button type="submit" id="code-submit"
            style="padding: 12px; background: ${BRAND_NAVY}; color: #fff; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer; margin-top: 8px;">
            כניסה
          </button>
          <div id="status-message" style="min-height: 24px; text-align: right; font-size: 14px;"></div>

          <div style="display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; padding-top: 16px; border-top: 1px solid #eee;">
            <button type="button" id="back-btn"
              style="padding: 8px 14px; background: #fff; color: #666; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; cursor: pointer;">
              ← שינוי כתובת מייל
            </button>
            <button type="button" id="resend-btn"
              style="padding: 8px 14px; background: #fff; color: ${BRAND_NAVY}; border: 1px solid ${BRAND_NAVY}; border-radius: 4px; font-size: 13px; cursor: pointer;">
              שלח קוד חדש
            </button>
          </div>
        </form>
      </div>

      ${renderContactFooter()}

    </div>
  `;

  var form = hostContainer.querySelector('#code-form');
  var codeInput = hostContainer.querySelector('#code');
  var submitBtn = hostContainer.querySelector('#code-submit');
  var backBtn = hostContainer.querySelector('#back-btn');
  var resendBtn = hostContainer.querySelector('#resend-btn');

  // Auto-focus the code field
  codeInput.focus();

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var code = codeInput.value.trim();
    if (code.length !== 6) {
      showMessage('הקוד חייב להכיל 6 ספרות', '#c00');
      return;
    }
    await handleVerifyCode(code, submitBtn);
  });

  backBtn.addEventListener('click', function () {
    renderEmailEntry();
  });

  resendBtn.addEventListener('click', async function () {
    await handleResendCode(resendBtn);
  });
}

// =============================================================================
// SHARED — Contact footer
// =============================================================================
function renderContactFooter() {
  return `
    <div style="max-width: 420px; margin: 16px auto 0; padding: 16px 20px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center; font-size: 13px; color: #555; line-height: 1.7;">
      <div style="color: ${BRAND_NAVY}; font-weight: 700; margin-bottom: 6px;">בית אמות משפט · שדרות שאול המלך 8, תל אביב-יפו</div>
      <div>טל׳: 03-6919797 · 03-5552970 · פקס: 03-6916262</div>
      <div style="direction: ltr; margin-top: 4px;">gadlawnotary@gmail.com</div>
    </div>
  `;
}

// =============================================================================
// HANDLERS — Supabase calls
// =============================================================================
async function handleSendCode(email, submitBtn) {
  submitBtn.disabled = true;
  submitBtn.textContent = 'שולח קוד...';
  showMessage('', '');

  var result = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (result.error) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'שלח לי קוד';
    showMessage(translateError(result.error.message), '#c00');
    return;
  }

  currentEmail = email;
  renderCodeEntry();
  // After re-render, show a confirmation message in the new screen
  showMessage('הקוד נשלח! בדוק את המייל שלך', '#080');
}

async function handleVerifyCode(code, submitBtn) {
  submitBtn.disabled = true;
  submitBtn.textContent = 'מתחבר...';
  showMessage('', '');

  var result = await supabase.auth.verifyOtp({
    email: currentEmail,
    token: code,
    type: 'email',
  });

  if (result.error) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'כניסה';
    showMessage('קוד שגוי או פג תוקף — נסה שוב', '#c00');
    return;
  }

  showMessage('התחברת בהצלחה!', '#080');
  // The app's main.js auth listener will detect the session and redirect to the main screen
}

async function handleResendCode(resendBtn) {
  resendBtn.disabled = true;
  resendBtn.textContent = 'שולח...';

  var result = await supabase.auth.signInWithOtp({
    email: currentEmail,
    options: {
      shouldCreateUser: false,
    },
  });

  resendBtn.disabled = false;
  resendBtn.textContent = 'שלח קוד חדש';

  if (result.error) {
    showMessage(translateError(result.error.message), '#c00');
    return;
  }

  showMessage('קוד חדש נשלח למייל', '#080');
}

// =============================================================================
// ERROR TRANSLATOR — convert Supabase errors to user-friendly Hebrew
// =============================================================================
function translateError(errorMessage) {
  if (!errorMessage) return 'שגיאה לא ידועה';
  var msg = String(errorMessage).toLowerCase();

  if (msg.indexOf('rate limit') !== -1 || msg.indexOf('429') !== -1) {
    return 'נשלחו יותר מדי בקשות. אנא המתן דקה ונסה שוב.';
  }
  if (msg.indexOf('invalid') !== -1 && msg.indexOf('credentials') !== -1) {
    return 'פרטי הזיהוי שגויים';
  }
  if (msg.indexOf('user not found') !== -1 || msg.indexOf('signups not allowed') !== -1) {
    return 'משתמש לא רשום במערכת. פנה למנהל המערכת.';
  }
  if (msg.indexOf('expired') !== -1 || msg.indexOf('invalid otp') !== -1 || msg.indexOf('token has expired') !== -1) {
    return 'הקוד שגוי או פג תוקף — נסה שוב';
  }
  if (msg.indexOf('network') !== -1 || msg.indexOf('failed to fetch') !== -1) {
    return 'בעיית רשת. בדוק את החיבור לאינטרנט.';
  }
  if (msg.indexOf('email') !== -1 && msg.indexOf('valid') !== -1) {
    return 'כתובת מייל לא תקינה';
  }

  // Fallback — return the original message so we still see what went wrong
  return errorMessage;
}// =============================================================================
// HELPER — Show status message
// =============================================================================
function showMessage(text, color) {
  var el = hostContainer.querySelector('#status-message');
  if (!el) return;
  el.textContent = text;
  el.style.color = color || '';
}