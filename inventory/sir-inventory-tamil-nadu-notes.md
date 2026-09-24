# Tamil Nadu — CEO-site inventory notes (SIR-WATCH)

**Date:** 2026-09-24 · **Method:** public web search only. No live page fetch was possible this session: a direct `browser_open` of `https://elections.tn.gov.in/` failed at the tool layer (browser-service could not fetch), and the session instruction was to continue without retrying it or reproducing it via curl. So everything below is sourced from **search-result text and the verbatim full-URL mappings returned with the results** — no page body was read, no link was clicked, no form touched.

## Key structural finding
Tamil Nadu's roll PDFs live on a **dedicated host, `erolls.tn.gov.in`**, not on the main CEO site `elections.tn.gov.in`. Multiple independent third-party walkthroughs and the official DEO (Nagapattinam) what's-new page all point there. The prior survey's `/rollpdf/SSR2023_SR_01072023.aspx` example was reported on `elections.tn.gov.in`; what I observed verbatim this session is the same `/rollpdf/` pattern on `erolls.tn.gov.in`.

## Click path (evidence-based, NOT my own navigation)
1. Start at **elections.tn.gov.in** (CEO site) → electoral-roll section links out to the roll portal **erolls.tn.gov.in** (per multiple published walkthroughs, e.g. "Visit erolls.tn.gov.in").
2. On erolls.tn.gov.in: choose **district → assembly constituency** → part-wise PDF list → download. One guide notes "you will be asked to give the code sometimes too" (see Access notes).
3. Vintage index pages live at `erolls.tn.gov.in/rollpdf/<NAME>.aspx` (observed: `FINALROLL_EN_06012025.aspx`).
4. **Deletion (ASD) lists**: Nagapattinam DEO what's-new entry "Special Intensive Revision – 2026" (published 19/12/2025) links:
   - "Absent / Shifted / Dead Electors [ASD] BLO BLA Minutes : **https://erolls.tn.gov.in/asd/**"
   - "Draft Roll : **https://voters.eci.gov.in/download-eroll**" (ECI central portal)
5. **Name search**: erolls.tn.gov.in "Search" page — by EPIC, by details (name/DOB/gender/district), or by mobile (if linked). CAPTCHA or OTP required (see Access notes).

## Observed URLs (in the JSONL, 4 rows)
1. `https://erolls.tn.gov.in/asd/` — **Deletion-ASDD list index.** Indexed on the CEO domain with title "ASD and BLO BLA Minutes": *"List of voters whose names were in the Tamil Nadu Electoral Rolls as of 2025 but are not included in the Draft Roll of 01.01.2026"* — exactly the SIR deletion list. Search-index text shows the page form fields: **State, District, Assembly Constituency, Part No, Enter EPIC No.** Disclaimer quoted: *"Please note the BLO BLA Minutes are mapped to the Old Part No. To locate an ASD Elector in the BLO BLA Minutes List refer to the Old Part No. mentioned in the ASD List."* → per-part ASD files sit behind the JS dropdowns; no individual part file link was observable.
2. `https://erolls.tn.gov.in/rollpdf/FINALROLL_EN_06012025.aspx` — **Final Roll (SSR 2025, qualifying date 01.01.2025) part-PDF index**, quoted verbatim as a direct download link in a Mylapore Times article (2025-11): "Residents can use this link … to download the updated list of voters at each polling booth in their respective constituency." Plain anchor link, no gate mentioned → consistent with prior survey's "likely direct" assessment, but **not live-verified this session**.
3. `https://erolls.tn.gov.in/Rollpdf/SIR_2002.aspx` — **Pre-SIR 2002 roll index** (quoted verbatim in a YouTube video's description text). Reported/third-party; NOT live-verified, needs a fetch check.
4. `https://erolls.tn.gov.in/Rollpdf/SIR_2005.aspx` — **Pre-SIR 2005 roll index**, same provenance and caveat as (3). Note the path case as observed: `/Rollpdf/` (capital R) vs `/rollpdf/` in (2) — both spellings appeared verbatim in search text; treat case as unconfirmed until fetched.

**Deliberately excluded:** `DRAFTROLL_EN_19122025.aspx` (SIR 2026 draft, published 19.12.2025) was never observed verbatim anywhere; the naming pattern suggests it may exist, but guessing it would violate the zero-fabrication rule. The DEO notice routes Draft Roll traffic to the ECI portal instead.

## API-like / aggregate endpoints (observed verbatim, documented here — NOT roll PDFs, so not in JSONL)
- `https://www.elections.tn.gov.in/ACwise_Gendercount_06012025.aspx` — AC-wise gender counts, pre-SIR (SSR 2025). Quoted in a GitHub analysis project's data-sources section.
- `https://www.elections.tn.gov.in/ACwise_Gendercount_19122025.aspx` — same aggregate, post-SIR draft (19.12.2025). Same source.
- Both return rendered AC-wise aggregate tables (per the GitHub project's use); response format (HTML vs JSON) not observed — fetch needed.
- `https://erolls.tn.gov.in/asd/` behaves like a query endpoint: State/District/AC/Part dropdowns + EPIC lookup over the deletion list.

## URL naming patterns (observed)
- `/rollpdf/<REVISION>_<DDMMYYYY>.aspx` → vintage index of part-wise PDFs, e.g. `FINALROLL_EN_06012025.aspx`. (The pre-SIR pages break this pattern: `/Rollpdf/SIR_2002.aspx`, `/Rollpdf/SIR_2005.aspx`.)
- Part-level PDF URLs: **not observed** — no individual part file link appeared in any search text. This is the main gap vs the goal.

## Vintages located (context)
- **Pre-SIR:** SSR Final Roll published 06.01.2025 (qualifying 01.01.2025) — part PDFs indexed; SIR-2002 / SIR-2005 pre-SIR archives (reported, need live check).
- **SIR 2026:** enumeration 27.10.2025–14.12.2025; **Integrated Draft Roll published 19.12.2025** (qualifying 01.01.2026): 54,376,756 electors, 97,37,831 names deleted (26,94,672 deceased, 66,44,881 shifted/absent, ~3.9 lakh multiple entries); ASD + BLO-BLA-minutes lists on erolls.tn.gov.in/asd.
- **Final Roll published 23.02.2026**: 5,67,07,380 electors (post claims/objections 19.12.2025–30.01.2026). No erolls.tn.gov.in final-roll index URL observed yet.

## ACCESS NOTES (blockers)
- **Page fetch unavailable this session** — browser_open on elections.tn.gov.in failed at the tool layer; no retry permitted. All `scriptable` = "N" because nothing was live-verified. This is a method limitation, not a site gate.
- **ASD page is JS-gated for scripting:** the deletion lists are behind State/District/Assembly Constituency/Part No dropdowns + an EPIC search box on the page — a script would need to drive the form. Individual part URLs not visible in static/indexed text.
- **Name search requires CAPTCHA or OTP** on erolls.tn.gov.in ("Search by EPIC / by details / by mobile" flow; captcha-or-OTP challenge per a Tamil walkthrough site). Never attempted; recorded as a gate.
- **Occasional code prompt** ("you will be asked to give the code sometimes too") on the district→constituency download flow — unresolved whether CAPTCHA-like; not bypassed, flagged.
- **ECI central draft-roll path (voters.eci.gov.in/download-eroll) is CAPTCHA-gated** per prior survey — not attempted.
- Tamil labels: the CEO/ASD pages carry Tamil/English labels (photo rolls are Tamil+English per ECI standard), but no specific Tamil label string was observed verbatim in search text, so none are reproduced here.

## Row counts
- **JSONL rows: 4** (all index/landing pages, zero part-level file rows — none observable without a live fetch).
- Districts covered: 0 as rows · ACs covered: 0 as rows · Parts covered: 0 as rows (the ASD page and FINALROLL_EN index aggregate the whole state: 234 ACs, ~64.1M pre-SIR electors).
- **Gates encountered:** 1 tool failure (browser fetch down this session — environmental, not the site); 3 site-side blockers documented without being touched (CAPTCHA/OTP on name search, JS dropdowns on ASD page, occasional "code" prompt, ECI-portal CAPTCHA).

## Follow-ups for a session with live fetch
1. `browser_open https://erolls.tn.gov.in/asd/` → enumerate district/AC dropdowns and any per-part links the page exposes.
2. `browser_open https://erolls.tn.gov.in/rollpdf/FINALROLL_EN_06012025.aspx` → extract part-PDF URL pattern (e.g. AC + part → `.../A<nnn>P<ppp>.pdf` or query-string) — this unlocks enumeration of ~68k part files.
3. Verify `https://erolls.tn.gov.in/Rollpdf/SIR_2002.aspx` and `.../SIR_2005.aspx` live (case of `/Rollpdf/` vs `/rollpdf/`).
4. Check whether a `DRAFTROLL_EN_19122025.aspx` index exists (via a listing directory page or CEO what's-new, NOT by guessing the URL blind).
