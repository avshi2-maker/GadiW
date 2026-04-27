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

- 23/04/2026 — Hebrew filename handling for GadiW: decide between UUID storage keys (recommended, industry standard) vs Python rename-to-English script vs raw Hebrew with careful URL encoding. Original Hebrew name stored in documents.file_name column regardless. **STATUS:** Resolved in Lesson 7 — chose ASCII-safe storage path with original Hebrew preserved in file_name column.
- 22/04/2026 — Comet/Gemini research files on OneDrive — cherry-pick for Phase 2+ (template/data model design)
- 22/04/2026 — Gadi replies tomorrow after Independence Day holiday
- 22/04/2026 — Develop ready-made Excel sheet for calculating Avshi's developing hours CRM with Claude bot
- 22/04/2026 — Download from Comet all files to be tested/used in Gadi's CRM
- 23/04/2026 — app_config table with API keys is in OLD project (vmcipofovheztbjmhwsl), not Gadi_W_CRM. Need to recreate in Phase 3+
- 26/04/2026 — Build Gadi mobile app that will sync with Gadi CRM files/voice/pictures [use beni_pocket android as sample]

---

## SCHEDULED (committed for a phase)

### Phase 1 — Cloud document archive (NOW, before Gadi USA trip)
- [SCHEDULED-P1] Upload files to Supabase Storage ✅ Lesson 7
- [SCHEDULED-P1] List files with search by name ✅ Lesson 9A
- [SCHEDULED-P1] Filter files by type (pdf / docx / image) ✅ Lesson 9A
- [SCHEDULED-P1] Download / preview files ✅ Lesson 8
- [SCHEDULED-P1] Organize by client (link to clients table) and matter ✅ Lesson 7
- [SCHEDULED-P1] Gadi-only auth (Supabase email + TOTP) ✅ Lesson 5
- [SCHEDULED-P1] RLS policies on storage bucket (vendor cannot read) ✅ Lesson 4
- [SCHEDULED-P1] Mobile read-only view ⏳ Lesson 9B
- [SCHEDULED-P1] Bulk upload (in-app) ✅ Lesson 9D
- [SCHEDULED-P1] Document edit screen ⏳ Lesson 9E
- [SCHEDULED-P1] Python USB migration script ⏳ Lesson 9C
- [SCHEDULED-P1] Deploy to GitHub Pages ⏳ Lesson 10

### Phase 2 — Templates with Gadi's writing style
- [SCHEDULED-P2] Collect 20-30 of Gadi's existing letters as training samples
- [SCHEDULED-P2] Library of letter types Gadi commonly writes
- [SCHEDULED-P2] Click template → AI drafts in Gadi's style → he edits → he sends
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
### 26/04/2026 — Gadi's Logo Branding (Lesson 9B or 10 polish — BEFORE beta)

**Source:** Avshi captured logo image during Lesson 9E session. File: 
`גד ויספלד · משרד עורכי דין ונוטריון`. Clean Hebrew typography, navy text on cream/yellow background.

**Why this matters:**
- Trust-building for Gadi (his name on his app = his tool, not "some software")
- Lawyers are image-conscious about their practice presentation
- Visible branding = "this is real, professional, mine"

**Where to add the logo:**
1. **Login screen** — large logo above the email/password fields. First touchpoint.
2. **File list header** — small logo next to "המסמכים שלי" (replaces or accompanies "avshi2@gmail.com" subtitle).
3. **Edit/upload form headers** — small logo top-left.
4. **Document edit success banner** — small logo as part of the green confirmation card. Reinforces "your archive saved your document."

**Technical implementation:**
1. Save logo as `public/gadi-logo.png` (or .svg if vectorized)
2. Reference via `<img src="/gadi-logo.png" alt="גד ויספלד · משרד עורכי דין ונוטריון" />`
3. Standard sizes:
   - Login screen: 280px wide
   - List header: 120px wide
   - Form headers: 100px wide
   - Success banner: 80px wide

**When to build:**
- Option A — Lesson 9B (mobile responsive lesson — natural place to touch all UI surfaces)
- Option B — Lesson 10 (deploy + onboarding lesson — final polish before showing Gadi)
- **Recommendation: Lesson 10.** Logo is a "wow" moment best saved for the final reveal.

**Asset needed from Gadi:**
- Higher resolution logo (PNG 1000px+ or ideally SVG)
- Confirmation he wants to use this exact logo (vs a slight variant)
- Avshi to ask Gadi during onboarding: "send me your logo file for the app branding"
---

## PARKED (good ideas, NOT now)

### 24/04/2026 — USB Migration Strategy (Lesson 9C)

**Problem:** Gadi has ~1,000+ files on USB drive. Single-file web upload = 50+ hours of manual metadata entry. Not viable for bulk migration.

**Solution — 3-tier approach:**

**Tier 1 — Python batch migration script (Lesson 9C):**
- `scan_usb.py` generates pre-filled Excel sheet with filenames, folder hints, file dates
- Gadi (or helper) bulk-fills the sheet in Excel using sort/multi-select/paste — ~2-3 hours for 1,000 files
- `migrate_to_gadiw.py --sheet X.xlsx --usb D:\` uploads all files + inserts documents rows
- Fuzzy-match client_name to existing clients table
- Progress bar + log file + error report for failures
- **Retry-cleanup queue required** (orphan handling — see network-failure note below)

**Tier 2 — Bulk upload mode in web app:** ✅ Shipped in Lesson 9D

**Tier 3 — OCR auto-suggestions (Phase 2, NOT NOW):**
- Parse PDFs/images → extract text → auto-suggest doc_tag, doc_date, client_name
- Requires Gadi to trust the system first

**Key insight:** the bottleneck is metadata entry, not upload speed. Fix metadata workflow, not upload throughput.

---

### 25/04/2026 — DOCX Inline Preview (deferred to post-Phase 1)

**Current behavior:** DOCX shows "תצוגה מקדימה לא זמינה" message → user downloads + opens in Word.

**Why deferred:** Browsers cannot natively render DOCX. Three options exist:
- Microsoft Office Viewer (public URL pass-through) — privacy concern for legal docs, requires Gadi's consent
- mammoth.js library (client-side conversion) — privacy-safe but loses formatting fidelity, +1hr work
- Status quo — friendly fallback message, force download + Word

**Decision:** Ship Phase 1 with status quo. If Gadi asks for preview after using it, prefer mammoth.js over Microsoft Viewer for privacy.

---

### 26/04/2026 — Full Client Intake Form (Phase 2/3 spec)

**Source:** customer_intake.xlsx provided by Avshi (53 fields across 9 categories).

**Categorization (which Phase each category belongs to):**

**Already covered by existing `clients` table (Phase 1, no work needed):**
- מספר_לקוח → client_number ✓
- שם_פרטי, שם_משפחה, שם_מלא → first_name, last_name, full_name ✓
- תעודת_זהות_או_חפ → id_number ✓
- כתובת_מלאה → address + city + postal_code ✓
- טלפון_נייד / טלפון_נוסף → phone_mobile, phone_other ✓
- דוא"ל → email ✓
- מקור_הפניה → source_id, source_notes ✓
- consent_marketing, consent_date, consent_scope ✓
- notes ✓

**Missing from clients table (Phase 2 ALTER TABLE needed):**
- תאריך_לידה (birth_date)
- שפה_מועדפת (preferred_language)
- אופן_יצירת_קשר_מועדף (preferred_contact_method)

**Belongs to `matters` table (already exists in DB, Phase 2 form):**
- מספר_תיק_פנימי, שם_תיק, סוג_הליך, ערכאה, תיאור_ראשוני, מטרת_הלקוח, סכום_משוער, צדדים_מעורבים, התיישנות_משוערת, מועדים_ידועים, סטטוס_תיק, תכנית_פעולה_ראשונית, הערות_פנימיות, עו"ד_מטפל

**Conflict-of-interest module (Phase 2 — separate feature):**
- תאריך_בדיקת_ניגוד, מבצע_הבדיקה, תוצאת_הבדיקה, צדדים_לבדיקה, הערות_ציות

**Calendar / hearings module (Phase 3+ — out of Phase 1 scope per Decision #1):**
- תאריך/שעת/מיקום_פגישת_קליטה, השתתפים, סיכום_פגישה
- קישור_ליומן (Outlook/Google integration)
- היסטוריית פגישות + דיונים (linked screens)

**Legal research module (Phase 3+ — definitely out of Phase 1 scope):**
- חוקים_רלוונטיים, תקנות_הליך, פסיקה_עיקרית, מאגר_פסיקה, סיכום_הלכות

**Document management — already built in Phase 1 ✓:**
- תיקיית_קבצים_לקוח, תיקיית_קבצים_תיק, קישור_לאינדקס_מסמכים, מסמכים_שהתקבלו_בקליטה, מסמכים_נדרשים_מהלקוח

**Phase 2 plan (post-Gadi-trip, post-feedback):**
1. ALTER TABLE clients ADD COLUMN birth_date, preferred_language, preferred_contact_method
2. Build Hebrew RTL Client Intake form using existing clients table fields
3. Build Matter intake form (5-step wizard like the Gadi Legal CRM Avshi already built in Feb 2026 — reuse that pattern)
4. Conflict-of-interest module (4-step wizard already exists in legacy Gadi project pslwvkymccbngtyvgagj — port the SQL pattern)

**Phase 3 plan (after Gadi has 100+ clients in system, asking for more):**
- Calendar/meetings integration
- Legal research database links

**Critical reminder:** Do NOT start Phase 2 until Gadi explicitly asks for it. He's currently in fear/AI/technology zone. Phase 1 first, then let HIS feedback drive Phase 2.

---

### 26/04/2026 — Search Fallback / External Search (Phase 2 candidate)

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

---

### 26/04/2026 — Duplicate Filename Handling (Phase 2 polish)

**Current behavior:** Same filename can be uploaded multiple times across sessions. Each upload becomes a separate documents row with unique `id`. No conflict UI shown.

**Why this is correct for legal context:**
- Same NDA template → multiple clients (legitimate)
- Revisions of the same contract over time (legitimate)
- USB migration may include intentional duplicates from different folders

**Within a SINGLE bulk upload session (Lesson 9D Phase B):** duplicates ARE blocked — same name+size detected and skipped with Hebrew alert. ✅

**Phase 2 polish ideas (when Gadi asks):**
- Detail screen badge: "📋 X מסמכים עם שם זהה"
- Click → modal showing all dupes side by side with metadata diff
- "Replace" option that archives old version instead of leaving 2 copies
- File hash comparison (true duplicate detection vs same name only)

**Decision: NO block in Phase 1.** Lawyer workflow expects duplicates as a feature.

---

### 26/04/2026 — Filter UX Bundle (Phase 2 polish — bigger than initially thought)

**Two related issues identified during 9D + 9B testing:**

**Issue 1 — Multi-filter AND-logic invisibility (from 9D testing):**
When multiple filters active simultaneously (search + tag + direction + client), users get "no results" but can't see which filter is killing the search. AND-logic is correct but invisible.

**Issue 2 — Filter persistence after navigation (from 9B testing):**
User searches "mp4" → clicks result → goes to detail → clicks back to list → filter STILL active. New search "חוזה" returns 0 because old filters AND new search yield empty intersection. User must click "נקה סינון" before each new search. Confusing.

**Why tooltip won't fix this:** Lawyers don't read tooltips. Software must adapt to user behavior, not vice versa.

**Solution — Filter Pills + Smart Navigation Reset (~60 min, Phase 2 polish lesson):**

1. **Active filter pills row above results:**
   - 🔎 פעילים: [חיפוש: mp4 ✕] [תיוג: חוזה ✕] [כיוון: פנימי ✕] [לקוח: כהן ✕]
   - Click ✕ on individual pill → removes only that filter
   - Pills only render when at least one filter active
   - "נקה הכל" button only appears when 2+ filters active

2. **Smart navigation reset behavior:**
   - On detail → back-to-list navigation: keep filters (current behavior)
   - On any explicit "new search" action (e.g., user clears search box THEN starts typing): auto-reset OTHER filters
   - Add small ✕ inside search input (X clears the search text only, not other filters)

3. **Empty state intelligence:**
   - When 0 results + filters active: show specifically "אין מסמכים התואמים לחיפוש 'mp4' עם הסינונים: תיוג=חוזה, כיוון=פנימי" (lists active filters by name)
   - One-click action: "[הסר את כל הסינונים והשאר רק 'mp4']"

**Where to build:** Dedicated polish lesson AFTER Phase 1 deploy. Could be Lesson 11 or Phase 2 first item.

**Why NOT in Phase 1:** Adding 60 min now risks blowing the trip deadline. Filter pain is real but workaround (נקה סינון button) exists. Phase 1 = ship the archive; Phase 2 = polish the UX.

**Decision: PARKED until Phase 2.** Update STATUS.md when Phase 1 deploys to remember this is "first Phase 2 priority."

**Problem identified during 9D testing:** When multiple filters are active simultaneously (search box + tag + direction + client), users get "no results" but can't easily see which filter is killing the search. AND-logic is correct but invisible.

**Decision:** AND-logic stays (OR would flood with irrelevant results).

**Solution:** Add active-filter pills above the result count showing each active filter as a removable chip:
- 🔎 פעילים: [חיפוש: mp4 ✕] [תיוג: prompt ✕] [כיוון: פנימי ✕] [לקוח: חברת בנייה ✕]
- Click ✕ on individual pill → removes only that filter, keeps others
- "נקה הכל" button only when 2+ filters active

**Where:** Build during Lesson 9B (mobile responsive lesson) where filter UX gets touched anyway.

**Time:** ~30 min code + test.

**Why deferred:** Lesson 9D was functionally complete; pills are an enhancement that doesn't block shipping.

---

### 26/04/2026 — Storage Object Deletion Protection (technical note)

Supabase added `storage.protect_delete()` trigger that blocks SQL DELETEs from `storage.objects` table. To delete files: use Storage REST API (`DELETE /storage/v1/object/{bucket}/{path}`) with proper auth headers.

Our `deleteOrphanStorageObject()` function in uploadForm.js already uses the API correctly. No code change needed.

**Implication for Lesson 9C Python migration:** orphan cleanup MUST use Storage API, not raw SQL. Will document in script.

The 3 leftover storage files from Lesson 6 placeholder seeds are not worth deleting — they consume <1KB of storage and have no real impact.

---

### 26/04/2026 — Network-Failure Orphan Handling (Lesson 9C requirement)

**Observed during Lesson 9D testing:** When Wi-Fi was killed mid-batch via DevTools Offline, Storage POST succeeded for one file before going offline, but DB INSERT failed AND the cleanup DELETE also failed (no network). Result: 1 orphan storage file.

**Net mismatch:** 1 orphan in storage, no phantom in DB. Functionally invisible to user but adds to storage cost.

**Implications for Lesson 9C Python migration:**
- Python script MUST have retry-cleanup logic — store unsuccessful cleanups in a local file, retry on script exit
- Migration log must include "orphan suspects" section for manual review
- After migration, run a reconciliation SQL to detect any orphans

**Implications for Lesson 9D in-app (deferred):**
- Could add: on next page load, check for orphans owned by current user, retry cleanup silently
- BUT: low priority since real-world Wi-Fi failures are rare in stable home/office networks
- Park as "background reconciliation" enhancement for after Phase 1 ship

## 26/04/2026 — Audit Trail for Document Edits (Phase 2 nice-to-have)

**Why parked:** Gadi has no compliance requirement that mandates audit trail for self-edits in Phase 1. He's the only user. SOC2/HIPAA compliance kicks in only when this becomes multi-tenant SaaS.

**When to revisit:** When Phase 2 multi-user (wife as back-office) ships, OR when first paying customer wants compliance certifications.

**Design (when needed):** Trigger-based table `documents_audit` with: id, doc_id, edited_by, edited_at, field_name, old_value, new_value. UI: detail screen tab "היסטוריית עריכות" showing changes.
## 26/04/2026 — GadiW Pocket Mobile Companion App (Phase 2 — POST-TRIP)

**Source pattern:** Beni Pocket (avshi2-maker, Android-deployed, working perfectly).
**Reference file:** Avshi has the full index.html captured in this session.

**Concept:** Single-file HTML mobile-first app, separate from main GadiW, that:
1. Connects to GadiW's same Supabase (`pslwvkymccbngtyvgagj`)
2. Lets Gadi photograph documents from court / client meetings → upload to GadiW archive
3. Receives push notifications for daily tasks (court dates, deadlines, follow-ups)
4. Syncs Gadi's voice memos for transcription
5. Shows pending items dashboard (calls to return, documents to file)

**Key Beni Pocket patterns to reuse:**
- Bottom nav with 4-5 panels (one active at a time)
- Touch-friendly 44px+ buttons
- Dark theme (better for evening/court use)
- Camera + gallery + PDF upload buttons in grid
- Active project selector at top (in GadiW context = active client/matter)
- Day brief banner with collapsible details
- 100dvh viewport for mobile browsers
- Heebo font with full RTL

**Key DIFFERENCES from Beni Pocket (must change):**
- Auth required (Gadi login on phone) — Supabase email + password (or passkey)
- RLS enforced — no anon key abuse
- Files go to Supabase Storage (not Cloudinary) — privacy for legal docs
- Push notifications via Supabase Realtime + service worker
- Different Supabase project URL/key

**Timeline:** Phase 2, AFTER:
1. Gadi uses GadiW desktop for 2-3 months
2. Gadi explicitly asks for mobile companion
3. Phase 1 ships and is stable

**Estimated build time:** 6-8 hours of focused work. Worth a dedicated lesson series (Lessons 11-14).

**Decision:** PARKED. Do NOT build before Phase 1 deploy. Reference Beni Pocket index.html as starting template.
## 26/04/2026 — BUG to fix before ship: edit→detail navigation console error

**Symptom:** Edit a doc → click 💾 שמור → green success card → 4-sec auto-navigate to detail screen → screen shows correctly with new data → BUT console shows red error:
`Uncaught (in promise) TypeError: Cannot read properties of null (reading 'addEventListener') at renderFileDetail (fileDetail.js:175)`

**User-visible impact:** ZERO. Data saves, screen renders, error is console-only.

**Likely cause:** Stale event listener from previous render trying to attach to elements that no longer exist after green-banner replaced the form DOM.

**To debug tomorrow:**
1. Open `src/screens/fileDetail.js` line 175
2. Find the `addEventListener` call there
3. Check if the element it targets actually exists at that moment
4. Likely fix: wrap in a null check `if (someBtn) someBtn.addEventListener(...)` OR ensure renderFileDetail isn't called twice

**Time estimate:** 10-15 min fix. Must do before deploy (Lesson 10).
---

### 26/04/2026 — Upload Form Mobile Header Clipping (Phase 2 cosmetic)

**Problem:** On mobile (Android Chrome <768px), the upload form's header title "העלאת מסמך חדש" is clipped on the right edge — visible as "לאת מסמך חדש". The cancel button stays in the top-left corner instead of stacking below.

**Tried during Lesson 9B Phase E (26/04/2026):**
1. External mobile.css with `[data-screen="upload"] .up-header { flex-direction: column }` — didn't apply
2. CSS `:has()` selector approach — didn't apply
3. Inline `<style>` block in component innerHTML — didn't apply (TBD why)

**Likely root cause (best guess):** The form's outer `<div>` has inline `style="max-width: 700px; margin: 40px auto;"` which the cascade isn't overriding cleanly on mobile. RTL direction + flex justify-content:space-between pushes the title outside the viewport on the right side.

**User-visible impact:** Cosmetic only.
- ✅ Form is FULLY FUNCTIONAL — drop zone works, file picker works, bulk table works, single-file mode works, validations work, progress UI works, retry works
- ✅ ביטול button is still tappable and works
- ❌ Title is half-clipped — Gadi can still understand the screen ("העלאת מסמך" partially visible is enough context)
- ❌ Looks unprofessional but not broken

**Why parked:** Lesson 9B is about responsive foundations, not pixel-perfection. The form ships as functionally complete. Cosmetic header polish is not worth blocking the trip deadline (14 days).

**To fix in Phase 2 polish lesson:**
1. Refactor uploadForm.js header to NOT use `flex justify-content: space-between` 
2. Use a simple `<header><h1>title</h1><button>cancel</button></header>` and let CSS Grid handle layout
3. Or: replace inline `style=` attributes with class-based styling so the cascade works as expected
4. Test on real Android device (DevTools emulation may not match exactly)

**Time estimate when fixing:** 30 min (refactor + test)

**Decision:** PARKED — visible flaw, but not a ship-blocker. Document the limitation in Lesson 10 onboarding so Gadi isn't surprised on his phone.
---

### 26/04/2026 — Mobile Bulk File Row Text Clipping (Phase 2 cosmetic)

**Problem:** On mobile bulk upload table, filenames are clipped showing ".g" / ".." instead of "cover-facade.jpg". Desktop displays full filenames correctly.

**Root cause:** Same family as upload header bug — inline `style="..."` attributes (text-overflow:ellipsis, white-space:nowrap) inside dynamically-generated HTML have higher specificity than `@media (max-width: 768px)` rules trying to redistribute the layout.

**User-visible impact:** Cosmetic only.
- ✅ Bulk upload functionality is fully working (3 files uploaded successfully in test)
- ✅ Tag inputs visible and tappable
- ✅ ✕ remove buttons work
- ✅ Total size shown
- ❌ Filenames truncated to 2-3 chars on mobile bulk table only
- Single-file mode shows filename correctly

**Phase 2 fix:** Refactor the bulk file row HTML to NOT use inline styles. Move all styling to CSS classes. Then media queries can override cleanly. ~45 min refactor.

**Why parked:** Lesson 9B ships responsive foundations. Cosmetic polish blocks no functionality.

---

### 26/04/2026 — "Apply Tag to All" Box Clears After Click (UX confusion)

**Problem:** In bulk upload, user types tag in "💡 החל תיוג על כל הקבצים" main box → clicks "החל על הכל" button → tag IS applied to all rows correctly, BUT the main box appears to clear and rows look empty in main display (rows actually have the tag, just visually subtle).

**Root cause:** `applyTagToAll(tag)` calls `renderFileTable()` which regenerates the HTML, creating a fresh empty `#bulk-tag-input` (loses user's typed text). The row inputs DO have the new tag value but it's not visually obvious because each row's input also uses placeholder styling.

**User-visible impact:** UX confusion — user thinks click didn't work, may click again or give up.

**Phase 2 fix options:**
1. Show a brief green flash/toast: "✓ תיוג 'X' הוחל על 3 קבצים"
2. Don't clear the main bulk-tag-input box after apply
3. Make applied tags visually prominent in row inputs (bold, different color)
4. Add a subtle animation when row inputs receive the new value

**Why parked:** Functionality works correctly — only the visual feedback is unclear. Document in Lesson 10 onboarding so Gadi knows the click works even if not obvious.

**Time estimate:** 20 min fix in Phase 2 polish lesson.
---

### Multi-user / team features

- [PARKED] **Wife as back-office user**
  - Reason: Gadi did not mention her in fact-finding meeting
  - Revisit: After Phase 1 ships and he uses it solo for 2-3 months
  - Decision rule: only build if Gadi himself asks

- [PARKED] **2-monitor split-screen UI**
  - Reason: Gadi did not mention. Modern browsers handle 2 monitors natively (open 2 windows)
  - Revisit: If users actually ask for it
  - Decision rule: do not build until 3+ users request it

- [PARKED] **Multi-tenant SaaS for other lawyers**
  - Reason: Phase 1 is Gadi-only proof of concept
  - Revisit: After Gadi has used it for 3+ months happily
  - Plan: hire Israeli tech lawyer (~5-15k ILS) for proper DPA + privacy policy

---

### AI heavy features

- [PARKED] **Real-time meeting recording (90+ min)**
  - Reason: Gadi explicitly said he is afraid of recording client calls
  - Revisit: ONLY if Gadi himself raises it after 6+ months of trust
  - Risk: legal disclosure required, client consent

- [PARKED] **Legal precedents RAG database (Israeli case law)**
  - Reason: Significant build (curation requires real lawyer time)
  - Revisit: After Phase 4 succeeds and Gadi asks for case-law lookup
  - Cost: medium effort, real value

- [PARKED] **Custom Hebrew legal vocabulary tuning for ElevenLabs**
  - Reason: Identified during demo (e.g. heard "עיסוי" instead of "ניסוי")
  - Revisit: When Phase 3 voice features ship
  - Solution: prompt engineering OR custom vocab list to ElevenLabs

---

### Demo / showcase ideas

- [PARKED] **60-second wow demo with fake real-estate inheritance case**
  - Reason: Designed for fantasy Gadi. Real Gadi wants archive first.
  - Revisit: Marketing material when Phase 5 ships
  - Asset: DEMO_DESIGN.md and DIALOG_SCRIPT.md preserved separately

- [PARKED] **Standalone gadi_voice_demo HTML for WhatsApp shares**
  - Reason: Already shipped to Gadi 21/04 successfully, served its purpose
  - Status: Keep file; do not develop further; reuse code patterns in Phase 3

---

### Bigger SaaS / business plays

- [PARKED] **International clients (English-speaking lawyers)**
  - Reason: Israel market first
  - Revisit: After 5+ Israeli lawyers paying

- [PARKED] **Stripe billing / subscriptions**
  - Reason: Free for Gadi forever; subscriptions only when 3rd lawyer signs up
  - Revisit: Phase 6+

- [PARKED] **Convert design docs to podcast format for Gadi**
  - Reason: Nice idea, not critical path
  - Revisit: When something interesting needs his absorption time

---

## TRASHED (with reason)

- [TRASHED 19/04/2026] **USB fingerprint device + SMS 2FA security architecture**
  - Reason: USB hardware = 2015 thinking, SMS officially deprecated by NIST since 2016 (SIM swap attacks)
  - Replaced by: Supabase Auth (email + password + TOTP + passkeys + RLS)

- [TRASHED 21/04/2026] **Verbal trigger word for voice memo categorization**
  - Reason: Avshi correctly pointed out users will not remember to say "ר עיון" first
  - Replaced by: AI auto-categorization on the transcript content

- [TRASHED 21/04/2026] **Add idea filter to Beni journal**
  - Reason: Beni journal frozen for Beni testing; Phase 1 is fresh-build instead
  - Replaced by: This IDEAS_PARKING.md file (much simpler)

- [TRASHED 21/04/2026] **Test idea: VS Code is now my home**
  - Reason: Was just a test entry

- [TRASHED 24/04/2026] **getSession() hang investigation**
  - Reason: Resolved in Lesson 6.5 — root cause = SDK navigator.locks bug. Fix: downgrade to 2.39.8 + REST fetch pattern project-wide.

---

## REVIEW LOG

| Date | What was reviewed | Decisions made |
|---|---|---|
| 21/04/2026 | Initial creation | Established phases, captured all known ideas from Day 1 + Day 2 |
| 26/04/2026 | Reorganization after Lessons 9A + 9D | Consolidated duplicate USB strategy; merged scattered Phase 2 intake form notes; moved TRASHED back to end; updated SCHEDULED Phase 1 with completion checkmarks |

---

*Last updated: 26 April 2026 · End of Lesson 9D — Reorganized for clarity*