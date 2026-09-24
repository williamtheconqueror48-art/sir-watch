# West Bengal CEO inventory notes (2026-09-24)

## Click path
1. `browser_open` → https://ceowestbengal.wb.gov.in/ — the first fetch failed (browser-service error); the site root itself rendered nothing here.
2. `browser_open` → https://ceowestbengal.wb.gov.in/roll_dist — fetched successfully. Page title: **"ELECTORAL ROLL 2002 (Voter List)"** — the CEO's pre-SIR (2002 SIR base roll) archive.
3. That page lists 24 districts as links (Coochbehar, Jalpaiguri, Darjeeling, Uttar Dinajpur, Dakshin Dinajpur, Malda, Murshidabad, Nadia, North 24 Parganas, South 24 Parganas, Kolkata NW, Kolkata NE, Kolkata SOUTH, Howrah, Hooghly, Purba Medinipur, Paschim Medinipur, Purulia, Bankura, Burdwan, Birbhum). The fetched text carried no link hrefs/outlink indices, so no district-level or part-PDF URLs could be extracted. (Likely JS-driven navigation.)
4. Public web search then enumerated directly observable `/Downloads/SIR2026/` files and confirmed the 2002-archive gate behaviour via third-party walkthroughs.

## Directly observed file rows (1)
- `https://ceowestbengal.wb.gov.in/Downloads/SIR2026/AC wise Draft Elector SIR 2026.pdf` — "AC wise Draft Elector as on 16.12.2025" (renders an .xlsx table as PDF): "AC wise Status of Polling Stations and Electors in Draft Electoral Roll w.r.t 01.01.2026 (SIR)". AC × polling-station × male/female/third-gender/total elector counts for all 294 ACs (e.g. 94-Bagda / North 24 Parganas: 300 PS, 263142 electors). Aggregate statistics only — no names/EPICs. Recorded as roll_type=Supplement. Direct GET, no gate seen in the indexed path → scriptable=Y.
- Note: the file has literal spaces in its filename (`AC wise Draft Elector SIR 2026.pdf`); servers typically accept this unencoded or percent-encoded.

## SIR-adjacent files on the CEO domain (documented, NOT rows — not roll/deletion lists)
- https://ceowestbengal.wb.gov.in/Downloads/SIR2026/SIR_PressNote/CEO PN 37 __16.12.2025.pdf — Press Note 36/37, draft roll publication (16.12.2025), states the draft roll is "made available on the CEO's website".
- https://ceowestbengal.wb.gov.in/Downloads/SIR2026/SIR_PressNote/CEO PN 10_ 22.05.2025.pdf — Press Note 10 (22.05.2025).
- `wbceo.wb.gov.in` (same CEO office's alternate domain) hosts SIR2026 press notes/bulletins:
  - `https://wbceo.wb.gov.in/Downloads/SIR2026/SIR_PressNote/CEO PN 26_04.11.2025.pdf`
  - `https://wbceo.wb.gov.in/Downloads/SIR2026/SIR_PressNote/CEO PN 27_06.11.2025.pdf`
  - `https://wbceo.wb.gov.in/Downloads/SIR2026/SIR_PressNote/CEO PN 35_11.12.2025.pdf`
  - `https://wbceo.wb.gov.in/Downloads/SIR2026/SIR_PRESSBULLETIN/Press Bulletin 17.12.2025.pdf` — SIR daily bulletin, claims & objections 17.12.2025
  - `https://wbceo.wb.gov.in/Downloads/SIR2026/SIR_PRESSBULLETIN/Press Bulletin 19.12.2025.pdf`
  (URL forms shown verbatim by the search index use backslashes `\Downloads\...`; normalised form shown here. All press notes/bulletins, not roll data.)

## URL patterns
- `/Downloads/SIR2026/<subfolder>/<descriptive filename>.pdf` — flat file downloads, no query strings, directly GET-able when indexed.
- `/roll_dist` — 2002 roll archive landing (district index). District → AC → part navigation confirmed by third-party guides (mywestbengal.com, jobwinner.in, voterslist.in).

## Vintages observed
- Electoral Roll 2002 (SIR base, AC-wise part PDFs) — CAPTCHA-gated per PDF.
- SIR Draft Electoral Roll w.r.t. 01.01.2026, published 16.12.2025 — booth-wise copies said to be on CEO website (Press Note 36/37), but no direct part-PDF URL observed; assumed same gated roll browser.
- AC-wise draft elector summary (16.12.2025) — the one directly observable file.

## API endpoints
- None observed. No JSON/download query endpoints found; the roll browser has no publicly indexed API surface.

## ACCESS NOTES (blockers — none bypassed, none attempted)
- **CAPTCHA per PDF** on the `/roll_dist` 2002 archive: multiple independent third-party sources (voterslist.in, published download guides) confirm a CAPTCHA challenge on every part-PDF download. This worker cannot click forms, solve CAPTCHAs, or submit anything → every one of the ~80,000 estimated part PDFs is scriptable=N; no individual part-PDF URL was directly observed, so no rows.
- Third-party mirror links (voterslist.in "Direct Part Wise PDF Download" pages, e.g. Chinsurah 186/230 parts, Dum Dum 138/295 parts, Nandigram 206/203 parts) were deliberately NOT catalogued — third-party provenance, unverified, and outside the CEO domain per the zero-fabrication rule. They are mentioned here only as a pointer for a future live-browser pass.
- `/roll_dist` district links expose no hrefs in fetched text (JS navigation) → district/AC/part rows impossible from this toolset.
- No ASDD/deletion lists published on the CEO website were found. Booth-level deceased/shifted/migrated lists were shared only with party BLAs per CEO Press Note 36.
- Bengali labels: the site is bilingual (Bengali/English) per guides; fetched pages surfaced English labels only.

## Method
browser_open of CEO pages (one root fetch failed, one roll_dist fetch succeeded) + public web search for indexed CEO-domain file URLs. Only verbatim URLs from tool output were catalogued. No elector names or EPIC numbers were encountered or recorded.

## Row count
1 inventory row (AC-wise SIR draft-roll elector summary, all 294 ACs). 24 districts / 294 ACs / ~80,000 parts noted as known-but-gated (not rows). Gates: 1 (CAPTCHA per part-PDF on the 2002 archive; draft-roll part PDFs unobserved but presumed gated the same way).
