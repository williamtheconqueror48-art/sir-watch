# SIR-WATCH inventory notes — Dadra and Nagar Haveli and Daman and Diu

**Rows:** 15 (12 × 2002 Final Roll part PDFs, 1 × 2015 Final Photo Electoral Roll index/summary, 2 × claims/objections supplements)
**Districts touched:** Daman (5 parts), Diu (7 parts), Dadra and Nagar Haveli (claims list), plus PC-wide index
**PCs:** 1-Daman & Diu (old, pre-merger rolls: 2002, 2015, 2018) and 1-Dadra and Nagar Haveli (2022 claims list)

## CEO site verification
- Official CEO site confirmed as **https://ceodaman.nic.in/** (page title: "CEO DAMAN | UT Administration of Dadra & Nagar Haveli and Daman & Diu"; the site describes itself as the Chief Electoral Officer's department website; CEO press notes repeatedly reference `www.ceodaman.nic.in` as the department website).
- The suggested candidate `ceodnh.nic.in` was NOT found to exist or be used anywhere; it is not the CEO site. `ddd.gov.in` is the UT administration portal; its Election Department service page (`https://ddd.gov.in/service/election-department/`) links voter services out to ceodaman.nic.in and carries no direct roll PDFs.

## Click path (fetch-only, no live browser)
1. `browser_open` on https://ceodaman.nic.in/ → homepage renders with almost no link text (JS-driven menu); no per-part roll links recoverable from fetched text.
2. Web searches (`"ceodaman.nic.in" electoral roll / IRER2002 / "Final PER" / E-Roll`) surfaced verbatim, directly-observable PDF URLs, which were recorded as rows. The 2015 IndexPage.pdf was fetched and fully read (18 pages, 135 parts) to confirm vintage, publication date, and part structure.
3. Every row URL is verbatim from search results or fetched page text. No URLs were constructed or guessed — e.g. other `IRER2002/DMN/E<n>.pdf` numbers were NOT recorded.

## Organization / URL patterns
- The UT has **no Legislative Assembly constituencies**; rolls are maintained per **Parliamentary Constituency**: currently **1-Dadra and Nagar Haveli** and **2-Daman and Diu** (per CEO SSR press notes). Older rolls predate the 2019 UT merger and use **PC 1-Daman & Diu (state/UT code U04)**.
- District ≈ PC mapping (post-merger): PC 1 = Dadra and Nagar Haveli district; PC 2 = Daman + Diu districts.
- 2002 roll pattern: `https://ceodaman.nic.in/IRER2002/DMN/E<part>.pdf` — NOTE: even Diu-district parts live under the `DMN/` folder (verified for parts 66, 68, 70, 71, 79, 81, 82 whose PDF text says District: Diu). Parts 1–52 observed sample are Daman-district; parts 66–82 are Diu-district. Do not assume contiguous numbering — only observed numbers were recorded.
- 2015 roll pattern: `https://ceodaman.nic.in/Final PER/Final  PHOTO ELECTORAL ROLL- 2015/IndexPage.pdf` (verbatim double space in path). Only the index/summary page is indexed/observed; individual 2015 part PDFs were not observed.
- Claims/objections pattern: `https://ceodaman.nic.in/Form%209,10,11%20and%2011A%20For%20Displaying%20list%20of%20claims%20and%20objections/pdf/English/Form%209%20DNH.PDF`; older list at `https://ceodaman.nic.in/2018/24092018-form11A.pdf`.

## Vintages observed
- **2002 Final Electoral Roll** (U04 Daman & Diu, PC 1): "Special Revision of Intensive Nature", qualifying date 01.01.2002, final publication **31.01.2002** (per PDF text). 12 part files observed.
- **2015 Final Photo Electoral Roll** (U04 Daman And Diu, AC field shows "1, DAMAN AND DIU (GEN)"): Special Summary Revision, qualifying date 01.01.2015, publication **05.01.2015**, 135 parts, 112,577 net electors (parts 1–~65 Daman district, 66–82+ Diu district per area descriptions). Only index page observed.
- **SSR-23 claims (Form 9, DNH)**: claims received 09–17 Nov 2022, Dadra and Nagar Haveli district (Silvassa addresses).
- **2018 Form 11A list**: transposition applications (Diu).

## API-like endpoints
- None observed. No JSON/query-string download endpoints found for this UT. All files are static PDFs under predictable-ish folder paths. ECI central services (`electoralsearch.eci.gov.in`, voters.eci.gov.in) are CAPTCHA-gated and were not touched.

## ACCESS NOTES (blockers, gates)
- **Direct PDF links: no gate.** All 15 recorded files are plain-GET static PDFs on ceodaman.nic.in (search-engine crawled; one fetched directly). Scriptable=Y.
- **Current (2023–2026) draft/final roll per-part PDFs: not observable.** CEO press notes (SSR-24 dated Oct 2023, SSR-25 dated 05/10/2024) state "Updated PC wise draft electoral roll will be available on the website of the department" (draft publication 27.10.2023 / 29.10.2024; final 05.01.2024 / 06.01.2025), but no per-part URLs for these vintages are indexed by web search and the site's E-Roll download page is JS-driven, not recoverable with fetch-only access. Requires a live-browser visit (delegable to parent). Scriptable status for current rolls: **unknown** — not attempted.
- **Quirk:** press-note URLs surfaced verbatim with Windows backslashes — `https://ceodaman.nic.in/Document-2023\PRESS NOTE SSR-24.pdf` and `https://ceodaman.nic.in/Document-2024\PN25.pdf`. These are SSR schedule press notes (not rolls), recorded here for the record.
- Voter search / E-EPIC download / registration services route through CAPTCHA-gated ECI portals — out of scope, never attempted.

## Method
`browser_search` (6 queries) + `browser_open` (4 fetches, including full read of the 2015 IndexPage.pdf). No live browser, no clicks, no CAPTCHAs. All rows trace to verbatim URLs from search results or fetched text; district/AC attribution for Daman parts is inferred from part area descriptions (Daman localities) + the DMN folder; Diu parts are explicit ("District: Diu") in the PDFs.

## Row count
- JSONL rows: **15** (12 roll parts + 1 roll index + 2 claims/objections supplements)
- Parts: 12 (parts 7, 38, 40, 48, 52 Daman; 66, 68, 70, 71, 79, 81, 82 Diu)
- Deletion/ASDD lists observed: **0**
- Gates encountered on recorded files: **0** (all plain-GET PDFs)
- Non-roll CEO files seen but excluded from inventory: ketanpatel-1.PDF (2014 nomination paper), Election-2024/F1DNH.pdf (LS-24 DNH election notice), panchayat-election-2015 orders, SSR press notes
