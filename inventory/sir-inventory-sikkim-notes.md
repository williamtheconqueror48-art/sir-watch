# Sikkim — inventory notes (survey date: 2026-09-24)

## Row count
- 17 rows in `sir-inventory-sikkim.jsonl` (17 unique part-PDFs, all scriptable=Y).
- Coverage: 13 of Sikkim's 32 Assembly Constituencies (ACs 01, 03, 04, 05, 06, 08, 13, 16, 18, 21, 23, 28, 32), 17 parts total.

## Domain used
- Hint URL `https://ceosikkim.nic.in/` does NOT resolve via fetch (browser-open fails on both http and https).
- Actual live CEO Sikkim website: **https://ceo.sikkim.gov.in/** — fetched successfully (site title "CEOSikkim"). Recorded here for reuse.
- All 17 roll PDFs live on the ECI central SIR repository: `https://www.eci.gov.in/sir/f3/S21/data/OLDSIRROLL/S21/...` (S21 = Sikkim state code). One PDF (AC 01, part 4) was fetched live and verified as a text-extractable electoral roll PDF; the rest were directly observed as indexed documents in search results and follow the identical path pattern.

## Click path (CEO site)
1. Opened https://ceo.sikkim.gov.in/ (fetched full page text).
2. Homepage sections observed: top nav (About, Election, Reports, Results, Form 20, Handbook), Press Release list, Tenders, "Press Note for Final Publication 2026", What's New cards (mostly "Click here to download / to watch / to go to Download page"), Elections 2024 microsite, footer with office address (Top Floor, North Sikkim Taxi Stand, Baluwakhani, Gangtok, PIN-737101).
3. The fetched homepage text exposes NO raw download hrefs (links are JS-driven cards; fetcher strips them), so no per-AC/part roll links were directly observable on the CEO site itself.
4. A third-party summary of CEO Sikkim services (electionin.in) documents the site's "Search your Name in Electoral Roll" facility (District-wise / AC-wise search with image-code/CAPTCHA) and a `Home/DownloadForm` page — consistent with rolls being served via gated search, not direct links.

## What's in the inventory (and why)
- All 17 rows are **Electoral Roll 2002 part-PDFs** — Sikkim's pre-SIR baseline rolls, qualifying date 01.01.2002 (per ECI's SIR qualifying-date table for Sikkim).
- They live under ECI's public SIR portal folder `OLDSIRROLL/S21/` — the same repository ECI instructs electors to consult for last-SIR details when filling Enumeration Forms. Public, ungated, plain-GET.
- These are pre-delimitation (2002) AC names/numbers, e.g. "01 YOKSAM", "16 TEMITARKU", "23 DJONGU(Reserved for BL)", "32 SANGHA(Reserved)" — names copied exactly as printed in the PDFs. They do NOT map 1:1 to current (post-2008 delimitation) AC numbers/names; noted here so downstream mapping doesn't treat them as current.
- `district` is null on all rows: the 2002 PDFs use the old (pre-2021) district structure and do not print a current district; no guessing.

## URL naming pattern (observed, not guessed)
- `https://www.eci.gov.in/sir/f3/S21/data/OLDSIRROLL/S21/<AC>/S21_<AC>_<PART>.pdf`
- Example verified live: `https://www.eci.gov.in/sir/f3/S21/data/OLDSIRROLL/S21/1/S21_1_4.pdf` → "STATE OF SIKKIM / ELECTORAL ROLL : 2002 / ASSEMBLY CONSTITUENCY : 01 YOKSAM / PART NO: 04" (330 voters, polling station 01/04 Govt. L.P. School, Darapthang). Fetched 2026-09-24, ~2584 text lines, fully text-extractable.
- PDFs are produced by National Informatics Centre (N.I.C), Tashiling, Gangtok.

## API-like endpoints observed
1. `https://www.eci.gov.in/eci-backend/public/api/download?url=<url-encoded-pdf-path>` — ECI backend PDF download gateway (observed in search results for other SIR documents; NOT observed serving Sikkim roll PDFs in this survey — use only as an endpoint pattern reference).
2. `https://voters.eci.gov.in/download-eroll` — ECI's citizen roll-download page (referenced by sarkariyojana.com's Sikkim voter-list guide and by ceo.kerala.gov.in's SIR SOP): state dropdown → district → language → **CAPTCHA** → "Download Selected PDFs". This is where Sikkim's 2026 SIR draft/final rolls are served; the CAPTCHA gate makes it Scriptable=N. No bypass attempted.

## ACCESS NOTES (gates & blockers)
- **ceosikkim.nic.in does not resolve** (fetch fails on both http and https). Use ceo.sikkim.gov.in.
- **ceo.sikkim.gov.in** — homepage has e-roll download sections ("Click to go to download page", e.g. "Draft Roll w.r.t 01.01.2023 as qualifying date") but the links are JS-driven cards whose hrefs are not exposed in fetched text; a live-browser session is needed to expand/click them. Its "Search your Name in Electoral Roll" facility requires an image-code (CAPTCHA). Scriptable through this path: N.
- **2026 SIR draft/final rolls for Sikkim** (draft published 05.07.2026, final roll published 06.09.2026 per ANI/ECI press coverage): served only via voters.eci.gov.in/download-eroll behind a per-PDF CAPTCHA — not bulk-fetchable without bypassing. No public ASDD (Absent/Shifted/Dead/Duplicate) list for Sikkim was observed on ceo.sikkim.gov.in or indexed publicly, even though ECI instructions say booth-wise ASDD lists go on CEO websites. Likely available via district ERO offices' notice boards or the gated portal.
- **SIR 2026 timeline for Sikkim** (per ECI phase-3 schedule): enumeration 29.05–28.06.2026; draft roll 05.07.2026 (4,33,294 electors); claims/objections 05.07–04.08.2026; notice/hearing disposal by 02.09.2026; final publication 06.09.2026. Post-SIR exclusion: 54,209 names (37,724 ASDD + 16,485 ineligible in hearings), per CEO press note via ANI, 2026-09-06. None of the draft/final roll PDFs were directly observable.
- **No rate-limit or bot-block encountered** on the ECI SIR repository — PDFs are plain static downloads.

## Method
- browser_search (multiple query sweeps: CEO site pages, "ceo.sikkim.gov.in roll download pdf", ECI SIR S21 old-roll PDFs by AC/part filename pattern, ASDD list searches) + browser_open on ceo.sikkim.gov.in (homepage) and one ECI SIR PDF (live verification).
- Every row traces to a URL directly observed in a search result's verbatim URL mapping or in fetched page text. No URLs invented. The one AC 01/part 4 PDF was fetched live to verify format and content.

## Row count check
- JSONL lines: 17 (verified: one row per line, exact required keys only).
- ACs covered: 13/32. Parts: 17. Districts (2002 mapping): not recorded (null).

## Recommended follow-ups (for parent to arrange)
- Live-browser pass over ceo.sikkim.gov.in to expand the JS "What's New / Download page" cards (including "Draft Roll w.r.t 01.01.2023") and capture the real PDF hrefs — these could add full current rolls + older archives.
- District ERO-level search for Sikkim's booth-wise ASDD lists (37,737 electors) that ECI rules say should be on the CEO website.
- The 2026 draft/final rolls remain CAPTCHA-gated at voters.eci.gov.in — flag only; do not bypass.
