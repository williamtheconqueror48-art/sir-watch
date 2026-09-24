# Chandigarh — CEO electoral-roll inventory notes

## Domain actually used
- `ceochandigarh.gov.in` (the hint `ceochandigarh.nic.in` no longer resolves as the live CEO site; the CEO office now sits on the .gov.in domain). The site is a standard Indian government S3-WaaS build (assets served via `cdn.s3waas.gov.in`).

## Click path (as documented in observed sources)
CEO homepage (`https://ceochandigarh.gov.in`) → menu **"Electoral Roll"** → link **"Final Electoral Roll 2026"** → `https://ceochandigarh.gov.in/en/list-of-polling-stations` (list of polling stations / booths). Per booth, select the booth and click the **"Show PDF"** button → a **CAPTCHA must be solved** before the roll PDF opens. An older URL variant of the same listing page is `https://ceochandigarh.gov.in/pages/list_of_polling_stations`.
Alternative official path: ECI citizen portal `https://voters.eci.gov.in/download-eroll` → select State "Chandigarh" → District "Chandigarh" → Assembly "Chandigarh (चण्डीगढ़)" → roll type → part list → enter CAPTCHA → download PDFs.

## Electoral geography (observed, not fetched live)
- Chandigarh is a single district, single Parliamentary Constituency (01-Chandigarh), and a single Assembly Constituency named "Chandigarh (चण्डीगढ़)". No district/AC breakdown exists to catalogue.
- SIR status (press note dated 21.07.2026): the SIR-2026 **Draft Electoral Roll** for 01-Chandigarh PC was published **21 July 2026**, claims & objections window 21.07.2026–20.08.2026; the CEO office stated the draft roll is available on `www.ceochandigarh.gov.in` and `voters.eci.gov.in`.
- A YouTube short also documents an "Intensive Electoral Revision Rolls – 2002" section on the CEO site (choose area/sector, download PDF) — a pre-SIR baseline archive exists, but no direct PDF links were observable; the specific section URL was not visible in fetched text.

## Per-part PDF rows
- **Zero.** No per-part PDF/download URLs were directly observed in fetched text or search results. The per-booth PDFs are generated behind the "Show PDF" + CAPTCHA flow, and the ECI download-eroll per-part links require the CAPTCHA as well. No URL naming pattern for the PDFs could be observed. Nothing was guessed or invented.

## API-like endpoints observed
- None. No JSON/query-string download endpoints were visible for the CEO Chandigarh roll flow. (The ECI-side API `eci.gov.in/eci-backend/public/api/download?url=...` seen in search results is the central ECI press-note CDN path, not a CEO-Chandigarh roll endpoint.)

## ACCESS NOTES / blockers
1. **CAPTCHA gate on CEO site**: per-booth roll PDFs open only after solving a CAPTCHA on the "Show PDF" step (per instapdf.in's documented procedure for the CEO site). Not bypassed, not scriptable → all rows Scriptable=N.
2. **CAPTCHA gate on voters.eci.gov.in**: per-part PDF downloads require a CAPTCHA before "Download Selected PDF's". Same standing rule applies.
3. **JS-driven flow**: the booth list ("Show PDF" button) is JS-driven; no static `<a href>` per-part links were observable.
4. `browser_open` could not be used this session (fetch failure on the CEO domain), so this inventory rests on search results and documented procedures only. A live fetch of `https://ceochandigarh.gov.in/en/list-of-polling-stations` should be re-checked later to confirm the section still exists and to enumerate booth/part counts.

## Method
browser_search queries against the CEO Chandigarh domain and the documented download procedure; no browser_open succeeded. Rows trace only to URLs that appeared verbatim in search-result text or the ECI/EC press material.

## Exact counts
- Inventory rows: **3** (2 CEO-site polling-station listing pages, 1 ECI download-eroll portal page)
- Districts observed: 1 (Chandigarh)
- Assembly constituencies observed: 1 ("Chandigarh (चण्डीगढ़)")
- Parts/booths enumerated: 0 (no per-part URLs observable)
- Gates: **2 CAPTCHA gates** (CEO-site "Show PDF" flow; ECI download-eroll flow) + JS-driven booth list, both documented and not bypassed
