#!/usr/bin/env python3
"""Push an explicit list of repo-relative files to GitHub main via Git Data API.

Unlike api_push.py, this pushes exactly the files named (no local diff), so
unaudited worker changes elsewhere in the tree are never swept in.

Usage: python3 scripts/push_files.py -m "message" <path> [<path> ...]
Auth: stored custom.github connector via authd surrogates (api.github.com only).
"""
import argparse
import base64
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__))))
from gh_repo import api

OWNER = "williamtheconqueror48-art"
REPO = "sir-watch"
REPO_DIR = "/home/hatch/workspace/sir-watch"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-m", "--message", required=True)
    ap.add_argument("files", nargs="+")
    args = ap.parse_args()

    ref = api("GET", f"/repos/{OWNER}/{REPO}/git/refs/heads/main")
    base_sha = ref["object"]["sha"]
    base_tree = api("GET", f"/repos/{OWNER}/{REPO}/git/commits/{base_sha}")["tree"]["sha"]
    print("base:", base_sha[:8])

    entries = []
    for rel in args.files:
        full = os.path.join(REPO_DIR, rel)
        with open(full, "rb") as f:
            content = f.read()
        blob = api("POST", f"/repos/{OWNER}/{REPO}/git/blobs",
                   {"content": base64.b64encode(content).decode(), "encoding": "base64"})
        entries.append({"path": rel, "mode": "100644", "type": "blob", "sha": blob["sha"]})
        print(f"  blob {rel} ({len(content)/1e6:.1f} MB)")

    tree = api("POST", f"/repos/{OWNER}/{REPO}/git/trees",
               {"base_tree": base_tree, "tree": entries})
    commit = api("POST", f"/repos/{OWNER}/{REPO}/git/commits",
                 {"message": args.message, "tree": tree["sha"], "parents": [base_sha]})
    api("PATCH", f"/repos/{OWNER}/{REPO}/git/refs/heads/main", {"sha": commit["sha"]})
    print("pushed", commit["sha"][:8], "-> main")


if __name__ == "__main__":
    main()
