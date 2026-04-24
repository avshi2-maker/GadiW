# STATUS — GadiW Project

> Living document. Update at the END of every work session.

---

## Current phase
## Current phase
**LESSON 6.5 COMPLETE** — SDK wedge bug fixed (downgrade + REST fetch pattern). Hebrew RTL file list stable across page refreshes. Ready for Lesson 7 (upload flow + storage integration).
---

## Where we are right now

Date: 23 April 2026  
Last session: Today (Lesson 3)

### Completed today
- Cloned GadiW repo to `C:\dev\gadiv`
- Removed obsolete Day 1 mockup `index.html`
- Added `.gitignore` (blocks secrets, junk, generated files)
- Added `.env.example` (template for API keys)
- Upgraded `README.md` (project description, tech stack, philosophy)
- Created this `STATUS.md`
- Created IDEAS_PARKING.md (with first test entry)
- Set up VS Code as daily workspace
- Verified clean working tree (Lesson 1 closed)
- 22/04/2026 — Lesson 2 Architecture Day complete (7 decisions locked)
- 22/04/2026 — ARCHITECTURE.md created with full spec (623 lines)
- 22/04/2026 — IDEAS_PARKING updated with Comet/Gemini research note + Gadi holiday
- 23/04/2026 — Lesson 3 Project Skeleton Day complete
- 23/04/2026 — Vite installed (v8.0.9) + npm dependencies
- 23/04/2026 — HMR demo confirmed working
- 23/04/2026 — Folder structure built per ARCHITECTURE.md (lib/screens/components/styles/utils)
- 23/04/2026 — 14 placeholder files created with TODO markers for upcoming lessons
- 23/04/2026 — index.html customized for Hebrew/RTL with Frank Ruhl Libre + Heebo fonts
- 23/04/2026 — .gitignore merged (Vite default + our security rules)
- 23/04/2026 — First mega-commit: 21 files, 1028 insertions
- 23/04/2026 — Lesson 4.A Supabase Day complete: dropped wide-open auth_all policies, installed ownership policies (users_own_*) on documents/clients/matters
- 23/04/2026 — documents schema evolved: matter_id nullable, client_id added (FK to clients), docs_has_owner CHECK constraint, 2 indexes
- 23/04/2026 — Lesson 4.B/C Storage complete: gadi-documents private bucket created with inbox/ + templates/ folders, 4 storage policies installed
- 23/04/2026 — SQL_CHANGES.md created with full audit trail and verification queries for all SQL executed
- 23/04/2026 — IDEAS_PARKING updated with Hebrew filename handling decision (deferred to storage.js)
- 23/04/2026 — Lesson 5 Auth complete: @supabase/supabase-js installed, src/lib/supabase.js client wired with env vars
- 23/04/2026 — Hebrew RTL login screen (src/screens/login.js) with signInWithPassword against Supabase
- 23/04/2026 — src/main.js boots based on session state, listens to onAuthStateChange for login/logout
- 23/04/2026 — Full auth cycle tested: login, logout, refresh-while-logged-in, refresh-while-logged-out, re-login — all working
- 23/04/2026 — Test user avshi2@gmail.com created in Supabase Auth for dev testing
- 23/04/2026 — .env.local created locally (git-ignored) with VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
- 23/04/2026 — Lesson 6 File List Screen complete: src/screens/fileList.js renders user's documents from Supabase via RLS-filtered query
- 23/04/2026 — Seed data created: 1 test client (TEST-001) + 3 test documents linked to avshi2@gmail.com
- 23/04/2026 — RLS validation test PASSED in production: 2nd user test@example.com correctly sees 0 documents (ownership isolation proven)
- 23/04/2026 — Hardened boot sequence in main.js with 5s getSession timeout + auto-recovery to login screen
- 23/04/2026 — KNOWN BUG parked: getSession() hangs on page reload with persistSession=true; hardening masks it, root cause TBD in Lesson 7
- 24/04/2026 — Lesson 6.5 SDK Wedge Bug FIXED after ~4hr debugging across 3 Claude sessions
- 24/04/2026 — Root cause identified: @supabase/supabase-js v2.104.0 wedges silently on every SDK call (auth + queries) after page reload, due to navigator.locks behavior in Chrome
- 24/04/2026 — Failed fixes attempted: Promise.race timeout, custom safeStorage, flowType pkce, custom storageKey, lock no-op function, Vite cache rebuild, OS reboot, clear site data — all failed
- 24/04/2026 — Working fix #1: downgraded @supabase/supabase-js from 2.104.0 → 2.39.8 (last version before navigator.locks was added)
- 24/04/2026 — Working fix #2: src/main.js boot() reads session directly from localStorage, bypasses broken getSession()
- 24/04/2026 — Working fix #3: src/screens/fileList.js uses direct REST fetch to Supabase (apikey + Bearer token headers) instead of supabase.from() — bypasses SDK wedge for queries
- 24/04/2026 — Logout hardened: try supabase.auth.signOut() with fallback to manual localStorage.removeItem() + window.location.reload()
- 24/04/2026 — Verified working: login → file list (3 docs) → F5 refresh → file list still loads. RLS still enforced (queries go via REST with user's access_token, RLS policies apply server-side same as via SDK)
- 24/04/2026 — Pattern locked: ALL future Supabase queries in this project use direct REST fetch, NOT supabase.from(). SDK only used for auth (signInWithPassword, onAuthStateChange, signOut)
- 24/04/2026 — HANDOVER_24042026_GETSESSION_BUG_v2.md archived (no longer active bug)
### Tools confirmed working
- Git CLI (clone, add, commit, push)
- PowerShell terminal
- VS Code installed
- Node.js installed
- Python 3 installed
- GitHub auth (push works)
- Vite 8.0.9 dev server (HMR working)
- npm 11.6.2
- Node.js 24.11.1
---

## What is NOT done yet

### Remaining lessons toward Phase 1 ship
- Lesson 7: Upload flow + storage integration
- Lesson 8: File detail screen (Screen 3) + preview + download
- Lesson 9: Mobile responsive + polish
- Lesson 10: Deploy to GitHub Pages + Gadi onboarding

-

---

## Active scope (Phase 1)

**Goal:** Replace Gadi USB drive with secure cloud archive — BEFORE his 4-week USA trip.

**In scope:**
- Upload files to Supabase Storage
- List files (search by name, filter by type)
- Download / preview files
- Organize by client / matter
- Secure Gadi-only auth (Supabase Auth + RLS)
- Mobile-friendly view (read-only on phone OK for v1)

**OUT of scope (parked in IDEAS_PARKING):**
- Voice memo transcription
- Meeting recording
- AI letter drafting / templates
- Wife as back-office user
- Multi-user / multi-tenant
- Billing / invoicing
- Calendar / hearings management
- Full CRM features

---

## Key decisions locked

| # | Decision | Locked |
|---|---|---|
| 1 | Phase 1 = cloud archive only | 21/04/2026 |
| 2 | Backup strategy = git only (no GoogleDrive script) | 21/04/2026 |
| 3 | Local folder = `C:\dev\gadiv` (not OneDrive) | 21/04/2026 |
| 4 | Supabase project = `Gadi_W_CRM` (15 tables) | 20/04/2026 |
| 5 | Publishable key = `gadi_l` | 20/04/2026 |
| 6 | Bilingual UI (HE default, EN toggle) | 20/04/2026 |
| 7 | Auth = Supabase (email + TOTP + passkeys) | 20/04/2026 |

---

## Risks + watch list

- ⚠️ **Gadi USA trip deadline** — date TBC, plan around weeks not months
- ⚠️ **Gadi AI fear** — Phase 1 must show ZERO AI features; trust first
- ⚠️ **Beni journal frozen** — do NOT touch; Beni testing in parallel
- ⚠️ **Ironman brain** — every wild idea goes to IDEAS_PARKING immediately

---

## How to resume next session

1. Open PowerShell
2. `cd C:\dev\gadiv`
3. `git pull` (in case anything changed remotely)
4. Open this STATUS.md
5. Tell Claude: "I am back, here is current STATUS.md, continue from where we left off"

---
*Last updated: 24 April 2026 · End of Lesson 6.5 (SDK wedge bug fixed, file list stable)*

