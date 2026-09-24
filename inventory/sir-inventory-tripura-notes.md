# Tripura CEO-site roll inventory — notes

**State:** Tripura (60 ACs, ~28.97 lakh electors, 3,356 polling stations/parts; CEO press conference 2026-08-07)
**Date of observation:** 2026-09-24
**Method:** Public web search (browser_search) plus browser_open fetches of third-party pages. A direct browser_open of `ceotripura.nic.in` root (http and https) failed consistently this session (tool error on every attempt), so no live walk of the CEO homepage was possible; however deep PDF URLs on the same domain (`/sites/default/files/...`) fetched fine, so the failure is specific to the Drupal front page in this fetch environment, not necessarily a site outage. **No forms were submitted, no CAPTCHA touched, no access control bypassed.**
**Row count:** 0 — no per-file roll / draft-roll / deletion-list PDF URL was directly observable on the CEO domain this session.

## Domain used

`https://ceotripura.nic.in/` — the hint URL resolves to the official CEO Tripura website (Drupal installation, files under `/sites/default/files/YYYY-MM/`). No alternate official domain was needed or found; ECI and state directory listings all point here.

## Click path (reconstructed from published guides; NOT live-walked this session)

The homepage menu could not be fetched, so the exact in-site path to the e-roll section is unconfirmed. Third-party guides describe two routes for Tripura rolls, both ultimately served by ECI infrastructure:

1. **ECI central e-roll portal:** `https://voters.eci.gov.in/download-eroll` → select State = "Tripura", year of revision → District → Roll Type → Assembly Constituency → Language → Polling Station/Part → "Search Electoral Roll" → enter **CAPTCHA** → "Download Selected PDF's". (Walkthrough from voterslist.in Tripura/Golaghati page.)
2. **CEO-site "Electoral Roll Search"** (state-wise / district-wise / AC-wise, by EPIC No. or Name) — described on electionin.in with a "Search Name upto 31.01.2018" reference, i.e. stale; live status unverified.

## What was directly observed

- **Exactly one PDF on the CEO domain**, unrelated to rolls: `https://ceotripura.nic.in/sites/default/files/2023-10/a2.pdf` — "LIST OF DEPLOYED GENERAL OBSERVERS", dated 06/03/2022 (fetched live; content verified). Establishes the Drupal URL pattern `/sites/default/files/YYYY-MM/<file>.pdf` but contributes no inventory row.
- **The 2005 special electoral roll (last SIR) is on the CEO's website** — CEO Brijesh Pandey, press conference 2026-08-07 (tripuratimes.com, fetched live: "the 2005 special electoral roll has also been uploaded on the CEO's website to facilitate verification of voter details"; independently corroborated by theindianawaaz.com, krctimes.com, and the dejavu.org mirror of indiatodayne.in). **The exact page and per-part URL structure were NOT observable** from this environment (homepage unfetchable; no per-AC/part links indexed in search results) → no rows, and the upload itself is flagged *unverified as to location*.
  - The working per-part access for the 2005 roll is ECI's **"Search Your Name in Last SIR"** flow on `voters.eci.gov.in`: select State → District → Assembly Constituency → Polling Station No. and Name → "View" → roll PDF opens in a new tab; alternative "Search by Elector Details" tab (name + relative name + **CAPTCHA**) — documented live from voterslist.in's Tripura 2005 page. Both are gated flows, not direct file URLs.
- **SIR 2026 timeline (rolls do not exist yet):** enumeration Sep 15–Oct 14, 2026; **draft roll published Oct 21, 2026** (at designated locations + CEO website + to recognised parties); claims/objections Oct 21–Nov 20, 2026; **final roll Dec 23, 2026**; qualifying date Oct 1, 2026 (tripuratimes.com, fetched live). As of 2026-09-24 there is no SIR draft roll and no ASDD/deletion list for Tripura anywhere — a re-crawl after Oct 21, 2026 should check `ceotripura.nic.in` and the ECI portal for draft-roll PDFs.
- **Roll vintages referenceable via the ECI portal** (voterslist.in Golaghati/Tripura page): 2026 — Bye Election Final Roll-Revision2, Bye Election Final Roll, Bye Election Draft Roll; 2025 — Supplement-4, Final Roll, Draft Roll; 2024 — General Election Roll. All are served behind the CAPTCHA-gated portal; no direct file URLs observed.

## Districts and AC structure (context only, no rows)

- **8 districts** (from the Tripura State Election Commission notification listing the 8 District Magistrates & Collectors): North Tripura, Unakoti, Dhalai, Khowai, West Tripura, Sepahijala, Gomati, South Tripura.
- **60 ACs**, 1-Simna (ST) through 60-Kanchanpur (ST) (ECI delimitation document, hindi.eci.gov.in). No district↔AC↔part file mapping was observed, so no mapping is recorded here.

## URL / API endpoints

- **No API-like roll endpoints observed** for Tripura. `https://voters.eci.gov.in/download-eroll` fetched live returns the ECI SPA shell, which errored under text-fetch (ChunkLoadError on a JS chunk) — it requires a real browser. No query-string pattern for per-part PDFs was observed.
- CEO Drupal file pattern (observed, not a roll link): `https://ceotripura.nic.in/sites/default/files/YYYY-MM/<file>.pdf`.

## Access notes / blockers

- **CAPTCHA gate (ECI-wide):** every per-part roll PDF on `voters.eci.gov.in` (current rolls and 2005 last-SIR rolls) requires dropdown selections plus a CAPTCHA per download → Scriptable=N for all name-level roll PDFs. No bypass attempted.
- **CEO homepage unfetchable from this environment** (repeated browser_open tool failures on `/`, both http and https; deep PDF URLs on the same domain work). This blocked live verification of the 2005-roll upload location and of any draft-roll section. Recommend a re-crawl from a live-browser session; the upload likely exists behind the homepage's electoral-roll menu.
- **No SIR draft/final/deletion PDFs exist yet** (draft due Oct 21, 2026) — there is nothing to inventory on that vintage until then.
- No rate limits encountered (no file downloads attempted).

## Summary counts

- Inventory rows: **0**
- Districts / ACs / parts with direct file URLs: **0**
- Gated flows documented (not rows): 2 (ECI download-eroll portal; ECI "Search Your Name in Last SIR" 2005 flow)
- Scriptable=Y rows: 0 | Scriptable=N rows: 0
