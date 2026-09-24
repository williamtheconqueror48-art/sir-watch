# SIR-WATCH National Electoral-Roll File Inventory — Report

**Built:** 2026-09-24 · **Rows:** 381 · **States/UTs with files:** 24 of 36 · **Method:** 36 parallel state workers, official CEO sites + ECI portal only · **Zero fabrication:** every URL directly observed, none guessed · **No gates bypassed:** CAPTCHA/login/paywall files recorded as not scriptable, never touched.

**What this is:** a catalogue of *file URLs and metadata only* — electoral-roll PDFs, service-elector rolls, supplements, claims/objections lists, deletion/ASDD lists, plus honestly-typed supporting records (council rolls, statistics annexures, press notes, listing pages). No voter names. No EPIC numbers.

**What this is not:** not a complete national roll archive. Most states serve per-part rolls behind a per-PDF CAPTCHA; those files are documented as coverage gaps, not collected.

## Headline numbers

| Metric | Value |
|---|---|
| Total file rows | 381 |
| States/UTs with ≥1 file row | 24 |
| States/UTs with 0 file rows (gated/ungated-but-unobserved) | 12 |
| Rows live-verified (HTTP 2xx, bytes flowed) on 2026-09-24 | 167 |
| Rows directly observed but unreachable from this sandbox (host-level egress block) | 177 |
| Rows verification-blocked (ECI 406 on range-less GET) | 17 |
| Dead links found and downgraded (Meghalaya service-elector PDFs, genuine 404) | 11 |
| Scriptable=Y (final) | 361 |
| Scriptable=N (gated, listing, or dead) | 20 |

### Row types (record_type)

| Type | Rows | Meaning |
|---|---|---|
| main_roll | 118 | Assembly draft/final rolls, intensive-revision baselines |
| service_elector_roll | 118 | Service-elector (armed forces) rolls |
| supplement | 54 | Supplements, monthly pooling addition/deletion lists, SIR bulletins |
| statistics | 34 | Aggregate counts/annexures — **not name-level rolls** |
| claims_objections | 29 | Form 9/10/11/11A lists, electors-movement reports |
| council_roll | 17 | MLC Graduates/Teachers rolls — **not Assembly rolls** |
| listing_page | 8 | CEO/ECI listing pages, no file behind them |
| press_notice | 2 | SIR press notes — **not rolls** |
| instruction | 1 | SIR-2002 name-search how-to |

## Per-state results

| State/UT | Rows | Districts | ACs | Parts | Scriptable Y | Notes |
|---|---|---|---|---|---|---|
| Andaman & Nicobar | 32 | 2 (+6 unconfirmed) | 0 (PC roll, no ACs) | 29 | 32 | 2002 Final Roll part PDFs (pub 31.01.2002) + 3 service-voter PDFs. SIR 2026 draft/deletion lists: press says posted, zero direct URLs observed; ECI portal CAPTCHA-gated |
| Andhra Pradesh | 16 | 2 | 9 | 14 | 14 | SSR 2007 rolls in URL-patterned tree `ERolls/PDF/English/A{AC}/A{AC}{part}.PDF`; 1 aggregate-statistics file; current rolls CAPTCHA-gated (ECI portal + CEO verification code) |
| Arunachal Pradesh | 18 | — | 15 | 18 | 18 | 2006 Intensive Revision part PDFs, direct and text-searchable; current rolls on gated ECI portal |
| Assam | 0 | 0 | 0 | 0 | 0 | CEO delegates to CAPTCHA-gated ECI portal or transient district Drive/WeTransfer links — no stable CEO roll URLs observed |
| Bihar | 9 | 0 | 0 | 0 | 9 | Statewide statistical Format PDFs incl. deletion statistics — **not name-level rolls**; per-part rolls CAPTCHA-gated |
| Chandigarh | 3 | 1 | 1 | 0 | 0 | Polling-station listing pages + ECI downloader page (all webpage table, N); per-booth PDFs behind CAPTCHA |
| Chhattisgarh | 0 | 0 | 0 | 0 | 0 | CEO routes rolls to CAPTCHA-gated ECI portal |
| Dadra & Nagar Haveli and Daman & Diu | 15 | 2 | 0 | 12 | 15 | 2002 Final Roll part PDFs (pub 31.01.2002) + 2015 roll index + Form 9/11A supplements |
| Delhi | 18 | — | 14 | 18 | 18 | 2002 SIR Final Roll parts via opaque `validateUser_2002BK.aspx?id=` tokens; 2026 draft/ASDD links not exposed in fetched text |
| Goa | 25 | 2 | 19 | 0 | 25 | Draft/Final 2026 service-voter PDFs + voter-count summaries; main-roll part PDFs behind JS dropdowns (no CAPTCHA — live-browser pass could enumerate); ASDD list exists on site, no direct URL observed |
| Gujarat | 1 | 0 | 0 | 0 | 0 | Portal entry page only (ASP.NET WebForms); part PDFs behind JS/postback, CAPTCHA per third-party guide; draft-roll booth PDFs reportedly on Google Drive (unverified) |
| Haryana | 10 | 0 | 0 | 0 | 10 | Monthly 2025 addition-in-E-Roll supplement PDFs (10 months); SIR 2026 draft behind district→AC→part→CAPTCHA |
| Himachal Pradesh | 0 | 0 | 0 | 0 | 0 | CEO routes to ECI portal with per-PDF CAPTCHA |
| Jammu & Kashmir | 0 | 0 | 0 | 0 | 0 | ceo.jk.gov.in (new official site) unfetchable this session; old site exposes no hrefs; ECI CAPTCHA wall |
| Jharkhand | 0 | 0 | 0 | 0 | 0 | CAPTCHA per PDF |
| Karnataka | 9 | 1 | 9 | 0 | 9 | Draft/Final 2025 service-elector AC PDFs on ceo.karnataka.gov.in/uploads/; main rolls redirect to CAPTCHA-gated ECI portal |
| Kerala | 35 | 13 | 30 | 0 | 35 | Service-elector PDFs + SIR-2026 electors-movement reports + Form 9/11A claim lists + Form 10 objection lists + state aggregates; main rolls CAPTCHA-gated |
| Ladakh | 0 | 0 | 0 | 0 | 0 | Genuine site is ceo.ladakh.gov.in (hint domain defunct); no roll PDFs indexed; ECI portal CAPTCHA |
| Lakshadweep | 0 | 0 | 0 | 0 | 0 | Roll sections exist (island→Part 1–64, SIR Final 2026) but download buttons expose no hrefs to text fetch — needs live browser |
| Madhya Pradesh | 48 | 24 | 39 | 0 | 48 | Final Roll 2026 service-voter PDFs on new domain ceoelection.mp.gov.in (`PDF_Service_Voter/A<n>.pdf`) + parts summary (71,930 parts) + 8 SIR daily bulletins |
| Maharashtra | 17 | — | — | 0 | 17 | MLC Graduates/Teachers 2026 rolls — **not Assembly SIR rolls**; Assembly draft/ASDD reportedly published, no direct URLs observed |
| Manipur | 14 | 8 | 14 | 0 | 14 | Final Roll 2025 service-voter PDFs (`eroll_manipur/serviceElector/S14AC{NNN}SVRC.pdf`); /eroll app (SIR 2026 incl. draft 05.07.2026 + final 06.09.2026) is per-file CAPTCHA |
| Meghalaya | 23 | 5 | 19 | 12 | 12→(11 dead) | 2005 Intensive Revision part PDFs (live); 11 service-elector URLs returned genuine 404 → downgraded to N; SIR-2026 draft/ASDD hrefs not exposed |
| Mizoram | 15 | — | — | 0 | 15 | 12 monthly addition/deletion PDFs + 2 SIR press notes + 1 parts index; full part rolls CAPTCHA-gated |
| Nagaland | 11 | 6 | 11 | 0 | 11 | Draft Roll 2025 service-elector PDFs; main rolls CAPTCHA-gated; SIR draft 2026 link target unobserved |
| Odisha | 10 | 0 | 0 | 0 | 10 | Electoral-roll statistical analysis annexures — **not name-level rolls**; per-part rolls CAPTCHA-gated |
| Puducherry | 21 | 4 | 15 | 0 | 21 | Service-elector rolls: SIR Final 2026 (9), Final 2026 continuous updation (6), Draft/Final 2025 (6); 14 PDFs header-verified |
| Punjab | 0 | 0 | 0 | 0 | 0 | CEO site unfetchable this session; rolls behind CAPTCHA/JS; final SIR roll due 01.10.2026 (after inventory date) |
| Rajasthan | 0 | 0 | 0 | 0 | 0 | CAPTCHA-gated district→AC→part flow |
| Sikkim | 17 | 0 | 13 | 17 | 17 | 2002 pre-SIR baseline part PDFs on ECI SIR repository (`eci.gov.in/sir/f3/S21/data/OLDSIRROLL/`); 2026 draft/final behind ECI CAPTCHA |
| Tamil Nadu | 4 | 0 | 0 | 0 | 3 | Index/landing pages only (incl. `erolls.tn.gov.in/asd/`, 2025 final-roll index, 2002/2005 archive indices); no part links observed |
| Telangana | 9 | 1 | 0 | 0 | 9 | 3 MLC council rolls + 6 aggregate-statistics PDFs; 119 assembly ACs CAPTCHA-gated (CEO publishes the CAPTCHA directive) |
| Tripura | 0 | 0 | 0 | 0 | 0 | 2005 special roll uploaded to CEO site (announced Aug 2026) but page location unobserved; SIR 2026 draft due 21.10.2026 |
| Uttar Pradesh | 0 | 0 | 0 | 0 | 0 | `rollpdf.aspx` exposes district/AC JS dropdowns + per-PDF CAPTCHA; no direct file URLs observed |
| Uttarakhand | 0 | 0 | 0 | 0 | 0 | SIR 2026 hub exists (draft roll + ASD list flagged "New") but links sit behind dropdown cascade + CAPTCHA |
| West Bengal | 1 | 0 | 0 | 0 | 1 | AC-wise SIR draft aggregate-count PDF (counts only, **not name-level**); 2002 archive per-part rolls CAPTCHA-gated |

## Access blockers encountered

- **Per-PDF CAPTCHA (ECI central portal + most CEO sites):** Assam, Bihar, Chhattisgarh, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka (main rolls), Kerala (main rolls), Manipur (/eroll app), Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu (current), Telangana (assembly), Uttar Pradesh, Uttarakhand, West Bengal. Never bypassed.
- **JS-rendered link targets (no CAPTCHA, needs live browser):** Goa (`SIRDraftRoll.aspx` dropdowns), Lakshadweep (download buttons), J&K (ceo.jk.gov.in unfetchable), Tripura (2005-roll page), Chandigarh (per-booth "Show PDF").
- **Host-level egress block (this sandbox):** 177 URLs on ceoandaman, ceoandhra, ceodaman, ceoharyana, ceo.karnataka, ceoelection.mp, ceoelection.maharashtra, ceo.nagaland, ceoodisha, ceotelangana, ceowestbengal could not be reached from this environment. URLs were directly observed in the search index / fetched text; they are marked `not_reachable_from_sandbox`, not declared dead.
- **Genuinely dead:** 11 Meghalaya service-elector URLs (HTTP 404 confirmed with full GET) → downgraded to Scriptable=N.

## Verification log

- Schema: every row validated — exact 10 keys, URL well-formed, Scriptable ∈ {Y,N}. Zero PII: scanned for EPIC patterns (`[A-Z]{3}[0-9]{7}`) and name fields — none found.
- Live check 2026-09-24: plain GET (first 1 KB, follow redirects ≤3) against all 372 Scriptable=Y URLs. 167 returned HTTP 206/200 with PDF bytes; 11 Meghalaya URLs returned 404; 17 Sikkim URLs on www.eci.gov.in returned 406 from this egress (one had been verified live by direct fetch during inventory); 177 could not be reached from this sandbox.
- Typing QA: 17 Maharashtra + 3 Telangana rows are MLC/council rolls, 34 rows are statistics annexures, 1 WB row is an aggregate count, 2 Mizoram rows are press notes, 8 rows are listing pages — all labelled `record_type` so the UI cannot present them as name-level Assembly rolls.

## Files

- `inventory/sir-inventory-<state>.jsonl` — raw worker output (36 states/UTs)
- `inventory/sir-inventory-<state>-notes.md` — click paths, URL patterns, vintages, blockers
- `data/inventory/inventory.jsonl` — combined 381 rows + `record_type` + `live_status`
- `data/inventory/inventory.csv` — same, CSV
- `public/inventory/inventory.json`, `public/inventory/inventory.csv` — site-served copies
- UI: `/inventory` — filter by state, file type, scriptability; direct official links; blocker labels
