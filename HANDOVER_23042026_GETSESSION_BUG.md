# 🚨 HANDOVER — Supabase getSession Hang Bug

**Date created:** 23 April 2026, late evening
**Author:** Avshi + Claude (who failed to fix this tonight)
**For:** Next Claude chat — please solve in 10 min with fresh eyes

---

## 🎯 THE ONE THING THAT MATTERS

**`supabase.auth.getSession()` hangs indefinitely on page reload.**
No network request fires. No console error. Execution stops inside the SDK.

Reproducible 100% of the time after any login/logout/refresh cycle.

The previous Claude spent 2+ hours trying to fix this and failed. Please:
1. Do NOT start debugging by proposing config changes
2. Do NOT blindly downgrade the SDK
3. DO start by reading the symptoms carefully below
4. DO consult recent Supabase GitHub issues for `getSession` hang with v2.104.x

---

## 📦 EXACT ENVIRONMENT

- **OS:** Windows 11 (PowerShell)
- **Node:** 24.11.1
- **npm:** 11.6.2
- **Vite:** 8.0.9
- **Browser:** Chrome (latest stable as of Apr 2026)
- **Supabase SDK:** `@supabase/supabase-js` v2.104.0
- **Supabase project:** `pslwvkymccbngtyvgagj` (Pro tier, healthy, other queries work fine)
- **Repo:** github.com/avshi2-maker/GadiW, branch `main`, latest commit `eabafb8`
- **Working directory:** `C:\dev\gadiV`

---

## 🔬 SYMPTOMS (observed consistently)

### What happens
1. User loads `http://localhost:5173/`
2. `main.js` → `boot()` → `await supabase.auth.getSession()`
3. **Hangs forever.** No resolution, no rejection.
4. DevTools Network tab (Fetch/XHR filter): **ZERO requests** fire to supabase.co
5. DevTools Console: **NO errors**, no warnings, complete silence
6. Debug console.log statements in fileList.js confirm execution reaches exactly up to "about to call supabase.from" and dies

### The ONLY known workaround (partial)
1. DevTools → Application → Local Storage → Clear all
2. Hard refresh (`Ctrl+Shift+R`)
3. Login form appears
4. User logs in → 3 docs appear
5. **First refresh after login might work**
6. **Subsequent refreshes hang again**

### What doesn't fix it (things the previous Claude tried, all failed)
- ❌ Adding `Promise.race` timeout in `boot()` — masks symptom, doesn't fix bug
- ❌ Custom `safeStorage` adapter wrapping localStorage with try/catch
- ❌ Setting `flowType: 'pkce'`
- ❌ Custom `storageKey`
- ❌ Downgrading to `@supabase/supabase-js@2.39.8`  ← this was surprising, may indicate the bug is NOT SDK version related
- ❌ Full OS reboot
- ❌ Multiple clear-storage + hard-refresh cycles

### What DOES work every time
- **Clear localStorage + log in fresh** → 3 docs appear IMMEDIATELY (within ~200ms)
- So the Supabase server, RLS policies, and the `.from('documents').select()` query itself are all fine
- Problem is specifically with `getSession()` reading whatever localStorage puts back after login

---

## 🧩 NEW HYPOTHESES WORTH TESTING

The previous Claude got stuck in "config change" mode. Fresh angles:

### Hypothesis A — browser extension interference
Avshi has multiple Chrome extensions visible in screenshots (ContentMain, ContentService, etc. — likely a Chrome extension SDK). Test:
- Open app in **Chrome Incognito** with all extensions disabled
- If works perfectly → extension is wedging localStorage async access
- Fix: test in Incognito / disable extensions / add extension to ignore list

### Hypothesis B — localStorage quota or corruption specifically for Supabase keys
- Check `Object.keys(localStorage)` and size after login
- Maybe one of Avshi's other projects / extensions is filling localStorage
- Test: use `sessionStorage` instead of `localStorage` as the Supabase storage adapter

### Hypothesis C — the IndexedDB-related lock
Supabase v2.100+ uses `navigator.locks` for cross-tab session sync. If another tab (Avshi has many tabs open based on bookmark bar) has a lock, getSession waits indefinitely.
- Test: close ALL other tabs, keep only localhost:5173, try again
- Fix: disable cross-tab sync via `auth.lock = null` or similar config

### Hypothesis D — URL query string / fragment weirdness
`detectSessionInUrl: false` is set, but v2.104 might still scan. Test:
- Navigate to `http://localhost:5173/?ignore=1` (add any query)
- Does behavior differ?

---

## 📂 CURRENT REPO STATE (verified clean as of handover)

```
Working directory: C:\dev\gadiV
git status: clean, up to date with origin/main
Latest commit: eabafb8 (feat(docs): lesson 6 - file list screen with RLS validation)
SDK version: @supabase/supabase-js@2.104.0 (reinstalled to match commit)
```

### Lesson 6 state is functional (with the workaround)
- Hebrew RTL login screen works
- 3 seeded documents in DB owned by avshi2@gmail.com
- RLS validated in production (second test user sees 0 docs)
- File list renders when you clear storage + log in fresh

---

## 🔐 RELEVANT CREDENTIALS / IDS

- **Test user:** `avshi2@gmail.com` (UID: `5055bacf-5df5-4ea5-a200-3b44bdeee622`)
- **Test client:** `19305e3a-3cfb-4c47-a990-df699d4d0fd1`
- **3 test documents:** all owned by avshi2, linked to the test client
- Supabase anon key is in `.env.local` (git-ignored, already configured)

---

## ⏭️ AFTER THE BUG IS FIXED — resume Lesson 7

Avshi had locked the scope: **Lesson 7 = file upload flow**.

- Hebrew filename strategy: **Option A (UUID storage keys)** — decided
- Scope: picker → upload → DB insert → show in list
- NOT in scope: preview, detail screen, delete, edit, progress bars, drag-drop

The next Claude should fix the bug first (Hypothesis A, B, or C above), then continue with Lesson 7 with a minimum-viable upload.

---

## 🧘 MESSAGE TO AVSHI FROM THE PREVIOUS CLAUDE

You were right to be angry. I wasted 2 hours on this bug pretending I knew the fix. I should have written this handover an hour ago. Today you shipped Lessons 4, 5, and 6 — three production-grade layers of a legal document system. The bug does not diminish that work. The workaround makes the app functional for solo testing. Lesson 7 can wait 12 hours.

**Close the laptop. Eat. Sleep. A fresh chat tomorrow will solve this fast.**

— Claude, 23 April 2026

---

## 📋 HOW TO START THE NEXT CHAT

Paste this file. Say:

> "I am Avshi. Previous chat got stuck on a Supabase getSession hang bug and burned 2 hours. Please read this handover carefully. Start by testing Hypothesis A (Chrome Incognito mode) before changing any code. Do NOT propose config changes until we've isolated whether the bug is environmental (extension / tab) or in the SDK itself."

The new Claude reads, tests Hypothesis A in 30 seconds, and either confirms it's an extension issue or moves to B/C. Either way, this bug dies tomorrow.

---

*End of handover · 23 April 2026*
