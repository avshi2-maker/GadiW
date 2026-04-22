# STATUS — GadiW Project

> Living document. Update at the END of every work session.

---

## Current phase

**LESSON 2** — Architecture Day COMPLETE. Ready for Lesson 3 (Vite setup + project skeleton).
---

## Where we are right now

Date: 21 April 2026  
Last session: Today

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
### Tools confirmed working
- Git CLI (clone, add, commit, push)
- PowerShell terminal
- VS Code installed
- Node.js installed
- Python 3 installed
- GitHub auth (push works)

---

## What is NOT done yet

### Remaining in Lesson 1
-
- Final foundation commit + verify on GitHub

### Remaining in Lessons 2+
- Design Phase 1 architecture (cloud document archive)
- Set up Supabase Storage bucket for files
- Build first HTML page (file upload UI)
- Connect Supabase Auth (Gadi-only login)
- Implement upload + list + download + organize
- Deploy to GitHub Pages
- Test with Gadi's real files (anonymized)

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

*Last updated: 21 April 2026 · End of Lesson 1 (in progress)*
