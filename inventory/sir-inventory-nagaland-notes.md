# SIR-WATCH inventory notes — Nagaland
Survey date: 2026-09-24 (IST). Worker: inventory subagent (browser_search / browser_open only; no live browser).

## Actual domain used
**https://ceo.nagaland.gov.in/** — the site's live official domain. The hint domain
`https://ceonagaland.nic.in/` did NOT resolve via browser_open (fetch failed with a
tool error; the RTI Disclosure PDF on the live site also names the old
`http://ceonagaland.nic.in` address, but the working site is `ceo.nagaland.gov.in`).

## Click path (plain language)
1. Open `https://ceo.nagaland.gov.in/` (Home — "Chief Electoral Officer, Nagaland").
2. Homepage "What's New" section lists **"SIR Draft Roll 2026"** (marked New, top of
   list), plus press notes (20-09-2026 SIR key findings of enumeration phase, SIR
   Phase-III), district helpdesk numbers, and notices. Note: the fetched page text did
   NOT expose link hrefs, so the exact target URL of the "SIR Draft Roll 2026" item
   could not be observed — it is reported as seen-but-unresolved, NOT as a row.
3. Homepage "Quick Links" → **"Electoral Roll of Service Voter"** — this is the source
   of every row in the JSONL: direct, ungated PDF uploads under
   `/media/service_voter/`.
4. Main (general) electoral roll download is NOT hosted per-part on the CEO site; the
   official flow points to ECI's central portal: https://voters.eci.gov.in/download-eroll
   (select state → district → roll type → AC → part → CAPTCHA → download). That path is
   CAPTCHA-gated per download → Scriptable=N, documented under Access Notes.

## URL naming pattern (observed)
`/media/service_voter/tmp<RANDOM>-<AC NAME>.pdf` — e.g.
`https://ceo.nagaland.gov.in/media/service_voter/tmpy13rx8al2-DIMAPUR II.pdf`.
The `tmp…` prefix is a random upload slug (not derivable from AC number/name), so
files can only be discovered from the site's own listing or the search index — there
is no predictable enumeration without the directory listing. Do not guess URLs.

## Vintages
- All 11 rows are **Draft Electoral Roll, 2025 — Service Electors ("Last Part" of the
  mother roll)**. PDF header text (observed via search index): "Draft Electoral Roll,
  2025 of Assembly Constituency <N>-<NAME> (ST), (S17) NAGALAND"; Revision details:
  Year of Revision 2025, Type of Revision SSR(D), Qualifying Date 01-01-2025, Date of
  Draft Publication 29-10-2024. `last_updated` is null because no page-level
  publication date was shown for these files.
- SIR context (background, not rows): Nagaland SIR qualifying date 01-10-2026;
  enumeration phase 16-08-2026 to 14-09-2026; **SIR Draft Roll 2026 published 20-09-2026
  across all 60 ACs** by EROs (per DIPR/CEO press notes); claims & objections window
  20-09-2026 to 20-10-2026; final roll due ~22/23-11-2026. Pre-SIR roll: 13,57,208
  electors; draft roll: 12,06,457 electors (11,99,456 general + 7,001 service);
  ~1.59 lakh names not carried forward (28,944 deceased; 1,23,749 absent/shifted/
  untraceable; 5,059 duplicates). Press reports say the list of claims & objections
  "will also be displayed on the CEO Nagaland website" — no such links were observed.
- No ASDD / deletion / uncollectable (ASD) lists for Nagaland (state code S17) were
  observed anywhere (CEO site or search index).

## API-like endpoints / predictable patterns (observed on other states — candidate, NOT verified for S17)
- ECI CDN ASD (uncollectable/deletion) lists, observed indexed for Meghalaya (S15):
  `https://voters.eci.gov.in/eroll/asd/2026/s15/<ac>/uncollectable_elector_report_ac<ac>_part<part>_ENG.pdf`
  (e.g. `.../s15/9/uncollectable_elector_report_ac9_part34_ENG.pdf` — AC 9 Nongpoh,
  Part 34). Same-pattern S17 URLs exist only by analogy and were **deliberately not
  recorded as rows** (zero-fabrication rule); a parent/coordinator may live-verify.
- ECI draft/final roll CDN pattern seen in prior work (Karnataka S10):
  `https://voters.eci.gov.in/eroll/2026/s10/sir-draftroll/<ac>/2026-EROLLGEN-S10-<ac>-SIR-DraftRoll-Revision1-KAN-<part>-WI.pdf`
  — not observed for S17.
- Auxiliary observed pattern: district polling-station lists at
  `https://ceo.nagaland.gov.in/media/polling_stations/<N>. <District>.pdf`
  (e.g. `1.%20Dimapur.pdf`, `15.%20Chumoukedima.pdf`, `8. Wokha.pdf`, `7. Zunheboto.pdf`)
  — these are district → AC → part organization documents, NOT electoral rolls, so they
  are not rows; they corroborate the district→AC mapping used above.

## Access notes / gates
1. **Main roll download (voters.eci.gov.in/download-eroll): CAPTCHA-gated per part.**
   Flow: select Nagaland → district → roll type (incl. "SIR DraftRoll - 2026") →
   AC → part → enter captcha → download. Scriptable=N. Never attempted to bypass.
2. **"SIR Draft Roll 2026" What's New item:** visible on the CEO homepage, but its link
   target was not observable in fetched page text (text extraction strips hrefs); no
   direct PDF link could be confirmed → Scriptable=unknown, zero rows.
3. **Search Voter / e-EPIC flows** on the CEO site are form+CAPTCHA → gated, not rows.
4. Claims & objections lists: announced to appear on the CEO website; none observed yet.
5. Rate limits: none encountered (search-index and plain-GET based survey only).

## Row-count summary
- 11 rows in `sir-inventory-nagaland.jsonl`, all Scriptable=Y, all "Draft Roll"
  (2025 SSR draft, service-electors last-part PDFs).
- Coverage: 11 of 60 ACs (18%); 6 districts (Dimapur, Chümoukedima, Peren, Zunheboto,
  Mon, Tuensang); 0 parts enumerated as numbered parts (each row is the whole
  AC-level service-electors document, part_number null).
- ACs covered: 2-DIMAPUR-II, 3-DIMAPUR-III, 5-GHASPANI-II, 6-TENNING, 13-PUGHOBOTO,
  31-AKULUTO, 43-TAPI, 46-MON TOWN, 47-ABOI, 52-LONGKHIM CHARE, 53-TUENSANG SADAR-I.
- 0 deletion/ASDD rows; 0 SIR Draft Roll 2026 rows; 0 numbered-part main-roll rows.

## Method
browser_search (site-scoped and roll-specific queries) + browser_open of the CEO
homepage. Every file_url was copied verbatim from search-result full URLs; PDF
contents verified as the named AC's 2025 draft service-electors roll via the search
index's extracted text. No elector names or EPIC numbers are recorded anywhere in
these files (metadata only). Nothing was guessed.
