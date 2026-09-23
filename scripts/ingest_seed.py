#!/usr/bin/env python3
"""
SIR-WATCH seed ingestion (v0, 2026-09-23).

Downloads each source document to data/raw/, hashes the bytes, seals one
ingestion_ledger batch per source, and inserts rows carrying that ledger id.
All figures/descriptions are reproduced VERBATIM from the cited source as
retrieved today; nothing is estimated or interpolated. Competing claims are
stored as separate rows and never merged.

DB access: project 'sir-watch' via the neon skill credential helper.
The connection URI lives in memory only and is never printed or persisted.
"""
import hashlib
import json
import os
import subprocess
import sys
import urllib.request

SKILL_BIN = "/home/hatch/workspace/skills/neon/bin"
sys.path.insert(0, SKILL_BIN)
import neon_api  # noqa: E402

RAW = "/home/hatch/workspace/sir-watch/data/raw"
os.makedirs(RAW, exist_ok=True)

SOURCES = [
    {
        "key": "madhyamam_ecr_review",
        "source_name": "ECI one-year SIR review (via Madhyamam)",
        "url": "https://madhyamamonline.com/india/special-intensive-revision-completes-one-year-around-6-crore-names-removed-from-voter-lists-1532376",
        "rows": {"kind": "mixed"},
    },
    {
        "key": "gk365_sir_phase3",
        "source_name": "GK365 current-affairs explainer (SIR Phase 3)",
        "url": "https://gk365.in/current-affairs-articles/national/eci-special-intensive-revision-phase-3-2026/",
        "rows": {"kind": "mixed"},
    },
    {
        "key": "inc_ramesh_statement",
        "source_name": "INC claim \u2014 Jairam Ramesh statement 2026-09-20 (via Daily Jagran)",
        "url": "https://www.thedailyjagran.com/lite/india/news/congress-calls-sir-shah-instigated-removal-questions-high-voter-removal-in-12-states-10329852",
        "rows": {"kind": "mixed"},
    },
    {
        "key": "medium_sir_analysis",
        "source_name": "Medium analysis \u2014 India\u2019s Shrinking Voter Rolls (Apr 2026)",
        "url": "https://medium.com/@amarmoid322/indias-shrinking-voter-rolls-what-the-deletion-of-3-13-71566306e26f",
        "rows": {"kind": "mixed"},
    },
    {
        "key": "ie_dissent_maktoob",
        "source_name": "Indian Express dissent investigation (via Maktoob)",
        "url": "https://maktoobmedia.com/post?id=116516&slug=destroyed-electoral-integrity-at-bjps-behest-opposition-hits-out-at-cec-after-report-finds-two-ecs-objected-14-times-to-sir-decisions-in-10-months",
        "rows": {"kind": "mixed"},
    },
    {
        "key": "eci_denial_ians",
        "source_name": "ECI denial of dissent report (via IANS)",
        "url": "https://ianslive.in/eci-rejects-report-of-dissent-by-election-commissioners-says-all-decisions-including-sir-were-unanimous--20260923110202",
        "rows": {"kind": "mixed"},
    },
    {
        "key": "sc_hearing_taxtmi",
        "source_name": "SC SIR hearing report (PTI via TaxTMI)",
        "url": "https://www.taxtmi.com/news?id=68874",
        "rows": {"kind": "mixed"},
    },
]

# Verbatim seed rows, keyed by source key. Figures exactly as published.
PHASES = [
    # (source_key, phase, announced, enum_start, enum_end, coverage, electorate_cr)
    ("madhyamam_ecr_review", "Phase 1", None, "2025-06-24", None,
     "Bihar (pilot) \u2014 first intensive revision of the state rolls since 2003", None),
    ("madhyamam_ecr_review", "Phase 2", "2025-10-27", None, None,
     "12 states/UTs: Kerala, Uttar Pradesh, West Bengal, Tamil Nadu, Rajasthan, "
     "Chhattisgarh, Puducherry, Andaman and Nicobar Islands, Lakshadweep, Gujarat, "
     "Madhya Pradesh, Goa", None),
    ("gk365_sir_phase3", "Phase 3", "2026-05-14", "2026-05-30", None,
     "16 states + 3 UTs; Himachal Pradesh, J&K and Ladakh excluded", "36.73"),
]

SNAPSHOTS = [
    # (source_key, state, phase, pre, post, deletions, pct, notices)
    ("madhyamam_ecr_review", "Phase 2 aggregate (12 states/UTs)", "Phase 2",
     509900000, 458100000, 51800000, 10.2, None),
    ("madhyamam_ecr_review", "Bihar", "Phase 1", None, None, 6500000, None, None),
    ("gk365_sir_phase3", "Uttar Pradesh", "Phase 2", None, None, 20400000, None, None),
    ("gk365_sir_phase3", "West Bengal", "Phase 2", None, None, 9100000, None, None),
    ("gk365_sir_phase3", "Bihar", "Phase 1", None, None, 4700000, None, None),
    ("inc_ramesh_statement", "Phases 1+2 aggregate", "Phase 1+2",
     None, None, 78000000, 13.0, None),
    ("inc_ramesh_statement", "Phase 3 reporting states (12 states + 2 UTs)", "Phase 3",
     360600000, None, 61800000, 17.0, 54300000),
    ("medium_sir_analysis", "West Bengal", "Phase 2", None, None, 6366000, 15.9, None),
    ("medium_sir_analysis", "Gujarat", "Phase 2", None, None, 6812000, 13.4, None),
    ("medium_sir_analysis", "Tamil Nadu", "Phase 2", None, None, 7000000, None, None),
    ("medium_sir_analysis", "Bihar", "Phase 1", None, None, 6866000, None, None),
]

DISSENT = [
    # (source_key, date, precision, commissioner, subject, description)
    ("ie_dissent_maktoob", "2026-05-01", "month", "Vivek Joshi",
     "Form 6 change questioned",
     "Joshi questioned the process of changing Form 6 in May, saying the form could not "
     "be changed in that manner without an amendment to the rules."),
    ("ie_dissent_maktoob", "2026-08-01", "month", "Sukhbir Singh Sandhu",
     "Form 6 change called \u2018unauthorised and illegal\u2019",
     "Sandhu described the July change to Form 6 \u2014 adding a question on whether the "
     "applicant, parents or grandparents were on the previous SIR roll \u2014 as "
     "\u2018unauthorised and illegal\u2019 and said it \u2018must be removed immediately\u2019."),
    ("ie_dissent_maktoob", None, "not_stated", "Vivek Joshi",
     "ERONet centralisation flagged",
     "Joshi flagged a \u2018gradual centralisation of the electoral roll database\u2019 and "
     "suggested it be ensured that only the relevant statutory authorities have permission "
     "to make changes."),
    ("ie_dissent_maktoob", None, "not_stated", "Sukhbir Singh Sandhu",
     "State officials\u2019 ERONet access",
     "Sandhu said state-level election officials had reported that they \u2018don\u2019t have "
     "proper and complete access\u2019 to the ERONet system."),
    ("ie_dissent_maktoob", None, "not_stated", "Sukhbir Singh Sandhu",
     "West Bengal appeals questioned",
     "Sandhu asked who was authorised to file appeals on behalf of ECI against voters whom "
     "judicial officers had included in the rolls in West Bengal, saying neither he nor Joshi "
     "nor the state Chief Electoral Officer had been informed of the basis or process."),
    ("ie_dissent_maktoob", None, "not_stated", "Reported in IE investigation",
     "Goa software gap \u2014 97 voters",
     "97 voters found eligible by Electoral Registration Officers after being flagged for "
     "\u2018logical discrepancies\u2019 could not be recorded before the final roll was published; "
     "the Goa CEO\u2019s office wrote eight times seeking a rollback facility that was not enabled "
     "before the deadline."),
    ("ie_dissent_maktoob", None, "not_stated", "Sukhbir Singh Sandhu and Vivek Joshi",
     "Communications without full-Commission approval",
     "Sandhu wrote that \u2018many communications go out in the name of the ECI but they do not "
     "have the approval of the Commission\u2019; Joshi said \u2018several communications are "
     "disseminated in the name of the ECI without the requisite approval of the Commission\u2019."),
    ("ie_dissent_maktoob", "2026-09-23", "exact", "The Indian Express",
     "Investigation published: 14 on-record objections in 10 months",
     "The Indian Express reported that Sandhu and Joshi had formally objected on record at "
     "least 14 times over 10 months \u2014 four times on a single day \u2014 to decisions taken "
     "and orders issued without their knowledge, covering voter addition, deletion and "
     "restoration, Form 6 changes, and electoral-roll technology."),
    ("eci_denial_ians", "2026-09-23", "exact", "ECI (denial)",
     "ECI rejects dissent report; claims unanimity",
     "The Election Commission rejected the report, saying no Election Commissioner had "
     "recorded dissent and that all decisions of the ECI, including SIR, were unanimous with "
     "the approval of the CEC and both Election Commissioners."),
]

SC_EVENTS = [
    # (source_key, date, type, title, description)
    ("gk365_sir_phase3", None, "petition",
     "ADR vs ECI \u2014 Writ Petition (Civil) 640/2025",
     "Petition challenging the Special Intensive Revision of electoral rolls; bench of "
     "Justices Surya Kant and Joymalya Bagchi (as constituted at filing)."),
    ("sc_hearing_taxtmi", "2026-01-28", "hearing",
     "SC resumes final hearing on 19 petitions",
     "CJI Surya Kant on mass-deletion claims: \u2018Additions and deletions are part of the "
     "electoral roll revision exercise.\u2019 On Aadhaar as proof: \u2018the possibility of "
     "forgery cannot be a ground to reject the 12-digit biometric identifier.\u2019"),
    ("gk365_sir_phase3", None, "direction",
     "Aadhaar added as 12th identity document",
     "Aadhaar added as the 12th identity document for SIR following Supreme Court direction "
     "in ADR vs ECI; the distinction recorded is that Aadhaar proves identity, not citizenship."),
]


def fetch(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "SIR-WATCH/0.1 research"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
    except Exception as e:  # noqa: BLE001
        print(f"  FETCH FAILED {url}: {e}")
        return None
    with open(dest, "wb") as f:
        f.write(data)
    h = hashlib.sha256(data).hexdigest()
    print(f"  saved {dest} ({len(data)} bytes, sha256 {h[:12]}...)")
    return h


def main():
    project = neon_api.find_or_create_project("sir-watch", quiet=True)
    uri = neon_api.connection_uri(project["id"])
    actions = []
    ledger_ids = {}

    for src in SOURCES:
        dest = os.path.join(RAW, src["key"] + ".html")
        sha = fetch(src["url"], dest)
        if sha is None:
            print(f"SKIP batch for {src['key']} (unreachable)")
            continue
        row_count = (
            len([p for p in PHASES if p[0] == src["key"]])
            + len([s for s in SNAPSHOTS if s[0] == src["key"]])
            + len([d for d in DISSENT if d[0] == src["key"]])
            + len([c for c in SC_EVENTS if c[0] == src["key"]])
        )
        actions.append({
            "sql": "INSERT INTO ingestion_ledger (source_name, source_url, retrieved_at, sha256, row_count) "
                   "VALUES ($1,$2,NOW(),$3,$4) RETURNING id",
            "params": [src["source_name"], src["url"], sha, row_count],
            "returns": "rows",
        })
        ledger_ids[src["key"]] = len(actions) - 1  # index into results

    payload = {"uri": uri, "actions": actions}
    proc = subprocess.run(
        ["node", os.path.join(SKILL_BIN, "neon-exec.js")],
        input=json.dumps(payload).encode(), capture_output=True, timeout=180,
    )
    if proc.returncode != 0:
        print("LEDGER INSERT FAILED:", proc.stderr.decode()[:500])
        sys.exit(1)
    results = json.loads(proc.stdout.decode())["results"]
    id_by_key = {}
    i = 0
    for src in SOURCES:
        if src["key"] in ledger_ids:
            lid = results[i][0]["id"]
            id_by_key[src["key"]] = lid
            print(f"ledger {lid}: {src['key']}")
            i += 1

    data_actions = []
    for key, phase, ann, es, ee, cov, ecr in PHASES:
        if key not in id_by_key:
            continue
        data_actions.append({
            "sql": "INSERT INTO sir_phases (phase, announced_date, enumeration_start, enumeration_end, "
                   "coverage, electorate_covered_cr, source_name, source_url, ledger_id) "
                   "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
            "params": [phase, ann, es, ee, cov, ecr,
                       next(s["source_name"] for s in SOURCES if s["key"] == key),
                       next(s["url"] for s in SOURCES if s["key"] == key),
                       id_by_key[key]],
            "returns": "none",
        })
    for key, state, phase, pre, post, dele, pct, notices in SNAPSHOTS:
        if key not in id_by_key:
            continue
        data_actions.append({
            "sql": "INSERT INTO state_snapshots (state, phase, pre_sir_electors, post_sir_electors, "
                   "deletions, deletion_pct, notices_issued, source_name, source_url, ledger_id) "
                   "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
            "params": [state, phase, pre, post, dele, pct, notices,
                       next(s["source_name"] for s in SOURCES if s["key"] == key),
                       next(s["url"] for s in SOURCES if s["key"] == key),
                       id_by_key[key]],
            "returns": "none",
        })
    for key, date, prec, comm, subj, desc in DISSENT:
        if key not in id_by_key:
            continue
        data_actions.append({
            "sql": "INSERT INTO dissent_events (event_date, date_precision, commissioner, subject, "
                   "description, source_name, source_url, ledger_id) "
                   "VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
            "params": [date, prec, comm, subj, desc,
                       next(s["source_name"] for s in SOURCES if s["key"] == key),
                       next(s["url"] for s in SOURCES if s["key"] == key),
                       id_by_key[key]],
            "returns": "none",
        })
    for key, date, typ, title, desc in SC_EVENTS:
        if key not in id_by_key:
            continue
        data_actions.append({
            "sql": "INSERT INTO sc_events (event_date, event_type, title, description, source_url, ledger_id) "
                   "VALUES ($1,$2,$3,$4,$5,$6)",
            "params": [date, typ, title, desc,
                       next(s["url"] for s in SOURCES if s["key"] == key),
                       id_by_key[key]],
            "returns": "none",
        })

    payload = {"uri": uri, "actions": data_actions}
    proc = subprocess.run(
        ["node", os.path.join(SKILL_BIN, "neon-exec.js")],
        input=json.dumps(payload).encode(), capture_output=True, timeout=180,
    )
    if proc.returncode != 0:
        print("DATA INSERT FAILED:", proc.stderr.decode()[:500])
        sys.exit(1)
    print(f"inserted {len(data_actions)} rows across {len(id_by_key)} ledger batches")


if __name__ == "__main__":
    main()
