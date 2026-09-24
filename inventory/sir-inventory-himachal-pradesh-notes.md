# SIR-WATCH Inventory Notes — Himachal Pradesh (HP, ECI state code S08)

**Worker session:** 2026-09-24 ~18:12–18:25 IST · **Rows produced: 0** (zero directly observed per-file roll PDF links)
**Districts/ACs/parts enumerated: 0** (no per-file rows)

## 1. Actual CEO domain used
- **ceohimachal.hp.gov.in** — the live CEO Himachal Pradesh website (NIC S3WaaS platform). Observed via search results showing its content (training presentations served through `ceohimachal.hp.gov.in/CommonControls/CMSFileView?qs=...`).
- `https://ceohimachal.nic.in/` (task hint) **could not be fetched this session** — the fetch tool returned a service-level error, so no reachability verdict is possible from this turn; no first-hand page text was obtained from either domain. All CEO-site structure below comes from indexed third-party descriptions of the site and is marked as such.
- Legacy mirror also referenced by third parties: `https://himachal.nic.in/index.php?lang=1&dpt_id=6` (old NIC page for the Election Department, pre-S3WaaS).

## 2. Click path (reconstructed from third-party descriptions, NOT first-hand this session)
1. CEO HP homepage (`ceohimachal.hp.gov.in`) → **"For Voters"** section
2. → link **"Voter List - Electoral Rolls [PDF Files]"** (label in English; Hindi label not observed)
3. → redirects OFF the CEO site to the ECI Voter Services portal: `https://voters.eci.gov.in/download-eroll?stateCode=S08` (S08 = Himachal Pradesh; URL observed in a search result from yogiyojana.co.in)
4. On the ECI portal: select **District** (dropdown) → **Assembly Constituency** (dropdown) → **Language** → **Roll Type (Final/Draft)** → solve **CAPTCHA** → per-polling-station **"Show PDF"** button to download the part roll.
- Older (pre-S3WaaS) path via `himachal.nic.in ... dpt_id=6`: homepage → **"Electoral Rolls [PDF Files]"** → select District / Assembly Constituency / polling station → CAPTCHA → **"Show PDF"** (described on tneaonline.in).

## 3. Organization (district → AC → part)
- Himachal Pradesh: **12 districts, 68 Assembly Constituencies** (confirmed via ANI/latestly coverage of the Oct 2023 Special Summary Revision).
- AC/district mapping (from an ECI gazette document surfaced in search, e.g. 68.Kinnaur (ST)–KINNAUR, 63.Shimla–SHIMLA, 44.Una–UNA, 37.Sujanpur–HAMIRPUR, 27.Sundernagar–MANDI, 54.Kasauli (SC)–SOLAN, 56.Nahan–SIRMAUR, 46.Jhanduta (SC)–BILASPUR, 41.Chintpurni (SC)–UNA, 10.Dehra–KANGRA) — useful for future work, but NO roll PDF URLs were tied to these rows this session, so they are not emitted as inventory rows.

## 4. URL naming pattern for direct PDFs
**None observed.** No district/AC/part-level direct PDF URL appeared in any fetched text or search result this session. The CEO site's current CMS serves documents via opaque encrypted query strings (`CommonControls/CMSFileView?qs=<opaque-token>` — seen only on training presentations, never on rolls), and all roll downloads are delegated to the ECI portal behind a CAPTCHA.

## 5. Vintages observed
- **No roll vintages (2025/2026 draft/final) were directly observed on the CEO site this session.** Third-party how-to pages refer to the 2024 LS-election rolls; an ANI report notes draft photo electoral rolls published **27 Oct 2023** for all 68 ACs (Special Summary Revision).
- A `dms.hp.gov.in` (HP Document Management System — **State Election Commission**, not CEO) order shows a draft electoral-roll programme with **draft publication 07.04.2026 and final publication on/before 27.04.2026** — but this concerns **ULB (municipal) rolls** (Nagar Panchayat Jhandutta, Swarghat, Sangrah, Bangana, Narkanda; MC Nadaun & Rohru), not ECI assembly rolls, so it is out of scope for CEO inventory and was not emitted as a row.
- **No SIR draft-roll / ASDD deletion-list page was observed for Himachal Pradesh** in any source fetched this session.

## 6. API-like endpoints (observed, not roll files — kept out of JSONL)
- `https://voters.eci.gov.in/download-eroll?stateCode=S08` — ECI central e-roll download entry point for HP (landed on via CEO link; PIB Release ID 2154489, 08 AUG 2025, confirms this is "the primary site/link for E-Roll download for all states"). CAPTCHA-gated per polling station; login/OTP not required for download, mobile+OTP only for e-EPIC.
- `https://electoralsearch.eci.gov.in` — name/EPIC search (CAPTCHA-gated), not a file download.
- Example request/response: **not obtainable** — the fetch tool was unavailable this session and no API contract was observable from search snippets. Do not infer endpoints.

## 7. ACCESS NOTES (blockers)
- **CAPTCHA gate (hard blocker):** per-polling-station CAPTCHA on `voters.eci.gov.in/download-eroll` is required before each PDF "Show PDF" download. Per standing rules, never bypassed → any row sourced here would be `scriptable: "N"` with blocker "CAPTCHA per PDF".
- **JS dropdown dependency:** district/AC/polling-station selection on the ECI portal requires interactive JS form flow; no static index page of roll PDFs was observed.
- **No bypass-capable bulk endpoint observed:** no unauthenticated direct-PDF tree (unlike Kerala in the national survey) was found for HP.
- **browser_open was unavailable this turn** (service error on the single attempt), so CEO-site pages could not be fetched first-hand; the survey rests on search-result text only. A follow-up pass with a working fetch tool (or parent's live browser) should re-check `ceohimachal.hp.gov.in` "For Voters → Electoral Rolls" for any direct links the index may have missed.

## 8. Method
- `browser_search` only (4 queries: CEO site identity; ECI download-eroll S08 path; ceohimachal.hp.gov.in roll PDFs; HP 2026 draft roll). `browser_open` failed once with a service error and was not retried this turn.
- Zero-fabrication: no URL was constructed or guessed. The only URLs recorded are verbatim from search results; none pointed at per-district/AC/part roll PDFs.
- Privacy: no elector names or EPIC numbers touched at any point.

## 9. Recommendation for parent
- HP roll PDFs currently appear **gated behind a per-PDF CAPTCHA on the ECI portal** — Scriptable=N. If the national inventory wants HP coverage, the feasible input is the portal entry URL above (documented here) plus a note that automated harvesting is blocked by the CAPTCHA; or a parent-side live-browser pass to catalogue district/AC dropdown contents (without solving CAPTCHAs).
- Re-verify `ceohimachal.hp.gov.in` first-hand when browser tools recover, to confirm no direct roll PDFs are published on the CEO site itself.
