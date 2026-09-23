#!/usr/bin/env python3
"""Push local HEAD to GitHub main via the Git Data API (api.github.com only).

Replicates the local commit(s) on top of origin/main as a single API commit:
- blobs only for files changed vs origin/main (plus chosen untracked files)
- new tree built on base_tree = origin/main's tree (unchanged files preserved)
- commit parent = origin/main, then fast-forward refs/heads/main

Usage: api_push.py [--include <path> ...]  (extra untracked files to include)
Auth: stored custom.github connector via authd surrogates. No raw secrets.
"""
from __future__ import annotations

import argparse
import base64
import subprocess
import sys
import urllib.request

sys.path.insert(0, "/opt/hatch/skills/skill-creator/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response, DynamicCredentialError

CRED = "custom.github"
HOSTS = ["api.github.com"]
API = "https://api.github.com"
REPO_DIR = "/home/hatch/workspace/sir-watch"


def api(method: str, path: str, payload: dict | None = None):
    req = urllib.request.Request(API + path, method=method,
                                 data=(__import__("json").dumps(payload).encode() if payload is not None else None))
    if payload is not None:
        req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("User-Agent", "sir-watch-push/1.0")
    add_surrogate_to_request(req, CRED, allowed_hosts=HOSTS)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return {} if resp.status == 204 else read_json_response(resp)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:400]
        raise DynamicCredentialError(f"GitHub {method} {path} -> {e.code}: {body}")


def sh(*args: str) -> str:
    return subprocess.run(args, cwd=REPO_DIR, capture_output=True, text=True, check=True).stdout.strip()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--include", nargs="*", default=[],
                    help="extra untracked paths (relative) to include")
    args = ap.parse_args()

    owner = api("GET", "/user")["login"]
    repo = "sir-watch"
    ref = api("GET", f"/repos/{owner}/{repo}/git/ref/heads/main")
    base_sha = ref["object"]["sha"]
    base_commit = api("GET", f"/repos/{owner}/{repo}/git/commits/{base_sha}")
    base_tree = base_commit["tree"]["sha"]
    print(f"origin/main = {base_sha[:8]}")

    local_head = sh("git", "rev-parse", "HEAD")
    changed = sh("git", "diff", "--name-only", f"{base_sha}", local_head).split("\n")
    changed = [c for c in changed if c]
    for inc in args.include:
        if inc not in changed:
            changed.append(inc)
    if not changed:
        print("nothing to push")
        return
    print(f"changed files: {len(changed)}")

    entries = []
    for rel in sorted(changed):
        with open(f"{REPO_DIR}/{rel}", "rb") as f:
            content = f.read()
        blob = api("POST", f"/repos/{owner}/{repo}/git/blobs",
                   {"content": base64.b64encode(content).decode(), "encoding": "base64"})
        entries.append({"path": rel, "mode": "100644", "type": "blob", "sha": blob["sha"]})
    tree = api("POST", f"/repos/{owner}/{repo}/git/trees",
               {"base_tree": base_tree, "tree": entries})
    msg = sh("git", "log", "-1", "--format=%B", local_head)
    commit = api("POST", f"/repos/{owner}/{repo}/git/commits",
                 {"message": msg, "tree": tree["sha"], "parents": [base_sha]})
    api("PATCH", f"/repos/{owner}/{repo}/git/refs/heads/main", {"sha": commit["sha"]})
    print(f"pushed {commit['sha'][:8]} -> main")


main()
