# Bihar CEO-site roll inventory — notes

**State:** Bihar (243 ACs, ~90,000 part PDFs estimated; ECI press notes)
**Date of observation:** 2026-09-24
**Method:** Public web search only (browser_search). A direct browser_open of ceobihar.nic.in failed (tool error) and could not be retried this session, so no page was fetched live; all file URLs below are quoted verbatim from search-engine results. **No forms were submitted, no CAPTCHA touched, no access control bypassed.** Click path is reconstructed from multiple published third-party download guides, not from a live session.
**Row count:** 9 (all statewide aggregate files; 0 district/AC/part-level file URLs observable)

## What was directly observed (the 9 inventory rows)

The CEO Bihar's official alternate domain **ceoelection.bihar.gov.in** (same office that runs ceobihar.nic.in) exposes the standard ECI statistical formats (Formats 1–8, the AC/district-wise annexures published with draft/final rolls) as **direct, ungated PDFs** (plain HTTP GET; indexed by search engines; table text extractable from snippets → text-searchable PDFs, no CAPTCHA in the path).

### 2025 SIR vintage — folder `/PDF/Year_2025/Format1-8/`, titled "as per proposed Final ROLL (To be Published on 30.09.2025) - AC & District wise", qualifying date 01.07.2025
| File | ECI format | Contents |
|---|---|---|
| Format_4B.pdf | Format 4B | Inclusions & deletions over previous roll: electors as per Draft Roll 01.07.2025, claims lodged/admitted (Form 6), objections lodged/admitted (Form 7), suomoto deletions, total deletions subsequent to last publication, deletions by Expired/Shifted/Repeated, electors as per proposed Final Roll 01.07.2025. **This is the deletion-statistics file — the only SIR deletion data directly observable on the CEO domain.** |
| Format_1B.pdf | Format 1B | Gender-ratio elector information: Final Roll w.r.t. 01.01.2025, Draft Roll w.r.t. 01.07.2025, proposed Final Roll w.r.t. 01.07.2025 |
| Format_5B.pdf | Format 5B | EPIC & photo coverage in current rolls, as per proposed Final Roll w.r.t. 01.07.2025 |
| Format_5C.pdf | Format 5C | Photo-coverage distribution (PS bands), as per proposed Final Roll w.r.t. 01.07.2025 |
| Format_7.pdf | Format 7 | Information on service voters (Draft Roll vs proposed Final Roll) |

### 2023 vintage — folder `/PDF/Format_1_to_8_2023/`, qualifying date 01.01.2023
| File | ECI format | Contents |
|---|---|---|
| Format_4B_2023.pdf | Format 4B | Inclusion & deletions over previous roll: Draft Roll w.r.t. 01.01.2023, Form 6 claims, Form 7 objections, suomoto deletion, total deletions subsequent to last publication |
| Format_3B_2023.pdf | Format 3B | State age-cohort-wise elector information, proposed Final Roll w.r.t. 01.01.2023 |
| Format_6_2023.pdf | Format 6 | Polling-station locations (PSL) details, AC-wise, as per proposed Final Roll w.r.t. 01.01.2023 |
| Format_7_2023.pdf | Format 7 | Service-voter information, draft vs final roll (2023 folder; exact qualifying date not shown in snippet) |

**URL pattern (observed, not guessed):** `http(s)://ceoelection.bihar.gov.in/PDF/<Year_folder>/<FormatN...>.pdf` — folder per vintage (`Year_2025/Format1-8/`, `Format_1_to_8_2023/`), file per ECI format number. Only the 9 URLs above are attested in search results; I did not infer or construct any others.

## Name-level roll PDFs — GATED (no file rows possible, documented here, not fabricated)

The per-part (polling-station) electoral roll PDFs — the actual name lists — are **CAPTCHA-gated per PDF on ceobihar.nic.in**. This is ECI-mandated, not site-specific: ECI letter no. 485/Comp/ERO-Net/2017 dated 04.01.2018 (hosted on hindi.eci.gov.in) directs that only **image PDFs** of rolls be hosted on CEO websites and that "the access to view such image PDF of electoral rolls should be strictly provided through CAPTCHA containing alphabet, numeral and special character."

Click path (reconstructed from published guides; not live-verified this session):
1. `ceobihar.nic.in` → homepage menu → Election → Electoral Roll → "Search in E-Roll"
2. Choose "Search in PDF" → page titled **"VIEW FINAL ROLL (MOTHER & SUPPLEMENTRY) IN PDF FORMAT PUBLICATION"** (`http://ceobihar.nic.in/search_in_pdf.html`)
3. Select Assembly Segment + Part Number → enter CAPTCHA → click View → roll PDF renders/downloads
4. Name search alternative: "Search in E-Roll" (`http://ceobihar.nic.in/searchinroll.html`, also `/Search/Name_Search.html`): State → District → Constituency → Part No → Age → Gender → EPIC → Name → Relative Name → CAPTCHA → Show

Because the CAPTCHA gates every file, **no per-district/AC/part file URL is directly observable** — adding rows for them would be fabrication. Scriptable = N for all name-level roll PDFs. Blocker: ECI-mandated per-view CAPTCHA (alphabet + numeral + special character).

## Other endpoints / documents observed (NOT inventory rows — pages or press material, not roll files)

- `http://210.212.18.117:8880/` — "Deleted Elector After Deduplication & Verification in 2015 Roll" (Assembly Segment + Part Number → View). Third-party-reported (electionin.in), 2015 vintage, IP:port page (not a PDF), live status unverified this session. Not a file URL → not inventoried.
- `http://ceoelection.bihar.gov.in/PDF/Year_2025/PressRelease2025/AUG/01.08.2025-Press Release SIR Draft Publication.pdf` — SIR draft-publication press release 01.08.2025 (Hindi, विशेष गहन पुनरीक्षण). Press material, not a roll → not inventoried.
- `http://ceoelection.bihar.gov.in/PDF/Year_2025/PressRelease2025/SEPT/30-09-2025 Press Note TCandGC.pdf` — 30.09.2025 press note. Not inventoried.
- `http://ceoelection.bihar.gov.in/PDF/PR-Final Pub-05012022.pdf` — final-publication press release 05.01.2022. Not inventoried.
- `https://ceoelection.bihar.gov.in/PDF/Year_2025/tcgc2026/Program for preparation of Electoral Rolls.pdf` — Teachers'/Graduates' constituencies denovo-prep schedule (qualifying 01.11.2025). Not an assembly roll → not inventoried.

## API-like endpoints

- `https://www.eci.gov.in/eci-backend/public/api/download?url=<encrypted-token>` — ECI central backend document API (observed verbatim serving Bihar SIR daily bulletins, e.g. `...url=LMAhAK6sOPBp%2FNFF0iRfXbEB1EVSLT41NNLRjYNJJP1KivrUxbfqkDatmHy12e%2Fzznw5Qtyss%2B8ILdni0Z0RBAkwVPAdy67ySd4dS2SdwaMBk2R96DibuBAtp2M0x9wMgKdCmUSHqA1uyd%2BQgGswdQ%3D%3D`). The `url` parameter is an encrypted/opaque token — **not a predictable pattern**, and it serves ECI press material, not roll PDFs. Not scriptable for rolls.
- `https://voters.eci.gov.in/download-eroll?stateCode=...` — ECI central eroll portal; observed for UP (`S24`), Kerala (`S11`), Karnataka (`S10`) in guides, always CAPTCHA-gated per PDF. Bihar's code (`S04`) is **not observed in any source this session** — not recorded, not used.
- The Lakshadweep-pattern `/Users/download_pdf_draft_roll_2024/<base64>` appeared in a search result for this query but belongs to ceolakshadweep.gov.in — not applicable to Bihar.

## Vintages relevant to SIR

- Pre-SIR baseline: **2003 Bihar roll** (4.96 crore electors) uploaded 30.06.2025 to voters.eci.gov.in per ECI press note ECI/PN/237/2025 — lives on ECI infrastructure, **not** on the CEO website; not observed as CEO-hosted file → not inventoried.
- SIR Draft Roll 01.08.2025 and SIR Final Roll 30.09.2025: published "on the ECI website" per ECI press notes — no direct CEO-hosted roll files observed.

## Access notes / blockers

- **CAPTCHA gate (ECI-mandated, 04.01.2018):** every per-part roll PDF view on ceobihar.nic.in requires solving a CAPTCHA with alphabet + numeral + special character → name-level roll PDFs are Scriptable=N. Rule honored: no bypass attempted.
- **browser_open failed** on ceobihar.nic.in homepage this session (tool error, not retryable); observation is search-index-based. A live fetch could still reveal additional direct links on ceoelection.bihar.gov.in (e.g., other Format_1_to_8 vintages) — recommend a re-crawl when live fetching is available.
- **No rate limits observed** — the 9 files are direct GET with no gate.

## Summary counts

- Inventory rows: **9**
- Districts / ACs / parts with direct file URLs: **0** (all 9 rows are statewide aggregate files)
- Gated flows documented (not rows): 2 (PDF roll viewer via search_in_pdf.html; name search via searchinroll.html / Search/Name_Search.html)
- Scriptable=Y rows: 9 | Scriptable=N rows: 0
