# SIR-WATCH inventory notes — Ladakh (UT)

**Worker run:** 2026-09-24 ~18:12 IST
**Actual domain used:** `https://ceo.ladakh.gov.in/` — verified genuine: official `.gov.in` domain, cited by name in Administration of UT Ladakh press releases (ladakh.gov.in, 06-11-2024 and 04-12-2024) as the CEO Ladakh website where draft rolls are uploaded. The task's candidate `https://ceoladakh.nic.in/` **does not resolve** via the fetch service (fetch failure, not attempted further) and appears defunct; do not use.

## Click path
1. Web search "CEO Ladakh electoral roll" → official CEO result at `https://ceo.ladakh.gov.in/` (title: "Chief Election Officer, Ladakh").
2. Fetched homepage text (text-only fetch; navigation menu links were NOT exposed in the fetched text — no outlinks rendered). Homepage body states services offered include "e-Filing, **download Electoral Rolls**, Voter Name Search and Know your BLO", but the target URL of the "download Electoral Rolls" service was **not observable** from the fetched text (no href exposed). Per the pre-existing CEO-site survey (ceo-roll-survey.md), the ECI central portal `voters.eci.gov.in/download-eroll` is CAPTCHA-gated for all states tested — this is the near-certain target, but it was not directly confirmed for Ladakh and is recorded as such.
3. Supplementary web searches for indexed roll PDFs on the CEO domain and on district sites (leh.nic.in, kargil.nic.in) returned **zero roll part-PDFs** — only election-procedure documents (see below).

## Organization
- Ladakh has **no Legislative Assembly of its own** — the roll is a single **Parliamentary Constituency** roll.
- PC numbering: 2021 ERO Form 5 (observed PDF) uses **"4-Ladakh Parliamentary Constituency"** (ERMS numbering); the ECI ERO-designation notification dated 12-05-2026 (Ladakh Gazette SG-LD-E-18052026-1736) renumbers it to **"1-Ladakh Parliamentary Constituency"**. Record the numbering as observed per document vintage.
- Districts: **Leh, Kargil**. Parts: ~**577** (ECI SSR-2025 coverage report via ladakh.gov.in states 577 BLOs appointed — one BLO per part; SSR 2025 final roll: 1,90,735 electors, zero appeals).
- SSR 2025 timeline (ladakh.gov.in press releases): draft roll published 29-10-2024 (qualifying date 01-01-2025), claims/objections to 28-11-2024, final roll published 06-01-2025.

## URL pattern
- CEO site is a NIC **WaaS** site; uploads served from CDN bucket `https://cdn.s3waas.gov.in/s3291597a100aadd814d197af4f4bab3a7/uploads/<YYYY>/<MM>/<filename>.pdf`.
- Observed roll-*adjacent* documents on this bucket (NOT roll part-PDFs; file URL + metadata only, no elector data):
  - `https://cdn.s3waas.gov.in/s3291597a100aadd814d197af4f4bab3a7/uploads/2021/11/2021110156.pdf` — Form 5, **Notice of Publication of Electoral Roll in Draft** for "4-Ladakh Parliamentary Constituency" (ERO: Addl. Dy. Commissioner, Leh), SSR w.r.t. 01-01-2022, notice no. Elec-II(SR)2019-20(703), dated 01-11-2021.
  - `https://cdn.s3waas.gov.in/s3291597a100aadd814d197af4f4bab3a7/uploads/2022/12/2022121612.pdf` — Form 9 list of claims & objections (SSR 2022), dated 16-12-2022 (part numbers visible: 180, 193, 370, 388, 553 of 4-Ladakh PC).
  - `https://cdn.s3waas.gov.in/s3291597a100aadd814d197af4f4bab3a7/uploads/2025/04/2025040132-1.pdf` — Form 9 claims list, March 2025.
  - `https://cdn.s3waas.gov.in/s3291597a100aadd814d197af4f4bab3a7/uploads/2024/03/2024032923.pdf` — Form 12D absentee-voter notification (RO 1-Ladakh PC), not a roll.
  - `https://cdn.s3waas.gov.in/s3291597a100aadd814d197af4f4bab3a7/uploads/2025/11/17628619234026.pdf` — DEO Leh circular on Voter Awareness Forums / SIR enumeration-form guidelines, Nov 2025 (SIR pre-revision phase).
- None of these is a Draft Roll / Final Roll / SIR Draft Roll / Deletion-ASDD list / Supplement file, so **zero inventory rows** were written (the Form 9 lists are claims/objections, not roll-type files under the inventory schema).

## Vintages
- SSR 2022 draft-roll publication notice: 01-11-2021 (Form 5).
- SSR 2022 claims list: 16-12-2022 (Form 9).
- Form 9 claims list: March 2025.
- SSR 2025: draft 29-10-2024, final 06-01-2025 (per UT press releases; PDFs themselves not observed on the CEO site).
- SIR 2026: Ladakh entered the **preparatory phase** (ECI letter 19-02-2026; Earth News Leh report 21-02-2026: formal revision to commence April 2026). As of this run, **no SIR draft roll or ASDD (deletion) list for Ladakh has been observed** anywhere; ECI's indexed ASDD PDFs (`voters.eci.gov.in/eroll/asd/2026/s15/...`) currently cover other states only.

## API endpoints
- No Ladakh-specific roll or ASDD API endpoint was directly observed.
- Observed patterns from other states (documented in ceo-roll-survey.md, unverified for Ladakh): `https://voters.eci.gov.in/download-eroll?stateCode=<XX>` (CAPTCHA-gated per download) and direct ASDD PDFs at `https://voters.eci.gov.in/eroll/asd/2026/s<XX>/<AC>/uncollectable_elector_report_ac<AC>_part<NNN>_ENG.pdf` (no gate observed for the Meghalaya s15 examples). Ladakh's ECI state code was **not verified** and no Ladakh URL was constructed from these patterns (zero fabrication rule).

## ACCESS NOTES (blockers)
- CEO homepage text fetch exposed no navigation hrefs — the "download Electoral Rolls" service link target is unobservable via text fetch; a live browser session would be needed to confirm it (likely the CAPTCHA-gated ECI portal).
- Full roll part-PDFs (~577 parts for the single PC) are served, per ECI standard practice, through the ECI central portal which is **CAPTCHA-gated per download** — treated as Scriptable=N, gate not bypassed or attempted.
- `ceoladakh.nic.in` (task candidate domain) failed to load — defunct or blocking; genuine domain is `ceo.ladakh.gov.in`.
- No roll/ASDD/Supplement PDFs are indexed in web search for the CEO domain; only procedural documents (notices, Form 9 lists, circulars) are publicly indexed.

## Method
Public web search (browser_search) + text fetches (browser_open) of the CEO homepage and search-result pages only. No forms submitted, no CAPTCHA/logins touched, no bulk downloads. All URLs in these notes were copied verbatim from search-result "Full URLs" listings or the fetched homepage.

## Exact counts
- **Inventory rows written: 0** (no roll Draft/Final/SIR/Deletion-ASDD/Supplement PDF directly observed).
- Districts covered: 0 | ACs covered: 0 | parts covered: 0.
- Gates encountered: 1 (ECI central roll-download portal, CAPTCHA per PDF — not bypassed; status carried over from the 2026-09-24 CEO survey, not re-verified live for Ladakh).
- Observed roll-adjacent CEO-site documents (notices/claims lists): 5 (URLs above, in notes only).
