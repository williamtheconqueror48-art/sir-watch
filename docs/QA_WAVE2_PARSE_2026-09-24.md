# Wave-2 Parse & Shard QA — 2026-09-24

## Datasets built
| Dataset | Rows | Shards | Manifest rows | Decompressed | Status |
|---|---|---:|---:|---:|:---|
| inv-rolls | 30,087 | 482 | 30,087 | 30,087 | MATCH |
| kerala-service-2017 | 89,885 | 426 | 89,885 | 89,885 | MATCH |
| uttarakhand-service-2026 | 2,750 | 153 | 2,750 | 2,750 | MATCH |

Existing manifest datasets (ka-asd, ka-notices, ka-asddo, up-draftroll, cg-form10,
kl-form9/10/11a) untouched — row counts verified unchanged.

## Reconciliation (parsed rows by state/vintage)
| State | vintage_class | Rows |
|---|---|---:|
| Arunachal Pradesh | pre_sir | 6,905 |
| Delhi | pre_sir | 13,002 |
| Goa | pre_sir | 112 |
| Goa | post_sir | 65 |
| Manipur | pre_sir | 8,068 |
| Mizoram | other | 1,591 |
| Puducherry | pre_sir | 99 |
| Puducherry | post_sir | 245 |
| Kerala | other | 89,885 |
| Uttarakhand | post_sir | 2,750 |
| **Total** | | **122,722** |

inv-rolls = 30,087 (Arunachal+Delhi+Goa+Manipur+Mizoram+Puducherry). Kerala and
Uttarakhand are separate datasets per parent directive.

## Vintage notes (source-grounded, not assumed)
- **Goa is mixed, not uniformly post-SIR.** 112 rows come from "Draft Roll (Service
  Voters) 2026" PDFs published **16-12-2025** → pre_sir. 65 rows come from Final
  Roll PDFs published **21-02-2026** (incl. 2 rows explicitly "Special Intensive
  Revision") → post_sir. The parent's "post_sir" label for Goa was a simplification;
  per-source publication dates govern.
- **Puducherry is mixed.** 99 rows pre-SIR Roll 2025 (SSR; published 2024/2025);
  245 rows post-SIR Roll 2026 (Continuous Updation published 2026; SIR published 2026).
- Mizoram monthly-pooling lists (1,591 rows: 10 addition, 7 deletion, 2 modification
  files) are vintage_class=other, source_label="APPLICATIONS, CLAIMS & OBJECTIONS —
  NOT ROLLS". Months extracted from PDF titles/footers (3/2026, 4/2026) or inventory
  last_updated (April/May 2026).
- Kerala: vintage_class=other, exact label "2017 Special Summary Revision — SERVICE
  ELECTORS (defence/armed-police/foreign-service personnel + wives; final publication
  10-01-2017). Not Kerala's civilian roll; not pre/post-SIR."

## Honest skips (logged, not silently dropped)
- **Bihar** (9 URLs): ECI statistical formats 1B/3B/4B/5B/5C/6/7 — count tables, zero
  elector rows. 0 parsed, 0 rejects.
- **Meghalaya** (12 URLs): 2005 scans carry a garbled embedded-OCR text layer (words
  not grouped into logical rows; serial/attribute y-positions corrupted). Three
  mechanical reconstruction strategies prototyped (line clustering; serial-anchor
  pairing; order-based column assignment) — all failed validation against rendered
  pages (name/attribute cross-row pollution). No OCR engine installable in this
  environment (tesseract not available). Marked unparsed honestly.
- **Uttarakhand SIR booth table** (1 URL): district-wise 2003-vs-2025 summary table,
  name-less. Skipped with reason.
- **A0160008_1.pdf** (Meghalaya): corrupt/truncated download (missing PDF trailer/
  xref; poppler and MuPDF both fail; 0 words). The same URL's good fetch
  (A0160008.pdf, 3.57MB) parsed as skipped-per-Meghalaya above. Not a duplicate —
  a broken earlier fetch.

## Rejects
arunachal 944 | delhi 376 | goa 29 | manipur 493 | puducherry 95 | uttarakhand 151.
All in `data/parsed/inventory/*.rejects.jsonl` with reasons (structural_header,
bad_pooling_row, meg_* etc.). Mizoram 0 rejects.

## EPIC audit
- Parse-time EPIC audit: 0 suspect rows across all outputs.
- Post-build schema validation (122,722 rows): 0 raw EPICs in name/relation/address
  fields. Kerala `rank` field holds military service numbers (HAV/SEP/GNR+digits),
  not EPICs — verified, all 822 `[A-Z]{3}[0-9]{7}` matches are service numbers.
- 2 malformed masks in Arunachal (`AR/****68\``, `AR.****179`) from source OCR noise;
  still masked (no EPIC exposed), format irregularity only.

## Shard field contract (applied to all rows)
voter_name, relative_name, age, sex, address, state, district, ac_number, ac_name,
booth_no (string), vintage_label, vintage_class, source_label, record_type,
epic_masked, source_url, dataset. source_url present on 100% of rows.

## Files pushed
- `data/shards/inv-rolls/` (482 files), `data/shards/kerala-service-2017/` (426),
  `data/shards/uttarakhand-service-2026/` (153), `data/shards/manifest.json` (merged)
- `scripts/parse_inv_rolls.py`, `scripts/normalize_kerala.py`,
  `scripts/build_inv_shards.py`, this doc.
- Parsed JSONLs retained locally at `data/parsed/inventory/` (96MB; not pushed).
