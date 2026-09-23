#!/usr/bin/env python3
"""Push local git commits to origin using the stored custom.github credential.

Fetches a surrogate from authd and passes it to git as an HTTP Authorization
header via environment config (never printed, never written to disk).
Usage: git_push.py [refspec]  (default: HEAD:main)
"""
import os
import subprocess
import sys

sys.path.insert(0, "/opt/hatch/skills/skill-creator/bin")
from dynamic_credentials import dynamic_credential_entry

entry = dynamic_credential_entry("custom.github", "access_token")
surrogate = str(entry["surrogate"]).strip()
placement = entry.get("placement")

if placement == "bearer_header":
    header = f"Authorization: Bearer {surrogate}"
elif isinstance(placement, dict) and isinstance(placement.get("custom_header"), str):
    header = f"{placement['custom_header']}: {surrogate}"
else:
    raise SystemExit(f"unsupported credential placement: {placement!r}")

refspec = sys.argv[1] if len(sys.argv) > 1 else "HEAD:main"
env = dict(os.environ)
env["GIT_CONFIG_COUNT"] = "1"
env["GIT_CONFIG_KEY_0"] = "http.extraHeader"
env["GIT_CONFIG_VALUE_0"] = header
r = subprocess.run(["git", "push", "origin", refspec], env=env,
                   cwd="/home/hatch/workspace/sir-watch")
sys.exit(r.returncode)
