#!/usr/bin/env python3
"""Build SIR-WATCH national roll-file inventory outputs.

Inputs:
  inventory/sir-inventory-<state>.jsonl  (36 files, exact 10-key schema)
  /tmp/inv_livecheck.tsv                 (live GET verification of scriptable=Y URLs)
Outputs:
  data/inventory/inventory.jsonl         (381 rows + live_status + record_type)
  data/inventory/inventory.csv
  inventory/INVENTORY_REPORT.md
Zero fabrication: rows only ever come from worker-observed JSONL.
"""
import json, glob, csv, os, re
from collections import Counter

INV_DIR = os.path.expanduser("~/workspace/sir-watch/inventory")
OUT_DIR = os.path.expanduser("~/workspace/sir-watch/data/inventory")
os.makedirs(OUT_DIR, exist_ok=True)

def classify(roll_type, fmt):
    rt = (roll_type or "")
    f = (fmt or "")
    low = rt.lower() + " " + f.lower()
    if "mlc" in low or "local authorities" in low or "council" in low:
        return "council_roll"
    if any(k in low for k in ["statistical", "statistics", "electors summary", "aggregate statistics",
                              "voter count summary", "analysis (statistical", "electorate aggregate"]):
        return "statistics"
    if "press note" in low:
        return "press_notice"
    if "instruction document" in low:
        return "instruction"
    if f.startswith("webpage") or "index page" in low or "listing page" in low or "portal —" in rt:
        return "listing_page"
    if any(k in low for k in ["form 9", "form 10", "form 11", "claims", "objection", "bulletin",
                              "movement", "transposition"]):
        return "claims_objections"
    if "asdd" in low or "asd index" in low:
        return "asdd_list"
    if "supplement" in low or "monthly pooling" in low:
        return "supplement"
    if "service" in low:
        return "service_elector_roll"
    return "main_roll"

# --- live check results ---
live = {}
if os.path.exists("/tmp/inv_livecheck.tsv"):
    for line in open("/tmp/inv_livecheck.tsv", encoding="utf-8"):
        parts = line.rstrip("\n").split("\t")
        if len(parts) < 6: continue
        url, code, ctype, eff, size, err = parts
        live[url] = {"http_status": code, "content_type": ctype,
                     "final_url": eff, "bytes_sampled": size, "error": err}

rows = []
for f in sorted(glob.glob(os.path.join(INV_DIR, "sir-inventory-*.jsonl"))):
    if f.endswith("-notes.jsonl"): continue
    for line in open(f, encoding="utf-8"):
        line = line.strip()
        if not line: continue
        r = json.loads(line)
        url = r["file_url"]
        lc = live.get(url)
        if r["scriptable"] == "Y" and lc:
            code = lc["http_status"]
            bytes_got = int(lc["bytes_sampled"] or "0") if (lc["bytes_sampled"] or "").isdigit() else 0
            if code.startswith("2") and bytes_got > 0:
                r["live_status"] = "verified_live"
            elif code in ("404", "410"):
                r["live_status"] = f"dead_link_{code}"
            elif code == "000":
                # sandbox egress cannot reach these hosts (DNS resolves to
                # unroutable space); link was directly observed, not declared dead
                r["live_status"] = "not_reachable_from_sandbox"
            elif code == "406":
                r["live_status"] = "verification_blocked_406"
            else:
                r["live_status"] = f"check_failed_{code or 'no_response'}"
            r["live_http_status"] = code
            r["live_content_type"] = lc["content_type"]
        elif r["scriptable"] == "Y":
            r["live_status"] = "not_checked"
            r["live_http_status"] = None
            r["live_content_type"] = None
        else:
            r["live_status"] = "gated_or_listing"
            r["live_http_status"] = None
            r["live_content_type"] = None
        r["record_type"] = classify(r.get("roll_type"), r.get("format"))
        rows.append(r)

# downgrade dead links: not scriptable in practice
dead = 0
for r in rows:
    if r["live_status"].startswith("dead_link"):
        r["scriptable"] = "N"
        dead += 1

rows.sort(key=lambda r: (r["state"] or "", r.get("district") or "",
                         str(r.get("ac_number") or ""), str(r.get("part_number") or "")))

with open(os.path.join(OUT_DIR, "inventory.jsonl"), "w", encoding="utf-8") as fh:
    for r in rows:
        fh.write(json.dumps(r, ensure_ascii=False) + "\n")

cols = ["state","district","ac_number","ac_name","part_number","roll_type","record_type",
        "file_url","format","scriptable","live_status","live_http_status","live_content_type","last_updated"]
with open(os.path.join(OUT_DIR, "inventory.csv"), "w", encoding="utf-8", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore")
    w.writeheader()
    for r in rows: w.writerow(r)

print(f"rows={len(rows)} states={len({r['state'] for r in rows})} dead_downgraded={dead}")
print("record_type:", dict(Counter(r["record_type"] for r in rows)))
print("live_status:", dict(Counter(r["live_status"] for r in rows)))
print("scriptable:", dict(Counter(r["scriptable"] for r in rows)))
