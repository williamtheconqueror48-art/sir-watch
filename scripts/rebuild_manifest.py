#!/usr/bin/env python3
"""Rebuild manifest.json entries by scanning shard files on disk.

Usage: python3 scripts/rebuild_manifest.py --out data/shards --datasets ka-asd,ka-notices
Merges into the existing manifest (does not wipe other datasets).
Provenance/fields come from the dataset builders in build_shards.py;
row counts and the shard file map come from the .json.gz files on disk.
"""
import argparse, datetime, gzip, json, os, sys, glob

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__))))
import build_shards as bs

BUILDERS = {"ka-asd": bs.dataset_ka_asd, "ka-notices": bs.dataset_ka_notices,
            "ka-asddo": bs.dataset_ka_asddo}

def scan_dataset(out, key):
    ddir = os.path.join(out, key)
    shards = {}
    total = 0
    for gz in glob.glob(os.path.join(ddir, "*.json.gz")):
        with gzip.open(gz, "rt", encoding="utf-8") as f:
            doc = json.load(f)
        sk = doc["shard"]
        n = doc["count"]
        assert doc["dataset"] == key, f"{gz}: dataset tag {doc['dataset']} != {key}"
        assert n == len(doc["rows"]), f"{gz}: count field {n} != actual rows {len(doc['rows'])}"
        rel = f"{key}/{os.path.basename(gz)}"
        e = shards.setdefault(sk, {"count": 0, "files": []})
        e["count"] += n
        e["files"].append(rel)
        total += n
    # normalize: single-file shards keep the legacy {"file", "count"} shape
    for sk, e in shards.items():
        e["files"].sort()
        if len(e["files"]) == 1:
            shards[sk] = {"file": e["files"][0], "count": e["count"]}
        else:
            shards[sk] = {"files": e["files"], "count": e["count"]}
    return shards, total

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="data/shards")
    ap.add_argument("--datasets", required=True, help="comma-separated dataset keys")
    args = ap.parse_args()
    out = os.path.abspath(args.out)
    manifest_path = os.path.join(out, "manifest.json")
    manifest = json.load(open(manifest_path, encoding="utf-8")) if os.path.exists(manifest_path) else {"v": 1}
    ok = True
    for key in args.datasets.split(","):
        key = key.strip()
        ds = BUILDERS[key]()
        shards, total = scan_dataset(out, key)
        exp = ds["provenance"].get("expected_rows")
        mark = "OK" if total == exp else "MISMATCH"
        if total != exp:
            ok = False
        print(f"[{key}] disk scan: {total} rows in {len(shards)} shards (expected {exp}) {mark}")
        manifest[key] = {"key": key, "fields": ds["fields"], "rows": total,
                         "shard_count": len(shards), "shards": shards,
                         "provenance": ds["provenance"]}
    manifest["built_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False)
    print("manifest rebuilt (merged):", manifest_path)
    print("ALL_EXACT" if ok else "STILL_OFF")
    sys.exit(0 if ok else 1)

if __name__ == "__main__":
    main()
