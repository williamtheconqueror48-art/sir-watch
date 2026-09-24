# SIR-WATCH Inventory Notes — Karnataka (CEO: ceo.karnataka.gov.in)

**Date:** 2026-09-24
**Row count:** 9 file rows (0 main-roll part PDFs; 9 service-elector AC PDFs)
**Districts covered in rows:** 1 observed (Belgaum, for ACs 4/6/7); 6 ACs have district=null (not stated in observed source excerpt)
**ACs covered:** 9 (4-KAGWAD, 6-RAYBAG, 7-HUKKERI, 32-INDI, 60-KUSHTAGI, 65-SHIRAHATTI, 86-HIREKERUR, 144-SRINIVASPUR, 191-NAGAMANGALA)
**Parts covered:** 0 — no per-part main-roll PDFs were directly observable on the CEO site.

## Method
- Fetched the CEO homepage (https://ceo.karnataka.gov.in/) via browser_open — loads, Kannada-language, forms section visible.
- A direct fetch of https://ceo.karnataka.gov.in/voter_list/kn (the "Voter List – 2002" listing page, link observed verbatim on the official Davanagere district site davanagere.nic.in/en/election/) failed with a browser-service tool error; not retried.
- Ran 6 public web searches (browser_search) targeting CEO-domain roll PDFs, the `/Elections_rolls_2023/` path, SIR draft roll 2026, the 2002 voter list, and gate documentation. No forms submitted, no CAPTCHAs touched, no downloads beyond index text.
- All 9 inventory rows are PDFs on `ceo.karnataka.gov.in/uploads/` whose full text the search index crawled — each row's title/AC metadata is quoted verbatim from indexed content (e.g. "Draft Electoral Roll, 2025 of Assembly Constituency 60-KUSHTAGI (GEN), (S10) KARNATAKA"). No URLs invented or guessed.
- The in-depth technical documentation came from the (now archived) third-party project `gouthamganeshm/karnataka_draft_roll_2026` README, read in full via browser_open (818 lines) — used only for gate/endpoint documentation, NOT for inventory rows.

## Click path (as observed / documented)
1. CEO homepage (https://ceo.karnataka.gov.in/) → site menu item **"Electoral Roll 2025/2026"** → **redirects off-site** to the ECI portal `https://voters.eci.gov.in/download-eroll?stateCode=S10` (documented from direct observation in the archived third-party project's README; the homepage itself was confirmed loading but its full menu structure was not text-visible in this environment).
2. The direct `/uploads/<numeric-id>.pdf` roll files are served by the CEO site's own media library with no gate seen by the search crawler (plain GET, HTTP 200, full text indexed). How they are linked from current site navigation was not observed in fetched text — they are presumed-linked from an older E-Roll section.
3. 2002 voter list: official guide describes homepage link "Electoral Roll-2002" → "View/Download 2002 Electoral Roll" → select District / A/C Name / Part No and Name → View/Download PDF. **My own fetch of the listing page (voter_list/kn) failed, so no 2002 per-part file URL was directly observed; gate status on that path is UNVERIFIED — do not treat as ungated.**

## URL naming patterns observed
- CEO media library: `https://ceo.karnataka.gov.in/uploads/<numeric-id>.pdf` (numeric IDs, no semantic content; e.g. `24041729852528.pdf`). One file per AC for service-elector rolls.
- CEO press notes (context only, not rolls): `https://ceo.karnataka.gov.in/uploads/media_to_upload<timestamp>.pdf` and named variants (`Press_Note_07.07.2026_06PM.pdf`, `Press Note - 23.07.2026.pdf`).
- 2002 roll mirror (third-party documented, NO concrete file URL directly observed by me): `/uploads/<DISTRICT>/AC%20<n>/A<ac4><part4>.pdf` with a part-cascade CSV `ac_names.csv` (~43,398 parts). The third-party author probed it and reports it does NOT carry the 2026 SIR draft and is stale/missing booths (e.g. AC 196 part 227 absent). No rows created.
- The `/Elections_rolls_2023/` path mentioned in prior notes did NOT surface in any search result; 2023 press notes say rolls were published "in PDF formats" on the CEO site but no 2023 roll file URLs were observed.

## Vintages found on CEO domain
- **Draft Electoral Roll 2025 — service electors** (Defence Service / Armed Police Force / Foreign Service sections): 7 AC PDFs observed (ACs 4, 6, 7, 60, 65, 86, 191).
- **Final Electoral Roll 2025 — service electors**: 2 AC PDFs observed (ACs 32, 144). Note: the 2025 "final" includes a Supplement-1 additions/deletions structure in the extracted content.
- **SIR Draft Roll 2026**: NOT observed on the CEO domain. CEO press note No. DPAR 172 ChuMaPa 2026 dated 29.06.2026 scheduled draft publication 05/08/2026 and final 07/10/2026; a third-party archive reports actual draft publication 24-08-2026 (224/224 ACs, 60,923 parts) served from ECI's CDN, not the CEO site. Claims/objections closed 23-09-2026; final due 27-10-2026 (dates from third-party README, unverified by me).
- **ASD (deletion/uncollectable-elector) lists and discrepancy notices**: not hosted on the CEO domain as direct files. ASD PDFs live on ECI's CDN (pattern below); notices are behind a CEO source page (below) backed by 34 district Google Drive folders (third-party documented).

## API-like endpoints / direct off-CEO paths (all third-party-reported, NOT verified by me; NOT CEO inventory rows)
- `GET https://gateway-voters.eci.gov.in/api/v1/common/districts/S10` → 34 districts, English + Kannada names. Reportedly 401 without `origin`/`referer` headers.
- `GET https://gateway-voters.eci.gov.in/api/v1/common/acs/<districtCd>` → that district's ACs (number, name, Kannada name, category). Same header requirement reported.
- ECI CDN SIR draft roll (reported no-CAPTCHA, plain GET, verified by third party from India residential IP; `Revision0`/`Revision2` 404, only `Revision1` published as of 2026-08-25):
  `https://voters.eci.gov.in/eroll/2026/s10/sir-draftroll/<ac>/2026-EROLLGEN-S10-<ac>-SIR-DraftRoll-Revision1-KAN-<part>-WI.pdf`
- ECI CDN ASD report (reported no-CAPTCHA, plain GET, carries a real text layer):
  `https://voters.eci.gov.in/eroll/asd/2026/s10/<ac>/uncollectable_elector_report_ac<ac>_part<part>_KAN.pdf`
- CEO notices source page (third-party-reported): `https://ceo.karnataka.gov.in/notices_issued.html` → 34 district public Google Drive folders of "No Mapping and Discrepancy" PDFs (mixed .pdf/.zip/.xlsx naming; Google Drive anonymous-download quota ~10,000 downloads/IP reported by third party).
- Format caveat (third-party measured): every 2026 ECI roll PDF is a stack of full-page JPEGs — `PyMuPDF.get_text()` returns 0 chars; OCR required. The CEO-hosted 2025 service-elector PDFs and ECI ASD/notices PDFs DO carry a text layer.

## ACCESS NOTES — gates and blockers
1. **GATED: CAPTCHA (per PDF) — main-roll download via ECI portal.** The CEO's own "Electoral Roll 2025/2026" menu item redirects to `voters.eci.gov.in/download-eroll?stateCode=S10`; every PDF download there is reached only after solving an image CAPTCHA (`POST /api/v1/printing-publish/generate-published-pdfs`), with request parameters encrypted (`accept_yek`/`accept_rotcev` headers). Documented from the archived third-party project's direct read of the ECI portal's JS bundle. **Scriptable=N; never attempt to bypass.** This is why the CEO site yields no per-part main-roll PDFs in this inventory.
2. **2002 voter-list listing page (voter_list/kn): UNVERIFIED.** A published guide describes district→AC→part selection with no CAPTCHA mentioned, but my fetch failed (tool error) and I could not observe any 2002 per-part file URL myself. Not marked scriptable.
3. **Direct CEO /uploads/ PDFs: no gate observed** (search crawler fetched full text via plain GET). Marked Scriptable=Y. Link discovery from the live site navigation was not possible in this environment (no live browser), so completeness cannot be asserted — rows are only what the search index surfaced.
4. **No logins/OTPs/paywalls encountered** on any path examined.

## Gaps / caveats
- Zero rows for the full general (main) rolls, the SIR 2026 draft roll, ASD lists, or discrepancy notices — none of these have directly-observable file URLs on the CEO domain in this pass; they live on the CAPTCHA-gated ECI portal, ECI's CDN, or Google Drive respectively (see endpoints above).
- District values are null for 6 of 9 rows: the observed PDF excerpts state AC number/name but not district. (Belgaum for ACs 4/6/7 grounded in the CEO-hosted 2014 PC-wise voter-statistics document.)
- `last_updated` is computed from the search index's "Last Updated: 267 days ago" (~2025-12-31) — unverified against the files themselves.
- Form 20 result sheets, BLO-detail xlsx files, and district-wise service-voter summary stats were observed on the CEO domain but are not electoral rolls; excluded from rows.
- No elector names or EPIC numbers were recorded (file URLs + metadata only, per privacy rule).

## Exact counts for parent report
- **9 inventory rows**, all Scriptable=Y, all on ceo.karnataka.gov.in.
- **9 ACs, 1 district observed (Belgaum), 0 parts.**
- Roll types: 7× "Draft Roll - service electors" (2025), 2× "Final Roll - service electors" (2025).
- **Gates: 1 hard gate** — main-roll per-PDF downloads via the ECI portal the CEO site redirects to are CAPTCHA-gated (Scriptable=N). **1 unverified path** — 2002 voter-list listing page (fetch failed; no bypass attempted).
