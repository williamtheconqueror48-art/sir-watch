# SIR-WATCH Inventory Notes — Madhya Pradesh

**Worker run:** 2026-09-24 (IST). **Method:** public web search (browser_search) only; page-text fetch (browser_open) was unavailable this session — every attempt on the CEO page failed at the service layer, so NO page was "visited". Every URL below appeared verbatim in a search result returned by the search tool (search-indexed PDFs on the CEO domain, full snippets read). No links were invented or guessed.

## Click path (attempted)

1. Prior survey hint: `https://ceomadhyapradesh.nic.in/VL.aspx` (roll search page, "district → AC → part").
2. browser_open on that URL failed (`browser-service could not fetch the requested page`); this failure is terminal for this session, so no fetched-text reads were possible.
3. Pivoted to public search. Key discovery: CEO MP now operates on a NEW domain — **ceoelection.mp.gov.in** — where its roll/PDF content is indexed. All roll links observed live there.
4. Search queries like `site:ceoelection.mp.gov.in pdf electoral roll`, `"ceoelection.mp.gov.in/PDF_Service_Voter"`, and AC/city-targeted variants surfaced the indexed PDFs below.

## URL naming patterns observed

- **Service-voter roll PDFs (AC-wise, one file per AC):**
  `https://ceoelection.mp.gov.in/PDF_Service_Voter/A<n>.pdf`
  where `<n>` is the Assembly Constituency number (e.g. `A7.pdf`, `A131.pdf`, `A230.pdf`). One PDF covers the whole AC — no part-level split for this file set. The pattern is visible and predictable, but ONLY the 39 ACs actually returned in search results are catalogued; the remaining ~191 ACs were NOT observed and are not included.
- **Draft Roll 2026 parts summary:** `https://ceoelection.mp.gov.in/Links/DraftRollTotalParts2026.pdf` — AC-wise total-parts table. Content snippet shows rows like `211 46-INDORE SANWER (SC) 315 66 0 381` and a grand total of **71,930 parts** (`Total Parts 65014 6934 18 71930`). This is the planning universe for the part-wise main roll (not the part PDFs themselves).
- **SIR daily bulletins:** `https://ceoelection.mp.gov.in/SIR2003/Daily Bulletin-<DD.MM.YYYY>.pdf` (note the space in the filename). 8 observed: 29.12.2025, 02.01.2026, 05.01.2026, 06.01.2026, 11.01.2026, 17.01.2026, 19.01.2026, 20.01.2026. Header: `No. SIR-26/09/SVEEP/2025 — SPECIAL INTENSIVE REVISION (SIR): DAILY BULLETIN — CLAIMS AND OBJECTIONS PERIOD 23.12.2025 to 22.01.2026`. They report claims/objections w.r.t. a "Draft Electoral Roll with 5,31,31,983 Electors".

## Vintages

- Service-voter roll cover pages: `ELECTORAL ROLL - 2026, STATE - (S12) MADHYA PRADESH`, qualifying date 01-01-2026, **date of publication 21-02-2026**. Revision type on the cover is NOT uniform: most sampled covers say "Type of Revision: Special Summary Revision"; at least one (AC 15-GWALIOR) says "Type of Revision: Special Intensive Revision".
- Each service-voter PDF integrates the mother roll plus Supplement 1 "List of additions, Deletions and Corrections" (Component List I/II/III); the "Last Part" field is marked "Service Electors" — i.e. these files are the service-elector (armed forces) portion only, not the main part-wise roll.
- SIR draft roll (5.31 crore electors) existed for the 23.12.2025–22.01.2026 claims window, but **no draft-roll part PDFs were directly observed** — only the bulletins and the parts-summary above. The actual draft-roll download path was not observed (no direct link seen), so its gate status is unknown.

## API endpoints

None observed. No JSON or query-string download endpoints surfaced in any search result for CEO MP. The only machine-friendly surface is the predictable `/PDF_Service_Voter/A<n>.pdf` path pattern, plus the `/Links/DraftRollTotalParts2026.pdf` parts table.

## ACCESS NOTES (gates/blockers)

1. `ceomadhyapradesh.nic.in/VL.aspx` (old hint): **gate status still UNVERIFIED** — the page could not be fetched this session (browser_open unavailable), so its dropdown/CAPTCHA structure is not documented from own observation. The prior survey said "VL.aspx → district/AC/part" without a walkthrough. Do NOT treat as gated or open.
2. The 39 `PDF_Service_Voter` PDFs and the bulletins/parts-summary were indexed by the search engine with full text snippets, which implies they are plain-HTTP-GET retrievable with no CAPTCHA/login/OTP in the path — marked `scriptable=Y`. Caveat: a live plain-GET was NOT performed by this worker this session (no browser/fetch capability), so this is "observed un-gated in search index", not "curl-verified 200". Treat the first downstream GET as a confirmation step.
3. **Main part-wise roll PDFs (the ~71,930 parts)** were NOT directly observed — no links, no gate determination. Any scraping of VL.aspx or the new ceoelection.mp.gov.in roll pages needs a live browser session to determine the real flow; if it turns out to be CAPTCHA-gated, that path is closed by standing rule.
4. Format: all observed PDFs are text-searchable (indexed text). No scanned-image rolls observed. No elector names or EPIC numbers are recorded in this inventory — URLs + metadata only.

## Method & row count

- Search-only observation, 8 distinct query batches, all results read verbatim.
- Rows written: **48** in `sir-inventory-madhya-pradesh.jsonl` (keys exactly: state, district, ac_number, ac_name, part_number, roll_type, file_url, format, scriptable, last_updated).
  - 39 rows: Final Roll 2026 – Service Voter, one per AC (ACs 7, 11, 13, 15, 16, 19, 23, 24, 40, 41, 45, 63, 69, 71, 72, 74, 83, 104, 107, 111, 114, 118, 126, 130, 131, 132, 133, 137, 151, 153, 154, 155, 157, 159, 171, 172, 177, 179, 230), across 24 districts.
  - 1 row: Draft Roll 2026 total-parts summary (state-level supplement).
  - 8 rows: SIR daily bulletins 2025-12-29 → 2026-01-20 (state-level supplements).
- Coverage honesty: MP has 230 ACs; only 39 AC URLs were directly observed (~17%). The other ~191 ACs almost certainly exist at `/PDF_Service_Voter/A<n>.pdf` but were not observed, so they are NOT in the inventory.
