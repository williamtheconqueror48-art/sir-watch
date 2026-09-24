# SIR-WATCH inventory — Kerala CEO (ceo.kerala.gov.in)

**Date:** 2026-09-24
**Method:** Public web search only (browser_search). `browser_open` was unavailable in this session (browser-service fetch failure; terminal for this turn), so the CEO site itself could NOT be fetched page-by-page. Every inventory row traces to a verbatim full URL returned by the search engine, whose index had crawled the CEO-hosted PDF content (titles and extracted text were shown in snippets). AC names are copied verbatim from those snippets. **No URL was invented; every row's URL was directly observed in a search result.**
**Rows:** 35. Districts covered: 13 of 14 (Kozhikode absent). Unique ACs: 30 (+ 2 state-level documents).

## Click path (inferred from search evidence, not personally navigated)
- Rolls page: `https://www.ceo.kerala.gov.in/electoralrolls.html` — links to (a) main-roll downloads routed through `voters.eci.gov.in/download-eroll?stateCode=S11` (CAPTCHA-gated; not inventoried — no rows), and (b) direct service-elector roll PDFs.
- SIR-2026 material sits under `/uploads/sir-2026/` (electorate aggregate, daily statutory claim/objection lists, GO/circulars).
- SIR-2026 elector-movement reports sit under `/uploads/voters-movement/`.
- Older statutory lists sit under `/ceokerala/pdf/statutory-forms/` and `/pdf/SSR2023_CLAIMS/`.
- A separate PDF fetch+parse agent was already working on Kerala; this inventory is metadata-only. **No PDF was downloaded by this worker.**

## What is inventoried (by roll_type)
1. **Final Roll (Service Electors, 2017)** — 6 rows: AC### direct GET PDFs, Special Summary Revision 2017 (qualifying 01-01-2017, final publication 10-01-2017). Two have `_sl02` suffix = Supplement List 2.
2. **SIR 2026 – Electors Movement Report/Request** — 10 rows: per-AC "Part/Section wise Electors Movement Report" / "Electors Movement Request" PDFs, created 08–18 Dec 2025, covering polling-part rationalisation movements (elector count, move-out, move-in, net). Dated right after SIR enumeration (04-11-2025–04-12-2025).
3. **SIR 2026 – Claims lists (Form 9 / Form 11A)** — 5 rows: daily statutory lists of inclusion applications (Form 9) and within-constituency shifting applications (Form 11A), dated 10/16/25-01-2026.
4. **Objections lists (Form 10)** — 12 rows: statutory lists of objections to inclusion (Death / Absent-Permanently Shifted / Not Indian Citizen). 11 from Nov 2024 revision + 2 from SSR 2023 + 1 from SIR 2026 (AC 70, 10-01-2026). This is the closest publicly-observed proxy to deletion/ASD material on the CEO site.
5. **State-level** — 2 rows: `final_electorate_sir_2026.pdf` (district × AC elector counts, dated 23-12-2025; used as the authoritative district-number map below) and `Name-Search-Instructions-SIR-2002.pdf` (Malayalam how-to for the SIR-2002 name search, linked from the CEO's SIR-2002 notice).

**No part-level main-roll PDFs and no ASDD/deletion list PDFs were directly observed.** Form 10 objection lists (reasons: Death, Absent/Permanently Shifted) are the only deletion-adjacent public material found.

## URL patterns observed (predictable; only observed instances are inventoried)
1. `http(s)://(www.)ceo.kerala.gov.in/pdf/serviceelectors/AC{NNN}.pdf` — service electors final roll 2017 (prior survey verified plain-GET 200 OK). `_sl02` variant = supplement list 2.
2. `https://www.ceo.kerala.gov.in/uploads/voters-movement/AC{NNN}.pdf` — per-AC elector movement report/request, Dec 2025.
3. `https://www.ceo.kerala.gov.in/uploads/sir-2026/list-claims/{DD-MM-YYYY}/form{9|10|11a}/form{9|10|11a}-S11{DD}-{AC}-{YYYY-MM-DD}-report.pdf` — daily statutory lists, claims period Jan 2026. S11 = Kerala, {DD} = ECI district number, {AC} = AC number.
4. `https://www.ceo.kerala.gov.in/ceokerala/pdf/statutory-forms/{DD-MM-YYYY}/FORM10/S11A{AC}_form10.pdf` — Form 10 lists, 2024 revision.
5. `https://www.ceo.kerala.gov.in/pdf/SSR2023_CLAIMS/form10/S11A{AC}_form10.pdf` — Form 10 lists, SSR 2023.

## District mapping (authoritative: the CEO-hosted `final_electorate_sir_2026.pdf` itself)
1 KASARAGOD · 2 KANNUR · 3 WAYANAD · 4 KOZHIKODE · 5 MALAPPURAM · 6 PALAKKAD · 7 THRISSUR · 8 ERNAKULAM · 9 IDUKKI · 10 KOTTAYAM · 11 ALAPPUZHA · 12 PATHANAMTHITTA · 13 KOLLAM · 14 THIRUVANANTHAPURAM.
AC→district in rows uses this map plus per-PDF evidence (S11{DD} codes in filenames; DIST_NO printed inside service-elector PDFs for AC 7=KANNUR, AC 92=IDUKKI; final_electorate district blocks: 7-THRISSUR=66–73, 8-ERNAKULAM=74–87, 9-IDUKKI=88–92, 10-KOTTAYAM=93–101) and the standard ECI delimitation for the rest. AC names are verbatim from search snippets.

## API-like endpoints
None JSON-shaped. The `list-claims` tree (pattern 3 above) is the closest thing to an API: fully deterministic filename from (date, form type, district, AC), and the per-date directory should enumerate one report per AC with any claims that day. No JSON/query-string endpoints observed.

## ACCESS NOTES / gates
- **Direct URLs observed: all Scriptable=Y** — plain GET, no CAPTCHA/login/OTP anywhere in the observed paths (`/pdf/serviceelectors/`, `/uploads/voters-movement/`, `/uploads/sir-2026/`, `/ceokerala/pdf/statutory-forms/`, `/pdf/SSR2023_CLAIMS/`).
- **Main (non-service) electoral-roll PDFs: NOT inventoried (no rows, no direct links observed).** Prior survey (~/workspace/sir-watch/ceo-roll-survey.md) documents: CEO rolls page routes main-roll downloads through `voters.eci.gov.in/download-eroll?stateCode=S11` with a per-download CAPTCHA → Scriptable=N; never bypassed, never attempted.
- **SIR Draft Roll 2026 (part-level):** not directly observed on the CEO domain; the CEO's Malayalam SOP routes users to the CAPTCHA-gated ECI portal. No bypass attempted.
- **ASDD/deletion lists:** searched explicitly (`ASDD absent shifted dead duplicate list pdf`) — none found on ceo.kerala.gov.in. The CEO's presiding-officer handbook confirms ASD (Absentee/Shifted/Dead) lists exist per polling station but they are operational docs, not published as bulk PDFs.
- **Limitation:** this inventory is search-index-based because browser_open failed this session. The fetch+parse agent working Kerala in parallel has the authoritative live view of which URLs still 200. The `/pdf/serviceelectors/` 200-OK was verified by the earlier survey (parent session).
- **Privacy:** inventory is URLs + metadata only. Claim/objection PDFs (Form 9/10/11A) contain claimant elector names — names are NOT reproduced here; only the file URLs and AC/date metadata.

## Coverage counts
- Rows: **35** (0 fabricated).
- Unique ACs: 30 (see Coverage counts) + 2 state-level docs.
- Districts: 13/14 (Kozhikode has zero rows).
- Parts: 0 (no part-level PDFs observed).
- Gates hit: 0 on inventoried URLs; 1 documented upstream gate (ECI portal CAPTCHA for main rolls).
