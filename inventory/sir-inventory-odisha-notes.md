# SIR-WATCH inventory notes — Odisha

## Domain used
**https://ceoodisha.nic.in/** — confirmed as the official CEO Odisha portal (the CEO's office, quoted in Bharathorizon, 2026-07: "Citizens should only rely on www.ceoodisha.nic.in for electoral roll updates and voter services"). Direct page fetch of the site failed from this session's fetch tool, so the site could not be crawled directly; the inventory below is built from directly observed, verbatim URLs found in public search-engine results for the ceoodisha.nic.in domain. Nothing was guessed.

## Click path (reported by third-party walkthroughs, NOT directly observed this session)
1. https://ceoodisha.nic.in/en/ → **"View Electoral Roll"** under "For Voters"
2. Select **District** → **Assembly Constituency** → **Booth**
3. Type the letters from the CAPTCHA image → **OK**
4. Click **"Download Integrated ERoll"** to download the PDF for the selected part
(Sources: electionin.in/4968.html; sarkarilist.in/ceo-odisha-voter-list/)
ECI central equivalent: https://voters.eci.gov.in/download-eroll — select Odisha → year → district → roll type → AC → language → part numbers → enter CAPTCHA → "Download Selected PDF's" (Source: voterslist.in). **Both routes are CAPTCHA-gated.**

## URL naming pattern (observed)
- Legacy: `https://ceoodisha.nic.in/docs/EROLL_ANALYSIS/FORMAT1TO8_<VINTAGE>/<FormatN>.<pdf>` (e.g. `FORMAT1TO8_DRAFT_2019/Format8B.pdf`)
- Newer: `https://ceoodisha.nic.in/repo/docs/eroll_analysis/FORMAT1TO8_<VINTAGE>/<FORMAT>.pdf` (e.g. `FORMAT1TO8_DRAFT_2025/FINAL/Format%205B.pdf`)
- No part-wise roll PDF URL pattern was observed — no per-district / per-AC / per-part roll PDFs appear in search results or site references for ceoodisha.nic.in.

## Vintages observed
- 2014 draft, 2016 supplement-1, 2017 draft, 2019 draft, 2024 draft, 2024 supplement-1, 2025 draft (final) — all as **electoral-roll analysis** statistical formats (1–8: EPIC/photo coverage, age cohorts, deletions via Form-7, polling-station locations).
- Odisha SIR 2026 timeline (ECI schedule, Annexure-VI on ceoarunachal.nic.in; corroborated by sarkariyojana.com): enumeration 20.05.2026–30.05.2026 → house-to-house 30.05.2026–28.06.2026 → **draft roll published 05.07.2026** → claims & objections 05.07.2026–04.08.2026 → **final roll ~06.09.2026** (third-party sites say 21.09.2026). Qualifying date 01.07.2026.
- **No SIR draft 2026 / final 2026 roll PDFs and no ASDD (deletion) lists for Odisha were directly observed anywhere** — not on ceoodisha.nic.in, not on district DEO/NIC sites in search results. Per the ECI 24.06.2025 directions (as modified), "boothwise lists of [non-included] electors" and notice-phase lists must be published on CEO/DEO websites in accessible format; Odisha-specific copies could not be found via search.

## API endpoints
- None observed. No JSON/query-string roll download endpoints found for ceoodisha.nic.in.
- One notable legacy pattern on the sibling domain: `https://ceoarunachal.nic.in/componenthelper/getcomponentfile/39` — not Odisha; included only as an example of the NIC-CEO download endpoint shape, not as an Odisha row.

## ACCESS NOTES (blockers)
1. **"View Electoral Roll" on ceoodisha.nic.in is CAPTCHA-gated per part** (image CAPTCHA + OK button before the PDF is generated). No bypass attempted. Scriptable=N for the roll-download feature; its rows cannot be inventoried because no direct part-PDF URLs are exposed anywhere.
2. **voters.eci.gov.in/download-eroll is CAPTCHA-gated** (select state/year/district/roll/AC/language/part, then CAPTCHA, then "Download Selected PDF's"). No bypass attempted.
3. Search-engine crawls returned only the EROLL_ANALYSIS statistical annexures for the CEO domain — no district-wise part PDFs, no ASDD lists, no SIR 2026 draft/final PDFs. (Possible they sit behind the gated feature or on DEO sites not indexed.)
4. A fraudulent site impersonating the CEO Odisha portal was flagged by the CEO's office ahead of SIR (~July 2026); users are directed to www.ceoodisha.nic.in only.

## Method
- browser_search only (direct page fetch was unavailable this session — browser-open failed terminally and was not retried).
- Queries: "CEO Odisha official website electoral roll download"; "ceoodisha.nic.in View Electoral Roll draft roll 2026 PDF"; "ceoodisha.nic.in draft roll 2026 electoral roll PDF district"; "Odisha SIR 2026 ASDD deletion list voter roll PDF district CEO"; ""ceoodisha.nic.in" roll "draft" 2025 OR 2026 PDF download district site upload"; "Odisha district website "draft electoral roll" 2026 pdf download booth part".
- Every row in the JSONL traces to a verbatim URL in search results. URLs copied exactly, including the `%20` in the 2025 file.

## Counts
- **Inventory rows: 10** (all Scriptable=Y, direct PDFs, state-level statistical annexures).
- **Districts covered as part-level rolls: 0. ACs covered: 0. Parts covered: 0.**
- **Gates: 2** (CEO "View Electoral Roll" CAPTCHA gate; ECI download-eroll CAPTCHA gate), both documented above with no bypass attempted.
- The 10 rows are ECI analytical formats, not name-level rolls: district × AC aggregate tables (elector counts, EPIC/photo coverage, deletions, age cohorts). **No elector names or EPIC numbers are exposed by these files.**

## Gaps / caveats for the coordinator
- zero-fabrication: do not present these 10 PDFs as voter rolls — they are statistics tables only. SIR-WATCH needs per-part roll PDFs for Odisha, none of which are publicly observable without clearing a CAPTCHA (which the standing rule forbids).
- Vintages use revision-year labels from URL directory names (e.g. FORMAT1TO8_DRAFT_2025/FINAL); exact page dates could not be observed (search only gave relative crawl ages), so `last_updated` is null on all rows.
