# SIR-WATCH inventory notes — CEO Puducherry (`ceopuducherry.py.gov.in`)

Date of inventory: 2026-09-24.

## Method and click/search path

1. Opened the official homepage `https://ceopuducherry.py.gov.in/` ("Welcome to the Official Website of the Chief Electoral Officer, Puducherry!"). Its fetched text exposed no electoral-roll navigation links, so no click path to roll files was observable from the homepage.
2. Ran targeted public searches (`browser.search`) for roll PDFs on the CEO domain, e.g. "ceopuducherry.py.gov.in serviceelectors pdf", "site:ceopuducherry.py.gov.in electoral roll", "Special Intensive Revision electoral roll 2026 Puducherry service electors pdf", and AC-specific queries ("Mannadipet electoral roll 2026 ceopuducherry pdf", "Karaikal Nedungadu Thirunallar", "Mahe Yanam").
3. Followed the search results' exact URLs (verbatim from tool output — nothing constructed) and opened each PDF directly. 14 of the 21 PDFs were opened and their headers (AC number/name, revision type, publication date) read; 7 were identified from search-index text of the same direct URLs.
4. No login, CAPTCHA, OTP, or other access control was presented by any of the direct CEO PDF URLs. No API/JSON endpoint was discovered.
5. Rows were written to `~/workspace/sir-watch/inventory/sir-inventory-puducherry.jsonl` (21 rows, 21 unique URLs, validated: exact 10-key schema).

## URL patterns observed

- `https://ceopuducherry.py.gov.in/admin/serviceelectors/AC_##.pdf` — SIR Final Electoral Roll 2026, service electors (verified live for AC_01, AC_09).
- `https://ceopuducherry.py.gov.in/admin/serviceelectors/<20-digit timestamp>.pdf` — other vintages: 6 × Final Electoral Roll 2026 (continuous updation), 3 × Draft Electoral Roll 2025 (SSR draft), 3 × Final Electoral Roll 2025 (SSR).

Note: `AC_##.pdf` URLs for ACs other than those in the JSONL were NOT assumed — e.g. no `AC_02.pdf`/`AC_29.pdf` in that series was observed, so none was included.

## Vintages (publication dates, as printed in the PDFs)

- SIR Final Electoral Roll 2026, publication 14-02-2026 (service electors, "Last Part").
- Final Electoral Roll 2026, continuous updation, publication 23-03-2026 (service electors, "Last Part"; headers say "Continuous Updation").
- Draft Electoral Roll 2025, SSR(D), draft publication 29-10-2024 (service electors, "Last Part").
- Final Electoral Roll 2025, Special Summary Revision, publication 06-01-2025 (service electors, "Last Part", incl. Supplement No. 1 additions/deletions/corrections).

## Row verification table

Directly opened (header + AC + revision + publication date confirmed):
- AC_01 (MANNADIPET, SIR final 2026, 14-02-2026); AC_09 (THATTANCHAVADY, SIR final 2026, 14-02-2026);
- 20260610132405484566494 (1-MANNADIPET, final 2026 cont. updation, 23-03-2026);
- 202606101324351125287697 (2-THIRUBHUVANAI, final 2026 cont. updation, 23-03-2026);
- 20260610133328698757758 (8-INDIRA NAGAR, final 2026 cont. updation, 23-03-2026);
- 202606101335491698629338 (13-MUTHIALPET, final 2026 cont. updation, 23-03-2026);
- 202606101342271674398132 (24-NEDUNGADU, final 2026 cont. updation, 23-03-2026);
- 20260610134248179958689 (25-THIRUNALLAR, final 2026 cont. updation, 23-03-2026);
- 202501060418022005349512 (8-INDIRA NAGAR, final 2025 SSR, 06-01-2025);
- 20241115115109553302412 (5-VILLIANUR, draft 2025 SSR(D), 29-10-2024);
- 20250106041245491987635 (30-YANAM, final 2025 SSR, 06-01-2025);
- 20241115115903367943909 (23-BAHOUR, draft 2025 SSR(D), 29-10-2024);
- 202411041407082033023599 (29-MAHE, draft 2025 SSR(D), 29-10-2024);
- 202501060414371632830111 (23-BAHOUR, final 2025 SSR, 06-01-2025).

Identified from search-index text of the direct URL only (not yet opened; `last_updated` left null except where the snippet stated it):
- AC_03 (3-OUSSUDU), AC_07 (7-KADIRGAMAM), AC_11 (11-LAWSPET), AC_13 (13-MUTHIALPET), AC_24 (24-NEDUNGADU) — snippets identify "Final Electoral Roll, 2026" / "Final Electoral Rolls of 2026" / "Final Electoral Roll - 2026".
- AC_22 (22-NETTAPAKKAM, 14-02-2026 in snippet), AC_25 (25-THIRUNALLAR, "Final Electoral Roll, 2026", 14-02-2026 in snippet).

## Coverage counts (exact)

- Total rows: **21** (21 unique file URLs).
- Districts (district inferred from standard ECI AC→district mapping; PDFs do not print district): Puducherry — 16 rows; Karaikal — 3 rows; Mahe — 1 row; Yanam — 1 row.
- ACs covered: 1 (MANNADIPET), 2 (THIRUBHUVANAI), 3 (OUSSUDU), 5 (VILLIANUR), 7 (KADIRGAMAM), 8 (INDIRA NAGAR), 9 (THATTANCHAVADY), 11 (LAWSPET), 13 (MUTHIALPET), 22 (NETTAPAKKAM), 23 (BAHOUR), 24 (NEDUNGADU), 25 (THIRUNALLAR), 29 (MAHE), 30 (YANAM).
- Roll types: SIR Final Roll 2026 (service electors) — 9 rows; Final Roll 2026 continuous updation (service electors) — 6 rows; Draft Roll 2025 SSR(D) (service electors) — 3 rows; Final Roll 2025 SSR (service electors) — 3 rows.
- AC name spellings are as printed in the PDFs (e.g. "THIRUNALLAR", "BAHOUR", "THIRUBHUVANAI", "MANNADIPET").

## Gates

- None on the inventoried CEO URLs: plain HTTP GET, no CAPTCHA/login/OTP.
- Not inventoriable here: full ordinary-elector rolls for Puducherry are served only through ECI's central roll downloader (CAPTCHA-gated per PDF) — not bypassed, per standing rule.
- No ASDD (absent/shifted/dead/duplicate) lists, deletion lists, or SIR draft-roll-2026 ordinary-part PDFs were directly observed on the CEO site. A press-note search result states boothwise SIR draft and absent/shifted/death/duplicate lists were published on the CEO site, but no direct file link to those lists was observed.
- No CAPTCHA, login, OTP, or bot-control bypass was attempted at any point.

## Limitations

- All 21 observed files are the service-electors "Last Part" of each AC's roll — not the ordinary-elector boothwise parts, and not a whole-state roll.
- Coverage is partial: 15 of 30 ACs appear, and several ACs appear only in one vintage.
- `part_number` is null for every row because the PDFs expose no numeric part number ("Last Part / Service Electors").
- Embedded supplements (additions/deletions/corrections lists inside the 2025 final-roll PDFs and 2026 final-roll PDFs) were not split into separate rows: each observed URL is one combined PDF.
- Districts are inferred from the standard AC→district mapping (ACs 1–23 Puducherry; 24–28 Karaikal; 29 Mahe; 30 Yanam), not printed in the PDFs.
