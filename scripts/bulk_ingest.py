#!/usr/bin/env python3
"""Launch the bulk-ingest node worker with the Neon URI passed via env only.
Usage: bulk_ingest.py --dataset asd|notices|asddo --repo <dir> --ledger <id> [--limit N]
"""
import importlib.util
import os
import subprocess
import sys

spec = importlib.util.spec_from_file_location(
    "neon_setup", "/home/hatch/workspace/skills/neon/bin/neon-setup.py"
)
neon_setup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(neon_setup)

project = neon_setup.find_or_create_project("sir-watch")
uri = neon_setup.connection_uri(project["id"])

env = dict(os.environ)
env["SIRWATCH_DB_URI"] = uri
proc = subprocess.run(
    ["node", "/home/hatch/workspace/sir-watch/scripts/bulk-ingest-worker.cjs"] + sys.argv[1:],
    env=env,
)
sys.exit(proc.returncode)
