# 🚀 LESSON 4 MID-FLIGHT — Handover to Next Chat

**Date:** 23 April 2026
**Status:** Lesson 3 COMPLETE. Lesson 4 (Supabase Day) STARTED — paused mid-Phase 4.A inspection.
**Student:** Avshi Sapir, 72yo Ironman
**Project:** GadiW — cloud document archive for lawyer Gadi Weisfeld

---

## ⚡ ONE-MINUTE STATUS

- ✅ Lesson 1 done (foundation files)
- ✅ Lesson 2 done (ARCHITECTURE.md with 7 locked decisions)
- ✅ Lesson 3 done TODAY (Vite installed, folder structure, 14 placeholders, all committed)
- 🔄 Lesson 4 IN PROGRESS: Supabase schema changes + RLS policies

**Current pause point:** Verified Supabase project `pslwvkymccbngtyvgagj` (Gadi_W_CRM), confirmed 13 tables + 2 views. About to inspect existing RLS policy on `documents` table BEFORE running SQL.

---

## 📁 REPO STATE (verified clean + pushed)

- **GitHub:** `github.com/avshi2-maker/GadiW`
- **Local:** `C:\dev\gadiV`
- **Latest commit:** `076e906` — Update STATUS after Lesson 3 completion
- **Working tree:** clean, synced

### Files in repo
```
.env.example
.gitignore (merged: Vite + security)
ARCHITECTURE.md (623 lines, 7 decisions locked)
HANDOVER_21042026_LESSON1_COMPLETE.md
IDEAS_PARKING.md
README.md
STATUS.md
index.html (Hebrew RTL, Frank Ruhl Libre + Heebo fonts)
package.json (Vite 8.0.9)
package-lock.json
public/favicon.svg
src/
├── main.js (placeholder)
├── lib/ (supabase.js, auth.js, storage.js — all placeholders)
├── screens/ (login.js, fileList.js, fileView.js — all placeholders)
├── components/ (button.js, card.js, modal.js, toast.js — all placeholders)
├── styles/ (base.css, tokens.css, components.css — all placeholders)
└── utils/ (format.js, validate.js — placeholders)
```

Every placeholder has a header comment + TODO marker for the lesson that will fill it in.

---

## 🔒 SUPABASE PROJECT STATE (verified today)

- **Project ID:** `pslwvkymccbngtyvgagj`
- **Project name:** `Gadi_W_CRM`
- **Organization:** "Avshi Sapir - Projects 2025-2026 Pro" (Pro tier)
- **URL:** `https://pslwvkymccbngtyvgagj.supabase.co`
- **Anon key (publishable) — PUBLIC, safe to share:**
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbHd2a3ltY2Nibmd0eXZnYWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjMwNjEsImV4cCI6MjA5MTk5OTA2MX0.65eX-SxwHTBOICIfsr3cB2zOVRq3cR0EgDUvePlXZjg
  ```

### History
- Project was deployed on **17/04/2026** with a live HTML app (`17042026-v2`) — the Day 1 mockup we deleted from the repo yesterday
- Had an auth user created for Gadi (test data)
- Schema was designed with Israeli-specific fields (ID validation, ILS, Hebrew courts)
- **app_config table does NOT exist** (was a wrong assumption in old handover — API keys are in a DIFFERENT project, not this one)

### Tables present (13 + 2 views)
- clients, communications, conflict_checks, courts, documents, hearings, invoices, legal_fields, matters, payments, referral_sources, tasks, time_entries
- views: v_dashboard_kpis, v_matters_summary (UNRESTRICTED — security concern for Phase 2+, fine for Phase 1)

### `documents` table — FULL column list (verified today)
| # | Column | Type | Default | Notes |
|---|---|---|---|---|
| 1 | `id` | uuid | `uuid_generate_v4()` | PK |
| 2 | `matter_id` | uuid | NULL | FK to matters (currently NOT NULL) |
| 3 | `file_name` | text | NULL | |
| 4 | `file_url` | text | NULL | |
| 5 | `file_size` | int8 | NULL | |
| 6 | `mime_type` | text | NULL | |
| 7 | `doc_tag` | text | NULL | |
| 8 | `direction` | doc_direction enum | `'פנימי'::doc_direction` | |
| 9 | `doc_date` | date | `CURRENT_DATE` | |
| 10 | `description` | text | NULL | |
| 11 | `uploaded_at` | timestamptz | `now()` | |
| 12 | `uploaded_by` | uuid | `auth.uid()` | FK to auth.users |

### Foreign keys
- `matter_id → public.matters.id`
- `uploaded_by → auth.users.id` (KEY for RLS!)

### RLS state
- **RLS is already ENABLED** on `documents` table ✅
- **"1 RLS policy" exists** on `documents` — NOT YET INSPECTED (was the next step when chat hit limit)
- Other tables — status unknown, need to check

---

## 🎯 WHAT TO DO NEXT (exact sequence for new chat)

### Step 1 — Re-entry ritual
In PowerShell:
```
cd C:\dev\gadiV
git pull
git status
```
Verify clean.

### Step 2 — Check the existing RLS policy on documents
- Open Supabase dashboard: https://supabase.com/dashboard/project/pslwvkymccbngtyvgagj/editor
- Navigate to `documents` table
- Click "1 RLS policy" badge at top
- Screenshot the policy details
- **Decision:** keep, modify, or replace based on what it says

### Step 3 — Inspect RLS state on other tables
Check sidebar for lock icons on: clients, matters, hearings, tasks, etc.
Note which have RLS enabled vs not.

### Step 4 — Execute schema changes on `documents`
Once RLS picture is clear, run this SQL in Supabase SQL Editor:

```sql
-- Make matter_id optional
ALTER TABLE public.documents 
  ALTER COLUMN matter_id DROP NOT NULL;

-- Add client_id column
ALTER TABLE public.documents 
  ADD COLUMN client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;

-- Constraint: at least one owner
ALTER TABLE public.documents 
  ADD CONSTRAINT docs_has_owner 
  CHECK (matter_id IS NOT NULL OR client_id IS NOT NULL);

-- Index on client_id
CREATE INDEX idx_documents_client_id 
  ON public.documents(client_id) 
  WHERE client_id IS NOT NULL;

-- Index on uploaded_by
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by 
  ON public.documents(uploaded_by);
```

### Step 5 — Enable RLS on all tables that don't have it yet
```sql
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hearings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conflict_checks ENABLE ROW LEVEL SECURITY;
-- Lookup tables may stay public (read-only reference data):
-- courts, legal_fields, referral_sources
```

### Step 6 — Create RLS policies for Phase 1 tables
From ARCHITECTURE.md section 6. Template per table:
```sql
CREATE POLICY "users_own_documents" ON public.documents
  FOR ALL 
  TO authenticated
  USING (uploaded_by = auth.uid())
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "no_anon_access" ON public.documents
  FOR ALL TO anon
  USING (false);
```
Repeat for `clients`, `matters` with matching ownership column.

### Step 7 — Create storage bucket
- Navigate to Storage in Supabase dashboard
- Create bucket named `gadi-documents`
- Configure as PRIVATE (not public)
- Create folders inside: `inbox/`, `templates/`

### Step 8 — Storage policies
```sql
CREATE POLICY "users_own_files_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'gadi-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "users_own_files_write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gadi-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "users_own_files_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'gadi-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "no_anon_storage" ON storage.objects
  FOR ALL TO anon
  USING (false);
```

### Step 9 — Document all SQL in repo
Create `SQL_CHANGES.md` in `C:\dev\gadiV` with every SQL statement executed. Commit + push.

### Step 10 — Close Lesson 4
Update STATUS.md. Commit + push.

---

## ⚠️ IMPORTANT RULES (established, still active)

1. **Always paste terminal/SQL output** — never just "done"
2. **One command at a time** — don't paste multiple lines as one message
3. **Verify before executing** — inspect reality, then run SQL
4. **VS Code only** for file editing — never notepad
5. **PowerShell here-strings (`@'...'@`)** for multi-line file creation
6. **Tiny commits with clear messages** — one logical change per commit
7. **Gadi's AI fear** — Phase 1 shows ZERO AI features; trust first
8. **Ironman schedule** — Avshi has ~2-4 GOOD hours/day for GadiW. Lesson chunks must respect this.
9. **Research files on OneDrive** — cherry-pick for Phase 2+ (template/data model design), not Phase 1
10. **Don't touch Beni journal** — frozen for Beni testing

---

## 🏃‍♂️ AVSHI'S SCHEDULE (for AI to respect)

```
Daily budget:
  Sleep: 6 hours
  Training: Ironman protocol (cycling, running, swimming)
  Training planning: next-day logistics
  Family: present when home
  Code with Claude: ~2-4 fresh hours/day
```

Lessons MUST be sized for this. Always include break checkpoints. "Stop and resume tomorrow" is always valid.

---

## 🎯 MISSION REMINDER

**Phase 1 = "replace Gadi's USB drive with a secure, searchable cloud folder before his USA trip."**

Gadi's real needs (in his order):
1. Cloud archive (URGENT, USA trip)
2. Templates with his writing style (Phase 2)
3. Voice/phone/notes capture (Phase 3)
4. Smart document processing (Phase 4)
5. Diary scheduling (Phase 5)

Gadi's fears: recording client calls, AI hallucinations.

Demo already shipped 21/04/2026 via WhatsApp. Gadi expected to reply after Independence Day holiday.

---

## 📋 HOW TO START THE NEW CHAT

Paste this file. Then say:

> **"I am Avshi. Last chat hit Claude's message limit. Here is the handover. We are in Lesson 4 (Supabase Day), paused right before inspecting the existing RLS policy on documents table. Please continue."**

The new Claude will read this, understand context, and pick up at Step 2 above.

---

## 🧘 HONEST NOTE

This handover is a SAFETY NET, not a failure. Claude chats fill up. Pros just restart cleanly without losing progress.

Your repo is safe. Your architecture is locked. Your Vite runs locally. The path forward is clear.

**Take a break if you need one.** Or open a new chat and paste this file. Your call.

---

*End of Lesson 4 mid-flight handover · 23 April 2026*
