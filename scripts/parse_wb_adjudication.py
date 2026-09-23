#!/usr/bin/env python3
"""Parse Alt News SIR Data Decoded adjudication HTML -> JSONL for bulk ingest.
EPICs are masked at parse time (first3 + **** + last3); full EPICs are never
written to the output. Fields map 1:1 to deletion_records columns.
"""
import json
import re
import sys

SRC = "/home/hatch/workspace/sir-watch/data/raw/sirwatch_raw/media_altnews_sir_bhabanipur_ballygunge_adjudication_records.html"
OUT = "/home/hatch/workspace/sir-watch/data/wb_adjudication.jsonl"
PAGE = "https://sir-data-decoded.altnews.in/see-adjudication-records.html"
AC_NAMES = {"159": "Bhabanipur", "161": "Ballygunge"}


def mask(epic: str) -> str:
    e = (epic or "").strip()
    if len(e) < 7:
        return "****"
    return e[:3] + "****" + e[-3:]


def main() -> None:
    data = open(SRC, encoding="utf-8", errors="replace").read()
    m = re.search(r"const DATA = (\[.*?\]);\s*\n", data, re.S)
    arr = json.loads(m.group(1))
    n = 0
    with open(OUT, "w", encoding="utf-8") as f:
        for r in arr:
            name = (r.get("name") or "").strip()
            if not name:
                continue
            acm = re.search(r"-S\d+-(\d+)-", r.get("source", ""))
            ac_no = acm.group(1) if acm else ""
            booth = (r.get("booth") or "").strip()
            bm = re.match(r"Booth\s+(\d+)\s*[—-]\s*(.*)", booth)
            booth_no = bm.group(1) if bm else None
            booth_name = bm.group(2).strip() if bm else (booth or None)
            f.write(json.dumps({
                "state": "West Bengal",
                "district": "Kolkata",
                "ac_name": AC_NAMES.get(ac_no, "AC " + ac_no if ac_no else None),
                "booth_no": booth_no,
                "booth_name": booth_name,
                "voter_name": name,
                "epic_masked": mask(r.get("voter_id", "")),
                "deletion_reason": "Under adjudication — SIR final roll revision 1 (Alt News SIR Data Decoded; decision not stated in source)",
                "phase": "Phase 2",
                "source_url": PAGE,
            }, ensure_ascii=False) + "\n")
            n += 1
    print(f"wrote {n} rows -> {OUT}")


main()
