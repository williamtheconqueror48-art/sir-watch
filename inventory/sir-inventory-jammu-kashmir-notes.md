# SIR-WATCH Inventory Notes — Jammu & Kashmir

**State/UT:** Jammu and Kashmir
**Date:** 2026-09-24
**Row count:** 0 (zero directly-observable roll PDF rows)

## Domains used
- **Old/official NIC site (fetchable):** https://ceojk.nic.in/ — opened successfully via page-text fetch.
- **New CEO website (official, referenced in ECI/DEO press notices):** https://ceo.jk.gov.in — page-text fetch FAILS consistently (browser-service could not fetch; tried http and https, 3 attempts). The old site carries a banner: "Click here to Visit the new website of Chief Electoral Officer, J&K" — the link target was not exposed in the fetched text and cannot be clicked with available tools.

## Click path (what was attempted)
1. Fetched https://ceojk.nic.in/ homepage text. Sections observed: Election Machinery, Archives, General; news items including:
   - "Press Note-Rationalization of Polling Stations & Draft Publication"
   - "Form 5: Notice of Publication of E-Roll in Draft (27-Budgam AC)"
   - "Form 5: Notice of Publication of E-Roll in Draft (77-Nagrota AC)"
   - "User Manual for Obtaining extract of Electronic Voter List (EVL) of Old Electoral Rolls"
   - Body text claims: "Services like e-Filing, download Electoral Rolls, Voter Name Search and Know your BLO are also available."
   The fetched text exposed NO clickable link URLs (no outlink indices), so the "download Electoral Rolls" service target could not be resolved without a live browser.
2. Web search for the new site's roll-download section returned only secondary press coverage (buzzbytes.in, thekashmirhorizon.com, jkmonitor.org, jammubulletin.com, thelegitimatenews.com, arisingstate.in, kashmirdigest.com, dograherald.com) all repeating the ECI notice line: "The Draft Electoral Roll could be downloaded at www.ceo.jk.gov.in and www.ceojk.nic.in." No direct part-wise PDF links surfaced in any result.
3. Tried fetching https://ceo.jk.gov.in (http/https) and https://www.jkmigrantrelief.nic.in — all failed with the same fetch error.

## Vintages / organization (from press notices, not directly observed files)
- 2nd Special Summary Revision of photo electoral rolls, qualifying date 01-07-2024, draft published ~25-07-2024.
- Special Summary Revision 2025: final rolls for Budgam and Nagrota (by-election ACs) — press notes on CEO site.
- No SIR (Special Intensive Revision) draft roll for J&K was found published or announced; J&K was not in the 12 states/UTs of the Oct–Dec 2025 SIR schedule found in ECI documentation.

## API-like / download endpoints (observed references, NOT verified as scriptable)
- ECI central e-roll download: https://voters.eci.gov.in/download-eroll — per prior all-India survey this is CAPTCHA-per-download → Scriptable=N, gate documented; NOT a row (not a CEO-site file, not directly observed in this pass).
- EVL portal for OLD rolls (1951, 1957, 1971): the Pulwama DEO circular (URL below) prints it as "https://ceoelection oldelectoralroll.,jk.gov.in/evl" — text garbled in the PDF, so the exact hostname is UNVERIFIED; do not use. Paid (Rs. 20 per extract) even if reachable → Scriptable=N. Unverified, NOT a row.

## Other observed roll-related documents (not roll files — recorded for provenance, not as inventory rows)
- DEO Pulwama circular on issuance of 1951/1957/1971 voter lists: https://cdn.s3waas.gov.in/s3c75b6f114c23a4d7ea11331e7c00e73c/uploads/2025/05/2025053029.pdf (dated 30-05-2025, PDF, direct). AC references inside: 32-Pampore, 33-Tral, 34-Pulwama, 35-Rajpora.
- ECI scheme for Kashmiri migrants (roll extracts for special polling stations, 2024): http://elections24.eci.gov.in/docs/WIQwPBZOkr.pdf and https://hindi.eci.gov.in/files/file/150-advertisement-in-respect-of-migrant-voters/?do=download&r=340&confirm=1&t=1&csrfKey=8d353104e756e51bfd5ac1aa85882f0b — policy documents, not rolls.
- CEO homepage mentions draft-roll extract publication for Kashmiri migrants on www.jkmigrantrelief.nic.in (Aug 2024) — site unfetchable with available tools.

## ACCESS NOTES / blockers
1. **ceo.jk.gov.in is the current official roll-hosting site but cannot be read with page-text fetch** — every browser_open attempt returned a tool failure. Needs a live Chromium session (parent delegation) to enumerate the district → AC → part PDF links. This is the single biggest blocker: per official notices, the draft electoral rolls ARE hosted there.
2. **ceojk.nic.in (old site) fetched text exposes no link URLs** — menus render as plain text without hrefs, so click paths cannot be followed without a live browser.
3. ECI central portal (voters.eci.gov.in/download-eroll): CAPTCHA per download — gate, Scriptable=N, never attempted.
4. Old-roll EVL portal: paid extract (Rs. 20), hostname unverified — do not scrape, do not guess URL.

## Method
browser_open on https://ceojk.nic.in/ (success); browser_open on https://ceo.jk.gov.in (3 failed attempts), https://www.jkmigrantrelief.nic.in (failed); 7 browser_search passes for roll PDFs, the new site's roll section, Form 5 notices, and migrant roll extracts. No CAPTCHAs/logins/paywalls were bypassed. Zero URLs invented.

## Recommendation
Delegate to a live-browser session: open https://ceo.jk.gov.in, follow the "Electoral Roll / E-Roll" menu (district → AC → part), and record every direct PDF href. That is where the actual per-part roll PDFs live.
