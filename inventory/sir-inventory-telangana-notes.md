# Telangana inventory notes — CEO site catalogue (2026-09-24)

**Domain used:** https://ceotelangana.nic.in/ (hint resolved; IP 164.100.187.165, Hyderabad). This is the official CEO Telangana portal. Nothing else observed beyond it; no mirror domain used for rows (one third-party mirror `sup1h9qx9bpo3poprlolhrllo.vcbrealty.top` surfaced in search results but is NOT official — deliberately excluded from the inventory).

## Method
- No live browser available in this worker; site was NOT navigated interactively and nothing was clicked.
- `browser_open` on `https://ceotelangana.nic.in/` returned only 9 lines of homepage text (frameset/JS-driven site); `browser_open` on `/home.aspx` and on the `LocalAuthorityRoll-2025/` directory both failed (tool-level failure, not retried per instruction).
- All 9 inventory rows come from web-search indexing of `ceotelangana.nic.in` — i.e. URLs the search engine has crawled and returned verbatim on the official domain, with index-extracted page text confirming each file's identity (constituency, PS name, publication date). Every file_url is copied verbatim from tool output; no URL was constructed or guessed.

## Click path (as documented by third-party guides + site structure)
1. Open https://ceotelangana.nic.in/
2. Homepage → "Search Your Name" → "Assembly Constituency" → district dropdown → AC dropdown → CAPTCHA-gated search (name search, not roll download).
3. Roll files themselves were found indexed under top-level folders (`LocalAuthorityRoll-2025/`, `LocalAuthorityRoll-2023/`, `epicstatus/`); the site does not expose a static, linkable index of assembly roll PDFs — assembly rolls are served through the CAPTCHA-gated "Search your name" flow only.

## Rows recorded: 9
- 3 council-constituency rolls (the only directly downloadable name-level rolls observed):
  - Draft Roll 2025, 17-Hyderabad Local Authorities' Constituency, PS No. 2 ("Library Room, Head Office, GHMC"; publication of draft rolls 26/03/2025), non-photo PDF.
  - Final Roll 2023, same constituency, PS No. 1 ("Panwar Hall, Head Office, GHMC") and PS No. 2 — final publication 23/02/2023.
  - Search-index text extraction proves these are typed/text PDFs (elector names, EPIC numbers, assembly segments extractable). District field set to Hyderabad because the constituency is the Hyderabad Local Authorities' Constituency and rolls were published at Hyderabad; part_number is null because files are organized per polling station, not per part.
- 6 "Electors Summary" aggregate-statistics PDFs under `epicstatus/` (district × AC elector counts, no names): SSR-2024 draft (published 06.01.2024), SSR-2014 final, SSR-2019 final (22.02.2019), 2023 final, 2022 final, HOP-2019 (25.03.2019). These are statistics, not rolls — recorded as supplementary rows, clearly labeled.

## Coverage
- Districts with directly observable roll files: **1** (Hyderabad — council constituency rolls only).
- Assembly ACs with directly downloadable roll PDFs: **0 of 119**. All assembly rolls are CAPTCHA-gated (see Access notes).
- Parts covered: none directly (council files are per-PS, not per-part).
- Other council constituencies (Warangal, Khammam, Nalgonda, Medak, Nizamabad, Karimnagar, Mahabubnagar, Ranga Reddy Local Authorities'; Graduates'/Teachers' constituencies) — press notes and schedules observed on the site, but NO roll PDFs surfaced for them.

## URL patterns observed
- `ceotelangana.nic.in/LocalAuthorityRoll-<YEAR>/<file>.pdf` — council roll folder per year.
- Filenames are descriptive, not ID-patterned: `Hyd Local Authorities_PS No.1_Final.pdf`, `Hyd Local Authorities_PS No.2_Final.pdf`, `PS No. 02 _ Non Photo_Draft Roll.pdf` (note spaces and inconsistent numbering styles — no predictable enumeration pattern safe to generate).
- `ceotelangana.nic.in/epicstatus/<descriptive name>.pdf` — electors-summary statistics.
- Other observed (non-row) folders on the domain, for orientation only: `Revision_2023/`, `Mlc2020/`, `Council/Council_Graduates_2023/`, `Legislative%20Council%20Electoral%20Rolls/TSLC_2018/`, `Bye-Election to the 61-Jubilee Hills-2025/`, `Current Issues/`, `MAPS_NEW/`, `GE_2019/LAC Affidavits_17.05.2019/`.

## Vintages
- Council rolls: Draft 2025 (26/03/2025), Final 2023 (23/02/2023).
- Electors summaries: 2014, 2019, 2022, 2023, SSR-2024 draft, HOP-2019.
- No CEO-hosted SIR-2026 draft roll PDFs, ASDD/deletion lists, or 2002 SIR baseline rolls were directly observed. SIR-2026 context from news sources (not CEO files): Telangana is in SIR Phase III (announced 14.05.2026); BLO house-to-house visits 25.06–24.07.2026; draft roll originally scheduled 31.07.2026, reported published ~mid-Aug 2026 with 73.39 lakh electors in ASDD categories out of 3.38 crore; claims/objections extended to 07.10.2026; final rolls now scheduled 09.11.2026 (per press reporting). Any ASDD lists circulating publicly appear to be third-party analyses, not CEO-hosted files.

## API-like endpoints
- None observed on ceotelangana.nic.in. No JSON/query-string download endpoints found in fetched text or search results. The site is a classic static-file + CAPTCHA-form NIC site.

## ACCESS NOTES (blockers — never bypassed, none attempted)
1. **Assembly electoral rolls (all 119 ACs): CAPTCHA gate — Scriptable=N.** The CEO site itself publishes the standing ECI directive: "The Electoral Roll shall be published on CEO website in image PDF only and the access to view this image of Electoral Roll shall be provided through CAPTCHA containing alphabet, numeral and special character as is being done for Assembly electoral rolls." Per-roll PDF links are therefore not statically observable; each view requires solving a CAPTCHA. No bypass attempted.
2. **Name search flow:** district dropdown → AC dropdown → house no/name/EPIC/gender + CAPTCHA → results page. Interactive, JS forms; not scriptable without a live browser (and the CAPTCHA step is out of bounds regardless).
3. **Council rolls (LocalAuthorityRoll-*) are directly fetchable** (Scriptable=Y): plain GET, no gate — evidenced by search-engine crawling and full text extraction. These are the only name-level roll PDFs publicly enumerable on the domain.
4. Directory listing of `LocalAuthorityRoll-2025/` via browser_open failed (tool failure), so completeness within that folder is search-index dependent — only PS No. 02 draft (2025) and PS No. 1/2 final (2023) surfaced; a PS No. 01 2025 draft, other years, and other council constituencies' PDFs may exist but were NOT observed and are NOT recorded.
5. The homepage is a frameset/JS shell; only 9 lines of text were retrievable without a live browser, so site navigation paths (e.g. a "Rolls" page) could not be walked to confirm whether additional static links exist.

## Telugu/Hindi labels
- No Telugu/Hindi file labels observed on the indexed roll pages (files are English-titled; roll content is bilingual English/Telugu as standard ECI format). No labels invented.

## Privacy
- File URLs + metadata only. No elector names or EPIC numbers recorded (search-index text of the council PDFs did contain them, but none was copied into this inventory).
