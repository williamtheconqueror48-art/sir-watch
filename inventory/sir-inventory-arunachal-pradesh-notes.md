# Arunachal Pradesh — CEO roll inventory notes

Date of survey: 2026-09-24. Domain used: **ceoarunachal.nic.in** (the hinted domain resolves and is the official CEO AP site). Browser work only — no live clicking; subagent may not operate a browser.

## Click path
1. `browser_open https://ceoarunachal.nic.in/` → homepage (CEOAP) renders with news/press-release lists and CEO's message; the fetched text exposed no explicit nav menu, but the page exists and is live.
2. `browser_open https://ceoarunachal.nic.in/eroll2006ac` (path hinted by third-party coverage of the site) → **"Electoral Roll 2006 AC Wise - CEOAP"** — VERIFIED LIVE via fetch. Lists all 60 ACs, 1-LUMLA … 60-PONGCHAO WAKKA, each as a clickable block entry (link targets not visible in fetched text, so AC-wise consolidated PDFs, if any, could not be captured).
3. `browser_open https://ceoarunachal.nic.in/eroll2006part` → failed with a browser-service fetch error; retry disallowed. Not re-attempted.
4. `browser_search` queries for the CEO domain surfaced 18 indexed PDFs under `/archiverolls/EROLL2006/AC###/A###PPPP.pdf` — full PDF text indexed by the search engine (crawls 42–260 days ago), confirming these are live, direct, text-searchable PDFs with no gate.

## URL pattern
`https://ceoarunachal.nic.in/archiverolls/EROLL2006/AC{NNN}/A{NNN}{PPPP}.pdf`
- NNN = zero-padded AC number (001–060), PPPP = zero-padded part number.
- Example: `.../AC007/A0070030.pdf` = AC 7 BOMDILA, Part 30.
- PDFs are plain GET, no query strings, no referrer/cookie requirement observed → Scriptable = Y.

## Vintage / roll type
- Every observed file is the **"Electoral Roll, 2006 : State - Arunachal Pradesh"** — "Basic roll of intensive revision, 2006", qualifying date 01.01.2006, **Date of Publication: 29.12.2006**. Each PDF carries its own "SUPPLEMENT DETAILS — Supplement No.: 1 … List of Additions, Deletions & Corrections" appended.
- NO draft/final 2025 or 2026 (SIR) roll PDFs were observed on the CEO site. Third-party coverage reports SIR 2026 schedule (draft roll 21.07.2026, final roll 22.09.2026) and points downloads at `https://voters.eci.gov.in/download-eroll` → gated (see below).

## API-like endpoints
- None for rolls. The CMS emits URLs like `https://ceoarunachal.nic.in/componenthelper/getcomponentfile/39` (appeared once in search results, "Untitled"); content unknown — NOT a roll file, not included in inventory.

## Access notes / gates
- Direct archive PDFs (2006): NO gate — Scriptable Y. Format: PDF text-searchable (search engine extracted full elector table text, e.g. "Seagate Crystal Reports - e_e_d").
- Current rolls (2025/2026/SIR Draft/Final): ONLY on ECI `voters.eci.gov.in/download-eroll`, which requires state/year/roll-type → district → AC dropdowns AND a CAPTCHA per part-selection before download → Scriptable N (CAPTCHA gate, never attempted/bypassed).
- `eroll2006part` page fetch failed once (transient tool failure); its links therefore not directly observed. The full part-wise inventory under `/archiverolls/EROLL2006/` is enumerable in principle (AC folders × part PDFs) but only 18 files are claimed here — exactly the ones observed in fetched text/search output.
- District filled only where the observed snippet stated it (rows 12–18); others null rather than guessed. No elector names or EPIC numbers recorded in this inventory (file URLs + metadata only).

## Row counts
- **18 rows** total (JSONL): 15 distinct ACs (2, 7, 9, 13, 14, 16, 23, 24, 28, 30, 45, 47, 49, 53, 60), 18 parts.
- Districts covered (where observed): PAPUM PARE, UPPER SUBANSIRI, EAST KAMENG, ANJAW, WEST SIANG, CHANGLANG.
- Gates: 1 (ECI voters portal CAPTCHA gate for current rolls).
