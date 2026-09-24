# Gujarat — CEO-site inventory notes (SIR-WATCH)

**Date:** 2026-09-24 · **Method:** public web search only (`browser_search`). A direct `browser_open` of `https://erms.gujarat.gov.in/ceogujarat/master/frmEPDFRoll.aspx` failed at the tool layer ("browser-service could not fetch the requested page"), and the session instruction was to continue without retrying it or reproducing it via curl/exec. So everything below is sourced from **search-result text and the verbatim full-URL mappings returned with the results** — no page body was read, no link was clicked, no form touched, no CAPTCHA encountered (none was ever presented to me).

## Click path (evidence-based, NOT my own navigation)
1. Gujarat's roll portal entry: **https://erms.gujarat.gov.in/ceogujarat/master/frmEPDFRoll.aspx** — listed verbatim as Gujarat's link in a civic "state-wise web links to download Vidhan Sabha booth level voter lists" guide (sarvodayasangam.com; third-party compilation, but the URL is the official CEO-Gujarat ERMS address). The main CEO site is `ceo.gujarat.gov.in` (multiple news sources route draft-roll traffic there).
2. One third-party download guide (low-quality spam mirror page, weak evidence) describes the flow on this portal as: **Select District → Select Assembly → enter CAPTCHA as shown → list of all polling stations shown → click "Show" in front of the polling station → voter list shown → download/print**. I could not confirm the CAPTCHA step live; it is recorded as *reported, not verified*.
3. For the **SIR 2026 draft roll**, one media walkthrough (thedailyjagran.com, third-party, unverified) describes a different flow on `ceo.gujarat.gov.in`: homepage → **'Electoral Rolls' section** → select revision year **2026** → district-wise list → **'Show'** next to district → select Assembly constituency → **booth-level PDF files "hosted on Google Drive"**. The Google Drive hosting claim is *unverified* — no drive URL was observed verbatim anywhere, so nothing is in the JSONL.
4. Alt path (prior survey, not re-observed this session): `voters.eci.gov.in/download-eroll?stateCode=S06` — CAPTCHA-gated.

## Observed URLs (in the JSONL, 1 row)
1. `https://erms.gujarat.gov.in/ceogujarat/master/frmEPDFRoll.aspx` — **E-Roll PDF portal entry/listing page** (ASP.NET WebForms; `frmEPDFRoll.aspx` = Electronic PDF Roll form). Recorded as a listing-page row with district/AC/part null. Per the third-party guide, part-level PDFs sit behind district/AC dropdowns and a CAPTCHA step — no individual part file link was observable in any search text.

**Zero part-level file rows** — no district/AC/part PDF link on any CEO-Gujarat domain was observed verbatim this session.

## Deliberately excluded (observed but not CEO-observable / not file rows)
- `http://ceogujarat.nic.in/site/download/FINAL_ROLL_2009.pdf` — seen ONLY on a lookalike archive mirror (`sup1a9wrlpyh5li9ro.vcbrealty.top/.../http://ceogujarat.nic.in/site/download/...`), not on a CEO domain; also a PC/AC elector-stats summary (2009), not part-wise roll PDFs. Excluded for provenance.
- `voterslist.in/gujarat/...` "Download" links (SIR draft ZIPs per AC, ~182 ACs listed) — third-party mirror, **non-CEO source**; per project rule (same as WB note in survey) third-party mirrors are not usable for provenance. Not in JSONL.
- The dailyjagran "PDFs hosted on Google Drive" claim — no actual drive URLs observed; unverified.

## API-like / aggregate endpoints
- **None observed for Gujarat.** No JSON/query-string download endpoint appeared in any search result.

## URL naming patterns (observed)
- Listing page: `erms.gujarat.gov.in/ceogujarat/master/frmEPDFRoll.aspx`. ERMS = "Electoral Roll Management System" — same backend family as Telangana's `ceotserms2.telangana.gov.in/ts_erolls/rolls.aspx` (pattern match, not verified same version).
- `.aspx` + `master/` prefix ⇒ ASP.NET WebForms; the page almost certainly requires server-side postback (`__VIEWSTATE`) for the district/AC dropdowns, so even without CAPTCHA it would not be a static GET-scrapable link list — inference from the URL shape, not confirmed live.
- Part-level PDF URL pattern: **not observed.**
- Legacy pattern (2009): `ceogujarat.nic.in/site/download/<FILE>.PDF` — seen only via mirror; dead/obsolete for current rolls.

## Vintages located (context, from news/ECI notices — files not yet inventoried)
- **SIR 2026 (second national round):** Draft Electoral Roll published **19.12.2025** (qualifying date 01.01.2026), on `ceo.gujarat.gov.in` and at polling stations; voter count **4.34 crore**; **~73 lakh names removed**. Lists of **absent / shifted / deceased / duplicate electors** displayed publicly and "made accessible online" with reasons for non-inclusion (ANI via latestly.com) — the ASDD-style deletion lists exist but their file URLs are not yet observed.
- Claims & objections: 19.12.2025 → 18.01.2026, **extended to 30.01.2026** (ECI order via Gujarat Govt Gazette 28.01.2026, archived on archive.org).
- **Final Roll: 17.02.2026** (per pune.news). Whether its file links are on `ceo.gujarat.gov.in` vs only via ECI portal: unconfirmed.
- Other vintages (roll-type labels from third-party mirror pages, **unverified**): "Bye-Election FinalRoll-REV3 2026", "Supplement-3 2026", "Supplement-2 2026", "SIR FinalRoll - 2026", "SIR DraftRoll - 2026", 2025 draft/final + supplements, "General Election 2024".
- Scale: 182 ACs, 33 districts → **~51,000 part PDFs** (estimate, per prior survey).
- Format: photo electoral rolls, **Gujarati + English** (ECI standard); no Gujarati label string observed verbatim on the portal pages in search text, so none reproduced per-row.

## ACCESS NOTES (blockers)
- **Page fetch unavailable this session** — `browser_open` on the erms entry page failed at the tool layer; no retry permitted. All `scriptable` = "N" because nothing was live-verified. This is a method limitation, not a site gate.
- **Reported CAPTCHA on the E-Roll flow** (third-party guide: district → AC → "enter CAPTCHA" → polling-station list). Never touched; recorded as unverified. If confirmed live, per-file downloads are gated.
- **JS/postback dropdowns** on `frmEPDFRoll.aspx` (inferred from .aspx form) — a script would need to drive the ASP.NET form; direct GET of a file list is unlikely.
- **ECI central portal** (`voters.eci.gov.in/download-eroll`) is CAPTCHA-gated per prior survey — not attempted.
- No login, OTP, or paywall was ever described or encountered for Gujarat's roll pages.

## Row counts
- **JSONL rows: 1** (portal listing page only; **zero file-level rows** — no district/AC/part PDF link observable without a live fetch).
- Districts covered as rows: 0 · ACs covered as rows: 0 · Parts covered as rows: 0.
- **Gates encountered:** 1 tool failure (browser fetch down this session — environmental); 1 reported-but-unverified site gate (CAPTCHA on E-Roll flow per third-party guide); 1 inferred structural barrier (ASP.NET postback form).

## Privacy
- File/portal URLs + metadata only. No elector names, no EPIC numbers, no roll contents were collected or reproduced.

## Follow-ups for a session with live fetch
1. `browser_open https://erms.gujarat.gov.in/ceogujarat/master/frmEPDFRoll.aspx` → confirm the district/AC dropdown flow and whether a CAPTCHA actually appears; capture the part-PDF URL pattern from the page's rendered links (likely ~51k files across 182 ACs).
2. Find the CEO site's SIR-2026 draft-roll page (homepage → 'Electoral Rolls' section) → capture the actual booth-level PDF file URLs and verify the "hosted on Google Drive" claim (thedailyjagran) — if drive links are the official host, record them with that provenance caveat.
3. Locate the absent/shifted/deceased/duplicate lists published Dec 2025 (the ASDD-equivalent deletion lists) — these are the highest-value SIR-WATCH rows for Gujarat.
4. Check for a Final Roll 17.02.2026 index page on `ceo.gujarat.gov.in`.
