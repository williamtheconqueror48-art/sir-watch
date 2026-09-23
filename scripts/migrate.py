#!/usr/bin/env python3
"""Run a SQL migration against the sir-watch Neon DB via the serverless driver.
Usage: migrate.py "<SQL>"
The Neon connection URI is fetched in-memory and piped to node via stdin only.
"""
import importlib.util
import json
import subprocess
import sys

spec = importlib.util.spec_from_file_location(
    "neon_setup", "/home/hatch/workspace/skills/neon/bin/neon-setup.py"
)
neon_setup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(neon_setup)

project = neon_setup.find_or_create_project("sir-watch")
uri = neon_setup.connection_uri(project["id"])

mode = "exec"
sql_text = sys.argv[1]
if len(sys.argv) > 2 and sys.argv[1] == "--query":
    mode = "query"
    sql_text = sys.argv[2]

if mode == "query":
    payload = json.dumps({"uri": uri, "actions": [{"sql": sql_text, "params": [], "returns": "rows"}]})
else:
    payload = json.dumps({"uri": uri, "sql": sql_text})
proc = subprocess.run(
    ["node", "/home/hatch/workspace/skills/neon/bin/neon-exec.js"],
    input=payload.encode(),
    capture_output=True,
    timeout=300,
)
out = proc.stdout.decode()
err = proc.stderr.decode()
print(out[-800:] if out else err[-800:])
