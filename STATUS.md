# STATUS — GadiW Project

> Living document. Update at the END of every work session.

---
## Current phase
**LESSON 9A COMPLETE** — Search + filter UI on file list (client-side filtering, AND logic, 4 dimensions: text/tag/direction/client). Auto-populated dropdowns from actual data, live result count, clear-filters button, empty-state UX. Upload form validation hardened (client + tag required, prevents docs_has_owner constraint violations). Ready for Lesson 9D (in-app bulk upload).

---

## ⚠️ PROJECT-WIDE RULE (locked 24/04/2026 after SDK wedge bug)

**ALL Supabase data operations use direct REST fetch — NOT the SDK.**

This applies to:
- Queries (SELECT) → `fetch(SUPABASE_URL + '/rest/v1/table?...')`
- Inserts (INSERT) → `fetch(... method: 'POST')`
- Updates (UPDATE) → `fetch(... method: 'PATCH')`
- Deletes (DELETE) → `fetch(... method: 'DELETE')`
- Storage uploads → `fetch(SUPABASE_URL + '/storage/v1/object/...')`
- Storage signed URLs → `fetch(SUPABASE_URL + '/storage/v1/object/sign/...')`

**SDK is ONLY used for auth:** `signInWithPassword`, `signOut`, `onAuthStateChange`.

**Required headers on every REST fetch:**
- `apikey: SUPABASE_ANON_KEY`
- `Authorization: Bearer ' + accessToken`  (from session)
- `Content-Type: application/json`

**Why:** @supabase/supabase-js wedges silently on page reload due to navigator.locks bug. Reference implementation: `src/screens/fileList.js`. RLS is still enforced — REST goes through PostgREST same as the SDK would.

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
- 24/04/2026 — Lesson 7 Phase A: Pre-flight pre-checks. Discovered documents schema (13 cols, uploaded_by auto-fills auth.uid), storage bucket config (private, 50MB limit), clients schema, doc_direction enum (פנימי/התקבל/נשלח)
- 24/04/2026 — Lesson 7 Phase B: Blue "➕ העלאת מסמך" button added to fileList.js header, wired with placeholder handler
- 24/04/2026 — Lesson 7 Phase C: Created src/screens/uploadForm.js — Hebrew RTL form with file picker, doc_tag, direction dropdown, doc_date (today default), client dropdown (REST-fetch populated), description textarea, cancel button. Form UI only, no upload logic yet.
- 24/04/2026 — Lesson 7 Phase C: Wired fileList.js → renderUploadForm with onCancel/onSuccess callbacks for navigation
- 24/04/2026 — Lesson 7 Phase D: Real upload logic — 2 REST calls (Storage POST + documents INSERT), progress states, Hebrew error/success messages, auto-return to list on success
- 24/04/2026 — Lesson 7 Phase D: Hebrew filename bug caught in real-world test — Supabase Storage rejects non-ASCII keys. Fixed by sanitizing storage path (timestamp + random suffix + ASCII extension) while preserving original Hebrew name in documents.file_name column
- 24/04/2026 — Lesson 7 Phase G: Tested 3 file types successfully — PDF (Sapir_Wellness_Engine_NDA.pdf), DOCX, JPG with Hebrew filename (חישובי שיפועים.jpg)
- 24/04/2026 — Lesson 7 verified in DB: documents row correctly linked to storage object, RLS-enforced ownership via uploaded_by auto-fill, storage object metadata matches DB (size, mimetype, eTag integrity)
- 24/04/2026 — Lesson 7 IDEAS_PARKING: bulk USB migration strategy documented (3-tier approach: Python batch script + in-app bulk upload + future OCR) — deferred to 
Lesson 9
- 25/04/2026 — Lesson 8 Phase A: Pre-flight confirmed bucket still private. Created src/screens/fileDetail.js stub. Made fileList.js rows clickable with hover effects, wired to renderFileDetail with onBack callback
- 25/04/2026 — Lesson 8 Phase B: Detail screen UI complete — navy header with filename/mime/size, action buttons (download + preview), 5-field metadata grid (תיוג, כיוון, תאריך, לקוח, תיאור), footer with upload time + UUID. Single REST call with FK join to clients table for client name display
- 25/04/2026 — Lesson 8 Phase C: Real download via signed URLs — first attempt used <a href download> attribute, but cross-origin blocked it (file opened in tab, lost Hebrew filename). Fixed with Blob approach: fetch bytes → create blob URL → trigger same-origin download → preserves Hebrew filename across all 3 file types
- 25/04/2026 — Lesson 8 Phase D: Inline preview with smart MIME detection — PDF in iframe (700px scrollable), images inline (max-width 100%), DOCX/other shows friendly orange "not available" fallback. Toggle behavior: click preview again → hides. Smooth scroll to preview area on open
- 25/04/2026 — Lesson 8 verified: all 15 end-to-end tests passed (login, list, hover, click row, detail, back, upload form, cancel, download all 3 types with Hebrew names, preview PDF + JPG + DOCX fallback, preview toggle, F5 refresh, logout, console clean)
- 25/04/2026 — Lesson 8 IDEAS_PARKING: DOCX inline preview deferred (3 options analyzed: Microsoft Viewer rejected for client privacy, mammoth.js noted for post-Phase 1, status quo shipped for now)
- 26/04/2026 — Lesson 9 split into 4 mini-lessons (9A search, 9D bulk, 9B mobile, 9C Python migration) due to scope. Order locked: 9A → 9D → 9B → 9C
- 26/04/2026 — Lesson 9A Phase A: Pre-flight — added 5 test clients (TEST-002 to TEST-006), redistributed 13 docs across all 6 clients via SQL UPDATE for filter testing
- 26/04/2026 — Lesson 9A Phase A bug discovered: clients table RLS policy `users_own_clients (created_by = auth.uid())` blocked detail screen JOIN for clients with NULL created_by. Fix: UPDATE clients SET created_by = user_uuid. Future intake forms via REST auto-fill via column_default = auth.uid()
- 26/04/2026 — Lesson 9A Phase B: fileList.js rewritten with filter panel (search box + 3 dropdowns: tag/direction/client), live client-side filtering, result count "מציג X מתוך Y מסמכים", smart empty state with 🔍 icon. Architecture: fetch ALL docs once, filter in memory — instant UX up to ~5,000 docs
- 26/04/2026 — Lesson 9A Phase B: filter dropdowns auto-populated from actual data (unique tags + unique clients found in user's documents). Embedded REST query with FK join: `clients(full_name)` for client names
- 26/04/2026 — Lesson 9A Phase D: upload form validation hardened — client now required ("בחר לקוח (חובה)"), doc_tag now required ("חיוני לחיפוש"). Red field highlight (3sec) on validation failure. Prevents future docs_has_owner constraint violations and ensures all docs are searchable by tag
- 26/04/2026 — Lesson 9A IDEAS_PARKING: full client intake form (53 fields, 9 categories from customer_intake.xlsx) deferred to Phase 2; external/AI search fallback rejected for Phase 1 (Decision #1: zero AI; lawyer privacy)
- 26/04/2026 — Lesson 9A verified: 11/11 filter tests passed (search, 3 dropdowns, AND combo, clear button, empty state, result count, row click, console clean) + 5/5 validation tests passed (block empty client, block empty tag, red field highlight, success path, dropdown label "בחר לקוח (חובה)")
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
### Remaining lessons toward Phase 1 ship
- Lesson 9D: In-app bulk upload (multi-file picker, drag-drop, table view, "apply to all" shared metadata)
- Lesson 9B: Mobile responsive (CSS media queries, touch targets, mobile file picker)
- Lesson 9C: Python USB migration script (scan_usb.py + migrate_to_gadiw.py + Excel template)
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
*Last updated: 26 April 2026 · End of Lesson 9A (Search + filter UI, RLS bug fixed, upload validation hardened)*
