# Delhi (NCT) — SIR Roll Inventory Notes

Date of survey: 2026-09-24. Worker: subagent (browser_search + one browser_open fetch of the CEO homepage; no live browser).

## Click path (as published by CEO Delhi)

Home (https://www.ceodelhi.gov.in/ — fetched successfully, shows SIR 2026 notice)
→ **Electoral Roll 2002 index**: https://www.ceodelhi.gov.in/ElectoralRoll_2002.aspx
→ Select District → Select Assembly Constituency → Select Part → PDF download

The index-page URL is from the CEO Delhi official press note "PRESS Release for SIR 2026 Announcement-1" (dated 15.05.2026): *"voter list of last Special Intensive Revision held in year 2002 in Delhi has been uploaded on the website of CEO, Delhi at the link https://www.ceodelhi.gov.in/ElectoralRoll_2002.aspx"*. The press note is itself a directly observed PDF on the CEO site: https://ceodelhi.gov.in/PDFFolders/2026/Schedule_of_Special_Intensive_Revision15May2026.pdf.

Also published (from the same 2002-roll launch): search-by-EPIC page https://www.ceodelhi.gov.in/ElectorSearch_2002.aspx and search-by-details page https://www.ceodelhi.gov.in/ElectorSearchByName_2002.aspx (reported by thedailyjagran.com; URL spellings on that third-party page contain spaces and are unverified — listed here only as reported, not observed).

**Caveat:** I could not render the ElectoralRoll_2002.aspx page itself (browser_open fetch of that page failed; homepage fetch succeeded). The District → AC → Part drill-down is therefore reconstructed from the CEO press note plus the observed hosting structure, not from clicking through the page. If it is a JS/ASP.NET postback form, full enumeration would require a live browser.

## URL patterns (directly observed)

1. **2002 roll PDFs** — hosted on the CEO's legacy roll domain:
   `https://ceodelhinet.nic.in/ceodelhiweb/validateUser_2002BK.aspx?id=<opaque-token>`
   - The `id` is an encrypted/opaque base64 token; it is NOT a predictable AC/part encoding and cannot be enumerated — each observed link is a single part PDF.
   - Search-engine-indexed copies of these pages show the served PDF's internal title, which reveals the source file path pattern: e.g. `D:\Election\Data\Output\English\020\PDF\A0200039.PDF` = **A<AC 3-digit><Part 4-digit>.PDF** (AC 20, Part 39). Confirmed pairs: A0200039=AC20/Part39, A0360060=AC36/Part60, A0240043=AC24/Part43, A0330038=AC33/Part38, A0330107=AC33/Part107, A0060080=AC6/Part80, A0030117=AC3/Part117, A0040115=AC4/Part115, A0200186=AC20/Part186.
   - All 18 rows use this pattern. Marked scriptable=Y because each link is a plain GET (search crawlers fetched the PDF content without a captcha); the opaque token is the only barrier to discovery of unlisted parts.
2. **2026 SIR draft-roll page** — exists on ceodelhi.gov.in behind a "Draft Electoral Roll 2026" link (reported by jagranjosh/dailyjagran/sarkariyojana, Sept 2026): Home → "Draft Electoral Roll 2026" → select district → select AC → part list → PDF. A YouTube description of the official links referenced `https://www.ceodelhi.gov.in/infoSIR20...` (truncated) — **unverified, not in inventory**.
3. **SIR info page (truncated URL above)** offers three options per reports: *SIR Draft Electoral Roll 2026 PDF* / *Search Your Name in SIR Draft Electoral Roll 2026* (→ electoralsearch.eci.gov.in, captcha) / *ASDD List/Minutes of Meeting (MOM)*.

## Roll vintages found

- **2002 SIR roll (Final Roll)** — the complete last-SIR baseline uploaded ~May 2026 for electors resident before 2002. **All 18 inventory rows are 2002.** AC numbering/names are the pre-2008 delimitation set (e.g. 25 NANGLOI JAT, 29 NASIRPUR, 66 PATEL NAGAR, 19 SHALIMAR BAGH, 3 MINTO ROAD, 4 KASTURBA NAGAR, 24 MANGOLPURI (SC)).
- **2026 SIR Draft Roll** — published **31.08.2026** (slipped from 05.08 → 24.08 → 31.08), ~97.5 lakh of 1.45 crore electors; qualifying date 01.10.2026; final roll due **04.11.2026**. Downloadable via the ceodelhi.gov.in JS drill-down and via voters.eci.gov.in/download-eroll (captcha). **No direct per-part PDF link was directly observable** — no rows written.
- **ASDD deletion list (2026)** — 47.7 lakh "uncollectable" names (Absent/Shifted/Dead/Duplicate/Others), list dated 31.08.2026; **33.1 lakh** in-draft electors served document-check notices (list dated 19.09.2026). These sit behind "ASDD List/Minutes of Meeting(MOM)" links / district portals (e.g. https://dmnewdelhi.delhi.gov.in/sample-page/sir-2026/ lists "Delhi SIR ASDD List" and "List of Persons to Whom Notices Have Been Issued" with View/Download buttons — the actual file URLs were not visible in fetched text, so no rows written).

## API-like endpoints

- `GET https://ceodelhinet.nic.in/ceodelhiweb/validateUser_2002BK.aspx?id=<token>` — the only observed query-string download endpoint. Response is the part PDF (Content-Type per search index: PDF; the crawler indexed full PDF text, so content is served inline). No JSON API, no session cookie observed via search crawl. Opaque tokens mean no enumeration; each token is a one-file download link.
- **No JSON/API endpoints observed.** The 2002 search pages (ElectorSearch_2002.aspx etc.) are ASP.NET form pages, not APIs, and were not fetched.

## Access notes / blockers

- CEO homepage fetched fine over plain GET. The ElectoralRoll_2002.aspx index page failed to fetch via the fetch tool (JS-heavy ASP.NET likely; treat as unrendered, not blocked-by-captcha).
- **2026 draft roll / ASDD / notice lists**: gated behind JS district→AC→part dropdowns on ceodelhi.gov.in (unverified render) and, on the ECI portal, a **CAPTCHA** (voters.eci.gov.in/download-eroll: solve captcha → "Download Selected PDFs"). Per standing rules these gates were NOT bypassed — hence no 2026 draft/ASDD rows.
- District portals (dmnewdelhi.delhi.gov.in and likely 12 others) carry SIR-2026 document tables with View/Download buttons; file URLs not in fetched text — a live-browser pass could recover them.
- ceodelhi.gov.in appears to be a plain ASP.NET site; no rate-limiting evidence observed (no requests were made beyond two page fetches and web searches).
- District column is null in all rows: the 2002 rolls print a DL district code (e.g. DL/07/066 for AC 66, DL/05/058 for AC 58, DL/03/019 for AC 19, DL/02/008 for AC 8) but the code→district mapping is unverified, so it is left null rather than guessed.

## Method (fetched vs not fetched)

- Fetched: https://www.ceodelhi.gov.in/ (homepage, SIR notice + Hindi text) via browser_open — success.
- Fetched: 5 public web searches (roll index URL, 2002 roll hosting pattern, validateUser gate, 2026 draft-roll publication facts, SIR info page URL) — these produced the 18 direct file links plus context.
- NOT fetched: the ElectoralRoll_2002.aspx index page itself (fetch failed); any ceodelhi.gov.in drill-down page; dmnewdelhi.delhi.gov.in SIR-2026 page (only its search-indexed table text); voters.eci.gov.in/download-eroll (captcha-gated, out of scope).
- No logins, no captchas, no form submissions were attempted.

## Row count

- **18 rows** in `sir-inventory-delhi.jsonl`. All roll_type=Final Roll, all vintage **2002 SIR**, all scriptable=Y, all on ceodelhinet.nic.in.
- ACs covered (14): 3 MINTO ROAD, 4 KASTURBA NAGAR, 6 OKHLA, 8 (name unverified — 3 separate parts), 19 SHALIMAR BAGH, 20 BADLI (2 parts), 24 MANGOLPURI (SC), 25 NANGLOI JAT, 26 (name unverified), 29 NASIRPUR, 33 SAKET (2 parts), 36 BADARPUR, 58 (name unverified; section "Bazar Chitli Qabar"), 66 PATEL NAGAR.
- Parts covered: 18 individual parts out of thousands (a complete Delhi 2002 roll would be ~11 district codes × 70 ACs × ~100-200 parts each — these 18 are the only part PDFs with directly observable links found in this pass).
- Districts covered: none identified (district=null on all rows — see access notes).
- Gates encountered: JS drill-down (2026 draft roll, unverified render), CAPTCHA (ECI central portal — not attempted), opaque non-enumerable tokens (2002 parts), failed page fetch (ElectoralRoll_2002.aspx index).

## Recommended follow-ups for parent

1. Live-browser pass on https://www.ceodelhi.gov.in/ElectoralRoll_2002.aspx to enumerate the full District → AC → Part tree (would yield thousands of rows).
2. Live-browser pass on the ceodelhi.gov.in "Draft Electoral Roll 2026" and "ASDD List/Minutes of Meeting(MOM)" drill-downs (JS forms, no captcha expected) — the big 2026 SIR prize: ~14,947 parts + ASDD + 33.1L notice lists.
3. Live-browser pass on the 13 Delhi district portals' SIR-2026 document tables (e.g. dmnewdelhi.delhi.gov.in/sample-page/sir-2026/) for direct ASDD/notice-list file URLs.
