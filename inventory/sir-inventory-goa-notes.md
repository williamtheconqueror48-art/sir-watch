# SIR-WATCH Inventory Notes — Goa (2026-09-24)

**Domain used:** `ceogoa.nic.in` (the hint URL resolved; official CEO Goa site).

## Method
- Fetched `https://ceogoa.nic.in/` and `https://ceogoa.nic.in/appln/UIL/SIRDraftRoll.aspx` (the "Draft Electoral Roll 2026" page linked from press coverage) as plain text — no live browser, no clicking, no forms.
- Both pages are ASP.NET pages whose roll content renders via client-side JS dropdowns; the text extractor only returns the page footer, so no per-part PDF links are visible in fetched text.
- Discovered direct file URLs via public web search of the CEO site's indexed documents. **Every row in the JSONL is a URL returned verbatim by search results; no URL was guessed or constructed.**

## Click path (observed)
1. `ceogoa.nic.in` home → Electoral Rolls section (Services menu: "View Electoral Roll Details").
2. Press coverage of the SIR draft-roll publication (e.g. digitalgoa.com) points directly to the draft-roll page: `https://ceogoa.nic.in/appln/UIL/SIRDraftRoll.aspx`.
3. That page presents JS dropdowns (District → Assembly Constituency → Part); the part-level PDF link is generated only after interactive selection. **Not scriptable — cannot be enumerated without a live browser, and no interactive driving was attempted.**
4. The site's static directories are directly fetchable with a plain GET and are search-engine indexed (no CAPTCHA, no login seen on any of these URLs).

## URL patterns (directly observed, do not extrapolate)
- Service-voter rolls (AC-consolidated, one file per AC, no part split):
  `https://ceogoa.nic.in/PDF/EROLL/MOTHERROLL/{DRAFTROLL|FINALROLL}/2026/SVP/S05AC{NNN}SVRC.pdf`
  where `S05` = Goa state code, `{NNN}` = zero-padded 3-digit AC number, `SVP` = Service Voters Part, `SVRC` = service voter roll current.
- Part-wise elector counts (Gender Wise Count, one file per AC, lists every polling part):
  `https://ceogoa.nic.in/PDF/EROLL/VOTERCOUNT/2026/AC{NN}.pdf`
- AC-wise service-voter summary (statewide):
  `https://ceogoa.nic.in/PDF/EROLL/VOTERCOUNT/2026/SVC/ACWise2026.pdf`
- **Main-roll (non-service) part PDFs were NOT observed.** Their directory pattern under `/PDF/EROLL/MOTHERROLL/` could not be confirmed from any fetched text or search result. Do NOT assume e.g. `/MAIN/` or `/PART/` paths — unverified.

## Vintages (from file contents)
- Draft Roll 2026: published **16-12-2025** (Special Summary Revision 2026, qualifying date 01-01-2026). Draft-roll PDFs are headed "DRAFT ELECTORAL ROLL - 2026 ... Type of Revision : Special Summary Revision 2026". Note: although served from the `SIRDraftRoll.aspx` page, the document body labels the revision "Special Summary Revision 2026".
- Final Roll 2026: published **21-02-2026** ("AS ON PUBLICATION DATE : 21/02/2026" on the AC-wise service count sheet; final PDFs headed "Final Electoral Roll, 2026 ... Draft Roll of Special Summary Revision published on 16-12-2025 ... integrated with Additions, Deletions and Modifications").
- AC-name reference for all 40 ACs was observed in the AC-wise service-voter count sheet: 1 MANDREM, 2 PERNEM, 3 BICHOLIM, 4 TIVIM, 5 MAPUSA, 6 SIOLIM, 7 SALIGAO, 8 CALANGUTE, 9 PORVORIM, 10 ALDONA, 11 PANAJI, 12 TALEIGAO, 13 ST. CRUZ, 14 ST. ANDRE, 15 CUMBARJUA, 16 MAEM, 17 SANQUELIM, 18 PORIEM, 19 VALPOI, 20 PRIOL, 21 PONDA, 22 SIRODA, 23 MARCAIM, 24 MORMUGAO, 25 VASCO-DA-GAMA, 26 DABOLIM, 27 CORTALIM, 28 NUVEM, 29 CURTORIM, 30 FATORDA, 31 MARGAO, 32 BENAULIM, 33 NAVELIM, 34 CUNCOLIM, 35 VELIM, 36 QUEPEM, 37 CURCHOREM, 38 SANVORDEM, 39 SANGUEM, 40 CANACONA. Note: district labels per the CEO site's own grouping are North Goa = AC 1–24, South Goa = AC 25–40 (used in the inventory).

## API-like endpoints
- None observed. `SIRDraftRoll.aspx` is an ASP.NET WebForms page (postbacks, no query-string API). No JSON endpoints, no ID-pattern download URLs seen.

## ACCESS NOTES (blockers)
1. **JS dropdown gate on part-level main rolls.** `https://ceogoa.nic.in/appln/UIL/SIRDraftRoll.aspx` (and the E-Roll "View Electoral Roll Details" flow) require District → AC → Part selection via client-side JS dropdowns. Without a live browser the per-part PDF links cannot be observed; they were not guessed. This is the main gap: the bulk of the main-roll PDFs are ungated *files* but undiscoverable *links* from text-only access. A future live-browser pass could enumerate them.
2. **ASDD/deletion list not located as a file.** Press coverage (digitalgoa) states Goa's ASDD list was displayed "online at ceogoa.nic.in" — almost certainly via the same dropdown-gated roll page or at polling stations. No direct ASDD file URL was observed in search results or fetched pages. Not included as rows; no fabrication.
3. `Home.aspx` fetch failed once (transient tool error); root and `SIRDraftRoll.aspx` fetched fine. No rate limits, CAPTCHAs, or logins encountered on any direct file URL.
4. Related but out-of-scope documents observed (not roll lists, excluded from rows): SIR daily bulletins/press notes under `/PDF/SIR2026/` (e.g. `SIR_DB26.pdf`, `SIR_DB34.pdf`, `SIR_PN2.pdf`, `SIR_PN10.pdf`, `SIR_PNN9.pdf`, `SIR_PNN12.pdf`) — SIR stats press material, not deletion indexes; also the Last SIR (2002) roll search page at `ceogoa.in/SIR2002/SIR2002ERoll` (fetch failed; unverified).
5. All recorded PDFs are text-searchable (search engines extracted elector text); service-voter files name Defence/Armed Police/Foreign Service electors. Privacy rule for the project applies: these files contain elector names/EPIC-like "Buckle No." fields — inventory stores URLs + metadata only, no names.

## Exact counts
- **25 rows** in `sir-inventory-goa.jsonl`.
- 11× Draft Roll (Service Voters): AC 5, 14, 18, 22, 23, 24 (North Goa) + AC 26, 27, 30, 37, 40 (South Goa).
- 6× Final Roll (Service Voters): AC 6 (North Goa) + AC 26, 27, 31, 37, 40 (South Goa).
- 7× Voter Count Summary (Gender Wise Count): AC 13, 15, 19 (North Goa) + AC 25, 31, 33, 38 (South Goa).
- 1× statewide AC-wise Service Voter Count summary.
- Districts covered: 2/2 (North Goa, South Goa). ACs touched: 5, 6, 13, 14, 15, 18, 19, 22, 23, 24, 25, 26, 27, 30, 31, 33, 37, 38, 40 (19 of 40). Part-level rows: none (part numbers not observed).
- Gates: 1 (JS dropdown gate on part-level roll PDFs + ASDD display; scriptable=Y on all 25 recorded files).
