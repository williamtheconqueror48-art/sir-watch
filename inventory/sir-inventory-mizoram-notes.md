# Mizoram Inventory Notes — SIR-WATCH

**Domain used:** `ceo.mizoram.gov.in` (the `ceomizoram.nic.in` hint does NOT resolve; direct fetch failed. All findings are on the `.gov.in` domain, verified via web-search indexing of the CEO site.)

## Click path (as indexed by search, from the CEO homepage)

1. `https://ceo.mizoram.gov.in/` → homepage carries a **Special Intensive Revision (SIR) 2026** strip with links:
   - `Submit Appeal`
   - `Final Roll of SIR 2026`
   - `BLO_BLA Minutes of Meeting`
   - `List of Electors not included in Draft Roll`
   - `Search by EPIC - Elector not included in Draft Roll`
   - `Search your name in last SIR E-Roll`
2. Same homepage has an **Electoral Roll** menu:
   - `Search Your Name in Current E-Roll` / `View E-Roll` / `Forms For Registration in E-Roll` / `Claims and Objections` / `Monthly Pooling - List of Addition, Modification and Deletion`
3. `https://ceo.mizoram.gov.in/page/eroll` — the E-Roll page (search-crawled 15 days ago) repeats the SIR 2026 link set above.
4. Homepage also lists dated notices, e.g. "04.07.2026 - SIR 2026 (Eng): Publication of Draft Electoral Roll for Special Intensive Revision, 2026 (English)", "Press Note Dt. 07.09.2026 - SIR 2026 (Eng): Publication of Final Electoral Roll for Special Intensive Revision, 2026 (English)", and "Press Note Dt.30.09.2025 - Final Electoral Roll, 2025 of 2-Dampa (ST) Assembly Constituency".

NOTE: `browser_open` on the CEO site was unavailable this run (tool failure, terminal for this session). The link targets of the SIR 2026 strip ("Final Roll of SIR 2026", "List of Electors not included in Draft Roll", search-by-EPIC forms) were therefore NOT observed — they are recorded below as gates, not rows.

## URL patterns (observed directly in search results)

- Monthly pooling lists (addition / deletion / modification accepted applications):
  `https://ceo.mizoram.gov.in/storage/monthly-poolings/{AC No}/{Month_Year}/{addition|deletion|modification}/{random-ulid}.pdf`
  e.g. `/storage/monthly-poolings/24/May_2026/addition/01KR0MNZ6EPR0CJMZGPT1PM2J5.pdf` (Champhai, AC 24).
  These are plain-GET PDFs, no gate → Scriptable=Y. Each file covers one district/AC and month.
- Press releases: `https://ceo.mizoram.gov.in/storage/press-releases/July_2026/{random}.pdf`
- Current events: `https://ceo.mizoram.gov.in/storage/current-events/July_2026/{random}.pdf`
- E-Roll page: `https://ceo.mizoram.gov.in/page/eroll`

## Vintages observed

- **Monthly pooling lists**: April 2026 (addition + deletion) and May 2026 (addition) batches. File bodies carry batch labels like "List of applications for Addition in E-Roll 4-2026" / "List of applications for Deletion accepted 3-2026". The deletion rows' folder says April_2026 while the body label says "3-2026" — likely batch sequence; folder month used as `last_updated`.
- **SIR 2026 press notes** (2 PDFs, July 2026): No. H.11018/2/2024-CEO dated Aizawl 4th July 2026 (Mizo) and the English draft-publication release. They state: SIR 2026 Phase III in Mizoram 20.05.2026–06.09.2026; draft roll published 04.07.2026 (shifted from 05.07.2026 because Sunday); claims & objections 04.07.2026–04.08.2026; notice phase 04.07.2026–02.09.2026; **final roll publication 06/07.09.2026** (homepage notice says final roll published 07.09.2026, English version); qualifying date 01.07.2026; baseline = last SIR roll (2005); 8,75,068 electors as on 30.05.2026, 8,28,906 enumeration forms submitted; 11 districts, 40 EROs, 49 AEROs, 1301 polling booths, 3,937 BLAs. ASDD minutes/lists uploaded by BLOs in the BLO App; boothwise absent/shifted/death/duplicate lists displayed on notice boards and "published on CEO's website in an accessible format" — but no direct ASDD PDF URLs surfaced in search indexing.
- **SIR 2026 List of Parts** (state-wide index PDF, July 2026): columns District Name | AC No. | AC Name | Part No. | Part Name (e.g. MAMIT 3 MAMIT parts 14–43; KOLASIB 4 TUIRIAL parts 1–28; etc.). This is the district→AC→part map for SIR 2026. It is an index, not a roll.

## API-like endpoints

None observed on the CEO site. No query-string download endpoints surfaced in indexing. The CEO's "View E-Roll" page is a CAPTCHA-gated form (AC No + Part No + CAPTCHA, PDF opens in new tab). Per-AC roll PDFs are served through ECI's `voters.eci.gov.in/download-eroll` flow: select district → assembly constituency → language → **CAPTCHA** → download (steps corroborated by sarkariyojana.com and districtsinfo.com for ceo.mizoram.gov.in). The "Search by EPIC - Elector not included in Draft Roll" link is a form, not a file.

## ACCESS NOTES (blockers / gates)

1. **Per-AC/part full electoral roll PDFs are CAPTCHA-gated** — both on the CEO site's own View E-Roll page (select AC No + Part No, enter CAPTCHA, "Click Here to Download PDF") and on ECI's download-eroll portal (district → AC → language → CAPTCHA). No gate bypass attempted. Scriptable=N for these paths; no per-part roll rows added (no direct URLs observed).
2. **"List of Electors not included in Draft Roll" / "Search by EPIC - Elector not included in Draft Roll" / "Final Roll of SIR 2026"** links on the SIR 2026 strip were observed as menu labels only (search-crawled text). Their target URLs could not be observed because the page fetch failed this session. They may resolve to ECI-gated tools or direct lists — recheck needed with a working page fetch.
3. `ceomizoram.nic.in` does not resolve — do not use it; canonical domain is `ceo.mizoram.gov.in`.
4. No login/OTP paywalls encountered; all PDFs found are plain HTTP(S) GET with no referrer checks observed.
5. **Privacy note:** the monthly-pooling PDFs contain elector names + EPIC numbers in the body (observed only in search snippets). Per project privacy rules, only URLs and metadata are recorded here — no names, no EPICs.

## Method

- `browser_search` only (browser_open failed on the CEO domain this session and was declared terminal).
- Inventoried every directly observed `ceo.mizoram.gov.in` PDF link returned by targeted searches: `site ceo.mizoram.gov.in monthly-poolings`, SIR 2026 press-note/current-events storage URLs.
- AC names left null except where directly observed (AC 3 = Mamit, from the List of Parts PDF). Part numbers null — monthly-pooling files are whole-AC/month aggregates, not per-part rolls.

## Row count

**15 rows total** in `sir-inventory-mizoram.jsonl`:
- 12 × Monthly Pooling lists (7 deletion, 5 addition), April–May 2026, covering ACs 3 (Mamit), 13/15/16 (Aizawl), 23/25 (Champhai), 31/32/33/34 (Lunglei), 40 (Siaha) — 6 districts, 11 ACs, 0 per-part files (aggregates).
- 2 × SIR 2026 draft-publication press notes (Mizo + English), July 2026.
- 1 × SIR 2026 List of Parts state-wide index (all districts/ACs/parts), July 2026.
- 0 × per-AC/part roll PDFs, 0 × ASDD deletion lists as direct files (gated/notice-board-only; the "List of Electors not included in Draft Roll" target unobserved).

## Follow-ups for the parent

- Re-fetch `https://ceo.mizoram.gov.in/page/eroll` (and the SIR strip) with a working page fetch to capture the true targets of "Final Roll of SIR 2026", "List of Electors not included in Draft Roll", and the search-by-EPIC form — these may be direct lists the search index missed.
- The monthly-pooling pattern strongly suggests additional `modification/` and more months/ACs exist beyond the 12 indexed files; a live crawl of `page/eroll` or the monthly-pooling listing would complete the set. Do NOT guess the random `{ulid}` filename segments — enumerate via the site's own listing.
