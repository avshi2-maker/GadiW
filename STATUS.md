# STATUS — GadiW Project

> Living document. Update at the END of every work session.

---

## Current phase

**LESSON 9B COMPLETE** — Mobile responsive for Android Chrome. Phases A-G shipped: viewport meta + global touch behaviors, login mobile, file list mobile (header stacked, filters stacked, doc rows stacked), detail mobile (3 buttons stacked, metadata grid 1-col), edit form mobile (full responsive flow), upload form mobile (functional but with parked cosmetic header clipping). All 6 screens tested on Pixel 7 emulation — full user journey works: login → browse → search → view → edit → upload single → upload bulk. Desktop layout unchanged (verified). Bonus: fixed defensive null-check bug in fileDetail.js that was throwing console error after edit→save→navigate flow. Ready for Lesson 9C (Python USB migration).

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

Date: 26 April 2026  
Last session: Today (Lessons 9A + 9D + 9E + 9B all shipped in one day)

### Completed history (chronological)

**Lessons 1-3 (21-23/04/2026) — Foundation**
- Cloned GadiW repo to `C:\dev\gadiv`
- Removed obsolete Day 1 mockup `index.html`
- Added `.gitignore`, `.env.example`, upgraded `README.md`
- Created STATUS.md and IDEAS_PARKING.md
- Set up VS Code as daily workspace
- Lesson 2 Architecture Day complete (7 decisions locked)
- ARCHITECTURE.md created with full spec (623 lines)
- Lesson 3 Project Skeleton: Vite v8.0.9 installed, HMR working, folder structure built per ARCHITECTURE.md

**Lessons 4-5 (23/04/2026) — Supabase + Auth**
- Lesson 4.A: dropped wide-open auth_all policies, installed ownership policies (users_own_*) on documents/clients/matters
- Documents schema: matter_id nullable, client_id added (FK to clients), docs_has_owner CHECK constraint, 2 indexes
- Lesson 4.B/C: gadi-documents private bucket created, 4 storage policies installed
- SQL_CHANGES.md created with full audit trail
- Lesson 5: @supabase/supabase-js installed, Hebrew RTL login screen, src/main.js boots based on session, full auth cycle tested
- Test user avshi2@gmail.com created in Supabase Auth

**Lesson 6 (23/04/2026) — File List**
- src/screens/fileList.js renders user's documents via RLS-filtered query
- Seed data: 1 test client (TEST-001) + 3 test documents
- RLS validation test PASSED in production: 2nd user sees 0 documents
- Hardened boot sequence with 5s getSession timeout
- KNOWN BUG parked: getSession() hangs on page reload (root cause TBD in Lesson 7)

**Lesson 6.5 (24/04/2026) — SDK Wedge Bug FIXED (~4hr debug)**
- Root cause: @supabase/supabase-js v2.104.0 wedges silently on every SDK call after page reload, due to navigator.locks behavior in Chrome
- Failed fixes: Promise.race timeout, custom safeStorage, flowType pkce, custom storageKey, lock no-op, Vite cache rebuild, OS reboot, clear site data
- Working fix #1: downgraded to 2.39.8 (last version before navigator.locks)
- Working fix #2: src/main.js boot() reads session directly from localStorage
- Working fix #3: src/screens/fileList.js uses direct REST fetch with apikey + Bearer token
- Logout hardened with manual fallback
- Pattern locked: ALL future Supabase queries use direct REST fetch, NOT supabase.from()

**Lesson 7 (24/04/2026) — Single Upload**
- Phase A: Pre-flight schema discovery
- Phase B: Blue "➕ העלאת מסמך" button in fileList header
- Phase C: src/screens/uploadForm.js — Hebrew RTL form
- Phase D: Real upload — 2 REST calls (Storage POST + documents INSERT)
- Hebrew filename bug caught — Supabase Storage rejects non-ASCII keys. Fix: ASCII-safe storage path with timestamp + random suffix; Hebrew preserved in documents.file_name
- Tested PDF, DOCX, JPG with Hebrew filenames — all working
- IDEAS_PARKING: bulk USB migration 3-tier strategy documented for Lesson 9

**Lesson 8 (25/04/2026) — Detail + Download + Preview**
- Phase A: src/screens/fileDetail.js stub, clickable rows in fileList
- Phase B: Detail screen UI complete — navy header, action buttons, 5-field metadata grid, footer with upload time + UUID. Single REST call with FK join
- Phase C: Real download via signed URLs + Blob approach (preserves Hebrew filenames across all file types)
- Phase D: Inline preview — PDF in iframe, images inline, DOCX/other shows orange "not available" fallback. Toggle behavior + smooth scroll
- Verified: all 15 end-to-end tests passed
- IDEAS_PARKING: DOCX inline preview deferred (mammoth.js noted for post-Phase 1)

**Lesson 9 split (26/04/2026)** — into 4 mini-lessons (9A/9D/9E/9B/9C)

**Lesson 9A (26/04 morning) — Search + Filter**
- Phase A pre-flight: added 5 test clients (TEST-002 to TEST-006), redistributed 13 docs across all 6 clients
- Bug: clients table RLS policy blocked detail screen JOIN for clients with NULL created_by. Fix: UPDATE clients SET created_by = user_uuid
- Phase B: fileList.js rewritten with filter panel (search + 3 dropdowns), live client-side filtering, smart empty state
- Filter dropdowns auto-populated from actual data
- Phase D: upload form validation hardened — client + tag now required, red field highlight (3sec) on validation failure
- IDEAS_PARKING: full client intake form (53 fields, 9 categories) deferred to Phase 2; external/AI search fallback rejected for Phase 1
- Verified: 11/11 filter tests + 5/5 validation tests passed

**Lesson 9D (26/04 afternoon) — Bulk Upload**
- Lesson 9 plan revised: 9D moved up, 9E inserted (doc edit screen for migration recovery)
- Phase A: drag-and-drop dropzone + multi-file picker, dropzone visual feedback
- Phase B: file selection state as JS array (`selectedFiles[]` single source of truth), `renderFileTable()` re-renders from array, automatic mode switching (0/1/2+ files), duplicate + oversize detection with Hebrew skip alerts
- Phase C: + הוסף קבצים נוספים button, total size footer, smart submit button label
- Phase D: sequential upload loop with for-await (avoids rate limits), per-file 2-step transaction, automatic Storage cleanup on INSERT failure, per-file try/catch isolation
- Phase D validations: bulk-mode requires all row tags, single-mode keeps top-level תיוג validation, mid-batch failures retain failed files for retry
- Phase E: visual progress UI replaces alerts — navy header with progress bar, per-file status icons (⌛/⏳/✅/❌), color-coded backgrounds, inline Hebrew error messages
- RLS data fix: UPDATE clients SET created_by for SQL-seeded test rows
- Network-failure orphan caught: Wi-Fi killed mid-batch left 1 orphan storage file. Cleaned via Storage REST API DELETE from browser console
- IDEAS_PARKING (7 entries): DOCX preview, full intake form spec, search fallback rejected, duplicate filename allowed, filter pills enhancement, network-failure orphan handling for 9C Python, Storage delete protection
- Verified: 10/10 end-to-end tests passed (final docs/storage count match 29=29)

**Lesson 9E (26/04 evening) — Document Edit Screen**
- Phase A: ✏️ ערוך button added to fileDetail.js action bar
- Phase B: created src/screens/fileEdit.js — fetches single doc by id via REST, pre-populates Hebrew RTL form, shows read-only file info banner
- Phase C: real REST PATCH updates documents row, validations match upload form, success state replaces form with green banner: ✅ icon + "המסמך נשמר בהצלחה" + Hebrew DD/MM/YYYY · HH:MM:SS timestamp + manual חזרה למסמך button + auto-navigate
- Phase C polish: success-banner timer increased 2→4 seconds (gives Gadi time to register the save before navigation, trust-building for fear-of-tech user)
- IDEAS_PARKING: (1) Audit trail deferred to Phase 2, (2) Gadi's logo branding scheduled for Lesson 10
- Verified: 6/6 tests pass

**Lesson 9B (26/04 evening) — Mobile Responsive Android**
- Phase A: created src/lib/mobile.css imported in main.js — global touch behaviors (-webkit-tap-highlight-color: transparent, overscroll-behavior, 100dvh viewport, 16px min input font to prevent iOS zoom). Updated viewport meta in index.html (viewport-fit=cover, no maximum-scale lock for accessibility)
- Phase B: login screen mobile via data-screen="login" marker — full viewport edge-to-edge, no card border on phone, centered vertically with min-height 100dvh
- Phase C: file list mobile via data-screen="filelist" + class hooks (.fl-header, .fl-header-buttons, .fl-filter-grid) — header stacked vertically with full-width buttons, 3 filter dropdowns stacked, doc rows transformed from 4-col grid to 1-col stacked layout
- BUG FIX: fileDetail.js had race condition where re-render after edit→save→navigate flow threw "Cannot read properties of null (reading 'addEventListener')" at line 175. Fix: scoped queries to detailContent, added null-check guards before every addEventListener
- Phase D: detail screen mobile via data-screen="filedetail" — page header stacked, 3 action buttons stacked vertically full-width, metadata grid 2-col → 1-col, footer stacked, preview iframe height reduced to 500px on phone
- Phase E: upload form mobile via data-screen="upload" + .up-header class — drop zone responsive, 2-column direction+date stacked, bulk file table per-row redesign with 2-row grid, apply-to-all panel stacked, progress UI rows responsive. KNOWN COSMETIC: header title clipping on mobile (parked Phase 2)
- Phase F: edit form mobile via data-screen="fileedit" — page header stacked, all form fields full-width, 2-column direction+date stacked, save+cancel buttons stacked, success banner remains green-centered
- Phase G: 8-test end-to-end mobile pass on Pixel 7. Full user journey works: login → list → search → detail → download → preview → edit → save → navigate → upload single → upload bulk. Desktop regression confirmed
- IDEAS_PARKING: (1) Upload form header clipping ~30 min Phase 2 fix, (2) Bulk file row text clipping ~45 min Phase 2 fix, (3) Apply-tag-to-all UX confusion ~20 min Phase 2 fix, (4) GadiW Pocket mobile companion app — full Phase 2 spec captured using Beni Pocket as reference template

### Tools confirmed working
- Git CLI (clone, add, commit, push)
- PowerShell terminal
- VS Code installed
- Node.js 24.11.1
- Python 3 installed
- GitHub auth (push works)
- Vite 8.0.9 dev server (HMR working)
- npm 11.6.2

---

## What is NOT done yet

### Remaining lessons toward Phase 1 ship
- Lesson 9C: Python USB migration script (scan_usb.py + migrate_to_gadiw.py + Excel template + retry-cleanup queue + reconciliation SQL)
- Lesson 10: Deploy to GitHub Pages + Gadi's logo branding + Gadi onboarding session

### Phase 2 polish queue (post-trip, low priority)
- Filter pills UX bundle (filter visibility + navigation reset)
- Upload form header mobile clipping
- Bulk file row mobile filename clipping
- "Apply tag to all" visual feedback
- Document edit audit trail
- DOCX inline preview (mammoth.js)
- Search inside document content (OCR + full-text)
- GadiW Pocket mobile companion app (post-Gadi-feedback)

---

## Active scope (Phase 1)

**Goal:** Replace Gadi USB drive with secure cloud archive — BEFORE his 4-week USA trip.

**In scope:**
- Upload files to Supabase Storage ✅
- List files (search by name, filter by type) ✅
- Download / preview files ✅
- Organize by client / matter ✅
- Secure Gadi-only auth (Supabase Auth + RLS) ✅
- Mobile-friendly view ✅
- Document edit (metadata corrections) ✅
- Bulk upload (in-app) ✅
- Python USB migration ⏳
- Deploy + Gadi onboarding ⏳

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
| 8 | All Supabase data ops use REST fetch (SDK auth-only) | 24/04/2026 |
| 9 | 9C migration: Avshi uploads → SQL UPDATE transfers ownership to Gadi | 26/04/2026 |

---

## Risks + watch list

- ⚠️ **Gadi USA trip deadline** — ~10 May 2026, 14 days remaining
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

*Last updated: 26 April 2026 · End of Lessons 9A + 9D + 9E + 9B (Search + Bulk + Edit + Mobile Android — full Phase 1 web app functionality complete; only Python migration + deploy remain)*