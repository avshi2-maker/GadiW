# STATUS — GadiW Project

> Living document. Update at the END of every work session.

---

## Current phase
**LESSON 5** — Auth COMPLETE. Hebrew RTL login screen working end-to-end with Supabase. Ready for Lesson 6 (file list screen + fetch).
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
-- Lesson 6: File list screen (Screen 2) + fetch + search
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
*Last updated: 23 April 2026 · End of Lesson 5 (Auth complete)*

