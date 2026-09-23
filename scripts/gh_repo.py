#!/usr/bin/env python3
"""Small GitHub REST helper reusing the custom.github authd surrogate pattern."""
import json
import sys
import urllib.request
import urllib.error

sys.path.insert(0, "/opt/hatch/skills/skill-creator/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response, DynamicCredentialError

CRED = "custom.github"
HOSTS = ["api.github.com"]
API = "https://api.github.com"


def api(method, path, payload=None):
    req = urllib.request.Request(
        API + path, method=method,
        data=(json.dumps(payload).encode() if payload is not None else None))
    if payload is not None:
        req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("User-Agent", "sir-watch-push/1.0")
    add_surrogate_to_request(req, CRED, allowed_hosts=HOSTS)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return {} if resp.status == 204 else read_json_response(resp)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:500]
        raise DynamicCredentialError(f"GitHub {method} {path} -> {e.code}: {body}")


if __name__ == "__main__":
    me = api("GET", "/user")["login"]
    print("owner:", me)
    r = api("GET", f"/repos/{me}/sir-watch")
    print("description:", repr(r.get("description")))
    print("homepage:", repr(r.get("homepage")))
    print("topics:", api("GET", f"/repos/{me}/sir-watch/topics").get("names"))
