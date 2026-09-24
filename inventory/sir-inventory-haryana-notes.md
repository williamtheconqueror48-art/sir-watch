# Haryana CEO roll inventory — notes (2026-09-24)

Site: `https://www.ceoharyana.gov.in/` (fetched 2026-09-24; browser task not available to subagent).

## Click path (as exposed in fetched page text)

Homepage menu items (hrefs not exposed in fetched text):
- Voter Corner > Final Roll Revision-II-2nd SSR 2024 as on 12-09-2024
- SIR - Special Intensive Revision 2026
- Monthly Pooling (Additions, Deletions and Modifications) — landing page
  `https://ceoharyana.gov.in/WebCMS/Start/1828` (fetched 2026-09-24; returned only
  heading/footer, no document links — JS-rendered or otherwise omitted content).
- Site listing page: `https://ceoharyana.gov.in/WebCMS/Start/1524`.

## Access blockers / Scriptable flags

1. SIR 2026 draft electoral roll — CAPTCHA-gated. Search evidence describes the path:
   Home > Draft Electoral Roll 2026 as on 31-07-2026 > Select district >
   Select Assembly Constituency > Select language > Select Part Number/Part Name >
   Enter CAPTCHA > Download PDF.
   Third-party reporting claims all 90 ACs are represented, but no direct SIR 2026
   PDF URL was observed. Scriptable=N for this route. CAPTCHA not attempted (standing rule).
2. Monthly supplement PDFs (10 rows) are plain GET direct links — Scriptable=Y.
   One was fetched successfully via plain GET and verified text-searchable.

## Direct file URL pattern

`https://ceoharyana.gov.in/Website/ELECTIONCOMMISSION/Images/{UUID}.pdf`
UUIDs are opaque; no safe predictable numeric or filename pattern exists.
No JSON/API-like endpoint was found.

## Vintages observed (10 JSONL rows)

Monthly "List of applications for Addition in E-Roll" statewide PDFs for 2025 —
months 1, 2, 3, 5, 6, 7, 8, 9, 10, 12. Each file contains multiple Haryana
district/AC sections (BHIWANI, PANCHKULA, HISAR rows seen in search snippets;
the 12-2025 PDF was fetched and verified to hold multiple district sections,
title "List of applications for Addition in E-Roll 12-2025").
Classified as roll_type=Supplement; district/ac_number/ac_name/part_number are
null because each file spans many districts, not one AC/part.
Months 4-2025 and 11-2025 addition lists were not indexed for Haryana
(one November result was a Chhattisgarh file — excluded). No 2026 monthly lists
indexed on the CEO site; 2026 search results were blank ECI forms and State
Election Commission (Panchayat/ULB) documents, not Assembly roll files.
No separate monthly Deletion or Modification lists were observed for Haryana
(only blank Form 7/8A forms). last_updated is null for all rows — no
document/page date was shown; search-engine "days ago" values are not page dates.

## Observed but excluded from JSONL

- Aggregate final-roll statistics PDFs (AC-wise stats, not part-wise rolls):
  2022 SSR (05.01.2022): `.../Images/4c341c4a-9d62-49dd-940b-f91825f5e30c.pdf`
  2023 SSR (05.01.2023): `.../Images/5997dc78-03ea-4688-8c7d-0d517f2cef2f.pdf`
  2024 Final (22.01.2024): `.../Images/8a1f7ab0-134c-45d0-b52d-8ffca7a283ac.pdf`
  2024 Final II (27.08.2024): `.../Images/c212428b-3653-4991-baf5-76034dda1af6.pdf`
- Blank forms: Form 7 (`bf5252fa-dd54-4cc2-a0d6-9ae2f691332a.pdf`),
  Form 8A (`0337a60f-d353-45f7-a621-c9aca493e990.pdf`), 2020 Form-11 claims/objections.
- SIR 2026 route: gate documented above; zero directly observed file URLs, zero rows.

## APIs

None found.

## Hindi/regional labels

No Hindi labels were actually found in fetched page text; menu and document
titles observed were in English. None preserved because none observed.

## Method

Public web search (site-scoped month-by-month queries, Chhattisgarh/Karnataka
homonyms excluded) plus direct page-text fetches of the CEO homepage, Monthly
Pooling landing page, site listing page, and one supplement PDF. URLs used only
if seen verbatim in fetched text or search results; nothing guessed or inferred.

## Exact count

`sir-inventory-haryana.jsonl` contains 10 rows (non-header JSONL lines).
Coverage: statewide Haryana monthly addition supplements, 10 of 12 months of
2025. Districts/ACs/parts: not applicable per-row (statewide compilations;
null). Pre-SIR full roll part PDFs and SIR 2026 draft/final PDFs: 0 rows —
no direct URLs observable; gated behind CAPTCHA.
