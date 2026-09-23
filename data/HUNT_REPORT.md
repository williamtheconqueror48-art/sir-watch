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

## 8. National roll-hunt — second wave (2026-09-23)

Four parallel streams; all complete. 11 new files staged in `data/raw/` (each with a 7-field `.provenance.json` sidecar); all 50 sidecars hash-verified, 0 mismatches. `SOURCES_MANIFEST.json` now lists 50 files. `data/mirror/` untouched (parent's Karnataka bulk-mirror clone in progress there). No database writes. No CAPTCHA bypassed, nothing paywalled, no logins.

### 8a. State-code corrections (supersede §7.3)
Header-rendered verification of actual roll PDFs: **S27 = Jharkhand** (not Maharashtra), **S13 = Maharashtra**. The `f1`–`f4` folder names do NOT align with published SIR phases (f1 holds AP + Haryana, both Phase-3 states) — treat as internal hosting batches.

### 8b. ECI Wayback OLDSIRROLL tree (stream 1/4)
Full `/sir/` prefix CDX query: the entire archived tree = 524 unique URLs, all `OLDSIRROLL` part-wise roll PDFs; no DRAFTSIRROLL/NEWSIRROLL subtree exists. 522 return 200 (2 archived 403s excluded). **All are pre-SIR baseline rolls (2002/2003 revisions)** — the "before" side only; no draft/final SIR roll anywhere in the archive. Snapshots span 2026-04 → 2026-08.

| Code | State (verified) | PDFs | ACs archived |
|---|---|---|---|
| S01 | Andhra Pradesh | 1 | 26 |
| S07 | Haryana | 2 | 9, 61 |
| S11 | Kerala (code-table + Malayalam; header name not legible — partially verified) | 3 | 72, 107 |
| S13 | Maharashtra | 2 | 53, 197 |
| S19 | Punjab | 1 | 17 |
| S24 | Uttar Pradesh | 1 | 237 |
| S27 | Jharkhand | 490 | 1, 2 |
| S29 | Telangana | 8 | 209, 210 |
| U05 | Delhi NCT | 14 | 20, 42, 46, 57 |

Nothing for Bihar (S04), WB (S25), TN (S22), MP (S12), Rajasthan (S20), Gujarat (S06), Karnataka (S10), Chhattisgarh (S26) — absence from the archive, not deletion. Archive is sparse vs real rolls (Jharkhand has 81 ACs; only ACs 1–2 archived). 5 samples staged: S27_2_58, S11_72_64, S13_53_78, S29_209_116, U05_46_64 (all <5MB, header-verified genuine). Telangana sample contains an EPIC column — noted in sidecar, no EPICs extracted.

### 8c. CEO websites (stream 2/4) — 4 samples staged
- **Kerala (S11):** ASD index at ceo.kerala.gov.in/asd-list ("SIR 2026 ASD list", updated 23 Dec); SIR hub /sir (draft 23-12-2025, final 21-02-2026); Form 9/10/11A claim lists under /uploads/sir-2026/list-claims/<date>/form{N}/ (10/20/25/26-01-2026). Staged: Form-10 (Form-7 objections) sample 10-01-2026 (3 pp, Irinjalakuda — documented deletion-objections) + final electorate summary (8 pp; doc header says "21-02-2025", likely typo for 2026; S11: 13,827,319 M / 13,126,048 F / 277 TG).
- **Uttar Pradesh (S24):** draft roll 2026 parts on cdn.s3waas.gov.in (draft pub. 06-01-2026). Staged: AC 52 Baghpat last part (102 pp), AC 51 Baraut last part (120 pp) — service-elector parts.
- **Maharashtra (S13):** CEO press note verified (full text): all 288 AC draft rolls pub. 31.08.2026; ASDDO lists posted on CEO/DEO websites; pre-SIR 9,78,54,049 → draft 7,71,65,562 (78.86%); dropped 2,06,88,487 (21.14%) with district annexures; claims/objections 31.08–30.09.2026; final 04.11.2026. Direct download failed from this VM (empty reply) — content verified via provider fetch only; a browser-capable agent could stage it.
- **Tamil Nadu (S22):** draft 19-12-2025, final 07-02-2026; ASD lists on district sites (Kancheepuram FAQ verified); 641.1L→543.8L (97.4L, 15.2% dropped). File URLs not enumerated.
- **Gujarat (S06):** draft 19-12-2025, final 07-02-2026; 4.34 cr validated, 73.73L deleted. ASD workflow: CEO site → district → AC → Google Drive folder of booth-wise PDFs. District index pages verified (Ahmedabad ACs 39–59, Morbi, Mahesana, Rajkot); Drive targets JS-gated.
- **Madhya Pradesh (S12):** SIR order + daily bulletins (02-01-2026 bulletin: draft roll 5,31,31,983 electors; claims/objections 23.12.2025–22.01.2026). Download failed from this VM; verified via search text.
- **Rajasthan (S20):** ASD 41,84,891 excluded from draft (29.6L shifted/absent, 8.75L deceased, 3.44L multiple); pre-SIR 5,46,56,215 → draft 5,04,71,324 (16-12-2025) → final 5,15,19,929 (21-02-2026). Exact ASD list URL unverified.
- **Chhattisgarh (S26):** roll route CAPTCHA-gated — not bypassed.
- Blocked: voters.eci.gov.in (CAPTCHA + HTTP 406 to this VM's IP); elections.tn.gov.in (CAPTCHA at PDF step per third-party guides); Kerala /asd-list + Gujarat ASD Drive links are JS-rendered (need live browser).

### 8d. GitHub (stream 3/4) — 2 samples staged; no non-Karnataka open row-level deletion index exists
Verified via API + 2 shallow clones (deleted after): MahmoodUlHassan/electoral-parser (Telangana SIR 2026 OCR parser, code only); in-rolls/parse_unsearchable_rolls (25-state parser suite, code only; parsed output on Harvard Dataverse, access unverifiable); mkhalid-s/sir-saathi (MH pipeline, no data by design); light-bringer/ecr-ocr-cli (WB OCR CLI, code only). **sharik19/India-Electoral-Rolls: UP SIR Deleted Voters Draft List — 177,422 parts × ~162 mean deleted/part ≈ 28.7M rows (estimated) — the only row-level non-Karnataka SIR deletion dataset found, but ACCESS-GATED (Google Form request, non-commercial, no-redistribution).** Staged: jaiharinataraj TN AC-level impact analysis (232 rows, ABSENT-BETWEEN-VERSIONS — net removed from roll totals, not documented deletions) + GKartheeban TN AC-level ASD aggregates (234 rows, DOCUMENTED DELETION aggregate; README cites no exact official source URL — verify vs CEO-TN before bulk ingest). Neither sample contains names or EPICs. Dead/empty: Pronojit2001/indian_electoral_rolls (empty), archii-afk/rollguard (synthetic demo), ashwiinnnn/SIR-India + s1dd4rth/tamilnadu-elections-2026 (aggregate-only).

### 8e. Bihar + news orgs (stream 4/4) — gap confirmed again, no new data
Bihar: ceobihar.nic.in exposes only form-based lookup; bulk route is voters.eci.gov.in with per-part CAPTCHA (hard stop per no-bypass rule); SC-ordered 65L ASD lists were EPIC-keyed lookup only (no bulk archive found); GitHub API search returned zero relevant repos; Wayback CDX for Bihar unverified this turn (fetch tool failed; needs live browser). **No public name-level Bihar SIR data — documented gap holds.** News orgs: Alt News sir-data-decoded.altnews.in is WB-only (6 ACs, ~12.8L voters; already staged); Reporters' Collective Bihar series is article-only (14.35L suspect duplicates etc. — leads, not datasets); Newslaundry paywalled article-only.

### 8f. Environmental notes
- `/tmp` is a 512M tmpfs that hit 100% during one clone; large clones should go to `~/workspace` scratch, not /tmp. Another stream's `/tmp/sirwatch_raw` (190M) was left in place — do not delete without checking with the parent.
- Mid-task, `data/raw/` briefly vanished from the workspace (parent's push-time move-aside); one stream restored from `/tmp/sirwatch_raw`. Post-task verification: all 50 sidecars match, no duplicates, manifest paths correct.

### 8g. Ranked next targets (supersede §7)
1. **Kerala CEO claim/objection lists bulk harvest** — static CAPTCHA-free PDFs at ceo.kerala.gov.in/uploads/sir-2026/list-claims/<date>/form{N}/ ; ASD index at /asd-list (JS-rendered — needs live browser to enumerate).
2. **Jharkhand S27 OLDSIRROLL bulk harvest** — 490 pre-SIR part PDFs via the CDX index query (stream 1/4 report); gives the "before" side for 2 ACs.
3. **UP draft-roll 2026 bulk** — cdn.s3waas.gov.in parts (index enumeration needed).
4. **File the sharik19 UP Deleted Voters access request** (user decision; non-commercial, no-redistribution terms).
5. **Verify GKartheeban TN ASD aggregates against CEO-TN official ASD lists** before any bulk ingest.
6. **Browser-capable follow-ups:** enumerate Maharashtra ASDDO lists on CEO/DEO sites; Gujarat district ASD Drive folders; Kerala /asd-list links; stage MH press note + MP bulletin PDFs (direct download fails from this VM).
7. **Bihar Wayback CDX** (ceobihar.nic.in* roll PDFs) via live browser.
