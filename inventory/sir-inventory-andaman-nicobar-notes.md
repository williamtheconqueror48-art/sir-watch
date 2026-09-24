# SIR Inventory Notes — Andaman and Nicobar Islands

**Domain used:** https://ceoandaman.nic.in/ (the hint URL). Note: the bare `ceoandaman.nic.in` root returns a `302 Found` redirect to itself (redirect loop) for plain fetches; the `www.` variant (`https://www.ceoandaman.nic.in/`) serves content normally. All observed files exist under both host forms.

**Method:** Public web search (browser_search) + one successful page-text fetch of the E-ROLL-2002 index page. No live-browser session, no CAPTCHA/logins touched, no URL guessing. Every file URL below was returned verbatim in search output; part/tehsil/district metadata was read from the documents' own header text in the search snippets. No elector names or EPIC numbers were recorded.

## Click path (2002 SIR final roll)
1. `https://www.ceoandaman.nic.in/election/E-ROLL-2002/default.htm` — landing page titled **"Special intensive Revision Electoral Roll - 2002"** with a **"SELECT YOUR TEHSIL"** menu listing 9 tehsils: DIGLIPUR, PORT BLAIR, CAR NICOBAR, MAYABUNDER, FERRARGUNJ, NANCOWRY, RANGAT, LITTLE ANDAMAN, CAMPBELL BAY.
2. Tehsil links lead (per press reports) to part-wise PDF indexes; individual part PDFs are hosted flat at `.../E-ROLL-2002/AllPdf/<partnumber>.pdf` (no tehsil in the filename). The tehsil subpage URLs themselves were not captured (image/JS links, no text hrefs rendered), so only the AllPdf file links are inventoried.

## URL naming pattern (observed, not inferred)
- 2002 final roll part PDFs: `https://ceoandaman.nic.in/election/E-ROLL-2002/AllPdf/<N>.pdf` where `<N>` = part number (observed 1..361+; highest observed part = 361, LAXMI NAGAR, Campbell Bay).
- Service voter PDFs under `https://ceoandaman.nic.in/election/AnnounceContent/` with descriptive filenames (contain spaces — must be URL-encoded for scripting):
  - `SERVICE VOTER FINAL ROLL 21.02.2026.pdf`
  - `Final Service Voter- 2025.pdf`
  - `DRAFT SERVICE VOTER-2025.pdf`
- Also observed (not roll files, listed for completeness): `election/announcecontent/BLOANI.pdf` (BLO list, part names tehsil-wise), `election/downloads/RTI-information.pdf` (RTI disclosure: roll-2025 stats — 3,11,506 total electors, published 06.01.2025), `election/ActionPlan/COMMUNICATION PLAN.pdf` (tehsil-wise part name list; source for part 49 = Parangara, Diglipur tehsil).

## Vintages / roll types observed
- **Final Electoral Roll 2002 (Special-Intensive, qualifying 01.01.2002, final publication 31.01.2002):** 29 part PDFs directly observed (parts 5, 11, 14, 16, 21, 22, 41, 45, 49, 56, 71, 73, 132, 134, 161, 163, 185, 197, 212, 239, 335, 336, 337, 342, 354, 356, 357, 359, 361). The full roll runs to at least part 361; the remaining ~330 part PDFs exist in the same AllPdf pattern but were not individually observed and are NOT listed (zero-fabrication).
- **Draft Service Voter 2025** and **Final Service Voter 2025** (PDFs; Defence/Armed Police/Foreign Service sections; header: "Assembly Constituency 1-ANDAMAN AND NICOBAR ISLANDS (GEN), (U01) ANDAMAN AND NICOBAR ISLANDS").
- **Service Voter Final Roll 21.02.2026** (post-SIR final; header: "Final Electoral Roll, 2026 of Assembly Constituency 1-ANDAMAN AND NICOBAR ISLANDS (GEN)"; ~514 defence + 2 foreign-service members shown in first snippet).

## AC / organization model
- The 2002 roll has **no Assembly Constituencies**: header reads "Assembly Constituency : Nil"; it is organized by **District (Andaman / Nicobar) → Tehsil → Part No.** and belongs to Parliamentary Constituency 26 – Andaman & Nicobar Islands. Hence `ac_number`/`ac_name` are null on 2002 rows; district is taken from the document's own "District:" field.
- The 2025/2026 service voter PDFs are headed as AC "1-ANDAMAN AND NICOBAR ISLANDS (GEN)"; those rows carry ac_number "1".

## Part → Tehsil mapping (observed from document headers)
- Diglipur (Andaman): 5 (GANDHI NAGAR), 11 (BURMACHAD), 14 (PASCHIM SAGAR), 16 (TALBAGAN), 21 (SUBHASGRAM), 22 (SITA NAGAR), 41 (HORRY BAY), 49 (PARANGARA — per COMMUNICATION PLAN PDF, Diglipur tehsil)
- Mayabunder (Andaman): 56 (TUGAPUR V)
- Port Blair (Andaman): 132, 134, 161, 163, 185, 197, 212 (Ward-numbered urban parts), 239 (RANGACHANG-II)
- Nancowry (Nicobar): 342 (MILDERA)
- Campbell Bay (Nicobar): 354 (GOVINDANAGAR), 356 (CAMPBELLBAY-I/A), 357 (CAMPBELLBAY-II), 359 (PULOBET), 361 (LAXMI NAGAR)
- Parts 45, 71, 73, 335, 336, 337: URLs observed, part numbers from filenames, tehsil/district not visible in snippets → district null.

## API endpoints
None found. No JSON/query-string download endpoints observed on the CEO site.

## ACCESS NOTES / gates
1. **SIR Draft Electoral Roll 2026 (published ~23 Dec 2025, claims till 22 Jan 2026):** press reports say part-wise/booth-wise draft rolls and deletion (deceased/shifted/duplicate) lists were posted on `ceoandaman.nic.in`, but **no direct file URLs for the 2026 SIR draft or deletion/ASDD lists were observable via public search** — not inventoried. The ECI voter portal (voters.eci.gov.in) path is **CAPTCHA-gated → Scriptable=N**; not attempted.
2. **2002 roll name search portal:** `https://ceo.andamannicobar.gov.in/sir2002/` ("Advance Electoral Search-2002") requires entering name/part/serial + **CAPTCHA → Scriptable=N**; not attempted. (This is a separate domain from ceoandaman.nic.in.)
3. **CEO site root redirect loop:** `https://ceoandaman.nic.in/` returns `302 Found` → itself for plain HTTP fetch; content is reachable via `www.` host and via deep links under `/election/...`. Not a gate for the files themselves.
4. The 2002 index page's tehsil links did not render as text hrefs (likely image/JS); navigating deeper required browser interaction beyond text fetch, so tehsil sub-index URLs are recorded as not-observed rather than guessed.
5. Space characters in `AnnounceContent` filenames ("SERVICE VOTER FINAL ROLL 21.02.2026.pdf") require `%20` encoding in scripts.

## Row count
**32 rows:** 29 × 2002 final-roll part PDFs + 3 × service voter PDFs (2025 draft, 2025 final, 2026 final). Districts covered: Andaman (17 parts with confirmed district), Nicobar (6 parts), district-unconfirmed (6 parts: 45, 71, 73, 335, 336, 337). All Scriptable=Y (plain HTTPS GET, no gate observed). No deletion/ASDD list rows — none directly observable.
