# Andhra Pradesh CEO-site roll inventory — notes

**Worker:** SIR-WATCH inventory subagent | **Date:** 2026-09-24 | **State:** Andhra Pradesh
**Row count:** 16 rows in `sir-inventory-andhra-pradesh.jsonl` (14 roll PDFs + 1 aggregate-statistics file + 1 gated-portal row)
**Domains used:** `https://ceoandhra.nic.in/` (hint URL resolved and worked), `https://voters.eci.gov.in/`
**Rows with Scriptable=Y (direct, ungated PDFs):** 15 | **Scriptable=N (gated):** 1

## Click path (observed)

1. CEO site root `https://ceoandhra.nic.in/` → renders near-empty in text fetch (JS-heavy homepage; only "Welcome to CEO Andhra Pradesh" visible).
2. `https://ceoandhra.nic.in/ceoap_new/ceo/index.html` → fetched text shows the news/press-note feed (dominated Sept 2025–Aug 2026 by SIR-2026 BLO/EPIC tender notices and AERO/ERO appointment gazettes). The nav menu ("Electoral Rolls" / "PDF Electoral roll") is rendered in JS and did not expose links in fetched text.
3. Per third-party guides (yogiyojana.co.in, cleartax.in, 99hrms.com, all indexed on 2023–2024 vintages): homepage → hover "Electoral Rolls" → click "Final SSR Eroll-2024" → opens `https://voters.eci.gov.in/download-eroll?stateCode=S01`; on the ECI portal select District → Assembly Constituency → Language, solve the CAPTCHA, then download each part PDF via its arrow icon.
4. A separate CEO-hosted path (per 99hrms.com guide, ~2023 layout): homepage → "PDF Electoral roll" → "Assembly Constituency" → choose "Draft SSR E-roll 2023" / "Final SSR E-roll 2022" → select District + Assembly Constituency → "Get Polling Stations" → choose Telugu/English → enter the on-screen verification code (CAPTCHA) → PDF download.

**Net:** no direct CEO-hosted PDF URL for any current (SSR 2022/2023/2024/2025 or SIR 2026) roll is directly observable; every current-vintage path ends in a CAPTCHA (Scriptable=N).

## Directly observed direct-PDF tree (scriptable=Y)

URL naming pattern (observed across all 14 roll PDFs — verified, not extrapolated):
`https://ceoandhra.nic.in/ERolls/PDF/English/A{AC 3-digit}/A{AC 3-digit}{part 4-digit}.PDF`

All 14 are the **Special Summary Revision 2007** rolls (qualifying date 01/01/2007; final publication 01/03/2007–25/05/2007 per roll covers; pre-2008 delimitation AC numbering). PDFs are text-searchable (search engines extract full roll text). Covered: ACs 001, 002, 003, 004, 007, 008, 009, 010, 011 (only 9 of the old 294 ACs; Srikakulam and Vizianagaram districts only). A parallel `/ERolls/PDF/Telugu/` branch presumably exists but no direct URL from it was observed — not recorded.
A004/A0040063 is the **Supplement No.1 (SSR 2007)**, not a main roll.

## Other directly observed file (scriptable=Y)

- `https://ceoandhra.nic.in/ceoap_new/ceo/SSR_2024/Final-SSR-2025 Electors.pdf` — Draft Electors (29.10.2024) press note + Final SSR 2025 district×AC elector counts (recorded as one aggregate-statistics row; not a per-part roll). Observed in search results.

## Gates / access notes

1. **ECI download-eroll portal** (`https://voters.eci.gov.in/download-eroll?stateCode=S01`) — the CEO site's "Final SSR Eroll-2024" link resolves here. CAPTCHA required after District/AC/Language selection; per-part PDFs only via in-page download arrows. Scriptable=N. Not bypassed.
2. **CEO-hosted "PDF Electoral roll" section** — dropdowns (District → AC → language) + on-screen verification code (CAPTCHA) before any PDF opens (per third-party guides; JS menu not visible in my text fetch, so flagged, not directly verified).
3. **SIR 2026 in Andhra Pradesh:** the CEO homepage news feed shows active SIR-2026 preparation (enumeration-form printing RFPs, BLO kits, AERO appointments). AP is in SIR Phase III (not Phase I/II), so no SIR draft roll has been published yet; **no SIR draft roll, deletion list, or ASDD list was found on the CEO site**.
4. `browser_open` of `https://ceoandhra.nic.in/ERolls/` failed (tool error); directory listing unavailable.

## API-like endpoints

None observed. No JSON/query-string download endpoints found on the CEO site.

## Method

- `browser_open` on `https://ceoandhra.nic.in/` (near-empty text) and `https://ceoandhra.nic.in/ceoap_new/ceo/index.html` (press-note feed only).
- Five `browser_search` queries; roll PDFs taken ONLY from search-result URLs with full verbatim URLs in the results' "Full URLs" mapping (14/14 from `ceoandhra.nic.in/ERolls/PDF/English/...`).
- AC names/districts taken only from roll-cover snippets shown in search results; where the snippet named only "Assembly Constituency No: NNN", ac_name/district are null (not guessed).
- No names, no EPIC numbers recorded. No URL was invented or pattern-extrapolated; rows 1–14 are all individually observed links.

## Coverage summary

- Districts observed: Srikakulam, Vizianagaram (rolls); 2 others null.
- ACs observed: 9 (001, 002, 003, 004, 007, 008, 009, 010, 011); AC names confirmed for 5 (007 Kothuru (ST), 002 Sompeta, 009 Parvathipuram, 010 Saluru (ST), 011 Bobbili).
- Parts observed: 14 (86, 10, 60, 19, 73, 21, 79, 121, 10, 133, 129, 141, 63-supplement, 29).
- Gates: 2 (ECI portal CAPTCHA; CEO verification code on own download path).
- Zero fabrication: every row traces to an observed URL; the aggregate-stats row and ECI-portal gate row are labeled as such.
