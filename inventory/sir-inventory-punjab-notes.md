# Punjab — CEO Electoral Roll / SIR Inventory Notes

**Row count in `sir-inventory-punjab.jsonl`: 0** (no directly observable file URLs)

## Official domain used

The official CEO Punjab website is now **https://ceopunjab.gov.in** (the older `ceopunjab.nic.in` domain no longer resolves to the site). A separate legacy roll portal exists at **https://elections.punjab.gov.in/** (host of the "Electoral Roll 2003" lookup per third-party walkthroughs). CEO (2026): Mrs. Anindita Mitra, IAS.

## Click paths attempted (plain language)

1. `https://ceopunjab.nic.in/` — browser_open FAILED (browser-service could not fetch; treated as terminal, not retried per runtime directive).
2. `https://ceopunjab.gov.in` — browser_open FAILED identically.
3. Web-search fallback (8 queries) used to find directly observable PDF/download links on the CEO site. None found in any search result or fetched text.

## What IS documented (from third-party guides, not directly observed)

### A. SIR 2026 draft roll download — national portal (gated)
- Path: **https://voters.eci.gov.in/download-eroll** → select State = Punjab → District → Roll Type ("SIR Draft Roll 2026" / "Final Roll") → Assembly Constituency → Language → Polling Station / Part number (multi-select) → **enter CAPTCHA text** → click "Download Selected PDF's".
- Sources: voterslist.in walkthrough (http://voterslist.in/punjab/), sarkariyojana.com/ceo-punjab-voter-list/.
- Gate: per-download CAPTCHA ⇒ Scriptable = N. Blockers: CAPTCHA, sequential JS dropdowns; no predictable file-URL pattern observed.
- Punjab SIR 2026 timeline (as reported): enumeration 25 Jun–24 Jul 2026 (24,453 BLOs, ~2.14 crore electors); draft roll published **13 Aug 2026** (sarkariyojana.com) — note conflicting reports of 3 Aug 2026 (CEO's own Punjabi SIR ad at https://ptu.ac.in/wp-content/uploads/2026/06/SIR-Punjabi.pdf says "ਡਰਾਫਟ ਵੋਟਰ ਸੂਚੀ 03 ਅਗਸਤ 2026 ਦਾ ਪਕਾਸ਼ਨ"); claims & objections 3 Aug–2 Sep 2026 (ad) / 13 Aug–12 Sep 2026 (sarkariyojana.com); disposal till 28 Sep 2026; **final roll due 1 Oct 2026** — i.e. AFTER today's date (24 Sep 2026), so no final roll exists yet.
- Punjab's last pre-SIR baseline roll: qualifying date **01.01.2003** (ECI SIR notification).

### B. 2003 electoral roll portal — elections.punjab.gov.in (JS-gated)
- Path (voterlist.co.in walkthrough): https://elections.punjab.gov.in/ → click "Electoral Roll 2003" on homepage → select Assembly Constituency + Part No → click "Download Electoral List" → PDF downloads.
- Gate: AC/part selection via JS dropdowns (not direct links); site itself could not be fetched via browser_open in this session ⇒ Scriptable = N, unverified live.

### C. CEO-linked PDF observed in the wild (NOT a roll)
- https://ptu.ac.in/wp-content/uploads/2026/06/SIR-Punjabi.pdf — CEO Punjab SIR awareness ad (Punjabi, "CEOPB_SIR_Full Page Ad_31May_final"). Publicity material only; no roll data. Included here for provenance, not in the JSONL.

## URL naming patterns

None observable. CEO Punjab roll downloads appear to be served dynamically (dropdown + CAPTCHA flow), with no indexed static PDF links for AC/part rolls in search results.

## API-like endpoints

None observed. The ECI national e-roll portal and the CEO portals expose no documented JSON/query-string download endpoint visible in search results.

## ACCESS NOTES (blockers)

1. `browser_open` hard-failed on both `ceopunjab.nic.in` and `ceopunjab.gov.in` (browser-service could not fetch; terminal — no retry, no curl). The CEO site could not be read at all in this session.
2. All known Punjab e-roll download flows require either sequential JS dropdown selections (CEO site, elections.punjab.gov.in) or a **CAPTCHA per download** (voters.eci.gov.in/download-eroll). These were NOT attempted/bypassed. ⇒ Scriptable = N on all rows if any existed.
3. No ASDD/deletion-list PDFs, no draft-roll static PDFs, and no part-wise file URLs were found in any fetched text or search result.

## Method

- Attempted direct fetches of both CEO domains (both failed terminally).
- Ran 8 public-web searches (official site confirmation, CEO roll-download guides, 2003-roll portal, SIR draft roll 2026, filetype:pdf on ceopunjab.gov.in, ASDD/deletion lists).
- Zero-fabrication: no row was recorded because no file URL was directly observed.

## Exact counts

- Inventory rows: 0
- Districts / ACs / parts covered: 0
- Gates encountered: CAPTCHA (voters.eci.gov.in download-eroll), JS dropdown selection (ceopunjab.gov.in / elections.punjab.gov.in), site unreachability via fetch tool.
