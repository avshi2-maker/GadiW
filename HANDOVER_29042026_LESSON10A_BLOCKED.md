# HANDOVER — Lesson 10A BLOCKED
## GitHub Pages Deployment — Bug Confirmed in CODE, Not Deployment

**Date:** 29 April 2026 (afternoon session, ~3 hours)
**Status:** ❌ BLOCKED — `createClient` throws "Invalid supabaseUrl" at module init in BOTH local preview AND deployed site
**Days until Gadi USA trip:** 11 days (departs ~10 May 2026)
**Operator state:** Frustrated (rightfully — session ran too long). Has working local DEV app (`npm run dev`).

---

## TL;DR for next-session Claude

**The bug is in CODE, not in deployment.** This was confirmed by Avshi running `npm run preview` (production build served locally with `.env.local` secrets) — it threw the **identical** error as the deployed site. Same error, same bundle hash, same stack trace.

**Implication:** Every minute spent on GitHub Actions, secrets, workflow YAML, package-lock.json, and cache-busting was solving a non-problem. Deployment works fine. The production build itself is broken — locally and on GitHub Pages alike. Only `npm run dev` works.

**Next-session priority: open `src/lib/supabase.js`, add a `console.log` immediately before `createClient()` to see what value is actually being passed at runtime in a production build, then trace from there.**

**Critical pacing note:** Avshi is not a coder. He copy-pastes commands. Keep instructions atomic — one command at a time. He told me "too difficult I am not a coder!!!" mid-session because I gave him a code block to integrate by hand. Use `code path` to open files, then Ctrl+A, Delete, paste full new content, Ctrl+S. Never "edit this file to look like X."

---

## The bug, stated precisely

### Three environments, one symptom — except dev

| Environment | Command | Result |
|---|---|---|
| Local dev | `npm run dev` → `localhost:5174` | ✅ WORKS — login screen, full app functional |
| Local preview | `npm run build` + `npm run preview` → `localhost:4173/GadiW/` | ❌ FAILS — "Invalid supabaseUrl" |
| Deployed | `https://avshi2-maker.github.io/GadiW/` | ❌ FAILS — "Invalid supabaseUrl" (identical error) |

**Dev mode works, production build fails. This rules out env vars, secrets, network, deployment.** Dev and prod use the same `.env.local` file. The only thing that changes is whether Vite is running in dev mode or producing a built bundle.

### The error
```
Uncaught Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
    at ui (index-DkNcNqXW.js:24:42535)        ← Supabase URL validator
    at new fi (index-DkNcNqXW.js:24:42818)    ← createClient itself
    at pi (index-DkNcNqXW.js:24:45990)        ← caller of createClient
    at index-DkNcNqXW.js:25:386               ← top-level module init
```

### What we know about the bundle
Console diagnostic on the deployed bundle (also true of local preview bundle, same hash):
- Supabase URL `https://pslwvkymccbngtyvgagj.supabase.co` appears 5 times in the bundle as a string literal
- Anon key (JWT) appears 5 times, 208 chars, 3 segments — correct shape
- No `undefined`, `null`, or empty placeholders for these values

So the values *are* in the bundle. The mystery: the values are present as string literals, but `createClient` still rejects the URL at runtime in production builds.

### Where the call happens
`src/lib/supabase.js`. Final state at end of session (after a refactor that did NOT fix the bug):

```javascript
import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase env vars...');
}

export var supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      lock: function (name, acquireTimeout, fn) { return fn(); },
    },
  }
);
```

The `if (!...)` guard does NOT trigger — meaning `import.meta.env.VITE_SUPABASE_URL` is truthy at the moment the guard runs. But `createClient` immediately below still rejects it. Strange. This suggests something about how Vite inlines `import.meta.env.VITE_SUPABASE_URL` in a *production* build — the value present at the guard check may differ from the value passed into `createClient` two lines later. Or there's a property-access / proxy issue with `import.meta.env` in prod that doesn't exist in dev.

### Suspicious clue
The bundle hash `index-DkNcNqXW.js` matches a hash from a previous build (Vite uses content-addressable hashing — same input produces same hash). The hash didn't change across our edits. This may simply mean Vite produced an identical bundle, OR it may mean there's a build cache somewhere that needs clearing.

---

## What was actually shipped today (still wins, even though deploy is blocked)

1. **`.env.example` corrected** — was documenting wrong variable names (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`); fixed to match code (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
2. **`vite.config.js` created** — adds `base: '/GadiW/'` for GitHub Pages subpath.
3. **`.github/workflows/deploy.yml` created** — full GitHub Actions Pages workflow. Verified working: build succeeds, secrets inject correctly (confirmed in expanded build log: `env: VITE_SUPABASE_URL: ***`), bundle uploads, deploy step runs green.
4. **GitHub Secrets configured** — `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set at repo level.
5. **GitHub Pages source switched** — from "Deploy from a branch" to "GitHub Actions".
6. **`package-lock.json` regenerated** — first build failed because `package-lock.json` was out of sync (missing `@emnapi/core`, `@emnapi/runtime` for Linux runner). Fixed by `Remove-Item node_modules, package-lock.json` then `npm install`. Lockfile now correct.
7. **`src/lib/supabase.js` refactored** — removed intermediate `var SUPABASE_URL = import.meta.env...` pattern; passes `import.meta.env.*` directly to `createClient`. Did not fix bug. Code is cleaner — keep.

**Net result:** the deployment pipeline is fully built and verified working. The remaining bug is purely in how the app itself behaves in a production build, regardless of where that build is served from.

---

## Commits pushed today

```
158ecbd  Lesson 10A: GitHub Pages deployment via Actions
cc2cc82  Lesson 10A fix: regenerate package-lock.json (sync @emnapi for Linux runner)
[next]   Lesson 10A WIP: pass env directly to createClient (did not fix prod-build bug)
```

Previous session's last commit: `1f174b4` (Lesson 9C complete).

**Verify on resume:** `git status` should be clean. If not, the supabase.js edit needs committing.

---

## Hypotheses for next session (ranked)

### Hypothesis 1 — `import.meta.env` proxy/getter behavior in prod (MOST LIKELY)
Dev mode and prod mode handle `import.meta.env` differently in Vite. In dev, it's a runtime-evaluated proxy. In prod, references like `import.meta.env.VITE_SUPABASE_URL` are *replaced at build time* with string literals — but only direct property access on `import.meta.env`. Other patterns (destructuring, dynamic property access, computed property names) may not get replaced and end up as `undefined` at runtime.

Worth checking: are there any other files that do something other than direct `import.meta.env.VITE_X` access? Anything like `const env = import.meta.env; env[varName]`? That would silently fail in prod.

### Hypothesis 2 — Stale Vite build cache
Same bundle hash across multiple builds is suspicious. Vite caches in `node_modules/.vite/`. Try:
```powershell
Remove-Item -Recurse -Force node_modules/.vite
npm run build
npm run preview
```
If a fresh build produces a different hash AND fixes the error, this was it.

### Hypothesis 3 — Vite 8.x breaking change
The actually-installed version is `vite v8.0.10` (per build log); package.json has `^8.0.9`. Vite 8 is unusually new and may have breaking changes around env handling that don't exist in older versions. Worth checking Vite 8.x changelog. Worst case: pin to Vite 5.x which has years of stability around `import.meta.env`.

### Hypothesis 4 — Add diagnostic console.log to supabase.js (HIGHEST-VALUE TEST)
Add three lines RIGHT before `createClient`:
```javascript
console.log('URL value:', import.meta.env.VITE_SUPABASE_URL);
console.log('URL type:', typeof import.meta.env.VITE_SUPABASE_URL);
console.log('URL length:', String(import.meta.env.VITE_SUPABASE_URL || '').length);
```
Build, preview, look at console BEFORE the error. This shows literally what value is being seen at the call site. If type isn't 'string' or value isn't the expected URL, that's the answer.

### Hypothesis 5 — Escape hatch
If hypotheses 1-4 don't yield a fix in 60 minutes: build a minimal Vite + Supabase + GitHub Pages template in a fresh folder, confirm it deploys and runs in production mode, then port the existing screens into it. This is a 30-minute job with a clear head.

---

## Plan for next session

### Phase 1 — Diagnostic (15 min, START HERE)
1. `cd C:\dev\gadiV`
2. `git pull` (in case anything changed)
3. `git status` — confirm clean
4. Add console.log lines from Hypothesis 4 to `src/lib/supabase.js` (next-session Claude: provide the exact final file content, not a "add these lines" instruction)
5. Try Hypothesis 2 cache clear: `Remove-Item -Recurse -Force node_modules/.vite`
6. `npm run build`
7. `npm run preview` → open the URL it prints
8. Look at browser console — what do the diagnostic logs show before the error?

That tells us in one shot whether the value at the call site is correct or not.

### Phase 2 — Targeted fix
Based on Phase 1 results, apply specific fix. Don't speculate further until we have the diagnostic data.

### Phase 3 — Verify locally first
Once `npm run preview` shows the login screen, THEN push and watch the deployed version work.

### Phase 4 — Branding (Lesson 10B)
Brand assets ready (see below). Fast once 10A is done.

### Phase 5 — Onboarding (Lesson 10C)
Live session with Gadi, recommended date May 7 or May 8.

### Plan B — If deploy stays broken
Onboard Gadi against the LOCAL app via screen-share. Avshi drives. Defer deployment to Phase 1.5 (post-USA-trip), folding it into the ownership transfer step. Two-week slip on deployment, zero slip on Gadi onboarding. Avshi is open to this.

---

## Brand assets ready for Lesson 10B

From Avshi's screenshots provided this session:

- **Firm name (Hebrew):** גד ויספלד
- **Subtitle (Hebrew):** משרד עורכי דין ונוטריון
- **Brand color:** Deep navy (estimate `#1E2D5C` — confirm with `imagecolorpicker.com` from screenshot)
- **Logo direction:** White logo on navy background (Avshi's preference)
- **Address:** בית אמות משפט · שדרות שאול המלך 8, תל אביב-יפו
- **Phone 1:** 03-6919797
- **Phone 2:** 03-5552970
- **Fax:** 03-6916262
- **Email:** gadlawnotary@gmail.com

Avshi explicitly said: "no need for draft letter, use the screenshots for logo & details."

---

## Critical context for next-session Claude

### Avshi is NOT a coder
- Copy-paste only. Step-by-step exact commands.
- NEVER say "edit the file to look like X" — instead: open file with `code path`, Ctrl+A, Delete, paste full new content, Ctrl+S.
- One command per message. Wait for output. Then next.
- He lost patience at the 3-hour mark today. Pace accordingly.

### What's working RIGHT NOW
- Local DEV app (`npm run dev` → localhost:5174) — fully functional, all 9 lessons of features
- Migration scripts (`scan_usb.py` + `migrate_to_gadiw.py`) — proven 5/5
- Supabase backend — clients, documents, RLS all working
- GitHub Actions deployment pipeline — builds and deploys without errors

### What's broken
- Production build (whether served locally via `npm run preview` or via GitHub Pages) — throws "Invalid supabaseUrl" at module init, before any UI renders

---

## Parked items (carry forward)

From earlier handovers + this session:
1. Cleanup test/leftover Supabase data (6 test clients incl. לקוח בדיקה, חברת בנייה אבני דרך בע"מ; 32 leftover test docs).
2. Friendly file_name on download (currently UUID).
3. Phase 1.5 ownership transfer SQL (post-USA-trip).
4. Real Gadi USB migration session.
5. `migrate_to_gadiw.py` v2 polish — rename `--sheet` to `--file`.
6. Excel save vs scan timestamp note in migration log.
7. **NEW:** Node.js 20 actions deprecation warning (June 2026). Bump action versions when they release Node 24-compatible.
8. **NEW:** Investigate `var SUPABASE_URL = import.meta.env...` declarations in 4 screen files (`fileDetail.js`, `fileEdit.js`, `fileList.js`, `uploadForm.js`). They import `supabase` from the shared lib but ALSO read env vars directly. Likely dead code. Remove if unused.
9. **NEW:** `dist/` folder may exist locally from build — gitignored, but check.

---

## Resume instructions for next session

1. Open PowerShell.
2. `cd C:\dev\gadiV`
3. `git pull`
4. Read this file: `HANDOVER_29042026_LESSON10A_BLOCKED.md`
5. Tell Claude:
   > **"I'm back. Lesson 10A is blocked. The bug is CONFIRMED in code, not deployment — `npm run preview` shows the same Invalid supabaseUrl error as the deployed site. Read HANDOVER_29042026_LESSON10A_BLOCKED.md. Start with Phase 1: clear Vite cache, add diagnostic console.log to supabase.js, run preview, check console output. I'm not a coder — exact paste-able commands one at a time."**

---

## Honest postmortem

What went wrong on the Claude side:
1. **Did not act on the most diagnostic test soon enough.** Avshi DID run `npm run preview` and the same error appeared. That single fact should have redirected the entire session away from deployment-layer debugging. Instead, Claude misread the situation and kept chasing GitHub-side issues for another ~90 minutes.
2. **Mixed contexts in single messages.** Pasted PowerShell commands and browser-console JavaScript in the same message without clearly labeling which window each belongs to. Caused 30 lines of red errors when JS hit PowerShell.
3. **Refactored code as a "replace this" code block** instead of as step-by-step actions. Avshi correctly pushed back: "too difficult I am not a coder."
4. **Wrote a first-draft handover with a factual error** — claimed Avshi didn't run `npm run preview` when in fact he had. Avshi caught the lie. Corrected here. Lesson: only state facts witnessed in the conversation. If unsure, ask.

What went right:
- Caught the markdown-link false alarm without pursuing it
- Caught the missing `vite.config.js` and out-of-sync `package-lock.json` quickly
- Build pipeline IS correct — that work is banked permanently

What to carry forward:
- LISTEN to what Avshi tells you. If he says he ran `npm run preview` and saw the error, BELIEVE HIM and pivot immediately.
- Always state explicitly: "this command goes in PowerShell" or "this goes in browser DevTools Console"
- Default assumption: Avshi runs each command exactly as pasted, in sequence. Anything more complex needs to be broken down BEFORE asking him to do it.
- When writing handovers, only state facts you witnessed in the conversation. If unsure, ask.

---

*End of handover · Lesson 10A blocked · Bug isolated to production builds · Resume tomorrow with `npm run preview` + diagnostic logs*
