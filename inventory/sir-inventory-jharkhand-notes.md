# SIR-WATCH Inventory — Jharkhand

Date: 2026-09-24. Worker: subagent (search-only; no live-browser fetch).

## Official site (actual domain used)

- **Primary:** https://ceo.jharkhand.gov.in/ (confirmed official by multiple
  sources, incl. thedailyjagran.com 2026-09-23 and electionin.in mirrors)
- **Legacy/mirror:** http://archive.jharkhand.gov.in/ceo/ (old CEO Jharkhand site,
  still referenced for forms; hosts direct Form 6/7/8/8A PDFs under
  `/ceo/AllForms/`, not electoral rolls)

## Click path (as documented by third-party guides to ceo.jharkhand.gov.in)

1. Open https://ceo.jharkhand.gov.in/
2. Click **Search Elector Details** (name/EPIC search, district-wise or AC-wise), OR
   **E-Roll** section:
   - Select Roll type (e.g. "Election Roll 2003", current roll, SIR 2026 draft)
   - Select **District** (24 districts)
   - Select **Assembly Constituency**
   - Select polling **Part** / polling station
   - **Enter the CAPTCHA code** (explicit bot gate at download time)
   - Roll downloads as a PDF (photo roll)
   (thedailyjagran.com: "Jharkhand Voter List 2003 Download", crawled 2026-09-23)
3. "Know Your Assembly" flow (District → nearest-location text → **CAPTCHA** →
   AC No / AC Name / Part No / Booth Name). (electionin.in mirror, crawled 2026-09-24)

## Vintages / what exists on the site (per published sources)

- **SIR 2026 draft electoral roll**, published **5 August 2026**, available on
  ceo.jharkhand.gov.in (sarkariyojana.com, updated 2026-09-08). "Voter list with
  photo PDF", manual name search within the downloaded PDF.
- **2003 baseline roll** ("Nirvachak Namawali 2003") downloadable via the same
  E-Roll flow (thedailyjagran.com guide). This is the SIR pre-roll baseline for
  Jharkhand.
- Polling-station list, BLO information, and the **"list of unmapped voters"**
  viewable on ceo.jharkhand.gov.in (thedailyjagran.com, SIR Phase 3 Dhanbad
  report, June 2026: 373,407 voters in Dhanbad flagged with discrepancies —
  75,884 Sindri, 69,806 Nirsa, 60,607 Dhanbad, 50,770 Jharia, 63,873 Tundi,
  52,467 Baghmara ACs; 112 new polling stations added, Dhanbad up from 2,372
  to 2,484).
- No standalone "ASDD deletion list" download section was surfaced by any
  observed source; deletion/objection services are routed through
  voters.eci.gov.in.

## URL naming pattern

- None directly observed. No per-file roll PDF URL (no district/AC/part PDF
  link, no `/pdf/` or `/eroll/` path, no query-string pattern) appears in any
  search result or crawled page text seen for Jharkhand.

## API-like endpoints

- None directly observed. The E-Roll section is described as chained
  dropdowns (Roll type → District → AC → Part) with the final PDF gated by
  CAPTCHA; no API URL was quoted in any source. Not guessing one.

## ACCESS NOTES (blockers)

- **CAPTCHA at PDF download time (per part).** Documented explicitly:
  "Enter the captcha code to verify and view the list… At last, the final
  roll will be downloaded as a PDF file." Bulk/scripted part-wise download
  is therefore NOT scriptable — Scriptable would be N on any such row.
- The first `browser_open` of https://ceo.jharkhand.gov.in/ from the worker
  sandbox failed (tool error), and browser fetching was disabled for the rest
  of this task, so the site's HTML/JS and any direct links could not be
  fetched and inspected this session. All structure above is from
  search-result evidence, NOT from a live page fetch.
- No login/OTP gate documented for the public E-Roll download; CAPTCHA is
  the documented gate.
- Central ECI portal alternative (voters.eci.gov.in) is CAPTCHA-gated per
  the national survey — same Scriptable=N verdict if it were in scope.

## Method

- `browser_search` only (public web search), ~6 targeted queries. No
  `browser_open` fetch of the CEO site (initial attempt failed; further
  fetches not permitted this turn). No forms submitted, no CAPTCHA
  attempted or bypassed, no credentials used.
- Zero fabrication: every statement above traces to a search result quoted
  above. No per-file roll URL was directly observed, so no rows are emitted.

## Row counts

- Inventory rows emitted: **0**
- Districts identifiable: 24 (Bokaro, Chatra, Deoghar, Dhanbad, Dumka,
  East Singhbhum, Garhwa, Giridih, Godda, Gumla, Hazaribagh, Jamtara,
  Khunti, Koderma, Latehar, Lohardaga, Pakur, Palamu, Ramgarh, Ranchi,
  Sahibgunj, Saraikela, Simdega, West Singhbhum) — from sec.jharkhand.gov.in
  DC contact list, not from roll files.
- ACs / parts observed at file level: 0.
- Gates confirmed: 1 (CAPTCHA per PDF download, would apply to every
  part-level row if enumerated).

## Recommended follow-up (for parent / live-browser agent)

A live-browser pass on https://ceo.jharkhand.gov.in/ → E-Roll could capture
the dropdown AJAX endpoints and per-part PDF URLs, but every actual PDF
download is behind a CAPTCHA, so files cannot be fetched at scale without
violating the no-bypass rule. File-level inventory is only feasible if the
site exposes a static link list (e.g. a district-wise PDF table) — none was
observed.
