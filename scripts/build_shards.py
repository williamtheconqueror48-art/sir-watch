#!/usr/bin/env python3
"""Build name-sharded, gzipped static JSON shards from the Karnataka mirrors.

Reads the extracted third-party mirrors (verified schemas) and writes
per-dataset shards keyed by the first 2 characters of the normalized voter
name. Oversized shards are split by 3rd character. Output is .json.gz
(decompressed client-side via DecompressionStream).

Row arrays are compact; field order is documented in shards/manifest.json.

Usage:
    python3 scripts/build_shards.py --out data/shards
"""
import argparse, gzip, json, os, sys, unicodedata
from collections import defaultdict

MIRROR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                      "data", "mirror")

def norm_name(s):
    s = (s or "").strip()
    # keep script as-is (Kannada names stay Kannada); uppercase Latin
    return s.upper()

def shard_key(name, n=2):
    nname = norm_name(name)
    # first n alphanumeric-ish chars; pad short names
    chars = [c for c in nname if c.isalnum()]
    if not chars:
        return "0" * n
    key = "".join(chars[:n])
    return key if len(key) == n else key + "0" * (n - len(key))

DATASETS = {}

def dataset_ka_asd():
    repo = os.path.join(MIRROR, "Karnataka_Draft_Roll_2026-main")
    manifest = json.load(open(os.path.join(repo, "docs", "data-asd", "manifest.json")))
    acs = manifest["acs"]  # dict keyed by AC-number string
    root = os.path.join(repo, "docs", "data-asd", "roll")
    fields = ["name", "district", "ac_name", "part", "reason_code", "src_bucket"]
    def rows():
        for dirpath, _, files in os.walk(root):
            for fn in files:
                if not fn.endswith(".json"):
                    continue
                fp = os.path.join(dirpath, fn)
                rel = os.path.relpath(fp, root)  # e.g. a3/f1.json
                try:
                    bucket = json.load(open(fp))
                except Exception as e:
                    print(f"WARN skip {rel}: {e}", file=sys.stderr)
                    continue
                for t in bucket:
                    # [hash_suffix, ac, part, serial, reason_code, old_part, old_serial, name, relative_name]
                    ac = acs.get(str(t[1]), {})
                    yield [t[7], ac.get("district"), ac.get("name"),
                           str(t[2]), t[4], rel[:-5]]  # src_bucket without .json
    return {"key": "ka-asd", "fields": fields, "rows": rows,
            "provenance": {
                "source_project": "gouthamganeshm/Karnataka_Draft_Roll_2026",
                "source_branch": "main",
                "tarball_sha256": "763117d7ecfe6fc9b58914f8f89c7050261598134c11ec2ce90269c3adbee64d",
                "retrieved_at": "2026-09-23",
                "expected_rows": manifest["rows"],
                "note": "Third-party parser over ECI draft-roll PDFs. EPICs hashed at source; not present.",
            }}

def dataset_ka_notices():
    repo = os.path.join(MIRROR, "Karnataka_Draft_Roll_2026-main")
    manifest = json.load(open(os.path.join(repo, "docs", "data-notices", "manifest.json")))
    acs = manifest["acs"]
    root = os.path.join(repo, "docs", "data-notices", "roll")
    fields = ["name", "district", "ac_name", "part", "reason_text", "drive_file_id"]
    def rows():
        for dirpath, _, files in os.walk(root):
            for fn in files:
                if not fn.endswith(".json"):
                    continue
                fp = os.path.join(dirpath, fn)
                try:
                    bucket = json.load(open(fp))
                except Exception as e:
                    print(f"WARN skip {fp}: {e}", file=sys.stderr)
                    continue
                for t in bucket:
                    # [hash_suffix, acNo, partNo, serial, reason_text, age, gender, name, driveFileId]
                    ac = acs.get(str(t[1]), {})
                    yield [t[7], ac.get("district"), ac.get("name"),
                           str(t[2]), t[4], t[8]]
    return {"key": "ka-notices", "fields": fields, "rows": rows,
            "provenance": {
                "source_project": "gouthamganeshm/Karnataka_Draft_Roll_2026",
                "source_branch": "main",
                "tarball_sha256": "763117d7ecfe6fc9b58914f8f89c7050261598134c11ec2ce90269c3adbee64d",
                "retrieved_at": "2026-09-23",
                "expected_rows": manifest["rows"],
                "note": "Discrepancy/no-mapping notices compiled from district election office PDFs. Notices are NOT deletions.",
            }}

def dataset_ka_asddo():
    repo = os.path.join(MIRROR, "karnataka-asddo-dashboard-main")
    manifest = json.load(open(os.path.join(repo, "docs", "data", "manifest.json")))
    dicts = manifest["dicts"]
    districts, acs, reasons = dicts["districts"], dicts["acs"], dicts["reasons"]
    root = os.path.join(repo, "docs", "data", "asddo")
    parts_dir = os.path.join(repo, "docs", "data", "parts")
    fields = ["name", "epic_masked", "district", "ac_name", "part",
              "booth_name", "reason", "drive_file_id"]
    parts_cache = {}
    def get_part(ac_idx, file_idx):
        if ac_idx not in parts_cache:
            p = os.path.join(parts_dir, f"{ac_idx}.json")
            parts_cache[ac_idx] = json.load(open(p)) if os.path.exists(p) else []
        lst = parts_cache[ac_idx]
        return lst[file_idx] if 0 <= file_idx < len(lst) else None
    def rows():
        for dirpath, _, files in os.walk(root):
            for fn in files:
                if not fn.endswith(".json"):
                    continue
                fp = os.path.join(dirpath, fn)
                try:
                    bucket = json.load(open(fp))
                except Exception as e:
                    print(f"WARN skip {fp}: {e}", file=sys.stderr)
                    continue
                for t in bucket:
                    # [suffix, name, relative, relIdx, age, serial, reasonIdx, acIdx, fileIdx, dupEpicMasked]
                    ac_entry = acs[t[7]] if 0 <= t[7] < len(acs) else []
                    part = get_part(t[7], t[8])  # [fileUrl, partNo, boothName, generatedOn]
                    yield [t[1], t[9] or None,
                           districts[ac_entry[2]] if len(ac_entry) > 2 and 0 <= ac_entry[2] < len(districts) else None,
                           ac_entry[1] if len(ac_entry) > 1 else None,
                           str(part[1]) if part else None,
                           part[2] if part else None,
                           reasons[t[6]] if 0 <= t[6] < len(reasons) else None,
                           part[0] if part else None]
    return {"key": "ka-asddo", "fields": fields, "rows": rows,
            "provenance": {
                "source_project": "omshivaprakash/karnataka-asddo-dashboard",
                "source_branch": "main",
                "tarball_sha256": "1695c25a2e83a1a049f08282965e1b7b3ec1a4d7fa5a4f0a59e6d1e08b1d8dac",
                "retrieved_at": "2026-09-23",
                "expected_rows": manifest["counts"]["records"],
                "note": "Dashboard over CEO Karnataka ASDDO lists. dupEpicMasked masked at source (ABC****XYZ).",
            }}

def build_dataset(ds, out_dir, flush_every=300000, split_over=150000):
    key = ds["key"]
    ddir = os.path.join(out_dir, key)
    os.makedirs(ddir, exist_ok=True)
    tmpdir = os.path.join(ddir, "_tmp")
    os.makedirs(tmpdir, exist_ok=True)
    buffers = defaultdict(list)
    buffered = 0
    total = 0

    def flush():
        nonlocal buffered
        for sk, rows in buffers.items():
            with open(os.path.join(tmpdir, sk + ".jsonl"), "a", encoding="utf-8") as f:
                for r in rows:
                    f.write(json.dumps(r, ensure_ascii=False) + "\n")
        buffers.clear()
        buffered = 0

    for row in ds["rows"]():
        # Empty names are kept under the "00" shard: they are real source
        # rows (part/serial/reason intact) and must not be silently dropped.
        sk = shard_key(row[0])
        buffers[sk].append(row)
        buffered += 1
        total += 1
        if buffered >= flush_every:
            flush()
        if total % 1000000 == 0:
            print(f"  [{key}] {total} rows...", flush=True)
    flush()

    # finalize: jsonl -> gzipped json, split hot shards
    import glob
    shards = {}
    for jl in glob.glob(os.path.join(tmpdir, "*.jsonl")):
        base = os.path.basename(jl)[:-6]
        n = sum(1 for _ in open(jl, encoding="utf-8"))
        if n > split_over:
            # split by 3rd char
            sub = defaultdict(list)
            with open(jl, encoding="utf-8") as f:
                for line in f:
                    r = json.loads(line)
                    sub[shard_key(r[0], 3)].append(r)
            for ssk, srows in sub.items():
                fn = f"{ssk}.json.gz"
                with gzip.open(os.path.join(ddir, fn), "wt", encoding="utf-8") as gz:
                    gz.write(json.dumps({"v": 1, "dataset": key, "shard": ssk,
                                         "count": len(srows), "rows": srows},
                                        ensure_ascii=False))
                shards[ssk] = {"file": f"{key}/{fn}", "count": len(srows)}
            os.remove(jl)
        else:
            rows = [json.loads(line) for line in open(jl, encoding="utf-8")]
            fn = f"{base}.json.gz"
            with gzip.open(os.path.join(ddir, fn), "wt", encoding="utf-8") as gz:
                gz.write(json.dumps({"v": 1, "dataset": key, "shard": base,
                                     "count": len(rows), "rows": rows},
                                    ensure_ascii=False))
            shards[base] = {"file": f"{key}/{fn}", "count": n}
            os.remove(jl)
    os.rmdir(tmpdir)
    # Size guard: jsDelivr refuses files over 20MB, so split any oversize
    # shard into sequential chunks (sk.p0, sk.p1, ...) instead of going
    # deeper than 3-char keys (the client only resolves up to 3 chars).
    # Manifest entries for chunked shards carry {"files": [...], "count"}.
    MAX_SHARD_BYTES = 15 * 1024 * 1024
    for sk in list(shards):
        path = os.path.join(ddir, sk + ".json.gz")
        if os.path.getsize(path) <= MAX_SHARD_BYTES:
            continue
        with gzip.open(path, "rt", encoding="utf-8") as f:
            doc = json.load(f)
        rows = doc["rows"]
        # start with enough chunks to land near ~12MB each, grow if needed
        n_chunks = max(2, (os.path.getsize(path) + 12 * 1024 * 1024 - 1) // (12 * 1024 * 1024))
        while True:
            per = (len(rows) + n_chunks - 1) // n_chunks
            parts = [rows[i:i + per] for i in range(0, len(rows), per)]
            ok_sizes = True
            written = []
            for i, prows in enumerate(parts):
                fn = f"{sk}.p{i}.json.gz"
                with gzip.open(os.path.join(ddir, fn), "wt", encoding="utf-8") as gz:
                    gz.write(json.dumps({"v": 1, "dataset": key, "shard": sk,
                                         "part": i, "parts": len(parts),
                                         "count": len(prows), "rows": prows},
                                        ensure_ascii=False))
                written.append(fn)
                if os.path.getsize(os.path.join(ddir, fn)) > MAX_SHARD_BYTES:
                    ok_sizes = False
            if ok_sizes:
                break
            for fn in written:
                os.remove(os.path.join(ddir, fn))
            n_chunks += 1
        os.remove(path)
        shards[sk] = {"files": [f"{key}/{fn}" for fn in written],
                      "count": len(rows)}
        print(f"[{key}] chunked oversize shard {sk} -> {len(written)} parts")
    exp = ds["provenance"].get("expected_rows")
    print(f"[{key}] done: {total} rows in {len(shards)} shards (expected {exp})")
    if exp and total != exp:
        print(f"[{key}] COUNT MISMATCH: got {total}, expected {exp} -- aborting",
              file=sys.stderr)
        sys.exit(1)
    return {"key": key, "fields": ds["fields"], "rows": total,
            "shard_count": len(shards), "shards": shards,
            "provenance": ds["provenance"]}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="data/shards")
    ap.add_argument("--only", default="")
    args = ap.parse_args()
    out = os.path.abspath(args.out)
    os.makedirs(out, exist_ok=True)
    builders = {"ka-asd": dataset_ka_asd, "ka-notices": dataset_ka_notices,
                "ka-asddo": dataset_ka_asddo}
    manifest_path = os.path.join(out, "manifest.json")
    # Merge with any existing manifest so --only runs don't wipe other datasets.
    if os.path.exists(manifest_path):
        manifest = json.load(open(manifest_path, encoding="utf-8"))
    else:
        manifest = {"v": 1, "shard_note": "shard key = first 2 alnum chars of uppercased name (any script); hot shards split to 3 chars"}
    import datetime
    manifest["built_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    for k, b in builders.items():
        if args.only and k != args.only:
            continue
        manifest[k] = build_dataset(b(), out)
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False)
    print("manifest written (merged)")

if __name__ == "__main__":
    main()
