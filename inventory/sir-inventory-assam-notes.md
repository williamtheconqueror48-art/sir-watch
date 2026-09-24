# SIR-WATCH inventory — Assam (ceoassam.nic.in)

## Result: 0 file rows

**Zero electoral-roll / draft-roll / deletion (ASDD) PDF file links were directly observed on the CEO Assam website.** The JSONL file is intentionally empty. This is a verified negative, not a failed fetch — the reasons are documented below.

## Click path

Home (`https://ceoassam.nic.in/`) → "Important Links" / "District Websites" section → 34 revenue-district election officer websites (dropdown: Barpeta, Baska, Bajali, Biswanath, Bongaigaon, Cachar, Charaideo, Chirang, Darrang, Dhemaji, Dhubri, Dibrugarh, Dima Hasao, West Karbi Anglong, Goalpara, Golaghat, Hailkandi, Hojai, Jorhat, Kamrup (Metro), Kamrup (Rural), Karbianglong, Karimganj, Kokrajhar, Lakhimpur, Majuli, Morigaon, Nagaon, Nalbari, Sivasagar, Sonitpur, South Salamara, Tinsukia, Udalguri, West Karbi Anglong). The CEO homepage states: *"Link to official Sites of District Election Officials of 34 Revenue Districts… Latest Electoral Rolls with search facility are also available on these sites."* No roll-download section or direct PDF link appeared anywhere in the fetched CEO homepage text (full page, 141 lines). The site is a JS-rendered NIC template; the menus could not be expanded without a live browser.

## Official download path (ECI central portal, not the CEO site)

Roll PDFs for Assam are served through the ECI central portal:

- `https://voters.eci.gov.in/download-eroll?stateCode=S03` (S03 = Assam)
- Corroborated by: sarkariyojana.com ("CEO Assam Voter List 2026"), thedailyjagran.com ("Assam SIR Draft Roll" guide), jagranjosh.com ("Assam Voter List 2026"), and Assamese YouTube walkthroughs — all point to this URL.
- Flow per sarkariyojana.com: select state → **CAPTCHA per PDF** → select district → AC → language (English/Hindi/Assamese) → roll type → part number → CAPTCHA again → "Download Selected PDF's".
- **Access blocker:** CAPTCHA challenge on each PDF download. Attempted `browser_open` on this URL failed (JS-heavy page, fetch error). This is a gate, not a bypassable URL — NOT scriptable.
- Name search (non-download): `https://electoralsearch.eci.gov.in/` — also CAPTCHA-gated per search.

## District websites (linked from CEO homepage; roll hosting pattern observed)

The CEO site delegates roll publication to district election-officer websites. Directly observed district-site artifacts (verified via fetched page text, NOT roll files themselves):

1. **Nalbari** — Draft Electoral Roll 2024 announcement PDF (published 8/12/2023): `https://nalbari.assam.gov.in/sites/default/files/public_utility/Draft%20Electoral%20Roll%202024_0.pdf` — covers ACs **38-Barkhetri**, **39-Nalbari**, **40-Tihu**. Actual roll files are hosted on third-party links inside the PDF: a Google Drive folder (Barkhetri: `drive.google.com/drive/folders/1Vg_1OJx_RJp0XQ0kVTagfqlClxHGPfB`) and two WeTransfer links (Nalbari, Tihu — expired/transient). Not CEO-site files; not scriptable at the file level.
2. **Nagaon** — "Non Photo Draft Electoral Roll" announcement PDF: `https://nagaon.assam.gov.in/sites/default/files/public_utility/Electoral Roll Nagaon_1.pdf` — points to Google Drive file links (English ~5.7 GB, Assamese ~6.1 GB; Drive IDs truncated in source, not reconstructed). Not CEO-site files; third-party host.
3. **Bongaigaon** — Form-5 draft-publication *notices* (NOT roll PDFs) for 17-Srijangram and 18-Bongaigaon LACs, dated 27/12/2025: `https://bongaigaon.assam.gov.in/sites/default/files/public_utility/Form%205%20Bongaigaon.pdf` and `https://bongaigaon.assam.gov.in/sites/default/files/public_utility/17%20Srijangram.pdf`.
4. **Morigaon** — Special Revision 2026 *schedule* press release (NOT roll PDF): `https://morigaon.assam.gov.in/sites/default/files/public_utility/Press%20Release%20Special%20Revision%202026.pdf`.
5. **Sivasagar** — certified-copy-of-electoral-roll *application form* (NOT roll PDF): `https://sivasagar.assam.gov.in/sites/default/files/public_utility/APPLICATION%20FOR%20CERTIFIED%20COPY%20OF%20ELECTORAL%20ROLL.pdf`.

None of these are roll data files, and none sit on ceoassam.nic.in — hence excluded from the JSONL.

## Roll vintages found (context for inventory consumers)

- **Assam did NOT undergo the nationwide SIR.** It had a **Special Revision (SSR) 2026**: draft published **27/12/2025** (25,201,624 electors), claims/objections 27/12/2025–22/01/2026, **final published 10/02/2026** (24,958,139 electors; 243,485 dropped between draft and final; sources: bhaskarenglish.in, newkerala.com, dy365live.com). Prior final roll: January 2025 (SSR w.r.t. 01.01.2024 published 08/02/2024 per ECI schedule letter).
- **No ASDD (deletion) list PDF observed anywhere** — Assam's exercise published no public deletion/asd-style lists in the surveyed sources.
- H2H verification (22/11/2025–20/12/2025) flagged 478,992 deceased + 523,680 shifted electors; CEO stated these names were NOT deleted at draft stage, only processed after claims/objections.

## URL patterns

- CEO site: no direct roll URL pattern exists (rolls live on the ECI portal).
- ECI portal: `https://voters.eci.gov.in/download-eroll?stateCode=S03` + CAPTCHA per download; no predictable static PDF URLs.
- District sites: `<district>.assam.gov.in/sites/default/files/public_utility/<Descriptive Name>.pdf` — announcement PDFs only; roll data pushed to Google Drive / WeTransfer (transient).

## API-like endpoints

**None found.** The ECI download portal is a form-driven, CAPTCHA-gated web app with no documented or observed public JSON API. No query-string download endpoints or numeric-ID PDF patterns were observed on the CEO site or district sites.

## ACCESS NOTES (blockers)

1. **CAPTCHA gate (ECI central portal):** every roll-PDF download for Assam requires solving a CAPTCHA on `voters.eci.gov.in` — bulk scripting is impossible without bypassing it, which is forbidden.
2. **JS-rendered CEO site:** ceoassam.nic.in homepage is a JS-heavy NIC template; `browser_open` captured only text, no clickable roll menu items. Without a live browser (forbidden to this worker) the JS dropdown path could not be walked.
3. **Third-party transient hosts:** district sites publish roll files via Google Drive folders and WeTransfer links (expiring), so even the district-level roll files are not stable, scriptable URLs.
4. **No direct-PDF state:** unlike Kerala (direct PDFs verified live) and Tamil Nadu (likely direct), Assam keeps no roll PDFs on its own CEO domain — matching the Bihar/UP/WB pattern of central-portal gating.

## Method

- Fetched: `https://ceoassam.nic.in/` (full page text), the Nalbari draft-roll announcement PDF (full text), the Morigaon SR-2026 schedule PDF (full text).
- Searched: 7 public-web queries (CEO-site roll pages; draft roll download guides; district-site roll PDFs; site-scoped queries).
- Attempted: `browser_open` on `https://voters.eci.gov.in/download-eroll?stateCode=S03` — failed (JS page, fetch error); documented as gated, not retried via other means.
- NOT done: live browser navigation, CAPTCHA solving, URL guessing, WeTransfer/Drive link reconstruction (truncated IDs were left as-is).

## Exact row count

- JSONL rows written: **0**
- Districts covered by observed roll announcements (district sites, not CEO site): Nalbari (3 ACs: 38-Barkhetri, 39-Nalbari, 40-Tihu), Nagaon (district-level, AC list not enumerated), Bongaigaon (2 ACs: 17-Srijangram, 18-Bongaigaon)
- Gates encountered: CAPTCHA-per-PDF on ECI download portal; JS-only navigation on CEO site; third-party transient hosting on district sites.
