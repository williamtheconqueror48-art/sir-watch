# SIR-WATCH Data Hunt — Report (2026-09-23)

Coordinator: data-hunt subagent. Five parallel streams, all complete.
Staging: `~/workspace/sir-watch/data/raw/` (39 files, untouched).
Manifest: `../SOURCES_MANIFEST.json` + per-file `.provenance.json` sidecars.
Retrieval date for every file: 2026-09-23. No CAPTCHAs bypassed, nothing paid, no database writes.

## Executive summary

**Name-by-name SIR deletion data EXISTS publicly — but only for Karnataka (Phase 3) and two West Bengal assembly constituencies (via Alt News).** No public name-level data was found for Bihar (Phase 1) or any Phase-2 state. Aggregate ECI figures were captured as real PDFs. All 14 dissent events were individually extracted. The full SC case file core (petition, ECI counter-affidavits, final judgment) was staged.

## 1. Name-level data recovered

### 1a. Karnataka SIR 2026 — ASD deletion index + notices (GitHub, public, no auth)
Two independent public projects parsed ECI's own per-part ASD (Absent/Shifted/Dead) PDFs:
- `github_gouthamganeshm_Karnataka_Draft_Roll_2026_asd_bucket_00_00.json` — **139 sample rows**; full tree **10,766,778 rows, 224/224 ACs, 100% coverage**. Schema: `[sha256_suffix(EPIC), AC, part, serial, reason_code, old_part, old_serial, name_Kannada, relative_name_Kannada]`. EPICs are hash-suffixed (privacy-preserving by source); names plaintext.
- `github_gouthamganeshm_Karnataka_Draft_Roll_2026_notices_bucket_00_0.json` — **1,054 sample rows**; project reports **4,340,895 notices** (99.06% of CEO count). Discrepancy/no-mapping notices.
- `github_omshivaprakash_karnataka-asddo-dashboard_asddo_bucket_00_00.json` — **141 sample rows**; **10,846,382 ASDDO records** total (absent 15.4L / shifted 65.6L / death 16.4L / duplicate 7.0L / others 4.0L). Cross-verified against the first project: same hash suffix `0039ca48` = same voter (Kannada vs English name).
- Full trees reachable file-by-file via raw.githubusercontent.com / GitHub Pages, no auth, no CAPTCHA. **Bulk pull (~1GB+) NOT taken** — staged small subsets only, per the staging rule.
- **Time-sensitive:** both repos were archived by their authors on 2026-09-23. URLs verified reachable today.
- Provenance doc: `~/workspace/sir-watch/PROVENANCE_HANDOFF_Karnataka_Draft_Roll_2026.md` (pipeline details, source URLs, known quirks incl. corrupted EPICs in AC157–159).

### 1b. West Bengal — Bhabanipur + Ballygunge (Alt News, published data appendix)
- `media_altnews_sir_bhabanipur_ballygunge_adjudication_records.html` — **39,605 records**: all voters under adjudication (name, EPIC voter_id, booth, serial, source CSV). Saved as published HTML with embedded record JSON (dashboard offers no separate CSV download; the pages ARE the published dataset).
- `media_altnews_sir_bhabanipur_fullroll_explorer.html` — **161,083 records** (full digitized roll).
- `media_altnews_sir_ballygunge_fullroll_explorer.html` — **191,204 records** (full digitized roll).
- **PII note:** these files contain plaintext voter names + EPIC IDs — public-roll data republished by Alt News "open to verification". Research use only; do not republish or transmit elsewhere.
- Alt News's analytical claims (e.g. on adjudication patterns) are Alt News's, not ECI's — recorded as such.

### 1c. Aggregates only (NOT name-level)
- `opencity_tn_sir_additions_deletions_ac_2026.csv` (273 rows, per-AC additions/deletions by category, Tamil Nadu) and WB per-AC draft counts — AC-level, labelled as such.

**Total name-level records staged (samples): 1,334 (Karnataka) + 391,892 (Alt News/WB) = 393,226 rows.**
Full public trees behind them: ~10.77M + 4.34M + 10.85M (Karnataka).

## 2. Aggregate figures — 9 ECI/CEO/Parliament PDFs staged
- `eci_2026-05-14_sir_phase3_order.pdf` (30 pp) — Phase III order: **36,73,87,831 electors**, 16 states + 3 UTs, state-wise table, 3,94,541 BLOs.
- `eci_pn_348_2025_sir_phase2_begins.pdf` — Phase II begins (04.11.2025): ~51 crore electors, 321 districts, 1,843 ACs. (Hosted on CEO Lakshadweep site; eci.gov.in direct 406s.)
- `pib_2025-12-07_sir_phase2_statewise_ef_status.pdf` — **full state-wise pre-SIR table as on 27.10.2025: 50,97,44,423** (UP 15,44,30,092; WB 7,66,37,529; TN 6,41,14,587; MP 5,74,06,143; Rajasthan 5,46,56,215; Gujarat 5,08,43,436; Kerala 2,78,50,855; Chhattisgarh 2,12,30,737; Goa 11,85,034; Puducherry 10,21,578; A&N 3,10,404; Lakshadweep 57,813).
- `pib_2025-12-09_sir_phase2_statewise_ef_status.pdf` — same incl. Rajasthan 193-Anta: **50,99,72,687**.
- `pib_2025-09-30_sir_bihar_final_roll.pdf` — Bihar: 7.89 cr → 65 lakh removed → 7.24 cr draft; 3.66 lakh ineligible removed, 21.53 lakh added → **~7.42 cr final**.
- `ceo_lakshadweep_sir_enumeration_keyfindings.pdf` — 56,384 EFs (97.53%); deceased 705; multiple entries 472; shifted/absent 252.
- `ls_sir_phases_summary_2026-07-25.pdf` — Lok Sabha Q&A annexure summarising Phases I–III.
- PIB pages offer no PDF download; PIB items are honest weasyprint renders labelled "Rendered capture" with source URL/date.
- **Critical honesty finding:** no consolidated ECI/PIB press note on Phase-II *completion* exists as a published PDF. The widely-cited **50.99 cr → 45.81 cr (5.18 cr, 10.2%)** is ECI data shared with the press (PTI, ~11 Apr 2026), not a published document — recorded as press-reported, not ECI-published.

## 3. The 14 dissent events — 14/14 individually isolated
Source: Indian Express investigation (published 2026-09-23; "TEN MONTHS, 14 NOTES" graphic). ECI's denial (IANS, 2026-09-23) recorded alongside — these are contested allegations, not settled facts.

| # | Date | Commissioner | Subject |
|---|------|--------------|---------|
| 1 | 2025-10-28 | Sandhu | Communications issued in ECI's name without Commission approval |
| 2 | 2026-04-16 | Sandhu | New IT modules/portals learned about from the media |
| 3 | 2026-04-16 | Sandhu | Official communications issued without Commission approval |
| 4 | 2026-04-16 | Joshi | No agenda before / minutes after meetings for over a year |
| 5 | 2026-04-16 | Joshi | Officers' foreign trips without Commission approval |
| 6 | 2026-04-24 | Joshi | Reiteration: communications need Commission approval |
| 7 | 2026-05-16 (Sandhu agreed 05-19) | Joshi | Form 6 can't be changed without govt rule amendment |
| 8 | 2026-05-29 (Sandhu endorsed 07-13) | Joshi | "Gradual centralisation" of electoral-roll database; audit proposed |
| 9 | 2026-07-29 | Joshi → Cabinet Secy | Work redistributed without his knowledge |
| 10 | 2026-07-29 | Sandhu → Cabinet Secy | Work roster issue; action sought against official |
| 11 | 2026-07-30 | Both | New work-allocation order struck down |
| 12 | 2026-08-12 | Sandhu | "Who was authorised to file these appeals on behalf of ECI, and by whom?" (WB) |
| 13 | 2026-08-13 | Sandhu | Form 6 change "unauthorised and illegal" / "must be removed immediately" |
| 14 | 2026-08-14 | Sandhu | Field officers lack ERONet access; DG(IT) "doesn't have any legal authority to restrict" |

Structured records (with verbatim-quote flags and source URLs) in `raw/_findings_dissent_sc.json` → `dissent_events`. Note: the Goa 97-voter software gap was reported as a *consequence* of centralisation (events 8/14), not its own numbered note. ECI: "no Election Commissioner recorded any dissent… All decisions, including SIR, have been unanimous." IE received no response to its 2026-09-21 questionnaire.

## 4. SC case file — ADR vs ECI, WP (Civil) 640/2025 — 8 PDFs staged
- `sc_adr_vs_eci_eci_counter_affidavit_2025-07-21.pdf` — **789 pp** — ECI counter-affidavit with SIR data annexures (BLA figures, enumeration/draft-roll data). HIGHEST-VALUE parsing target.
- `sc_adr_vs_eci_eci_additional_affidavit_2025-08.pdf` — 93 pp.
- `sc_adr_vs_eci_final_judgment_2026-05-27.pdf` — 124 pp — final judgment, 2026 INSC 564 (upheld SIR; Aadhaar as 12th document).
- `sc_adr_vs_eci_adr_writ_petition_2025-07.pdf` — 237 pp — ADR paper book.
- `sc_adr_vs_eci_adr_final_additional_affidavit_2025-10.pdf` — 251 pp (petitioners-side, not ECI's).
- `sc_adr_vs_eci_petitioners_written_submissions_2025-07.pdf` — 72 pp.
- `sc_adr_vs_eci_sc_order_2025-08-22.pdf` — 11 pp (interim); `sc_adr_vs_eci_sc_order_2025-11-11.pdf` — 2 pp.

## 5. Attempted and failed (honest gaps)
- **Bihar / Phase-2 name-level data:** none public. Newslaundry's 7-crore-row Bihar analysis was article-only, no dataset released; Newslaundry originals paywalled.
- **Kaggle:** zero SIR-related datasets. **data.gov.in:** API-key gated (403 anonymous); no SIR dataset without a key.
- **ceobihar.nic.in:** 2025 captures exist but only affidavit/EVM PDFs — no SIR-era roll/deletion PDFs archived.
- **UP `rollpdf/` and WB per-booth PDFs:** CAPTCHA-gated (confirmed in archived HTML) — not attempted further, per no-bypass rule.
- **Explicit "list of deleted electors" PDFs:** not found in Wayback CDX; MH hosts only an ASPX search interface.
- **Congress/Jairam Ramesh figures** (7.8 cr Phases 1+2; 6.18 cr Phase 3; 5.43 cr notices): opposition claims from X-post images — no INC PDF found. Labelled as claims, never ECI figures.
- **TRC / Newslaundry / SPECT datasets:** described in articles but not published as downloads.
- **ADR rejoinder (25.07.2025) and Application for Direction (05.08.2025):** listed on ADR's page, links unresolvable.
- **Draft-stage ≠ final deletions:** TRC/Newslaundry/SPECT Delhi figures (47.6L purged + ~32L notices) are explicitly draft-stage.
- ECI press-releases index not archived for 2026; ECI backend download API 406s with no Wayback snapshot.

## 6. Coordinator's cleanup notes
- Streams used inconsistent findings schemas (`filename` vs `name`/`path`; `rows` vs `pages`); normalised in `SOURCES_MANIFEST.json`. One finding JSON carried a transcription typo in a SHA-256 (`ls_sir_phases_summary_2026-07-25.pdf`) — manifest uses the actual file hash, noted in the record.
- Removed 7 files: 4 byte-identical duplicate SC PDFs, 2 exact-duplicate Google-Drive download artifacts of the ECI counter-affidavit (`.bin`), 1 unidentified 20-page partial download (not claimed by any stream). Documented here; nothing of value lost.
- One stream reorganised `raw/` mid-task into `raw/sirwatch_raw/`; all files verified present with matching hashes. Manifest paths reflect final locations.

## 7. Ranked next targets
1. **Bulk mirror of the two Karnataka GitHub repos** — archived 2026-09-23 by authors; ~1GB+; needs explicit parent authorisation (bulk rule). TIME-SENSITIVE.
2. **Parse the 789pp ECI counter-affidavit annexures** into structured tables (already staged — pure parsing work).
3. **Bulk-harvest the ECI `/sir/` OLDSIRROLL Wayback tree** — 200+ part-wise pre-SIR roll PDFs found via CDX (`web.archive.org/web/2026…/https://www.eci.gov.in/sir/f3/S27/data/OLDSIRROLL/…`); CDX pagination needed (200-row query limit hit). State-code mapping (S01/S07/…) UNVERIFIED — do not assert state identities without ECI's code table.
4. **Alt News dashboard deep-parse** — extract embedded record JSON from the 3 HTML files into structured CSVs (393k records).
5. **MH `SIR FAQs.pdf` (4.9MB) + `Revised Schedule - SIR 2026.pdf`; WB Form-7 Bengali (756KB)** — identified, not yet pulled.
6. **ADR rejoinder + Application for Direction PDFs** — retry link resolution on adrindia.org.
7. **data.gov.in API key** — user decision required.
8. **Karnataka notices/ASD full-tree diff analysis** — reason-code breakdowns (SHIFTED vs DEAD vs DUPLICATE) once bulk mirror exists.
