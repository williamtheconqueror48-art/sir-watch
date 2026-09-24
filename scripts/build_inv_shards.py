#!/usr/bin/env python3
"""Build name-prefix shards for inv-rolls, kerala-service-2017, uttarakhand-service-2026.

Reads unified parsed JSONL (data/parsed/inventory/*.jsonl), applies the shard
field-mapping contract, and builds gzipped name shards via build_shards.build_dataset.
Merges into data/shards/manifest.json without touching existing entries.

Shard field contract (parent 2026-09-24):
  elector_name->voter_name | relation_name->relative_name
  source_file_url->source_url | roll_vintage->vintage_label
  part_number->booth_no (string) | roll_type->source_label (human-readable)
  vintage_class, record_type preserved | source_url always carried.
"""
import gzip, json, os, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE, "scripts"))
from build_shards import build_dataset, shard_key  # noqa: E402

PARSED = os.path.join(BASE, "data", "parsed", "inventory")

FIELDS = ["voter_name", "relative_name", "age", "sex", "address", "state",
          "district", "ac_number", "ac_name", "booth_no", "vintage_label",
          "vintage_class", "source_label", "record_type", "epic_masked",
          "source_url", "dataset"]

ROLL_TYPE_PRETTY = {"service_elector_roll": "Service Electors Roll"}


def source_label(rec):
    rt = rec.get("roll_type") or ""
    if rec.get("vintage_class") == "other" and "pooling" in rt.lower():
        return "APPLICATIONS, CLAIMS & OBJECTIONS \u2014 NOT ROLLS"
    return ROLL_TYPE_PRETTY.get(rt, rt) or rec.get("record_type") or ""


def to_row(r):
    pn = r.get("part_number")
    booth = "" if pn in (None, "") else str(pn)
    return [
        r.get("elector_name") or "",
        r.get("relation_name") or "",
        r.get("age"),
        r.get("sex") or "",
        r.get("address") or "",
        r.get("state") or "",
        r.get("district") or "",
        r.get("ac_number") or "",
        r.get("ac_name") or "",
        booth,
        r.get("roll_vintage") or "",
        r.get("vintage_class") or "",
        source_label(r),
        r.get("record_type") or "",
        r.get("epic_masked") or "",
        r.get("source_file_url") or "",
        r.get("dataset") or "",
    ]


def read_jsonl(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                yield json.loads(line)


def dataset_def(key, jsonl_files, provenance):
    def rows():
        for jf in jsonl_files:
            for r in read_jsonl(os.path.join(PARSED, jf)):
                if not r.get("elector_name"):
                    continue
                row = to_row(r)
                assert row[15], f"missing source_url in {jf}"
                yield row
    # expected_rows = reconciled parsed total (verified before build)
    total = sum(1 for jf in jsonl_files for r in read_jsonl(os.path.join(PARSED, jf))
                if r.get("elector_name"))
    provenance["expected_rows"] = total
    return {"key": key, "fields": FIELDS, "rows": rows, "provenance": provenance}


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--out", default=os.path.join(BASE, "data", "shards"))
    args = ap.parse_args()

    builders = {
        "inv-rolls": lambda: dataset_def(
            "inv-rolls",
            ["arunachal-pradesh.jsonl", "delhi.jsonl", "goa.jsonl",
             "manipur.jsonl", "mizoram.jsonl", "puducherry.jsonl"],
            {"source": "CEO websites (Arunachal Pradesh, Delhi, Goa, Manipur, Mizoram, Puducherry); direct PDF fetches 2026-09-24",
             "note": "Parsed from ECI-format electoral rolls and service-elector rolls. EPICs masked at parse time (ABC****XYZ); full EPICs never stored. Bihar statistical tables (no elector rows) and Meghalaya 2005 scans (garbled OCR layer, unparseable) excluded with logged reasons. Mizoram monthly-pooling lists are applications/claims, not rolls (vintage_class=other).",
             "retrieved_at": "2026-09-24"}),
        "kerala-service-2017": lambda: dataset_def(
            "kerala-service-2017", ["kerala-service-2017.jsonl"],
            {"source": "CEO Kerala service-elector PDFs (140 files), 2017 Special Summary Revision",
             "note": "2017 Special Summary Revision \u2014 SERVICE ELECTORS (defence/armed-police/foreign-service personnel + wives; final publication 10-01-2017). Not Kerala's civilian roll; not pre/post-SIR. vintage_class=other; excluded from vote-check comparison. Source has no EPIC column.",
             "retrieved_at": "2026-09-24"}),
        "uttarakhand-service-2026": lambda: dataset_def(
            "uttarakhand-service-2026", ["uttarakhand.jsonl"],
            {"source": "CEO Uttarakhand draft-roll 2026 service-elector PDFs (3 ACs: Bhimtal, Haldwani, Kaladhungi)",
             "note": "Draft Electoral Roll 2026, Service Electors, SSR(D), qualifying 01-07-2026, draft publication 14-07-2026. post-SIR vintage.",
             "retrieved_at": "2026-09-24"}),
    }

    manifest_path = os.path.join(args.out, "manifest.json")
    manifest = json.load(open(manifest_path, encoding="utf-8"))
    import datetime
    manifest["built_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    for k, b in builders.items():
        if args.only and k != args.only:
            continue
        print(f"building {k}...", flush=True)
        manifest[k] = build_dataset(b(), args.out)
    tmp = manifest_path + ".tmp"
    json.dump(manifest, open(tmp, "w", encoding="utf-8"), ensure_ascii=False)
    os.replace(tmp, manifest_path)
    print("manifest updated:", manifest_path)


if __name__ == "__main__":
    main()
