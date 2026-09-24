# Maharashtra inventory notes — SIR-WATCH

Date: 2026-09-24

## Method
- This session could not fetch any page of ceoelection.maharashtra.gov.in directly: `browser_open`
  failed on every attempt (tool-level failure, terminal for this session). No page text was read from
  the CEO site, no dropdowns navigated, no CAPTCHA encountered or touched. No curl/exec reproduction
  was attempted.
- Evidence is restricted to **public web-search results** (browser_search): URLs observed verbatim in
  the search tool's "Full URLs for search results" output, plus the indexed page text snippets of those
  pages. Zero URLs were guessed, expanded, or reconstructed.
- Three searches were run: (1) searchlist/electoral-roll section; (2) ConstituencyRolls Teachers PDFs;
  (3) SIR 2026 draft roll / ASDDO availability on the CEO domain.

## Row count
- **17 rows** written to [sir-inventory-maharashtra.jsonl](sir-inventory-maharashtra.jsonl):
  - 5 × Draft Roll, MLC Graduates' constituency, Nagpur division (Bhandara parts 151, 155; Nagpur parts 13, 15, 44)
  - 6 × Draft Roll, MLC Teachers' constituency, Pune division (Satara parts 178, 196, 213; Pune part 100; Solapur part 133; Sangli part 224)
  - 6 × Final Roll, MLC Graduates' constituency (Aurangabad division: Hingoli part 327, Dharashiv part 583, Nanded part 413; Nagpur division: Nagpur parts 42, 112; Pune division: Pune part 72)
- Districts covered: Bhandara, Nagpur, Satara, Pune, Solapur, Sangli, Hingoli, Dharashiv, Nanded (9 districts).
- **Assembly AC numbers: none.** These are Legislative Council (MLC) division-level rolls, not assembly
  rolls, so AC numbers do not apply. Zero Assembly-level roll PDF URLs were directly observed.
- **Zero SIR 2026 Assembly draft-roll PDFs and zero ASDDO/deletion-list PDFs were observed.** The
  /searchlist/ section's PDF links could not be verified because page fetches were blocked this session.

## Click path
- UNVERIFIED. The reported path ("Home > Search Your Name / Electoral Roll > Select District >
  Select AC > Polling Station List") could not be confirmed: the CEO site and the /searchlist/
  page could not be fetched in this session. Treat the click path as unobserved.

## URL patterns observed
Draft MLC rolls:
`https://ceoelection.maharashtra.gov.in/ConstituencyRolls/{Division}/{District}/{Graduates|Teachers}/English/PART{NNN}_EN.pdf`
Final MLC rolls:
`https://ceoelection.maharashtra.gov.in/ConstituencyRollsFinal/{Division}/{District}/{Graduates|Teachers}/English/PART{NNN}_EN.pdf`
- Division names seen: Nagpur, Pune, Aurangabad. District segment uses current official names
  (Dharashiv, not Osmanabad). Only English variants observed (`_EN`); Marathi (`_MR`) variants were
  not seen but are not ruled out. Filenames are zero-padded-free (`PART155_EN.pdf`).

## Roll vintages found (page text of the PDFs themselves)
- MLC Draft Electoral Rolls 2026: qualifying date 01-11-2025, draft publication date 03-12-2025
  ("Voter list prepared till 06-11-2025 as per received application").
- MLC Final Voter Lists 2026: publication date 12-01-2026 ("Electoral Roll prepared till 18-12-2025
  as per received claims and objections").
- Language observed: English. PDFs are text-searchable (search engine extracted full elector text
  from them); photo column mostly "No Photo".

## SIR 2026 Assembly rolls — confirmed published, NOT link-observed
CEO Maharashtra press note (PDF, observed verbatim):
`https://ceoelection.maharashtra.gov.in/Downloads/PDF/Notification/Press%20Note%20English_31.08.2026%20Draft%20Roll.pdf`
Key facts stated in it:
- SIR 2026 Draft Electoral Rolls of **all 288 Assembly Constituencies** were published on **31.08.2026**
  and are available on voters.eci.gov.in, the CEO website (ceoelection.maharashtra.gov.in/ceo/), and
  the DEO websites.
- **ASDDO lists** (Absent / Shifted / Dead / Duplicate / Other — electors excluded from the draft) were
  also made available on the same websites.
- Pre-SIR Maharashtra total: 9,78,54,049 electors; 7,71,65,562 (78.86%) included in the draft;
  **2,06,88,487 (21.14%) not included** (enumeration forms not collected).
- This press note is context metadata, not an inventory row. The actual draft-roll and ASDDO PDF URLs
  on the CEO domain were **not** surfaced by any search — they likely sit behind the
  /searchlist/ (or /ceo/) navigation, whose gate status remains unverified.

## API-like endpoints
- None observed. The observed PDFs sit in a static-looking file tree; no JSON/query-string download
  endpoints, numeric-ID patterns, or API responses surfaced in search results.

## Access notes
- Blocker this session: page-fetch tool (browser_open) failed for all ceoelection.maharashtra.gov.in
  pages, so the /searchlist/ district → AC → polling-station flow could not be exercised at all.
  Gate status of the Assembly roll section (CAPTCHA vs open) remains **unverified** — the prior survey's
  "likely CAPTCHA via ECI portal" note is still unconfirmed.
- No gate is evident on the 17 observed MLC PDF URLs: they are plain static paths, fully indexed with
  text extraction by the search engine, suggesting plain-GET availability. Scriptable=Y reflects this,
  BUT a live HTTP 200 could not be confirmed this session — flag for a live check on the next pass.
- Privacy: only file URLs and roll metadata were recorded. No elector names or EPIC numbers were
  included in the inventory files (search snippets exposed them; they were deliberately excluded).
- Hindi/Marathi labels: the observed MLC PDFs are English-only; no Marathi/Hindi filenames or labels
  were observed to preserve.

## Follow-ups for a future pass (needs live page access)
1. Fetch https://ceoelection.maharashtra.gov.in/searchlist/ and /ceo/ to find the Assembly
   SIR draft-roll and ASDDO links; record whether CAPTCHA/login gates them.
2. Live-verify a sample of the 17 URLs (plain GET, 200, application/pdf).
3. Probe for Marathi variants (e.g. `PART155_MR.pdf`) — do NOT guess; only record if observed.
4. Check for Teachers' Final rolls and for other divisions (Mumbai, Nashik, Konkan) — not observed this pass.
