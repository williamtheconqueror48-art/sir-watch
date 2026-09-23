#!/usr/bin/env python3
"""Push data/shards/ into the sir-watch repo via the Git Data API.

- Uploads every data/shards/**/*.json.gz + manifest.json as blobs
- Single commit on top of origin/main (base_tree merge)
- Resume-safe: blob SHAs are checkpointed to data/shards/.push_state.json
- Rate-limit aware: sleeps until X-RateLimit-Reset on 403/429

Usage: python3 scripts/push_shards.py [--dry-run]
Auth: stored custom.github connector via authd surrogates (api.github.com only).
"""
import argparse
import base64
import json
import os
import sys
import time
import urllib.request
import urllib.error

sys.path.insert(0, "/opt/hatch/skills/skill-creator/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response, DynamicCredentialError

CRED = "custom.github"
HOSTS = ["api.github.com"]
API = "https://api.github.com"
REPO_DIR = "/home/hatch/workspace/sir-watch"
SHARD_DIR = os.path.join(REPO_DIR, "data", "shards")
STATE_FILE = os.path.join(SHARD_DIR, ".push_state.json")
OWNER = "williamtheconqueror48-art"
REPO = "sir-watch"


class RateLimited(Exception):
    pass


def api(method, path, payload=None, _retry=True):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(API + path, method=method, data=data)
    if payload is not None:
        req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("User-Agent", "sir-watch-push/1.0")
    add_surrogate_to_request(req, CRED, allowed_hosts=HOSTS)
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            remaining = resp.headers.get("X-RateLimit-Remaining")
            if remaining is not None and int(remaining) < 50:
                reset = int(resp.headers.get("X-RateLimit-Reset", "0"))
                wait = max(0, reset - int(time.time()) + 30)
                print(f"[rate] only {remaining} calls left; sleeping {wait}s", flush=True)
                time.sleep(wait)
            return {} if resp.status == 204 else read_json_response(resp)
    except urllib.error.HTTPError as e:
        reset = e.headers.get("X-RateLimit-Reset") if e.headers else None
        if e.code in (403, 429) and reset and _retry:
            wait = max(0, int(reset) - int(time.time()) + 30)
            print(f"[rate] hit {e.code}; sleeping {wait}s until reset", flush=True)
            time.sleep(wait)
            return api(method, path, payload, _retry=False)
        body = e.read().decode("utf-8", errors="replace")[:500]
        raise DynamicCredentialError(f"GitHub {method} {path} -> {e.code}: {body}")


def collect_files():
    files = []
    for root, _dirs, names in os.walk(SHARD_DIR):
        for n in names:
            if n == ".push_state.json":
                continue
            full = os.path.join(root, n)
            rel = os.path.relpath(full, SHARD_DIR)
            if n.endswith(".json.gz") or n == "manifest.json":
                files.append((rel, full))
    files.sort()
    return files


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    files = collect_files()
    total_bytes = sum(os.path.getsize(f) for _, f in files)
    print(f"{len(files)} files, {total_bytes / 1e9:.2f} GB")
    if args.dry_run:
        return

    state = {}
    if os.path.exists(STATE_FILE):
        state = json.load(open(STATE_FILE))
        print(f"resuming: {len(state)} blobs already uploaded")

    ref = api("GET", f"/repos/{OWNER}/{REPO}/git/refs/heads/main")
    base_sha = ref["object"]["sha"]
    base_tree = api("GET", f"/repos/{OWNER}/{REPO}/git/commits/{base_sha}")["tree"]["sha"]
    print("base:", base_sha[:8])

    done = 0
    for i, (rel, full) in enumerate(files):
        if rel in state:
            continue
        with open(full, "rb") as f:
            content = base64.b64encode(f.read()).decode()
        blob = api("POST", f"/repos/{OWNER}/{REPO}/git/blobs",
                   {"content": content, "encoding": "base64"})
        state[rel] = blob["sha"]
        done += 1
        if done % 50 == 0:
            json.dump(state, open(STATE_FILE, "w"))
            print(f"  blobs {i + 1}/{len(files)}", flush=True)
    json.dump(state, open(STATE_FILE, "w"))
    print(f"all {len(files)} blobs uploaded")

    tree_entries = [{"path": f"data/shards/{rel}", "mode": "100644",
                     "type": "blob", "sha": state[rel]} for rel, _ in files]
    tree = api("POST", f"/repos/{OWNER}/{REPO}/git/trees",
               {"base_tree": base_tree, "tree": tree_entries})
    print("tree:", tree["sha"][:8])

    commit = api("POST", f"/repos/{OWNER}/{REPO}/git/commits",
                 {"message": f"shard archive: Karnataka SIR name-level data "
                             f"({len(files)} files, exact-count verified)",
                  "tree": tree["sha"], "parents": [base_sha]})
    print("commit:", commit["sha"][:8])

    api("PATCH", f"/repos/{OWNER}/{REPO}/git/refs/heads/main",
        {"sha": commit["sha"]})
    print("main updated ->", commit["sha"][:8])
    os.remove(STATE_FILE)


if __name__ == "__main__":
    main()
