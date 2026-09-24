# SIR Inventory — Chhattisgarh

**State:** Chhattisgarh (ECI state code S26)
**Official CEO domain used:** https://ceochhattisgarh.nic.in/ (confirmed as the official site; the CEO's own SIR press note cites https://ceochhattisgarh.nic.in/ as the site where the draft roll is displayed. Note: election.cg.gov.in/voterlist/ was the legacy 2023 voterlist domain per third-party records, but the current official CEO portal is ceochhattisgarh.nic.in.)
**Rows in inventory JSONL:** 0 — no electoral roll PDF link could be directly observed.
**Date of survey:** 2026-09-24

## Click path (reported, not directly fetchable by me)

The browser service could not fetch ceochhattisgarh.nic.in (connection failure, twice — terminal for this session), so the click path below is reconstructed from three independent third-party guides plus the CEO's own SIR press note (all cited in method):

1. Open https://ceochhattisgarh.nic.in/
2. Homepage main-links section → link for the **final published electoral roll of SIR 2026** (third-party guides describe it as dated 21 February 2026; the CEO press note says the draft roll was published 23 December 2025 and displayed on this site)
3. That link leaves the CEO site and opens the ECI voter services portal electoral-roll download page: `https://voters.eci.gov.in/download-eroll?StateCode=S26`
4. Select State = Chhattisgarh → District (ज़िला) dropdown → Assembly Constituency (विधान सभा) dropdown → roll type (e.g. "SIR Final Roll 2026" / Final Roll 2026 / Supplement) → language (Hindi/English) → list of parts / polling stations
5. Select part number(s) → **enter CAPTCHA** → "Download Selected PDF's" button → per-part PDF downloads

One guide (newsd.in) additionally claims selecting the constituency opened a Google Drive folder of PDFs for the draft roll. This is a third-party claim and is **not verified** — no Drive URL was published in the observed text, so no row is recorded for it.

## URL naming pattern for rolls

No directly observable roll PDF URLs. The CEO site does not appear to host roll PDFs directly; roll PDFs are generated/served per-part through the ECI central portal behind a CAPTCHA.

## Directly observed downloadable files on the CEO domain (supporting docs, NOT rolls — excluded from inventory rows)

- `https://www.ceochhattisgarh.nic.in/assets/pdf files/PSList2026.pdf` — Polling Station List, Chhattisgarh (columns: DISTRICT_CD, ASMBLY_NO, PART_NUMBER, PART_NAME, PART_NAME_L1, category). State code format observed: `S2678` district prefix for Mohla-Manpur-Ambagarh Chowki district. Metadata scaffold only; not a roll.
- `https://ceochhattisgarh.nic.in/assets/pdf files/SIRDraftpressnote_en.pdf` — SIR key-findings press release (23.12.2025): draft roll published 23.12.2025; final roll date per guides 21.02.2026; SIR removed ~24.99 lakh names (pre-draft count 2,12,30,737; final roll ~1.87 crore).
- `https://ceochhattisgarh.nic.in/assets/pdf for website/vidhansabha map/51-raipurnagarsouth.pdf` — assembly map (51-Raipur Nagar South). Naming suggests per-AC maps exist: `<ac_number>-<ac_slug>.pdf` under `assets/pdf for website/vidhansabha map/` (UNVERIFIED — only this one URL seen).
- BLA agent lists, e.g. `https://ceochhattisgarh.nic.in/assets/pdf%20for%20website/BLA%20List/AC06-BLA%20Balrampur.pdf` and `.../BLA%20List/AC09-BLA.pdf`
- Index cards, BLO patrika, election result index cards (old, 2014).

## Vintages

- SIR draft electoral roll published 23.12.2025 (per CEO press note), displayed on the CEO website
- SIR final electoral roll published ~21.02.2026 (per multiple guides), link on CEO homepage
- Chhattisgarh has 90 assembly constituencies, ~32–33 districts (recent district split noted: 33 districts in the press note)

## API-like endpoints

None discovered on the CEO site. The ECI central download portal (`voters.eci.gov.in/download-eroll?StateCode=S26`) is a JS-driven page with cascading dropdowns + CAPTCHA per download — not a scriptable API.

## ACCESS NOTES (blockers)

- **Primary blocker:** roll PDFs are not directly linked from the CEO site; they are served via the ECI voter services portal (`voters.eci.gov.in/download-eroll?StateCode=S26`) behind a **per-download CAPTCHA** and cascading JS dropdowns (state → district → AC → roll type → part). Not scriptable; never attempted.
- **CEO site itself was not fetchable** by the available text-fetch service in this session (2 failures), so no in-site roll links could be verified first-hand. Domain confirmed official via the CEO's own press release and ECI-adjacent pages.
- No deletion (ASDD/ASD) list links observed for Chhattisgarh.

## Method

browser_search (public web search) across 4 query angles; browser_open attempted twice on the CEO homepage (failed); one direct-PDF URL set discovered via search-indexed crawl of ceochhattisgarh.nic.in. All file URLs above were seen verbatim in search results. Zero rows written to the JSONL — no fabrication.
