# IDEAS_PARKING — GadiW Project

> Every wild idea, "what if we also...", future feature, vague hunch goes HERE first.
> Reviewed at start of each session. Decided: scheduled / parked deeper / trashed.
>
> The point: get ideas OUT of your head and INTO a system you trust.
> So you can sleep. So you can focus. So you can ship.

---

## How to use this file

1. **The moment** an idea pops — write 1 line here. Stop working on the idea immediately.
2. **Start of each work session** — review the NEW section. Move each idea to one of:
   - `[SCHEDULED]` — committed for a specific phase
   - `[PARKED]` — good idea, not now
   - `[TRASHED]` — not worth it (with reason)
3. **Every line gets a date stamp** — so you see what you were thinking when.

---

## NEW (review next session)
- 23/04/2026 — Hebrew filename handling for GadiW: decide between UUID storage keys (recommended, industry standard) vs Python rename-to-English script vs raw Hebrew with careful URL encoding. Original Hebrew name stored in documents.file_name column regardless. Decide when building storage.js upload code.
### 21/04/2026 — Lesson 1 day
- 22/04/2026 — Comet/Gemini research files on OneDrive — cherry-pick for Phase 2+ (template/data model design)
- 22/04/2026 — Gadi replies tomorrow after Independence Day holiday
- 21/04/2026 — Test idea: VS Code is now my home [TRASHED - was just a test]
- 22/04/2026 — develop ready made excel sheet for calculating Avshi's developing hours CRM with claude bot
- 22/04/2026 — download from Comet all files to be test/used in Gadi's CRM
- 23/04/2026 — app_config table with API keys is in OLD project (vmcipofovheztbjmhwsl), not Gadi_W_CRM. Need to recreate in Phase 3+
---

## SCHEDULED (committed for a phase)

### Phase 1 — Cloud document archive (NOW, before Gadi USA trip)
- [SCHEDULED-P1] Upload files to Supabase Storage
- [SCHEDULED-P1] List files with search by name
- [SCHEDULED-P1] Filter files by type (pdf / docx / image)
- [SCHEDULED-P1] Download / preview files
- [SCHEDULED-P1] Organize by client (link to clients table) and matter
- [SCHEDULED-P1] Gadi-only auth (Supabase email + TOTP)
- [SCHEDULED-P1] RLS policies on storage bucket (vendor cannot read)
- [SCHEDULED-P1] Mobile read-only view
- [SCHEDULED-P1] Deploy to GitHub Pages

### Phase 2 — Templates with Gadis writing style
- [SCHEDULED-P2] Collect 20-30 of Gadis existing letters as training samples
- [SCHEDULED-P2] Library of letter types Gadi commonly writes
- [SCHEDULED-P2] Click template → AI drafts in Gadis style → he edits → he sends
- [SCHEDULED-P2] Never auto-send (Gadi stays in control)

### Phase 3 — Voice and notes capture (later)
- [SCHEDULED-P3] Mobile voice memo upload
- [SCHEDULED-P3] ElevenLabs Hebrew transcription (already proven in demo)
- [SCHEDULED-P3] Claude analysis (already proven in demo)
- [SCHEDULED-P3] Link captured items to client / matter

### Phase 4 — Smart document processing (much later)
- [SCHEDULED-P4] OCR scanned PDFs
- [SCHEDULED-P4] Auto-categorize by content
- [SCHEDULED-P4] Search WITHIN document content (not just filenames)

### Phase 5 — Calendar and scheduling (last)
- [SCHEDULED-P5] Replace paper handbook
- [SCHEDULED-P5] Link to hearings table
- [SCHEDULED-P5] Court deadline reminders

---

## PARKED (good ideas, NOT now)
## 24/04/2026 — USB Migration Strategy (for Lesson 9)

**Problem:** Gadi has ~1,000+ files on USB drive. Single-file web upload = 50+ hours of manual metadata entry. Not viable for bulk migration.

**Solution — 3-tier approach:**

### Tier 1 — Python batch migration script (Lesson 9)
- `scan_usb.py` generates pre-filled Excel sheet with filenames, folder hints, file dates
- Gadi (or helper) bulk-fills the sheet in Excel using sort/multi-select/paste — ~2-3 hours for 1,000 files
- `migrate_to_gadiw.py --sheet X.xlsx --usb D:\` uploads all files + inserts documents rows
- Fuzzy-match client_name to existing clients table
- Progress bar + log file + error report for failures

### Tier 2 — Bulk upload mode in web app (Lesson 9)
- Multi-file select / drag-and-drop folder support
- Table view: per-file rows + "apply to all" shared fields (client, direction, date, description)
- Progress bar + per-file status during upload
- Purpose: ongoing daily 10-20 file batches after the initial USB migration

### Tier 3 — OCR auto-suggestions (Phase 2, NOT NOW)
- Parse PDFs/images → extract text → auto-suggest doc_tag, doc_date, client_name
- Requires Gadi to trust the system first. Do NOT build in Phase 1.

**Key insight:** the bottleneck is metadata entry, not upload speed. Fix metadata workflow, not upload throughput.

**Sequence:**
1. Finish Lesson 7 ✓ (24/04/2026)
2. Lesson 8 — view/download/preview (Gadi can verify uploads)
3. Lesson 9 — BOTH tiers 1 + 2 (this is the real migration lesson)
4. Lesson 10 — deploy + onboarding session using the migration tool

### Multi-user / team features
- [PARKED] Wife as back-office user
  - Reason: Gadi did not mention her in fact-finding meeting
  - Revisit: After Phase 1 ships and he uses it solo for 2-3 months
  - Decision rule: only build if Gadi himself asks

- [PARKED] 2-monitor split-screen UI
  - Reason: Gadi did not mention. Modern browsers handle 2 monitors natively (open 2 windows)
  - Revisit: If users actually ask for it
  - Decision rule: do not build until 3+ users request it

- [PARKED] Multi-tenant SaaS for other lawyers
  - Reason: Phase 1 is Gadi-only proof of concept
  - Revisit: After Gadi has used it for 3+ months happily
  - Plan: hire Israeli tech lawyer (~5-15k ILS) for proper DPA + privacy policy

### AI heavy features
- [PARKED] Real-time meeting recording (90+ min)
  - Reason: Gadi explicitly said he is afraid of recording client calls
  - Revisit: ONLY if Gadi himself raises it after 6+ months of trust
  - Risk: legal disclosure required, client consent

- [PARKED] Legal precedents RAG database (Israeli case law)
  - Reason: Significant build (curation requires real lawyer time)
  - Revisit: After Phase 4 succeeds and Gadi asks for case-law lookup
  - Cost: medium effort, real value

- [PARKED] Custom Hebrew legal vocabulary tuning for ElevenLabs
  - Reason: Identified during demo (e.g. heard "עיסוי" instead of "ניסוי" )
  - Revisit: When Phase 3 voice features ship
  - Solution: prompt engineering OR custom vocab list to ElevenLabs

### Demo / showcase ideas
- [PARKED] 60-second wow demo with fake real-estate inheritance case
  - Reason: Designed for fantasy Gadi. Real Gadi wants archive first.
  - Revisit: Marketing material when Phase 5 ships
  - Asset: DEMO_DESIGN.md and DIALOG_SCRIPT.md preserved separately

- [PARKED] Standalone gadi_voice_demo HTML for WhatsApp shares
  - Reason: Already shipped to Gadi 21/04 successfully, served its purpose
  - Status: Keep file; do not develop further; reuse code patterns in Phase 3

### Bigger SaaS / business plays
- [PARKED] International clients (English-speaking lawyers)
  - Reason: Israel market first
  - Revisit: After 5+ Israeli lawyers paying

- [PARKED] Stripe billing / subscriptions
  - Reason: Free for Gadi forever; subscriptions only when 3rd lawyer signs up
  - Revisit: Phase 6+

- [PARKED] Convert design docs to podcast format for Gadi
  - Reason: Nice idea, not critical path
  - Revisit: When something interesting needs his absorption time
- 23/04/2026 — BUG parked: supabase.auth.getSession() hangs indefinitely on page reload when persistSession=true. Workaround: main.js has 5s timeout that auto-clears storage and re-routes to login. Symptom: logs stop before 'about to call supabase.from', Network tab shows zero requests. Likely @supabase/supabase-js version issue or localStorage adapter quirk. Debug in Lesson 7: check package.json for SDK version, try explicit storage option, test with persistSession=false as comparison. Clean repro: log in → log out → log in → refresh = hang.
---
## 24/04/2026 — USB Migration Strategy (for Lesson 9)

**Problem:** Gadi has ~1,000+ files on USB drive. Single-file web upload = 50+ hours of manual metadata entry. Not viable.

**Solution: 3-tier approach**

### Tier 1 — Python batch migration script (Lesson 9)
- `scan_usb.py` → generates pre-filled Excel sheet with filenames, folder hints, file dates
- Gadi (or helper) bulk-fills the sheet in Excel (sort, multi-select, paste) — 2-3 hours
- `migrate_to_gadiw.py --sheet X.xlsx --usb D:\` → uploads all files + inserts documents rows
- Fuzzy-match client_name to existing clients table
- Progress bar + log file + error report

### Tier 2 — Bulk upload mode in web app (Lesson 9)
- Multi-file select / drag-and-drop folder
- Table view: per-file rows + "apply to all" shared fields (client, direction, date)
- Progress bar during upload
- For ongoing daily 10-20 file batches (post-migration)

### Tier 3 — OCR auto-suggestions (Phase 2, NOT NOW)
- Parse PDFs/images → extract text → auto-suggest doc_tag, doc_date, client
- Requires Gadi trust the system first. Do NOT build in Phase 1.

**Key insight:** the bottleneck is metadata entry, not upload. Fix metadata workflow, not upload speed.
## 25/04/2026 — DOCX Inline Preview (deferred to post-Phase 1)

**Current behavior:** DOCX shows "תצוגה מקדימה לא זמינה" message → user downloads + opens in Word.

**Why deferred:** Browsers cannot natively render DOCX. Three options exist:
- Microsoft Office Viewer (public URL pass-through) — privacy concern for legal docs, requires Gadi's consent
- mammoth.js library (client-side conversion) — privacy-safe but loses formatting fidelity, +1hr work
- Status quo — friendly fallback message, force download + Word

**Decision:** Ship Phase 1 with status quo. Revisit after Gadi feedback. If he asks for DOCX preview, prefer mammoth.js over Microsoft Viewer for privacy.
## IDEAS_PARKING - 26/04/2026
BUILD GADI MOBILE APP THAT WILL SYNC WITH GADI CRM FILES/VOICE/PICTURES [USE BENI_POCKET ANDROID AS SAMPLE]
## 25/04/2026 — Full Client Intake Form (Phase 2/3 spec, NOT FOR NOW)

**Source:** customer_intake.xlsx provided by Avshi (53 fields across 9 categories).

**Categorization (which Phase each category belongs to):**
## 26/04/2026 — Search Fallback / External Search (Phase 2 candidate)

**Question raised:** Should searches with no results suggest external sources (chats, Google, AI, etc.)?

**Decision:** NO for Phase 1. Reasons:
1. Privacy — lawyer's search terms must stay inside the archive, never leave to Google/external
2. Decision #1 locked: "Phase 1 = cloud archive only" + "Gadi in fear/AI zone — zero AI features"
3. "No results" is the correct, honest, professional answer for a private archive
4. Adding a fallback would imply Gadi can't trust his own data — undermines the core value prop

**Wait for Gadi's actual feedback after Beta.** If he says "I wish I could search external sources from here," that becomes a Phase 2 feature request from the real user.

**Possible Phase 2 directions IF Gadi asks:**
- Search inside document content (OCR + full-text search) — far more useful than external
- Search his own past meetings/emails (if he ever connects calendar/Gmail) — Phase 3+
- "Did you mean X?" suggestions based on his existing tags — small AI, only if he opens up to AI

### Already covered by existing `clients` table (Phase 1, no work needed)
- מספר_לקוח → client_number ✓
- שם_פרטי, שם_משפחה, שם_מלא → first_name, last_name, full_name ✓
- תעודת_זהות_או_חפ → id_number ✓
- תאריך_לידה → ❌ NOT in clients table — would need ALTER TABLE in Phase 2
- כתובת_מלאה → address + city + postal_code ✓
- טלפון_נייד / טלפון_נוסף → phone_mobile, phone_other ✓
- דוא"ל → email ✓
- מקור_הפניה → source_id, source_notes ✓
- שפה_מועדפת → ❌ NOT in clients — Phase 2 ALTER TABLE
- אופן_יצירת_קשר_מועדף → ❌ NOT in clients — Phase 2 ALTER TABLE
- consent_marketing, consent_date, consent_scope ✓ (already there)
- notes ✓

### Belongs to `matters` table (already exists in DB)
- מספר_תיק_פנימי, שם_תיק, סוג_הליך, ערכאה, תיאור_ראשוני, מטרת_הלקוח, סכום_משוער, צדדים_מעורבים, התיישנות_משוערת, מועדים_ידועים, סטטוס_תיק, תכנית_פעולה_ראשונית, הערות_פנימיות, עו"ד_מטפל

### Conflict-of-interest module (Phase 2 — separate feature)
- תאריך_בדיקת_ניגוד, מבצע_הבדיקה, תוצאת_הבדיקה, צדדים_לבדיקה, הערות_ציות

### Calendar / hearings module (Phase 3+ — out of Phase 1 scope per Decision #1)
- תאריך/שעת/מיקום_פגישת_קליטה, השתתפים, סיכום_פגישה
- קישור_ליומן (Outlook/Google integration)
- היסטוריית פגישות + דיונים (linked screens)

### Legal research module (Phase 3+ — definitely out of Phase 1 scope)
- חוקים_רלוונטיים, תקנות_הליך, פסיקה_עיקרית, מאגר_פסיקה, סיכום_הלכות

### Document management — already built in Phase 1 ✓
- תיקיית_קבצים_לקוח, תיקיית_קבצים_תיק, קישור_לאינדקס_מסמכים, מסמכים_שהתקבלו_בקליטה, מסמכים_נדרשים_מהלקוח

**Phase 2 plan (post-Gadi-trip, post-feedback):**
1. ALTER TABLE clients ADD COLUMN birth_date, preferred_language, preferred_contact_method
2. Build Hebrew RTL Client Intake form using existing clients table fields
3. Build Matter intake form (5-step wizard like the Gadi Legal CRM Avshi already built in Feb 2026 — reuse that pattern)
4. Conflict-of-interest module (4-step wizard already exists in legacy Gadi project pslwvkymccbngtyvgagj — port the SQL pattern)

**Phase 3 plan (after Gadi has 100+ clients in system, asking for more):**
- Calendar/meetings integration
- Legal research database links

**Critical reminder (for future Avshi):** Do NOT start Phase 2 until Gadi explicitly asks for it. He's currently in fear/AI/technology zone. Phase 1 first, then let HIS feedback drive Phase 2.

**Sequence:**
1. Finish Lesson 7 (single upload) ✓
2. Lesson 8 (view/download) so Gadi can verify what he uploaded
3. Lesson 9 (BOTH tiers 1 + 2) — this is the real migration lesson
4. Lesson 10 (deploy + onboarding with migration tool)
## TRASHED (with reason)

- [TRASHED 19/04/2026] USB fingerprint device + SMS 2FA security architecture
  - Reason: USB hardware = 2015 thinking, SMS officially deprecated by NIST since 2016 (SIM swap attacks)
  - Replaced by: Supabase Auth (email + password + TOTP + passkeys + RLS)

- [TRASHED 21/04/2026] Verbal trigger word for voice memo categorization
  - Reason: Avshi correctly pointed out users will not remember to say "ר עיון" first
  - Replaced by: AI auto-categorization on the transcript content

- [TRASHED 21/04/2026] Add idea filter to Beni journal
  - Reason: Beni journal frozen for Beni testing; Phase 1 is fresh-build instead
  - Replaced by: This IDEAS_PARKING.md file (much simpler)

---

## REVIEW LOG

| Date | What was reviewed | Decisions made |
|---|---|---|
| 21/04/2026 | Initial creation | Established phases, captured all known ideas from Day 1 + Day 2 |

---

*Last updated: 21 April 2026 · End of Lesson 1*
