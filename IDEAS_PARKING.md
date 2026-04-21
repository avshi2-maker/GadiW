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

### 21/04/2026 — Lesson 1 day
- *(none yet — capture them as they come)*
- 21/04/2026 — Test idea: VS Code is now my home for all editing

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

---

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
