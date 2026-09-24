# SIR-WATCH inventory — Meghalaya CEO (ceomeghalaya.nic.in)

**Date:** 2026-09-24
**Method:** Public web search (browser_search) plus direct fetches of the CEO homepage, the claims page, one service-elector PDF, and the draft-publication press note. No live-browser clicking (subagent has no browser control tools); no CAPTCHA, login, OTP, or paywall encountered. **Every row's URL was directly observed — none invented or extrapolated.**
**Rows:** 23. Current ACs: 11 of 60 (ACs 4, 6, 10, 13, 15, 16, 25, 30, 49, 55, 58). Legacy 2005 rows: 12 part PDFs across 9 old-delimitation AC identities (ACs 2, 14, 16, 17, 20, 24, 26, 27, 31). Distinct numeric AC numbers: 19 (AC 16 appears in both vintages with different AC names — 2005 "Malki Nongthymmai" vs 2025 "East Shillong"). Districts: 5 verified names (East Jaintia Hills, East Khasi Hills, Eastern West Khasi Hills, West Garo Hills, West Khasi Hills); 11 rows have district `null` because the district was not directly observed for them.

## Click path (actually navigated via direct fetches)
- Homepage: `https://ceomeghalaya.nic.in/` — displays headings "DRAFT ELECTORAL ROLLS OF SPECIAL INTENSIVE REVISION (SIR) 2026 PUBLISHED ON 5TH AUGUST, 2026" and "LIST OF VOTERS WHOSE NAMES WERE IN THE MEGHALAYA ELECTORAL ROLLS AS ON 2025 BUT ARE NOT INCLUDED IN THE DRAFT ROLL OF SIR 2026". Their target hrefs were NOT exposed in the fetched page text, so no draft-roll or ASDD file URLs could be recovered from the homepage.
- `https://ceomeghalaya.nic.in/erolls/` — mostly empty dropdown placeholders, no usable links.
- `https://ceomeghalaya.nic.in/erolls/display-claims-and-objections.html` — lists all 60 ACs × 5 "Click here" links for Forms 9/10/11/11A/11B, but the displayed vintage is **2022-11-09 to 2022-12-08 (SSR 2022), NOT SIR 2026**. Exact file hrefs were omitted by the text fetch; no rows created from these labels.
- Draft-publication press note: `https://ceomeghalaya.nic.in/press-notes/pn_draft_pub_5_8_2026.pdf` (dated 2026-08-05) — confirms: draft rolls published for all 60 ACs; boothwise ASDD/non-inclusion lists placed on CEO and DEO websites; 12 districts, 60 EROs, 3,551 polling stations during enumeration; 2005 SIR rolls uploaded as partwise searchable PDFs. Supporting documentation, not a roll row.

## SIR 2026 schedule observed (homepage + press note)
- Draft publication: 2026-08-05.
- Claims/objections deadline: **2026-09-18** (supersedes original 2026-09-04).
- Disposal/hearing deadline: **2026-10-17** (supersedes 2026-10-03).
- Final publication: **2026-10-21** (supersedes 2026-10-07).
- Draft-roll electorate: 21,69,243 (of 23,49,645 pre-SIR); ASDD identified: 1,80,402 (per DEO/press material).

## What is inventoried (by roll_type)
1. **Final Roll (Service Electors, 2025)** — 11 rows: per-AC service-elector files, Special Summary Revision 2025 (qualifying date 01-01-2025, final publication 06-01-2025; verified by direct fetch of the AC 16 file). Text-searchable PDF, plain GET, Scriptable=Y. These are the "Last Part" service-elector supplements of the pre-SIR baseline roll.
2. **Final Roll (Intensive Revision 2005)** — 12 rows: part-level PDFs from the 2005 SIR baseline (qualifying date 01-01-2005; final publication 15-04-2005 per repeated snippets — see caveat below). Scanned-image PDFs that the CEO press note describes as searchable; Scriptable=Y.

**No SIR 2026 draft-roll, deletion/ASDD-list, or supplement file URLs were directly observed** — the homepage advertises both, but their link targets were not recoverable without live-browser navigation.

## URL patterns observed (predictable; only observed instances are inventoried)
1. `https://ceomeghalaya.nic.in/erolls/pdf/service-electors/S15AC{NNN}SVR.pdf` — S15 = Meghalaya state code, {NNN} = zero-padded 3-digit AC number. Observed: AC004, AC006, AC010, AC013, AC015, AC016, AC025, AC030, AC049, AC055, AC058. **Not enumerated further.**
2. `https://ceomeghalaya.nic.in/erolls/pdf/english/A{AC}/{CODE}{PPPP}.pdf` — legacy 2005 part PDFs, where A{AC} is the folder by old AC number, {CODE} is a file-prefix code, and {PPPP} is the zero-padded 4-digit part number. **ANOMALY: the pattern is not safe to enumerate** — the two AC 26 Nongkrem files sit in folder `A026` but their filenames begin `A024` (`A026/A0240021.pdf`, `A026/A0240015.pdf`); folder ≠ filename code.

## District mapping (per-PDF evidence and CEO/DEO press material only)
- East Jaintia Hills: AC 6. East Khasi Hills: ACs 13, 16, 17, 20, 24, 25*, 26, 31 (*legacy AC 31 Mawsynram; current AC 25 Mawsynram district unobserved → null). Eastern West Khasi Hills: AC 30. West Garo Hills: AC 49. West Khasi Hills: AC 14. Rows with district `null` (ACs 4, 10, 15, 25, 55, 58 current; ACs 2, 16, 27 legacy): district was not directly observed; left null rather than inferred from delimitation tables.

## Caveats
- Legacy 2005 `last_updated` (15-04-2005) is the final-publication date repeatedly shown in snippets for this file family, not a per-file-verified timestamp.
- Old-delimitation AC names/numbers (pre-2008) differ from current ACs: e.g. AC 16 "Malki Nongthymmai" (2005) vs AC 16 "East Shillong" (2025) — same numeric AC number, different constituency identity.

## ACCESS NOTES / gates
- **Direct URLs observed: all Scriptable=Y** — plain GET, no CAPTCHA/login/OTP anywhere in the observed paths (`/erolls/pdf/service-electors/`, `/erolls/pdf/english/`, `/press-notes/`).
- **Zero SIR-2026 draft/ASDD file URLs recovered** — the current-draft navigation links are rendered but their hrefs were not exposed in fetched text; live-browser click-through is required. **One non-security navigation/rendering blocker: the current-vintage roll file links are not exposed in the fetched homepage HTML**, so they cannot be catalogued without interactive browsing.
- **Directory listing denied:** fetching `https://ceomeghalaya.nic.in/erolls/pdf/english/` (directory index) failed; per standing instruction that path is terminal for this session — no retry, no curl.
- Claims/objections file hrefs for the 2022 vintage were also not exposed in fetched text; and the current SIR-2026 claims forms (Form 9/10/11/11A/11B) pages exist on the homepage headings but their targets were likewise not exposed.
- **No JSON API, query-string download endpoint, or file-list endpoint was directly observed.**
- **No API/data access controls were bypassed; none were encountered.**
