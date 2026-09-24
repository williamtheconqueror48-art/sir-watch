# Manipur CEO-site roll inventory — notes

Domain used: `https://ceomanipur.nic.in/` (resolves fine; all files below are on it).
Date of survey: 2026-09-24.
Row count: **14** inventory rows (all = Final Roll 2025, Service Voters, one file per AC).
Districts covered by rows: 8 (Imphal East, Imphal West, Bishnupur, Thoubal, Kakching, Chandel, Ukhrul, Senapati).
ACs covered by rows: 14 of 60. Parts: n/a (service-roll PDFs are single-file-per-AC, header reads "Last Part").
Privacy: metadata + URLs only; no elector names, no EPICs in the inventory.

## Click path (main E-roll section)
1. `https://ceomanipur.nic.in/` (homepage; shows press-release list and a "Digital Library").
2. FAQ on the site says "Electoral Rolls is also available in official website — www.ceomanipur.nic.in".
3. The actual roll-download app is at `https://ceomanipur.nic.in/eroll` — page title "CEO Manipur | Electoral Roll",
   heading **"SIR Electoral Roll 2026"**, body text: "Assembly Constituency — Select your assembly constituency from the list" plus an "Electoral Roll Data" panel. The dropdown and part list render via JavaScript (ASP.NET WebForms app); no direct PDF links exist in the fetched text.
4. A separate page `http://ceomanipur.nic.in/claimsNobjection` ("CEO, Manipur | Claims & Objections") has an AC dropdown and Form 9 / 10 / 11 / 11a / 11b tabs with a | District | AC | Date | Download | table that was **empty** on fetch (populated by JS per AC selection). No direct links observed.

## URL patterns
- Service-elector roll PDFs (verified live, direct GET, no gate):
  `https://ceomanipur.nic.in/eroll_manipur/serviceElector/S14AC{NNN}SVRC.pdf`
  where `S14` = Manipur state code, `NNN` = zero-padded AC number (observed: 003, 005, 016, 026, 029, 032, 033, 035, 036, 041, 044, 045, 047, 048), `SVRC` = Service Voters Roll Card(?).
  Only these 14 ACs were directly observed via search-engine results (verbatim URLs from results). Do NOT invent the other 46 AC URLs — the pattern is predictable but unobserved links were not recorded per zero-fabrication rule.
- Document headers (verified by opening S14AC026SVRC.pdf, 2176 lines of text): "ELECTORAL ROLL - 2025 / STATE - (S14) MANIPUR / No., Name and Reservation Status of Assembly Constituency: 26-BISHENPUR(GEN) / Year of Revision: 2025 / Type of Revision: Special Summary Revision / Qualifying Date: 01-01-2025 / Date of Publication: 06-01-2025 / SUMMARY OF SERVICE ELECTORS". Text layer present (text-searchable PDF).

## API-like endpoints (observed, not used to bypass anything)
The /eroll app's download flow was documented by a third-party scraper readme (github.com/in-rolls/electoral_rolls, manipur/2025):
1. `GET /eroll` — session cookie + AC dropdown.
2. `POST /eroll.aspx/GetData` `{"selectedValue","selectedText"}` — per-AC part/part-name/file-size manifest.
3. `GET /Captcha/captcha.ashx` — 6-char captcha image.
4. `GET /ValidateCaptcha.ashx?code=<answer>` — one success unlocks exactly ONE download.
5. `GET /FileDownload.ashx?selectedText&selectedValue&partNo&lang=ENG|BEN&type=final` — the PDF.
Example shape only (NOT fetched; do not call without solving a CAPTCHA manually): `https://ceomanipur.nic.in/FileDownload.ashx?selectedText=26-BISHENPUR&selectedValue=26&partNo=1&lang=ENG&type=final`.

## ACCESS NOTES (gates)
- **General/main rolls (including SIR 2026 draft published 05/07/2026 and SIR 2026 final published 06/09/2026): behind a per-file CAPTCHA.** The /eroll app requires a freshly solved 6-char captcha per download (ValidateCaptcha.ashx), confirmed by the app page text and third-party flow documentation. Gate was NOT bypassed. Scriptable=N for these; zero inventory rows.
- Claims & Objections lists (Forms 9/10/11/11a/11b): AC-dropdown + JS-populated table; no direct links observed. Scriptable=N.
- ASDD (Absent/Shifted/Death/Duplicate) boothwise lists: CEO press materials (SIR Draft Publication Press Release 2026, hosted at ceomanipur.nic.in/Documents/PressNote/2026-2027/) state they are "published on CEO's website in an accessible format", but no direct links to them were found on ceomanipur.nic.in. The district DEO site `imphaleast.nic.in` (Imphal East district, a separate domain — out of CEO-site scope) lists ASDD documents ("Lists of ASDD in respect of 4-Kshetrigao AC", "1-Khundrakpam AC", "2-Heinagng AC", dated 05/07/2026) on its Election Notice page; recommend a separate district-site inventory pass if in scope.
- The defunct 2018-era page `www.ceomanipur.nic.in/ElectoralRolls.html` no longer exists.

## Vintages observed
- Rows = Final Electoral Roll 2025 (SSR, qualifying 01-01-2025, published 06-01-2025), service voters only.
- SIR 2026 draft (published 05/07/2026) and SIR 2026 final (published 06/09/2026, per press note "06/09/2026 Press Note SIR Final Electoral Roll 2026") exist only behind the CAPTCHA-gated /eroll app — no direct links found on ceomanipur.nic.in.

## Method
browser_open on homepage, /sir, /eroll, /claimsNobjection; browser_search for indexed roll PDFs and ASDD lists. Verified one service-roll PDF opens with plain text fetch (no CAPTCHA, no session). No logins bypassed, no CAPTCHAs solved.

## Exact row count: 14 rows in sir-inventory-manipur.jsonl.
