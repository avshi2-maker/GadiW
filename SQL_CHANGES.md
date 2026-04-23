# 🗄️ SQL Changes Log — GadiW

This file records every SQL change made to the Supabase project `pslwvkymccbngtyvgagj` (Gadi_W_CRM), in chronological order. One section per lesson.

---

## Lesson 4.A — Phase 1 RLS + Schema Changes

**Date:** 23/04/2026  
**Author:** Avshi + Claude  
**Status:** ⏳ Script prepared — not yet executed

### Context

The project was deployed on 17/04/2026 with RLS enabled on all tables, but every non-lookup table received the same wide-open policy named `auth_all` with `USING (true) WITH CHECK (true)`. That policy permits any authenticated user to read, modify, or delete any row belonging to any other user. Acceptable for a single-user demo, unacceptable for production.

**Scope of this lesson:** Phase 1 tables only — `documents`, `clients`, `matters`. The other 7 data tables (`communications`, `conflict_checks`, `hearings`, `invoices`, `payments`, `tasks`, `time_entries`) retain their `auth_all` policy as security debt, to be fixed when their respective Phase begins. Lookup tables (`courts`, `legal_fields`, `referral_sources`) already use a correct read-only `lookup_read` policy and are not touched.

### Ownership column audit

| Table | Ownership column | Default | FK target | Verdict |
|---|---|---|---|---|
| `documents` | `uploaded_by` | `auth.uid()` | `auth.users.id` | ✅ Confirmed |
| `clients` | `created_by` | `auth.uid()` | `auth.users.id` | ✅ Confirmed |
| `matters` | `created_by` (assumed) | (assumed `auth.uid()`) | (assumed `auth.users.id`) | ⏳ Verified by STEP 0.1 at runtime |

### Schema changes planned

1. `documents.matter_id` → drop NOT NULL constraint (a document can belong to a client without a matter)
2. `documents.client_id` → new optional uuid column, FK to `clients(id)` with `ON DELETE SET NULL`
3. `documents.docs_has_owner` → new CHECK constraint requiring at least one of `matter_id` or `client_id` to be non-null
4. `documents.idx_documents_client_id` → new partial index on non-null `client_id` values
5. `documents.idx_documents_uploaded_by` → new index to speed up RLS policy evaluation

### RLS policy changes planned

| Table | Old policy | New policy | Ownership rule |
|---|---|---|---|
| `documents` | `auth_all` (drop) | `users_own_documents` | `uploaded_by = auth.uid()` |
| `clients` | `auth_all` (drop) | `users_own_clients` | `created_by = auth.uid()` |
| `matters` | `auth_all` (drop) | `users_own_matters` | `created_by = auth.uid()` |

---

### The script

Run in the Supabase SQL Editor. Execute **one STEP at a time** — do not paste all steps at once. After each STEP, verify output before proceeding.

```sql
-- =================================================================
-- GadiW Lesson 4.A — Phase 1 RLS + Schema Changes
-- Date:       23/04/2026
-- Project:    pslwvkymccbngtyvgagj (Gadi_W_CRM)
-- Scope:      Phase 1 tables only (documents, clients, matters)
-- Strategy:   Replace wide-open auth_all policies with ownership policies
-- =================================================================

-- =================================================================
-- STEP 0 — Safety checks (run these FIRST, verify output)
-- =================================================================

-- 0.1 Confirm matters has a created_by column with the expected default
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'matters'
  AND column_name IN ('created_by', 'owner_id', 'user_id', 'assigned_to');

-- 0.2 Confirm current policies that we're about to drop
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('documents', 'clients', 'matters')
ORDER BY tablename, policyname;

-- =================================================================
-- STEP 1 — Schema changes on documents table
-- =================================================================

-- 1.1 Make matter_id optional (documents can belong to a client directly)
ALTER TABLE public.documents
  ALTER COLUMN matter_id DROP NOT NULL;

-- 1.2 Add client_id column (linked to clients, optional)
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS client_id uuid 
  REFERENCES public.clients(id) ON DELETE SET NULL;

-- 1.3 Constraint: every document must belong to at least one owner
ALTER TABLE public.documents
  ADD CONSTRAINT docs_has_owner
  CHECK (matter_id IS NOT NULL OR client_id IS NOT NULL);

-- 1.4 Index on client_id (partial, only indexes non-null values)
CREATE INDEX IF NOT EXISTS idx_documents_client_id
  ON public.documents(client_id)
  WHERE client_id IS NOT NULL;

-- 1.5 Index on uploaded_by (speeds up RLS policy checks)
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by
  ON public.documents(uploaded_by);

-- =================================================================
-- STEP 2 — Replace auth_all policies with ownership policies
-- =================================================================

-- 2.1 DOCUMENTS — owner = uploaded_by
DROP POLICY IF EXISTS "auth_all" ON public.documents;

CREATE POLICY "users_own_documents"
  ON public.documents
  FOR ALL
  TO authenticated
  USING (uploaded_by = auth.uid())
  WITH CHECK (uploaded_by = auth.uid());

-- 2.2 CLIENTS — owner = created_by
DROP POLICY IF EXISTS "auth_all" ON public.clients;

CREATE POLICY "users_own_clients"
  ON public.clients
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- 2.3 MATTERS — owner = created_by
--     (Adjust the column name if STEP 0.1 showed a different one)
DROP POLICY IF EXISTS "auth_all" ON public.matters;

CREATE POLICY "users_own_matters"
  ON public.matters
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- =================================================================
-- STEP 3 — Verification queries (run AFTER the changes above)
-- =================================================================

-- 3.1 Confirm new policies exist
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('documents', 'clients', 'matters')
ORDER BY tablename, policyname;

-- 3.2 Confirm documents schema changes landed
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'documents'
  AND column_name IN ('matter_id', 'client_id', 'uploaded_by')
ORDER BY column_name;

-- 3.3 Confirm the check constraint exists
SELECT conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.documents'::regclass
  AND conname = 'docs_has_owner';

-- 3.4 Confirm indexes exist
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'documents'
  AND indexname IN ('idx_documents_client_id', 'idx_documents_uploaded_by');

-- =================================================================
-- END OF SCRIPT
-- =================================================================
```

---

### Execution log (fill in tomorrow)

- [x] STEP 0.1 output — matters ownership column verified as: `created_by`
- [x] STEP 0.2 output — old policies confirmed present
- [x] STEP 1.1–1.5 — documents schema changes applied
- [x] STEP 2.1 — documents policy replaced
- [x] STEP 2.2 — clients policy replaced
- [x] STEP 2.3 — matters policy replaced
- [x] STEP 3.1 — new policy list verified
- [x] STEP 3.2 — documents columns verified
- [x] STEP 3.3 — docs_has_owner constraint verified
- [x] STEP 3.4 — indexes verified
- [x] File committed and pushed to GitHub

### Notes on recovery

- If STEP 0.1 returns an empty result set, `matters` has no ownership column and we must add one before running STEP 2.3.
- If STEP 0.1 returns a column other than `created_by`, adjust STEP 2.3 accordingly before running it.
- STEP 1 uses `IF NOT EXISTS` on the column and index additions, so most of the script is safe to re-run if interrupted.
- STEP 1.3 (CHECK constraint) does not use `IF NOT EXISTS` — if you need to re-run, first issue: `ALTER TABLE public.documents DROP CONSTRAINT docs_has_owner;`

---
