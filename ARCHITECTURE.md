# ARCHITECTURE — GadiW Phase 1

> Locked decisions for Phase 1 — Secure Cloud Document Archive for Gadi Weisfeld.
>
> **Phase 1 scope in one sentence:**  
> Replace Gadi's USB drive with a secure, searchable cloud folder — accessible from anywhere including his USA trip, with Gadi as sole authorized user.

**Author:** Avshi Sapir + Claude (professor)  
**Date locked:** 22 April 2026  
**Course:** Pro Build University — Lesson 2

---

## 0. Phase 1 in 12 user actions

Everything this system must do. Twelve and no more.

| # | Hebrew | English |
|---|---|---|
| 1 | העלאת קובץ | Upload a file |
| 2 | העלאת כמה קבצים יחד | Upload multiple files at once |
| 3 | רשימת כל הקבצים | See all files as a list |
| 4 | חיפוש לפי שם קובץ | Search by filename |
| 5 | חיפוש לפי לקוח | Search by client |
| 6 | סינון לפי סוג | Filter by file type |
| 7 | צפייה מקדימה | Preview a file |
| 8 | הורדה | Download a file |
| 9 | מחיקה | Delete a file |
| 10 | שיוך לקוח/תיק | Assign file to client/matter |
| 11 | התחברות מאובטחת | Secure login (Gadi only) |
| 12 | יציאה | Logout |

**Anything not in this list = Phase 2+.** Already parked in IDEAS_PARKING.md.

---

## 1. DECISION — Tech Stack

### Chosen: Vite + Vanilla JS + Supabase + GitHub Pages

**Stack details:**
- **Build tool:** Vite (v5+) for dev server, bundling, hot reload
- **Language:** Vanilla JavaScript (ES modules, no framework)
- **Styling:** Plain CSS with CSS variables (no Tailwind, no styled-components)
- **Backend:** Supabase (Postgres + Auth + Storage + RLS)
- **AI (future phases):** Anthropic Claude + ElevenLabs (already proven in demo)
- **Hosting:** GitHub Pages for static build output
- **Local dev:** Windows 11 + Node.js + VS Code + PowerShell + Git CLI

### Why not React

- Phase 1 has 3 screens. React's component model is overkill.
- React learning curve would double Phase 1 timeline.
- Vite supports later React migration trivially (install react, rename files).
- Industry standard for solo-founder scope: start vanilla, add React when pain is real.

### Why not plain HTML (single-file)

- Scales poorly past ~1,500 lines.
- No hot reload.
- Harder to organize by feature.
- Vite gives modular structure + industry tooling with ~10 min setup cost.

### Why not Next.js / Nuxt

- Phase 1 needs no SSR (server-side rendering).
- Static site on GitHub Pages is sufficient.
- Adding Next.js = adding hosting complexity (Vercel) + server concepts.

### Trade-off accepted

- Slightly more setup than single HTML (~10 min Vite install once).
- In return: hot reload, clean modules, modern build, scales to Phase 5.

---

## 2. DECISION — Folder Structure

### Approved layout

```
C:\dev\gadiV\
│
├── .env                     # real API keys (gitignored)
├── .env.example             # template (committed)
├── .gitignore               # existing
├── README.md                # existing
├── STATUS.md                # living memory
├── IDEAS_PARKING.md         # parked ideas
├── ARCHITECTURE.md          # THIS file
│
├── package.json             # Vite + dependencies
├── package-lock.json        # locked versions
├── vite.config.js           # Vite config
├── index.html               # entry point (Vite serves)
│
├── public/                  # static assets copied as-is
│   └── favicon.png
│
├── src/                     # all our code
│   │
│   ├── main.js              # app entry, routes to screens
│   │
│   ├── lib/                 # talks to external services
│   │   ├── supabase.js      # Supabase client singleton
│   │   ├── auth.js          # login, logout, session
│   │   └── storage.js       # upload, download, list files
│   │
│   ├── screens/             # full-page screens (3 total)
│   │   ├── login.js         # Screen 1 — Login
│   │   ├── fileList.js      # Screen 2 — Main file list
│   │   └── fileView.js      # Screen 3 — File detail
│   │
│   ├── components/          # reusable UI pieces
│   │   ├── button.js
│   │   ├── card.js          # file card in the list
│   │   ├── modal.js
│   │   └── toast.js
│   │
│   ├── styles/              # CSS
│   │   ├── base.css         # reset, typography, layout
│   │   ├── tokens.css       # colors, spacing CSS variables
│   │   └── components.css   # reusable UI classes
│   │
│   └── utils/               # small helpers
│       ├── format.js        # date, filesize formatters
│       └── validate.js      # input validation
│
└── dist/                    # Vite build output (gitignored)
```

### Rules (locked for the whole project)

1. **One file = one responsibility.** Naming tells you purpose in 5 seconds.
2. **Flat folders.** No sub-sub-folders until any folder has >15 files.
3. **Imports flow one direction:** screens → components → utils. Never reverse.
4. **Supabase-touching code lives in `lib/`.** Never in screens or components.
5. **No hardcoded strings.** All API URLs, colors, texts use constants/env vars.

### Files NOT in this structure (and why)

- No `tests/` — testing deferred to Lesson 5+
- No `docs/` — handover + architecture at root for visibility
- No `assets/` — Vite handles imports directly
- No `types/` — plain JS, TypeScript deferred
- No `server/` — Supabase IS the backend

---

## 3. DECISION — Supabase Storage Design

### Chosen: Hybrid C-Plus — dashboard-friendly + database-driven

### Bucket layout

ONE Supabase Storage bucket named **`gadi-documents`**.

```
gadi-documents/
│
├── inbox/                      # admin manual drops (Avshi)
│   └── (unsorted files before metadata capture)
│
├── 2026-04/                    # month-prefixed for uploaded files
│   ├── <uuid>_<safe_filename>.pdf
│   ├── <uuid>_<safe_filename>.docx
│   └── ...
│
├── 2026-05/
│   └── ...
│
└── templates/                  # Phase 2 letter templates
    └── (not used in Phase 1)
```

### Filename convention

`<documents.id as uuid>_<sanitized_original_name>.<ext>`

Example: `f83a1b2c-e4d5-4a6b-8c7d-1e2f3a4b5c6d_employment_agreement.pdf`

### Why this design

- **Database is the organization source of truth** (`documents` table). Storage is just where bytes live.
- **Gadi never sees storage paths.** App UI builds client→matter→file tree from database query.
- **Renames, reassignments = 1 DB update.** Zero file moves. No broken URLs.
- **Month folders** give admin (Avshi) a dashboard-friendly view in Supabase UI.
- **Avshi's `inbox/`** lets him drop files directly during migration.
- **UUID prefix** prevents filename collisions.

### What we explicitly rejected and why

- ❌ **Pure flat bucket (no folders)** — chaotic for admin browsing
- ❌ **Client/matter path hierarchy** — rigid; renames = file moves = broken bookmarks; Hebrew name URL encoding issues; doesn't match DB-driven UI

---

## 4. DECISION — Authentication Flow

### Chosen: Email + password + TOTP via authenticator app

### Implementation — Supabase Auth native features

- **Signup:** Admin (Avshi) creates account for Gadi via Supabase dashboard
- **Password:** Generated secure random, shared with Gadi once in person
- **TOTP enrollment:** Gadi installs Google Authenticator → scans QR code from Supabase → first 6-digit code confirms
- **Login flow:** email → password → 6-digit TOTP code
- **Session:** Supabase JWT, 1-hour expiry, auto-refresh
- **Logout:** Explicit button + inactivity timeout (30 min)

### Supabase features used

- `supabase.auth.signInWithPassword()`
- `supabase.auth.mfa.enroll({ factorType: 'totp' })`
- `supabase.auth.mfa.challenge()` + `supabase.auth.mfa.verify()`
- `supabase.auth.signOut()`
- `supabase.auth.getUser()` / `onAuthStateChange()`

### Why this (not other options)

- **Email + password alone:** single factor; inappropriate for legal data
- **SMS 2FA:** NIST-deprecated since 2016 due to SIM swap attacks
- **Magic link only:** slow; depends on email access each login
- **Passkeys:** Supabase support still beta; Gadi 60yo, traditional, may find biometric weird

### Phase 2+ enhancement plan

Add optional passkey enrollment as alternative to TOTP once Supabase passkey support matures. Users can choose.

### Onboarding session required (one-time)

Avshi must physically help Gadi:
1. Share login credentials
2. Install authenticator app on his phone
3. Scan QR, enter first code
4. Test full login flow end-to-end

**Estimated: 15-20 minutes one-time.**

---

## 5. DECISION — Data Model

### Chosen: 5A — Flexible `documents` with optional `matter_id` + new `client_id`

### Existing Supabase tables used in Phase 1

| Table | Purpose in Phase 1 |
|---|---|
| `clients` (25 cols) | Client records |
| `matters` (26 cols) | Legal cases (files can attach here) |
| `documents` (12 cols — needs enhancement) | Core file metadata table |

### Tables NOT used in Phase 1

(Ignored but available for future phases.)

- `hearings`, `tasks`, `communications` — Phase 3
- `invoices`, `payments`, `time_entries` — Phase 4
- `conflict_checks` — Phase 3
- `courts`, `legal_fields`, `referral_sources` — lookup tables used later
- `v_dashboard_kpis`, `v_matters_summary` — views built from above

### Required schema changes (to execute in Lesson 3 or 4)

```sql
-- 1. Make matter_id optional (currently NOT NULL)
ALTER TABLE documents 
  ALTER COLUMN matter_id DROP NOT NULL;

-- 2. Add direct client link
ALTER TABLE documents 
  ADD COLUMN client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

-- 3. Ensure at least one link exists
ALTER TABLE documents 
  ADD CONSTRAINT docs_has_owner 
  CHECK (matter_id IS NOT NULL OR client_id IS NOT NULL);

-- 4. Performance: index on new column
CREATE INDEX idx_documents_client_id 
  ON documents(client_id) 
  WHERE client_id IS NOT NULL;

-- 5. Performance: index for common query "all my files"
CREATE INDEX idx_documents_uploaded_by 
  ON documents(uploaded_by);
```

### Why this shape

- **Gadi's reality:** 10 years of USB files — many will be "I don't remember which case." Need flexibility.
- **Natural thinking:** "This is Yossi's file" before "This is case-123 file."
- **Minimal schema change:** 1 new column + 1 constraint relaxation.
- **Backward compatible:** Existing rows stay valid.

### Queries Phase 1 will run (examples)

```sql
-- All files for logged-in user
SELECT * FROM documents WHERE uploaded_by = auth.uid() ORDER BY uploaded_at DESC;

-- All files for a specific client
SELECT * FROM documents WHERE client_id = $1 OR matter_id IN (
  SELECT id FROM matters WHERE client_id = $1
);

-- Search by filename
SELECT * FROM documents WHERE file_name ILIKE '%' || $1 || '%';

-- Filter by file type
SELECT * FROM documents WHERE mime_type LIKE 'application/pdf%';
```

---

## 6. DECISION — Row Level Security (RLS)

### Chosen: Strict RLS on every table — Gadi-only access architecturally enforced

### Principle

> **"No row is readable or writable unless the authenticated user owns it."**

Enforced by Postgres, not by app code. Even if a bug in app code tries to read another user's data, RLS refuses.

### Tables getting RLS enabled

ALL 15 existing tables + any new tables added in future phases.

### Policy template (applied per table)

```sql
-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Read + Write policy
CREATE POLICY "users_own_documents" ON documents
  FOR ALL 
  TO authenticated
  USING (uploaded_by = auth.uid())
  WITH CHECK (uploaded_by = auth.uid());

-- Deny anonymous access
CREATE POLICY "no_anon_access" ON documents
  FOR ALL
  TO anon
  USING (false);
```

Repeat for `clients`, `matters`, etc. — matching each table's ownership column (`created_by`, `uploaded_by`).

### Storage bucket RLS

```sql
-- Users can only touch files in their own path prefix
CREATE POLICY "users_own_files_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'gadi-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "users_own_files_write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gadi-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "users_own_files_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'gadi-documents' AND auth.uid() IS NOT NULL);

-- No anonymous access
CREATE POLICY "no_anon_storage" ON storage.objects
  FOR ALL TO anon
  USING (false);
```

### Admin access strategy (for Avshi)

Avshi (vendor) cannot read Gadi's data through the normal app path.

For admin operations:
- **Supabase Dashboard:** SQL editor bypasses RLS — use for debugging
- **Service role key:** server-side only, NEVER in browser code, NEVER committed
- **Bulk import tool:** separate Node script using service role (if needed)

### "Zero Vendor Access" — what this really means

- Gadi creates his account → becomes owner of his rows
- Avshi has no database user that owns Gadi's rows
- Via the app → Avshi sees nothing
- Via Supabase dashboard → Avshi CAN see (but this is audited admin access, not routine)
- Matches the promise in the security letter to Gadi

---

## 7. DECISION — UI Architecture

### Chosen: Architecture X — 3 screens, desktop-first, mobile read-only

### The 3 screens

#### Screen 1 — Login (`src/screens/login.js`)

**Purpose:** Authenticate Gadi before anything else.

**Layout (words):**
```
Centered card on law-firm cream background.
Top: small logo + "ע״ד GadiW" serif title.
3 inputs stacked: email, password, TOTP 6-digit code.
Primary button: "התחבר / Login" (navy + gold border).
Small "Remember me" checkbox.
Bottom: version number and copyright.
```

**States:**
- empty → ready to type
- submitting → button disabled, spinner
- TOTP challenge → password accepted, show TOTP field
- error → red inline message
- success → redirect to Screen 2

---

#### Screen 2 — Main File List (`src/screens/fileList.js`)

**Purpose:** Gadi's primary workspace. Find, filter, act on files.

**Layout (words):**
```
Top bar (full width):
  Left: logo + "ע״ד GadiW"
  Center: search box (filters as you type)
  Right: [+ Upload] button, [⚙ Settings] menu with logout

Body (two-column split):
  LEFT SIDEBAR (260px):
    "CLIENTS" header
    List of clients (clickable, shows file count per client)
    [+ Add client] button
    
    "FILTERS" header
    File Type dropdown: All / PDF / DOCX / Images
    Date range: All / This month / Last 30 days / Custom
    Tag dropdown: All / Agreement / Letter / Evidence / ...
  
  MAIN AREA (remaining width):
    Title: "ALL FILES (247)" — count updates with filters
    
    Scrollable list of file cards. Each card:
      📄 [filename]                    [file size]
      Client: [name] · Matter: [name or "(none)"]
      Uploaded: [date]                 [⬇][🗑]
    
    Click file card → navigate to Screen 3
```

**States:**
- loading → skeleton cards
- empty (no files) → illustration + "Upload your first file"
- filtered no match → "No files match your filters"
- error → red banner + retry

---

#### Screen 3 — File Detail (`src/screens/fileView.js`)

**Purpose:** See one file's details, preview, act on it.

**Layout (words):**
```
Top: [← Back to list] + filename as title

Body (two-column):
  LEFT (60% width):
    File preview area
    - If PDF: embedded PDF viewer
    - If image: img tag
    - If other: large file icon + "Download to view"
  
  RIGHT (40% width):
    METADATA section
    - Client: [editable dropdown]
    - Matter: [editable dropdown, filtered by client]
    - Tag: [editable dropdown]
    - Description: [editable textarea]
    - Uploaded: [readonly date]
    - Size: [readonly]
    - Type: [readonly]
    
    ACTIONS section (buttons):
    [⬇ Download]
    [✏️ Edit metadata]
    [🗑 Delete] (with confirm modal)
```

**States:**
- loading → skeleton
- loaded → show all
- editing → metadata fields enabled, [Save][Cancel] buttons appear
- saving → spinner in save button
- deleting → confirm modal

---

### Mobile behavior (Phase 1)

- Login: full screen, centered form (same as desktop, single column)
- File list: sidebar collapses into a hamburger menu, file cards full width
- File detail: stacks vertically (preview on top, metadata below)
- **No upload UI on mobile** — button hidden, replaced with "Upload via desktop" message
- Read-only experience: browse + search + preview + download works fully

### Why 3 screens

- Phase 1 = 12 actions that fit cleanly in 3 screens
- Gadi's mental model: "list of my files → click one → see it"
- Shippable in 3 dedicated lessons (one per screen)
- Easy to add Screen 4+ later without refactoring

---

## Design system (visual identity)

Inspired by the successful voice demo HTML shipped to Gadi on 21/04/2026.

### Colors (CSS variables)

```css
:root {
  --navy:       #0d1f36;   /* primary dark */
  --navy-soft:  #1e3a5f;
  --navy-muted: #2c4668;
  --gold:       #b8860b;   /* accent */
  --gold-soft:  #d4a93a;
  --gold-faint: #f4e4b1;
  --cream:      #faf7f0;   /* background */
  --cream-2:    #f4eddc;
  --paper:      #ffffff;
  --ink:        #1a1a1a;   /* body text */
  --ink-muted:  #5c5c5c;
  --ink-faint:  #8a8a8a;
  --border:     #e8dfc5;
  --success:    #2d5f3f;
  --error:      #8b2c2c;
}
```

### Typography

- **Display:** Frank Ruhl Libre (serif — for headings, proper nouns)
- **Body:** Heebo (sans — for UI labels, body text)

### Design principles

- Law-firm aesthetic, NOT SaaS purple-gradient
- Traditional, trustworthy, clean
- Hebrew-first (RTL), English toggle available
- No emoji overload (accents only)
- Subtle paper texture for warmth

---

## Lesson plan → Phase 1 ship

| Lesson | Topic | Est. time |
|---|---|---|
| 2 (today) | Architecture design | ~90 min ✅ |
| 3 | Project skeleton + Vite setup + first HTML | 60-90 min |
| 4 | Supabase schema changes + RLS policies (SQL) | 60-90 min |
| 5 | Login screen (Screen 1) + Supabase Auth integration | 90-120 min |
| 6 | File list screen (Screen 2) + fetch + search | 90-120 min |
| 7 | Upload flow + storage integration | 90-120 min |
| 8 | File detail screen (Screen 3) + preview + download | 60-90 min |
| 9 | Mobile responsive + polish | 60-90 min |
| 10 | Deploy to GitHub Pages + Gadi onboarding | 60 min |

**Realistic Phase 1 ship date:** 4-6 weeks at "no schedule" pace.

**Gadi's USA trip:** assumed weeks away — this timeline aligns if we stay focused.

---

## Risks + watch list

| Risk | Mitigation |
|---|---|
| Gadi USA trip deadline tight | Focus on Lessons 3-7 only; polish later |
| Gadi overwhelmed by TOTP setup | Plan 20-min in-person onboarding session |
| Hebrew RTL CSS bugs | Test every screen in both directions |
| Supabase RLS policy errors | Test each policy with `set role authenticated` SQL |
| File size limits (Supabase 50MB default) | Document and handle; may need pro plan ($25/mo) |
| Ironman brain adding ideas | IDEAS_PARKING.md is non-negotiable |

---

## Not in Phase 1 (parked)

Quick reference of items EXPLICITLY deferred. See IDEAS_PARKING.md for full list.

- Voice memo transcription (Phase 3)
- Meeting recording (Phase 3 or parked)
- AI letter drafting / templates (Phase 2)
- Multi-user / multi-tenant (Phase 6+)
- Billing / invoicing (Phase 4)
- Calendar / hearings / tasks (Phase 5)
- Full-text search WITHIN documents (Phase 4)
- OCR of scanned PDFs (Phase 4)
- Bulk import tool for 10 years of USB files (sub-project)
- Mobile upload (Phase 2)
- 2-monitor split-screen layout (not mentioned by Gadi — stay parked)
- Wife as back-office user (not mentioned by Gadi — stay parked)

---

## Change log

| Date | Change |
|---|---|
| 22/04/2026 | Initial architecture created. 7 decisions locked. |

---

*End of ARCHITECTURE.md · Lesson 2 complete*  
*Next lesson: build the Vite project skeleton and write `index.html`*
