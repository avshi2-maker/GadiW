# GadiW

> מערכת ניהול משרד עורכי דין חכמה · עם עוזר AI בעברית  
> *Intelligent legal office management system · with Hebrew AI assistant*

---

## What this project is

A focused CRM + document archive built for **solo Israeli lawyers**. Desktop + mobile. Hebrew-first. AI-assisted.

**Phase 1 goal (urgent):** secure cloud document archive — so Gadi can retire his USB drive before his 4-week USA trip.

**Phase 2+:** templates in lawyer's own writing style, voice memo analysis, calendar, billing, multi-user.

---

## Who this is for

- **Beta user:** Gadi W. (solo Israeli lawyer, ~60, traditional, AI-cautious)
- **Future:** Any solo Israeli lawyer who needs paperless office + AI assist
- **Target tier:** ~$10-20/month SaaS

---

## Tech stack

- **Frontend:** HTML + vanilla JS (no framework yet)
- **Backend:** Supabase (Postgres + Auth + Storage + RLS)
- **AI:** Anthropic Claude (analysis) + ElevenLabs (Hebrew STT)
- **Hosting:** GitHub Pages (static) or Vercel (when backend needed)
- **Local dev:** Windows 11 + Node.js + Python 3 + VS Code

---

## Project status

See `STATUS.md` for current phase + next steps.

See `IDEAS_PARKING.md` for parked ideas NOT in current scope.

---

## Confidentiality note

This project processes attorney-client privileged information.

- Lawyers own their data completely
- No vendor access to client content (enforced via Supabase RLS)
- Data residency: EU region

---

## Development philosophy

- **Working > Clean** — ship, then polish
- **Plan > Code** — design docs before implementation
- **Tiny commits** — one logical change per commit
- **Design for user, not designer** — match Gadi's actual workflow

---

*Project started 20 April 2026 · Student: Avshi Sapir · Course: Pro Build University*
