# SIR-WATCH Inventory — Uttar Pradesh (CEO roll site)

**Date observed:** 2026-09-24
**CEO roll site:** https://ceouttarpradesh.nic.in/rollpdf/rollpdf.aspx
**Rows written to JSONL:** 0

## Click path (observed via page fetch)
Home (ceouttarpradesh.nic.in) → Electoral Roll / "District & AC-Wise List of Polling Stations (Part Details) & Electoral Roll PDF" → rollpdf.aspx:
1. **Select District** (dropdown, populated via JavaScript — option values NOT visible in fetched text)
2. **Select AC** (dropdown, populated via JavaScript — option values NOT visible in fetched text)
3. **Enter the captcha** (CAPTCHA required before any PDF is served)

The fetched page title reads: **"Elector Roll PDF - 2003"** (मतदाता/निर्वाचक नामावली 2003 — the pre-SIR 2002/2003 baseline roll, hosted for SIR enumeration-form lookup).

## URL patterns
No district/AC/part PDF URL pattern was directly observed. No `file_url` under ceouttarpradesh.nic.in appeared in fetched page text or in public search-index results. The PDF delivery happens only after interactive selection + CAPTCHA, behind an ASP.NET WebForms postback.

## Roll vintages found (labels only, not downloadable links)
- **Elector Roll 2003** — served via rollpdf.aspx (CAPTCHA-gated per PDF). This is UP's pre-SIR (2002/2003 intensive revision) baseline, published by CEO UP to support SIR enumeration (consistent with ECI's 07.11.2025 press-note guidance: voters must fill EF details from the last intensive revision 2002/2005).
- **"General Elections Roll 2025"** — listed on the portal per prior survey; not directly observed in this pass.

## UP SIR status (context)
ECI's SIR phase-2 announcement (via Drishti IAS, quoting ECI): SIR covers **Uttar Pradesh**, Chhattisgarh, Goa, Gujarat, Madhya Pradesh, Rajasthan, A&N Islands, and Lakshadweep. UP: enumeration from 04.11.2025; qualifying date 01.01.2026; **final rolls 07.02.2026**. No UP SIR draft/final roll PDF was observed on the CEO site in this pass — post-SIR rolls for UP do not exist yet (final publication scheduled Feb 2026).

## API endpoints
None found. No JSON endpoints, query-string downloads, or predictable numeric-ID download patterns were observed in fetched text or search results.

## ACCESS NOTES (blockers)
1. **CAPTCHA per PDF** — the rollpdf.aspx flow requires entering a CAPTCHA after selecting district + AC, before any roll PDF is served. Scriptable: **N**.
2. **JS-rendered dropdowns** — "Select District" / "Select AC" option lists are populated client-side; their values (district codes, AC numbers) were not visible in the statically fetched page text. Scriptable: **N** (without executing JS and without solving the CAPTCHA).
3. **No bypass attempted or described** — per project rule, the CAPTCHA was not touched, no forms were submitted, and no automation of the dropdown/CAPTCHA flow was built.
4. **Direct-GET attempt failed** — a plain HTTPS GET of the page returned "Empty reply from server" (server expects browser-grade TLS/session); `browser_open` of `/rollpdf/` (directory index) failed, and further `browser_open` use was disallowed mid-task by a runtime instruction, so no deeper page-source inspection was possible.
5. **Alt ECI path is also gated** — voters.eci.gov.in/download-eroll?stateCode=S24 requires CAPTCHA per download (per prior survey; unchanged).
6. No rate-limiting evidence observed (no 429s; interaction never proceeded far enough to trigger limits).

## Method
- Fetched https://ceouttarpradesh.nic.in/rollpdf/rollpdf.aspx with browser_open (12 lines of rendered text: title "Elector Roll PDF - 2003", Select District, Select AC, Enter the captcha). No file links present.
- Fetched https://ceouttarpradesh.nic.in/ (homepage, 23 lines): only directly linked PDFs observed are voter-guide PDFs (English/Hindi, PwD/Sr. Citizens guides, GE-2024 phase-wise map) — **not electoral rolls**, so not inventoried.
- Public web searches: `"ceouttarpradesh.nic.in/rollpdf" pdf AC`, `ceouttarpradesh.nic.in filetype:pdf निर्वाचक नामावली 2025`, `UP CEO 2003 electoral roll "District & AC-Wise List of Polling Stations"`, plus site-map corroboration (sarvodayasangam.com lists rollpdf.aspx as UP's roll page; multiple SIR-guide mirrors point 2003-list seekers at rollpdf.aspx). No direct roll file URLs surfaced anywhere in the search index.

## Coverage
- Rows: 0 | Districts: 0 | ACs: 0 | Parts: 0
- Gates encountered: CAPTCHA (per-PDF), JS-only dropdown navigation, directory listing denied.
- Bottom line: **Uttar Pradesh's CEO roll portal exposes zero directly fetchable roll-file URLs**; every PDF requires interactive district→AC selection plus a CAPTCHA, which this project will not bypass. UP has ~403 ACs / ~162,000 part PDFs estimated, but none is scriptable today. Re-check recommended after UP's final SIR roll publication (scheduled 07.02.2026) — note whether the final roll is published as direct PDFs or stays behind the CAPTCHA wall.
