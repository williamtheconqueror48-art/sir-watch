# Uttarakhand — Inventory Notes (SIR-WATCH)

- **State:** Uttarakhand
- **CEO domain used:** https://ceo.uk.gov.in/ — resolved and fetched fine on first try; no alternate domain needed.
- **Method / date:** browser_open fetches of the CEO homepage, the SIR 2026 hub page, and the Deleted Electors page, plus public web searches (2026-09-24). No live browser, no clicking, no form submission, no CAPTCHA attempt. Roll-download flows described below are reconstructed from multiple third-party how-to guides corroborating each other; they are marked where not directly observed.
- **Rows emitted:** 0 (zero file-level rows). Explanation below.

## Click path (as observed)

1. Homepage `https://ceo.uk.gov.in/` → **Latest Updates** section lists:
   - "SIR 2026. Click Here" → `https://ceo.uk.gov.in/sir-2026/`
   - "SIR Draft Roll-2026" (New)
   - "List of Absent, Shifted & Deceased (ASD) Electors" (New)
   - "Polling Station List 2026" (New)
   - plus Tender notice (non-roll)
2. `https://ceo.uk.gov.in/sir-2026/` (SIR 2026 hub) lists sub-sections:
   - List of Absent, Shifted & Deceased (ASD) Electors
   - SIR Draft Roll-2026
   - Polling Station List-2026
   - Announcement & Press Note / Meetings & Minutes / Media Coverage / Photos / Videos
   - DEOs Portal SIR 2026
   - District Wise 2003 VS 2025 Booth Table
3. Main menu **Electoral Roll** (per site sitemap `https://ceo.uk.gov.in/sitemap/`) contains:
   - Draft Roll 2026 · Polling Station List 2026 · Electoral Roll 2025 · Polling Station List 2024 ·
     BLO List · List of ASD 2023 · Electoral Roll (Before Draft-2024) · Electoral Roll Before 2018
4. **Deleted Electors** page: `https://ceo.uk.gov.in/deleted-electors-2/` — fetched body renders essentially
   empty (title + footer + "Last Updated: November 11, 2025"), consistent with a JS-driven district/AC
   search form that does not render as static text. No direct PDF links observed on it.
5. Press releases (non-roll but SIR-relevant): `https://ceo.uk.gov.in/document-category/press-release/` —
   includes "Press Note 2026-36 Draft Roll Uttarakhand" dated 14/07/2026 (announcement PDF, not voter data).

## Why zero file rows

- The fetched CEO pages expose **link labels but not file URLs**: the SIR hub's "SIR Draft Roll-2026" and
  "List of Absent, Shifted & Deceased (ASD) Electors" links render as plain text with no href visible to the
  text fetcher, so no file URL could be recorded without guessing.
- All actual roll PDFs on the CEO/ECI surface sit behind an **interactive cascade**: select state →
  district → assembly constituency → language (Hindi/English) → roll type (SIR Draft 2026 / Final Roll /
  General Election Roll) → **enter CAPTCHA** → "Download Selected PDF's". This is a hard Scriptable=N gate;
  no static per-part PDF URL is published on the site pages.
- The 2003 pre-SIR baseline host `https://election.uk.gov.in/roll2003_/` (cited in a third-party guide as
  having per-booth "View PDF Document" / "Download PDF" links) **failed to fetch** via the text browser, so
  its links could not be directly observed or verified. Third-party archive index
  (`github.com/in-rolls/electoral_rolls`, uttarakhand_archives/readme.md) lists legacy index URLs such as
  `http://election.uk.gov.in/pdf_roll/01012007/Uttranchal_pdf_page.htm` … up to 2016, but these are
  third-party citations, not CEO-site observations, and were not verified live — **not emitted as rows**.
- No Uttarakhand DEO/district-hosted ASD/deletion-list PDFs were found via search (unlike TN's
  kancheepuram.nic.in pattern for other states).

## Vintages / roll types known (from third-party guides quoting the site's roll selector — corroborated, not directly observed)

- 2026: **SIR DraftRoll – 2026** (draft roll published 14 July 2026; 71,33,785 voters; final roll moved from
  15 Sep 2026 to **3 Oct 2026**)
- 2025: Supplement-4 2025, Draft Roll – 2025, Final Roll – 2025
- 2024: General Election Roll 2024
- Pre-SIR baseline: 2003 electoral roll (ECI's SIR notification lists Uttarakhand's last intensive revision as
  01.01.2003)

## State structure (for the eventual backend)

- 70 Assembly Constituencies across 13 districts. Booth counts cited in press: ~11,733–12,543 polling
  stations/parts (press figures, not CEO-site counts).
- ASD scale (third-party Sabar Institute analysis, NOT from CEO site): ~807,410 ASD electors.

## URL patterns observed

- `https://ceo.uk.gov.in/sir-2026/` — SIR hub (SIR 2026 / SIR Draft Roll-2026 / ASD list / Polling Station List-2026)
- `https://ceo.uk.gov.in/deleted-electors-2/` — Deleted Electors (JS search form; updated 11 Nov 2025)
- `https://ceo.uk.gov.in/document-category/press-release/` — press notes
- `https://ceo.uk.gov.in/sitemap/` — menu structure
- Older CEO permalink style `/pages/view/<id>-<slug>` (cited by third parties, e.g. the state electoral-rolls
  index page); not observed live this pass.

## API-like endpoints (for notes, NOT verified for Uttarakhand — do not use as rows)

Prior SIR-WATCH pipeline work (documented in the fetched `gouthamganeshm/karnataka_draft_roll_2026` README/HANDOFF)
established, for **Karnataka only**:

- `GET https://gateway-voters.eci.gov.in/api/v1/common/districts/S10` → 34 districts (open, but needs
  `origin`/`referer` headers or answers 401)
- `GET https://gateway-voters.eci.gov.in/api/v1/common/acs/<districtCd>` → that district's ACs
- ECI CDN draft-roll PDFs at predictable, unauthenticated paths, e.g. Karnataka (S10):
  `https://voters.eci.gov.in/eroll/2026/s10/sir-draftroll/<ac>/2026-EROLLGEN-S10-<ac>-SIR-DraftRoll-Revision1-KAN-<part>-WI.pdf`
  (byte-identical to portal-downloaded copies; CAPTCHA on the portal guards only the path-string lookup, not the file).

Uttarakhand's ECI state code was **not verified** in this pass, so the analogous URL was deliberately NOT
constructed or emitted. Verifying the code (via the districts endpoint with proper headers from an
eligible session) is the recommended next step before any bulk work — and any bulk fetching must stay within
the no-CAPTCHA-bypass rule.

## ACCESS NOTES (blockers)

1. Roll PDF download: **CAPTCHA gate** after district→AC→language→roll-type dropdown cascade. Scriptable=N.
   Never attempted to bypass.
2. Deleted Electors page: renders empty in text fetch — JS-driven search form; no direct links. Scriptable=N.
3. SIR Draft Roll-2026 / ASD list sub-pages: link targets not exposed in fetched text; likely the same
   gated cascade or DEO portals. Not verified.
4. `election.uk.gov.in/roll2003_/` (2003 baseline): fetch failed; per-booth direct-PDF structure reported by
   third parties but unverified. Treat as unconfirmed until a live check from an eligible session.
5. No login/OTP walls encountered on the static CEO pages themselves.

## Row count

- **JSONL rows: 0** — no per-file PDF/download URL was directly observable on the CEO site this pass.
- Districts/ACs/parts catalogued at file level: **0**.
- Gates documented: CAPTCHA-gated roll download flow; JS-driven Deleted Electors search; unresolvable
  ASD/Draft-Roll sub-page targets.
