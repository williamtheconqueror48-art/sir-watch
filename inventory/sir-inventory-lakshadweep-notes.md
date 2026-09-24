# SIR Inventory Notes — Lakshadweep (UT)

**Domain used:** `https://ceolakshadweep.gov.in/` — the hint domain `ceolakshadweep.nic.in` did NOT resolve/fetch from this environment (browser_open failed on it). The live official CEO site is **ceolakshadweep.gov.in** (confirmed by direct page fetch + search index). All URLs below are verbatim from browser_search output or browser_open page text.

**Method:** Public web search (browser_search) + text-only page fetch of the electoral-roll listing page via browser_open (no clicks, no forms, no CAPTCHA/logins touched, no URL guessing). Every candidate file URL in the CMS upload buckets was fetched and its content identified before deciding whether it is an electoral-roll file. No elector names or EPIC numbers recorded anywhere.

**Row count:** 0. No directly-observable individual roll *file* URLs (see ACCESS NOTES).

## Click path (observed)
1. Home page (site root `https://ceolakshadweep.gov.in/`, also served as `home.html`) → nav link **"Electoral Rolls"**.
2. `https://ceolakshadweep.gov.in/electoral-rolls` — fetched in full. Contains exactly four roll-download sections, in order:
   - **"Lakshadweep SIR FINAL ELECTORAL ROLL 2026"** — a PC-wise table: `PC No 1 | PC Name LAKSHADWEEP | Action: Download`
   - **"Download Electoral Roll 2026 -Island Wise"** (section header; part/island list not rendered in text fetch)
   - **"Download Last Part of Electoral Roll"** (section header)
   - **"Download Electoral Roll 2025"** (section header)
3. The "Download" buttons render as plain-text labels in the fetched text — **no hrefs were exposed** by the text extractor, and the web-search index contains no per-file roll URLs for this site. The buttons are therefore JS-driven or otherwise invisible to text-only reads; navigating them requires live-browser interaction. The actual file URLs behind them are NOT inventoried (zero-fabrication).

## Organization (district → AC → part)
- Lakshadweep has **one district** (Lakshadweep), **no Legislative Assembly ACs** — the roll is organized by **Parliamentary Constituency 1 – LAKSHADWEEP → island → Part No.**
- Parts run **1–64**, one contiguous series per island (per `/ero-aero-blo` BLO list, which names parts 1–64 and their polling stations; e.g. Agatti = parts 58–64).
- Island ↔ part counts from the site (final roll 2026, 57,607 electors): Bitra 1 part (226 electors), Chetlat 2 (2,063), Kiltan 4 (3,793), Kadmat 5 (4,849), Amini 9 (7,106), Androth 12 (10,696), Kalpeni 6 (4,118), Minicoy 9 (8,596), Kavaratti 9 (9,300), Agatti 7 (6,860).

## URL naming pattern (observed, not inferred)
- CMS upload bucket: `https://ceolakshadweep.gov.in/Users/<bucket>/<base64-filename>`. Filename is base64 of the original upload name, e.g. `MTc2Mjc2NzkxM181NjVhYzZjOTIyNTc0YjRhNTUwZC5wZGY=` = `1762767911_565ac6c922574b4a550d.pdf` (epoch-prefix = upload timestamp).
- Buckets observed: `download_pdf_press_notes`, `download_pdf_draft_roll_2024`, `download_pdf_ssr2023_form11a`, `download_pdf_ssr2023_form9`.
- All of these are plain-GET downloadable (no CAPTCHA/gate on the file URLs) — Scriptable=Y for the *files themselves*; but no roll files were found in them (see below).

## Vintages / roll types known to exist (listing-level only)
- **SIR FINAL ELECTORAL ROLL 2026** (qualifying 01.01.2026; final published ~07.02.2026 per SIR schedule; page table states roll as of 14.02.2026, 57,607 general electors, 155 service voters, 1 overseas voter) — PC-level download button observed; file URL NOT observed.
- **Electoral Roll 2026 – Island Wise** — section observed; no URLs observed.
- **Electoral Roll 2025** — section observed; no URLs observed.
- **Draft Electoral Roll (SIR) published 16.12.2025** (per CEO press release dated 12.12.2025: draft list to be on CEO website + ECINET; 64 booths; claims/objections 16.12.2025–15.01.2026) — no per-booth file URLs observed in search index.

## Observed-but-EXCLUDED files (content verified by fetch; not electoral rolls)
Each URL was fetched via browser_open and its first lines read. All are press notes/advertisements, not rolls — hence no rows. Direct-GET, no gate (all would be Scriptable=Y if they were in scope):
- `.../download_pdf_draft_roll_2024/U0lSLnBkZg==` = "SIR.pdf" — ECI Press Note 236/2025 (Bihar SIR begins, 28.06.2025).
- `.../download_pdf_draft_roll_2024/bm5ubi5wZGY=` = "nnnn.pdf" — ECI Press Note 233/2025 (Bihar SIR order, 24.06.2025).
- `.../download_pdf_draft_roll_2024/MjAwMy5wZGY=` = "2003.pdf" — ECI Press Note 237/2025 (Bihar 2003 rolls uploaded, 30.06.2025).
- `.../download_pdf_draft_roll_2024/em1zZ2o2eThVTi5wZGY=` = "zs1sgj2y8UN.pdf" — ECI Press Note 076/2026 (TN/WB 2026 poll participation, 23.04.2026).
- `.../download_pdf_draft_roll_2024/MTc2MTI4MTIyMl9hNTlmNzI0YjRkYjAyNjk2NDliZC5wZGY=` = "1761281222_a59f724b4db0269649bd.pdf" — ECI Press Note 339/2025 (CEO conference on SIR preparedness, 23.10.2025).
- `.../download_pdf_draft_roll_2024/MTc2MjU3OTc1NV82MzU1MjlkNDBiNjllM2FmODRiZC5wZGY=` = "1762579755_635529d40b69e3af881bd.pdf" — ECI Press Note 348/2025 (SIR Phase-II in 12 States/UTs incl. Lakshadweep, 04.11.2025).
- `.../download_pdf_draft_roll_2024/MTc2Mjc2NzkxM181NjVhYzZjOTIyNTc0YjRhNTUwZC5wZGY=` = "1762767911_565ac6c922574b4a550d.pdf" — CEO Lakshadweep ADVERTISEMENT (SIR schedule, F.No.16/10/2025-ELE/SIR dated 03.11.2025).
- `.../download_pdf_press_notes/UHJlc3MgTm90ZS0gUHVibGljYXRpb24gb2YgRHJhZnQgRWxlY3RvcmFsIFJvbGwgKDEpLnBkZg==` = "Press Note- Publication of Draft Electoral Roll (1).pdf" — CEO press note dated 16.12.2025 (draft roll publication; contains the **island-wise ASD summary table**: 64 booths, 57,813 pre-draft electors; 705 dead, 210 already enrolled, 472 permanently shifted, 41 untraceable/absent/refused-to-sign; 1,429 total excluded from draft; 56,384 in draft roll). Aggregate counts only — no names/EPICs.
- `.../download_pdf_press_notes/UHJlc3MgUmVsZWFzZSBvZiB0aGUgQ2hpZWYgRWxlY3RvcmFsIE9mZmljZXIsIExha3NoYWR3ZWVwIGRhdGVkIDEyLjEyLjIwMjUucGRm` = "Press Release of the Chief Electoral Officer, Lakshadweep dated 12.12.2025.pdf" (draft roll to be published 16.12.2025; part-wise ASD list shared with BLAs).
- `.../download_pdf_press_notes/UHJlc3MgUmVsZWFzZSBvZiB0aGUgRGlzdHJpY3QgRWxlY3Rpb24gT2ZmaWNlciBMYWtzaGFkd2VlcCBkYXRlZCAxMi4xMi4yMDI1LnBkZg==` = "Press Release of the District Election Officer Lakshadweep dated 12.12.2025.pdf" (same ASD summary).
- `.../download_pdf_press_notes/UHJlc3MgTm90ZS0gRmluYWwgTGlzdCBvZiBQb2xsaW5nIFN0YXRpb25zLnBkZg==` = "Press Note- Final List of Polling Stations.pdf" (search-index only, content not verified).
- `.../download_pdf_draft_roll_2024/MTc2Mjc2ODA0M19mMzM0NDlkNzE3ZWVkNDE4YTQ5ZC5wZGY=`, `.../MTc1OTkwNjQ2Nl9hNzVmN2QxZjZiZTE3NTE4NDlkMC5wZGY=`, `.../T25seSA2Ljg1IF8gRWxlY3RvcnMgcmVtYWluaW5nIHRvIGZpbGwgdGhlIGZvcm07IDkgbW9yZSBkYXlzIHRvIGdvLnBkZg==` ("Only 6.85 _ Electors remaining to fill the form; 9 more days to go.pdf"), `.../T2F1OExSeU9OcC5wZGY=` ("OaO8LRyONp.pdf"), `.../WkZZcFQxdkE0RS5wZGY=` ("ZZYpT1vA4E.pdf"), `.../Q2xlYW5pbmcgdXAgb2YgdGhlIEVsZWN0b3JhbCBTeXN0ZW0gQ29udGludWVzLnBkZg==` ("Cleaning up of the Electoral System Continues.pdf") — search-index only, content not fetched; titles indicate press-note type.
- `.../download_pdf_ssr2023_form11a/Zm9ybTExYS1VMDYwMS0xLTIwMjMtMTEtMjQtcmVwb3J0LnBkZg==` = "form11a-U0601-1-2023-11-24-report.pdf" and `.../download_pdf_ssr2023_form11a/Zm9ybTExYS1VMDYwMS0xLTIwMjMtMTItMDctcmVwb3J0LnBkZg==` = "form11a-U0601-1-2023-12-07-report.pdf" — SSR 2023 **Form 11A reports** (claims & objections disposal lists). Search snippets show these contain **elector names** → excluded on privacy grounds as well as out-of-scope (not roll PDFs; not SIR 2026).
- `.../download_pdf_ssr2023_form9/VTA2QTFfZm9ybTlfMDgtMTItMjAyMi5wZGY=` = "U02A1_form9_08-12-2022.pdf" — SSR 2023 **Form 9** list (elector names in snippets) → excluded, same reasons.

## API endpoints
None found. No JSON/query-string download endpoints observed on the CEO site. The roll download buttons' mechanism (whether direct link, JS fetch, or POST) could not be determined from text-only fetch — **requires a live-browser session by the parent**.

## ACCESS NOTES / gates
1. **Roll file URLs behind /electoral-rolls Download buttons: NOT observable without live-browser interaction.** The buttons render as text labels only; no hrefs in fetched text, no file URLs in the search index. Marked Scriptable=N (unverifiable). NO bypass was attempted — the blocker is informational (JS/button-driven links), not a CAPTCHA.
2. **No CAPTCHA, login, OTP, or paywall was observed** anywhere on the CEO site's public pages or file URLs during this inventory.
3. **SIR draft roll + part-wise ASD (deletion) name lists:** per the CEO/DEO press releases of 12.12.2025, the draft roll was published on 16.12.2025 at `ceolakshadweep.gov.in` and on ECINET, and the part-wise ASD list was shared with Booth Level Agents — but **no public per-booth/per-part file URLs were observable via search or text fetch**; not inventoried. The ECI voter-portal path (voters.eci.gov.in/download-eroll) is the known CAPTCHA-gated fallback → Scriptable=N; not attempted.
4. `ceolakshadweep.nic.in` (the hint domain) did not resolve/fetch from this environment; the live official site is `ceolakshadweep.gov.in`.
5. browser_open became unavailable partway through (tool failure, terminal for the session); remaining evidence came from browser_search results only. No additional candidate URLs were left unfetched that appeared likely to be rolls.
6. Related service: CEO site has a roll-name search page `http://ceolakshadweep.gov.in/rollsearch.html` (per third-party directory site; URL not independently verified — not used as a row).
