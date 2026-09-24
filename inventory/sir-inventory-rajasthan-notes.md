# SIR-WATCH Inventory Notes — Rajasthan

Date of survey: 2026-09-24. Worker: inventory subagent (no live browser available this session).

## Method
- `browser_search` only. `browser_open` on https://election.rajasthan.gov.in/electoralroll/rln FAILED
  (browser-service fetch error; terminal this session per runtime — not retried, and no curl/exec
  reproduction was permitted). The CEO roll page itself was therefore never fetched.
- Targeted web searches (English + Hindi) were run for: the exact portal path `electoralroll/rln`,
  the IP-mirror `http://164.100.153.10/electoralroll/rln`, CEO guides describing the download flow,
  the SIR 2026 draft/final roll publications, and direct roll-PDF URLs on election.rajasthan.gov.in.

## RESULT: 0 inventory rows
No per-part roll PDF link was directly observed in any fetched page text or search result. Every
roll-PDF URL under the portal sits behind an interactive listing page that could not be read this
session, and no search index exposed an individual district/AC/part PDF under /electoralroll/rln.

## What WAS established (third-party corroboration, not direct observation)
1. **Roll portal entry point.** Third-party guides consistently cite the CEO Rajasthan roll portal as
   `https://election.rajasthan.gov.in/electoralroll/rln` (also published as
   `http://164.100.153.10/electoralroll/rln`), described as a district-wise "Final Photo Electoral
   Roll" download page.
   - Sources: sarvodayasangam.com state-wise voter-list guide (PDF, crawl ~160 days ago);
     rajasthanresults.in (crawl 1 day ago); YouTube how-to metadata (Technical Update Rajasthan).
2. **Click path (per published how-to guide, cemca.org.in, Rajasthan Voter List page):**
   CEO site → "Final Electoral Rolls 2025" link in the Citizen Center section → **enter district
   name, assembly constituency, and CAPTCHA code** → click **Verify** → PDF opens.
   → **GATED: CAPTCHA on the CEO roll download flow (third-party attested, consistent with the
   UP/WB ECI-standard pattern). Not bypassed or tested directly this session.**
3. **SIR 2026 vintages for Rajasthan (Phase II SIR, Oct 2025–Apr 2026):**
   - Draft electoral roll published ~16 Dec 2025 (sarkariyojana.com, updated 12 Sep 2026;
     ECI schedule had said 9 Dec 2025).
   - Draft carried ~41.85 lakh removed names (bhaskarenglish.in; madhyamamonline.com): 29.6 lakh
     shifted/absent, 8.75 lakh deceased, 3.44 lakh multiple/enrolled-elsewhere. Separate
     Absent/Shifted/Dead/Already-Enrolled lists were published alongside the draft on the Election
     Department's website and district websites; draft rolls covered 61,136 polling booths in
     41 districts / 199 ACs and were also shared with recognised political parties.
   - Final SIR roll published 21 Feb 2026 (CEO's own "Electors District with AC 21.02.2026.pdf";
     sarkariyojana.com). ~5.15 crore electors across 199 ACs (Anta bypoll AC published separately
     12 Mar 2026).
   - CEO's own aggregate statistics PDFs ARE served directly (observed URLs, metadata only):
     - https://election.rajasthan.gov.in/Elector%20Statics/Electors%20PC%20with%20AC%2021.02.2026.pdf
     - https://election.rajasthan.gov.in/Elector%20Statics/Electors%20District%20with%20AC%2021.02.2026.pdf
     These are AC-level elector COUNT tables, not roll PDFs — not inventoried as roll rows.
4. **No API-like endpoint found.** Searches surfaced no JSON endpoints or predictable part-PDF URL
   patterns under /electoralroll/rln, unlike the base64-filename pattern seen on CEO Lakshadweep.
5. **Deletion (ASDD/ASD) lists:** the SIR draft's Absent/Shifted/Dead/Already-Enrolled lists were
   published on the Election Department website per press coverage, but no direct PDF URLs for any
   district/AC were observed in search results or fetched text.
6. **Pre-SIR baseline:** none located for Rajasthan. ECI's intensive-revision qualifying dates for
   Rajasthan were 01.01.2002 (and 01.01.2026) per ECI press note — the 2002 roll is the nominal
   pre-SIR baseline, but no publicly observed bulk source was found.

## Scale estimate
- ECI Phase-II SIR table: Rajasthan = 5,48.85 lakh electors, **52,490 polling stations**, 41 districts.
- 200 ACs constitutionally; SIR ran on 199 ACs + Anta bypoll → ~52,500 part PDFs expected per vintage.

## ACCESS NOTES / blockers
- CEO roll portal itself unreachable this session (browser_open terminal failure; no direct
  observation possible, no workaround attempted).
- Roll PDFs require district → AC selection + CAPTCHA + Verify click per published guides
  (cemca.org.in). Cannot be scripted without CAPTCHA bypass — **rule holds, do not attempt**.
- No gate observed on the CEO site's aggregate stat PDFs, but those are not rolls.
- Alternate mirrors: http://164.100.153.10/electoralroll/rln (NIC IP mirror of the same app);
  voters.eci.gov.in/download-eroll?stateCode=S20 (Rajasthan) — ECI central portal is CAPTCHA-gated
  per all prior tests.

## Exact row count: 0
