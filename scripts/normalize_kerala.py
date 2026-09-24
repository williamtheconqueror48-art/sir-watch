#!/usr/bin/env python3
"""Normalize Kerala 2017 service-elector JSONL into the unified inv-rolls schema.

Input : data/kerala/jsonl/kerala_service_electors_2017.jsonl (89,885 rows, verified)
Output: data/parsed/inventory/kerala-service-2017.jsonl (unified schema + supplemental fields)

Mapping (per parent directive 2026-09-24):
  elector_name=name | relation_name="" (husband_sl_no is a serial ref, never a name)
  age=age | sex=elector_type (M/W/blank kept verbatim)
  address=house_address (+ " [Regimental: <regimental_address>]" when non-empty)
  state="Kerala" | district="" (pc_name is NOT a district)
  ac_number=ac_no | ac_name=ac_name | part_number=""
  roll_vintage="2017 Special Summary Revision, Service Electors, final publication 10-01-2017"
  roll_type="service_elector_roll" | source_file_url=source_url | epic_masked=""
  dataset="kerala-service-2017" | vintage_class="other" | record_type from source
Supplemental fields preserved on each row: sl_no, rank, pc_no, pc_name, section,
  revision_type, final_publication, husband_sl_no, parse_method, repaired.
"""
import datetime, json, os, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "data", "kerala", "jsonl", "kerala_service_electors_2017.jsonl")
OUTDIR = os.path.join(BASE, "data", "parsed", "inventory")
OUT = os.path.join(OUTDIR, "kerala-service-2017.jsonl")

VINTAGE = "2017 Special Summary Revision, Service Electors, final publication 10-01-2017"
NOW = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")

# EPIC-shaped plaintext must never be written; source has no EPIC column but we
# still guard every free-text field before writing.
EPIC_LIKE = __import__("re").compile(r"\b[A-Z]{3}[0-9]{7}\b|\b[A-Z]{2}/[0-9]{2}/[0-9]{3}/[0-9]{6}\b")


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    n_in = n_out = n_fallback = n_repaired = n_blank_type = 0
    epic_hits = 0
    tmp = OUT + ".tmp"
    with open(SRC, encoding="utf-8") as f, open(tmp, "w", encoding="utf-8") as o:
        for line in f:
            line = line.strip()
            if not line:
                continue
            r = json.loads(line)
            n_in += 1
            if r.get("parse_method") == "word_fallback":
                n_fallback += 1
            if r.get("repaired"):
                n_repaired += 1
            etype = r.get("elector_type")
            if not (etype or "").strip():
                n_blank_type += 1
            addr = (r.get("house_address") or "").strip()
            reg = (r.get("regimental_address") or "").strip()
            if reg:
                addr = f"{addr} [Regimental: {reg}]".strip()
            rec = {
                "elector_name": r.get("name"),
                "relation_name": "",
                "age": r.get("age"),
                "sex": etype,
                "address": addr or None,
                "state": "Kerala",
                "district": "",
                "ac_number": r.get("ac_no"),
                "ac_name": r.get("ac_name"),
                "part_number": "",
                "roll_vintage": VINTAGE,
                "vintage_class": "other",
                "roll_type": "service_elector_roll",
                "record_type": r.get("record_type") or "service_elector_roll",
                "source_file_url": r.get("source_url"),
                "epic_masked": "",
                "parsed_at": NOW,
                "dataset": "kerala-service-2017",
                # supplemental provenance (not in shard contract)
                "sl_no": r.get("sl_no"), "rank": r.get("rank"),
                "pc_no": r.get("pc_no"), "pc_name": r.get("pc_name"),
                "section": r.get("section"),
                "revision_type": r.get("revision_type"),
                "final_publication": r.get("final_publication"),
                "husband_sl_no": r.get("husband_sl_no"),
                "parse_method": r.get("parse_method"),
                "repaired": r.get("repaired"),
            }
            for k, v in rec.items():
                if isinstance(v, str) and k != "rank" and EPIC_LIKE.search(v):
                    # rank holds military service numbers (HAV/SEP/GNR+digits),
                    # not EPICs; every other field must be EPIC-free.
                    epic_hits += 1
            o.write(json.dumps(rec, ensure_ascii=False) + "\n")
            n_out += 1
    os.replace(tmp, OUT)
    print(json.dumps({"input": n_in, "output": n_out, "word_fallback": n_fallback,
                      "repaired": n_repaired, "blank_elector_type": n_blank_type,
                      "epic_like_hits": epic_hits, "out": OUT}))
    assert n_in == n_out == 89885, f"row count mismatch: {n_in} -> {n_out}"
    assert n_fallback == 87, f"fallback count drift: {n_fallback}"
    assert n_repaired == 9, f"repaired count drift: {n_repaired}"
    assert n_blank_type == 2, f"blank-type count drift: {n_blank_type}"
    assert epic_hits == 0, f"EPIC-shaped plaintext found: {epic_hits}"
    print("KERALA NORMALIZE OK")


if __name__ == "__main__":
    main()
