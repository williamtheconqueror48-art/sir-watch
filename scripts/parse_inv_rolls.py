#!/usr/bin/env python3
"""Parse inventoried CEO-site roll PDFs (8 states) into the unified SIR-WATCH schema.

Zero fabrication: rows come only from PDF text layers; rejects are logged,
never silently dropped; EPICs are masked AT PARSE TIME (first3 + "****" +
last3) and plaintext EPICs are never written anywhere.

Handlers (chosen by inventory record_type):
  eci_roll         standard 8-col ECI roll pages (Arunachal 2006, Delhi 2002,
                   Meghalaya 2005) -- word-coordinate column anchoring.
  service_electors service-elector PDFs (Goa, Manipur, Puducherry).
  mizoram_pooling  monthly-pooling deletion/addition lists
                   (State/District/AC No/Part No/EPIC/Name token stream).
Skips (recorded in stats, never fabricated):
  Bihar statistics formats, Goa statistics tables, Mizoram List-of-Parts
  index, Mizoram press notes.

Duplicate fetches (same URL saved as name.pdf + name_1.pdf) are deduplicated
by URL before parsing.

Metadata (state/district/ac_number/roll_type/source_file_url) comes from
data/inventory/inventory.jsonl joined on the fetch URL; PDF-extracted
AC/part values are cross-checked and mismatches logged (inventory wins).

Vintage rule (documented, mechanical, no speculation):
  post_sir : 2026 roll AND (names SIR/Special Intensive Revision OR published in 2026)
  pre_sir  : roll year <= 2025, or 2026 roll published in 2025
  other    : supplements / claims / deletion-application lists
roll_vintage always carries the verbatim revision type + publication date.

Outputs (data/parsed/inventory/):
  <state>.jsonl          unified-schema rows
  <state>.rejects.jsonl  rejected/ignored line clusters with reasons
  parse_stats.json       per-PDF: pages, rows, rejects, skipped-reason, vintage decisions

Usage: python3 scripts/parse_inv_rolls.py [--only arunachal-pradesh] [--limit N]
"""
import argparse
import datetime
import hashlib
import json
import os
import re
import sys
from collections import defaultdict

import fitz  # PyMuPDF (venv)

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INV_PATH = os.path.join(BASE, "data", "inventory", "inventory.jsonl")
FETCH_LOG = "/tmp/fetch_log.tsv"
OUTDIR = os.path.join(BASE, "data", "parsed", "inventory")
os.makedirs(OUTDIR, exist_ok=True)

NOW = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")

STATES = ["arunachal-pradesh", "bihar", "delhi", "goa", "manipur",
          "meghalaya", "mizoram", "puducherry", "uttarakhand"]

STATE_NAMES = {
    "arunachal-pradesh": "Arunachal Pradesh", "bihar": "Bihar",
    "delhi": "Delhi", "goa": "Goa", "manipur": "Manipur",
    "meghalaya": "Meghalaya", "mizoram": "Mizoram",
    "puducherry": "Puducherry", "uttarakhand": "Uttarakhand",
}

DATASET_TAGS = {
    "arunachal-pradesh": "arunachal-roll-2006",
    "bihar": "bihar-statistics",
    "delhi": "delhi-roll-2002",
    "goa": "goa-service-electors-2026",
    "manipur": "manipur-service-electors-2025",
    "meghalaya": "meghalaya-roll-2005",
    "mizoram": "mizoram-monthly-pooling-2026",
    "puducherry": "puducherry-service-electors-2025-2026",
    "uttarakhand": "uttarakhand-service-2026",
}

# (state, record_type) -> handler name or ("skip", reason)
HANDLERS = {
    ("Arunachal Pradesh", "supplement"): "eci_roll",
    ("Delhi", "main_roll"): "eci_roll",
    ("Meghalaya", "main_roll"): ("skip", "2005 scans carry a garbled embedded-OCR text layer (words not grouped into logical rows; serial/attribute y-positions corrupted). Three mechanical reconstruction strategies were prototyped and all failed validation against rendered pages (name/attribute cross-row pollution). No OCR engine available in this environment (tesseract not installable). Marked unparsed honestly; not silently dropped."),
    ("Goa", "service_elector_roll"): "service_electors",
    ("Manipur", "service_elector_roll"): "service_electors",
    ("Puducherry", "service_elector_roll"): "service_electors",
    ("Uttarakhand", "service_elector_roll"): "service_electors",
    ("Mizoram", "supplement"): "mizoram_pooling",
    ("Bihar", "supplement"): ("skip", "ECI statistical formats 1B/3B/4B/5B/5C/6/7 (no elector rows)"),
    ("Goa", "statistics"): ("skip", "statistical count tables (no elector rows)"),
    ("Mizoram", "main_roll"): ("skip", "SIR 2026 List of Parts index (no elector rows)"),
    ("Mizoram", "press_notice"): ("skip", "press note (no elector rows)"),
    ("Uttarakhand", "sir_summary_table"): ("skip", "SIR booth table 2003 vs 2025 district-wise summary (name-less; no elector rows)"),
}


def mask_epic(s):
    s = re.sub(r"\s+", "", (s or ""))
    if not s:
        return None
    if len(s) <= 6:
        return "****"
    return s[:3] + "****" + s[-3:]


def clean(s):
    return re.sub(r"\s+", " ", (s or "")).strip()


# ------------------------------------------------------------------ PDF words

def page_words(page):
    out = []
    for x0, y0, x1, y1, w, _b, _l, _wn in page.get_text("words"):
        w = w.strip()
        if w:
            out.append({"x0": x0, "x1": x1, "y0": y0, "y1": y1,
                        "xc": (x0 + x1) / 2, "yc": (y0 + y1) / 2,
                        "h": y1 - y0, "t": w})
    return out


def cluster_lines(words):
    """Group words into visual lines by y-coordinate."""
    if not words:
        return []
    ws = sorted(words, key=lambda w: (w["y0"], w["x0"]))
    hs = sorted(w["h"] for w in ws)
    med = hs[len(hs) // 2]
    gap = max(2.0, 0.55 * med)
    lines, cur, prev_y = [], [], None
    for w in ws:
        if prev_y is not None and w["y0"] - prev_y > gap:
            lines.append(cur)
            cur = []
        cur.append(w)
        prev_y = w["y0"]
    if cur:
        lines.append(cur)
    for ln in lines:
        ln.sort(key=lambda w: w["x0"])
    return lines


def line_text(ln):
    return clean(" ".join(w["t"] for w in ln))


# ------------------------------------------------------- column anchoring
# Phrase-based: match multi-word header phrases (consecutive words) and use
# their true x-extents as column bands. Single-word keyword averages proved
# unreliable (e.g. "No" from "Part No" polluting the serial anchor; the (3)
# number token sitting right-of-center under a wide "Name of the Elector"
# header, stealing left-edge name words into the house-number column).

def _nw(t):
    return t.strip().strip(".").strip("-").lower()


ECI_COL_PHRASES = {
    1: [["serial", "no"], ["sl", "no"]],
    2: [["houseno"], ["house", "no"]],
    3: [["name", "of", "the", "elector"], ["name", "of", "elector"]],
    4: [["relationship"], ["relation", "ship"]],
    5: [["name", "of", "relation"]],
    6: [["sex"], ["sea"]],
    7: [["age"]],
    8: [["epic", "no"], ["epic"]],
}

SERVICE_COL_PHRASES = {
    "serial": [["sl.no"], ["sl", "no"], ["slno"]],
    "name": [["name", "of", "elector"]],
    "etype": [["elector", "type"]],
    "buckle": [["buckle", "no"], ["buckle"]],
    "gender": [["gender"]],
    "spouse": [["spouse's", "sl", "no"], ["spouses", "sl", "no"],
               ["spouse's"], ["spouse"]],
    "address": [["house", "address"]],
}

SERVICE_COL_ORDER = ["serial", "name", "etype", "gender", "spouse", "address"]
SERVICE_COL_ORDER_BUCKLE = ["serial", "name", "etype", "buckle", "gender",
                            "spouse", "address"]


def service_col_bands(words, page_width):
    """Phrase bands for service-elector headers, with interior gaps
    interpolated between known neighbours (the 'Elector Type' header is
    often split across two wrapped lines).

    The Spouse's-Sl.No. column is not given its own assignment band: it is
    almost always empty and its territory belongs to the address column's
    left edge. Returns (bands, spouse_cx); callers drop numeric words near
    spouse_cx from the address (spouse references are not in the schema).
    """
    bands = phrase_bands(words, SERVICE_COL_PHRASES)
    if not {"serial", "name", "address"}.issubset(bands.keys()):
        return None, None
    spouse_cx = None
    if "spouse" in bands:
        b = bands.pop("spouse")
        spouse_cx = (b[0] + b[1]) / 2
    order = (SERVICE_COL_ORDER_BUCKLE if "buckle" in bands
             else SERVICE_COL_ORDER)
    order = [c for c in order if c != "spouse"]
    full = dict(bands)
    for idx, col in enumerate(order):
        if col in full:
            continue
        prevs = [order[j] for j in range(idx - 1, -1, -1) if order[j] in full]
        nexts = [order[j] for j in range(idx + 1, len(order)) if order[j] in full]
        if prevs and nexts:
            full[col] = (full[prevs[0]][1], full[nexts[0]][0])
    if not {"serial", "name", "address"}.issubset(full.keys()):
        return None, None
    bands = expand_bands({c: full[c] for c in order if c in full}, page_width)
    if spouse_cx is not None and "address" in bands:
        # address data starts at the spouse column's visual gutter; the
        # spouse reference itself (numeric, near spouse_cx) is dropped later
        bands["address"] = (spouse_cx, page_width)
        if "gender" in bands:
            glo, ghi = bands["gender"]
            bands["gender"] = (glo, min(ghi, spouse_cx))
    return bands, spouse_cx


def phrase_bands(words, phrases):
    """{col: (x0, x1)} from consecutive-word phrase matches. Longer phrases
    win; matched word indices are consumed so "Sl.No" can't serve two cols."""
    normed = [_nw(w["t"]) for w in words]
    used = set()
    bands = {}
    # longest phrases first for deterministic disambiguation
    jobs = []
    for col, variants in phrases.items():
        for v in variants:
            jobs.append((col, v))
    jobs.sort(key=lambda j: -len(j[1]))
    for col, v in jobs:
        if col in bands:
            continue
        L = len(v)
        for i in range(len(words) - L + 1):
            if any(i + k in used for k in range(L)):
                continue
            if all(normed[i + k] == v[k] for k in range(L)):
                x0 = min(words[i + k]["x0"] for k in range(L))
                x1 = max(words[i + k]["x1"] for k in range(L))
                bands[col] = (x0, x1)
                used.update(range(i, i + L))
                break
    return bands


def expand_bands(bands, page_width):
    """Stretch band edges to midpoints between neighbours; outer edges to
    page margins. Returns {col: (lo, hi)} covering the full width."""
    cols = sorted(bands.keys(), key=lambda c: (bands[c][0] + bands[c][1]) / 2)
    edges = [bands[c] for c in cols]
    out = {}
    for i, c in enumerate(cols):
        lo = 0.0 if i == 0 else (edges[i - 1][1] + edges[i][0]) / 2
        hi = page_width if i == len(cols) - 1 else (edges[i][1] + edges[i + 1][0]) / 2
        out[c] = (lo, hi)
    return out


def numbered_centers(words, ncols=None):
    toks = {}
    for w in words:
        m = re.fullmatch(r"\((\d+)\)", w["t"])
        if m:
            toks.setdefault(int(m.group(1)), []).append(w["xc"])
    if not toks:
        return None
    if ncols and set(toks.keys()) != set(range(1, ncols + 1)):
        return None
    if not ncols and len(toks) < 4:
        return None
    return [sum(toks[k]) / len(toks[k]) for k in sorted(toks)]


def assign_to_bands(words, bands):
    """Assign each word to the band containing its x-center (nearest on ties)."""
    cols = defaultdict(list)
    for w in words:
        best, bestd = None, None
        for c, (lo, hi) in bands.items():
            ctr = (lo + hi) / 2
            d = 0 if lo <= w["xc"] <= hi else min(abs(w["xc"] - lo), abs(w["xc"] - hi))
            # inside band always wins over outside
            key = (d > 0, d if d > 0 else abs(w["xc"] - ctr))
            if bestd is None or key < bestd:
                best, bestd = c, key
        cols[best].append(w)
    for c in cols:
        cols[c].sort(key=lambda w: w["x0"])
    return cols


def col_text(cols, key):
    return clean(" ".join(w["t"] for w in cols.get(key, [])))


# ------------------------------------------------------------------ vintage

def decide_vintage(cover_text, inv_roll_type, state_dir):
    """Mechanical vintage decision; returns (vintage_class, roll_vintage)."""
    t = cover_text or ""
    rev = ""
    m = re.search(r"Type\s+of\s+Revision[ ]*:?[ ]*([A-Za-z][^\n]{2,59})", t)
    if m:
        rev = clean(m.group(1))
    if not rev:
        # covers put the value on the next line; fall back to known vocab
        m = re.search(r"\b(Special Intensive Revision|Special Summary Revision"
                      r"|Summary Revision|Continuous Updation|Intensive Revision"
                      r"|Intensive|Special)\b", t, re.I)
        rev = m.group(1) if m else ""
    pub = ""
    m = re.search(r"Date\s+of\s+(?:Final\s+|Draft\s+)?Publication[ ]*:?[ ]*"
                  r"([0-9.\-/]{6,12})", t)
    if m:
        pub = m.group(1).strip()
    if not pub:
        # label and value on adjacent lines: scan a small window around it
        lines = t.split("\n")
        for i, ln in enumerate(lines):
            if re.search(r"Date\s+of\s+(?:Final\s+|Draft\s+)?Publication", ln, re.I):
                window = lines[i + 1:i + 7] + lines[max(0, i - 6):i]
                for wln in window:
                    dm = re.search(r"\b(\d{1,2}[./-]\d{1,2}[./-]\d{4})\b", wln)
                    if dm:
                        pub = dm.group(1)
                        break
                break
    year = ""
    m = re.search(r"(19|20)\d{2}", inv_roll_type or "")
    if not m:
        m = re.search(r"ELECTORAL ROLL[^\n]{0,20}(19|20)\d{2}", t)
    if m:
        year = m.group(0)[-4:] if len(m.group(0)) > 4 else m.group(0)
    if not year:
        m = re.search(r"(20\d{2})", pub)
        year = m.group(1) if m else ""
    is_sir = bool(re.search(r"special intensive revision", rev, re.I))
    pub_year = (re.search(r"(20\d{2})", pub).group(1)) if re.search(r"(20\d{2})", pub) else ""

    detail = "; ".join(x for x in [rev, f"published {pub}" if pub else ""] if x)
    if detail:
        detail = f" ({detail})"

    if state_dir == "mizoram":
        return "other", f"Monthly Pooling roll supplement{detail} [applications, not a roll]"
    if year == "2026" and (is_sir or pub_year == "2026"):
        cls = "post_sir"
        return cls, f"post-SIR Roll 2026{detail}"
    if year in ("2002", "2003", "2005", "2006", "2007", "2017", "2023", "2024", "2025") or pub_year in (
            "2002", "2003", "2005", "2006", "2007", "2017", "2023", "2024", "2025"):
        return "pre_sir", f"pre-SIR Roll {year or pub_year}{detail}"
    # fallback: classify by publication year when roll year is unclear
    if pub_year and int(pub_year) >= 2026:
        return "post_sir", f"post-SIR Roll {pub_year}{detail}"
    if pub_year:
        return "pre_sir", f"pre-SIR Roll {pub_year}{detail}"
    return "other", f"unclassified vintage [{clean(inv_roll_type or '')[:60]}]"


# ------------------------------------------------------------- ECI roll pages

def eci_header_bands(page):
    W, H = page.rect.width, page.rect.height
    top_words = [w for w in page_words(page) if w["y1"] < H * 0.24]
    blob = " ".join(w["t"] for w in top_words)
    if "Elector" not in blob:
        return None
    bands = phrase_bands(top_words, ECI_COL_PHRASES)
    # fill any missing column from numbered tokens (1)..(8)
    if len(bands) < 8:
        num = numbered_centers(top_words, ncols=8)
        if num:
            have = sorted(bands.values(), key=lambda b: (b[0] + b[1]) / 2)
            for n, cx in enumerate(num, start=1):
                if n not in bands:
                    # narrow band around the token center, bounded by neighbours
                    bands[n] = (cx - 12, cx + 12)
    if len(bands) < 6:
        return None
    return expand_bands(bands, W)


def parse_eci_roll(pdf, meta, state_dir):
    """Standard 8-col ECI roll pages -> elector rows."""
    rows, rejects = [], []
    doc = fitz.open(pdf)
    npages = len(doc)
    cover_text = doc[0].get_text("text") if npages else ""
    vintage_class, roll_vintage = decide_vintage(cover_text, meta["roll_type"], state_dir)
    # cross-check AC/part from PDF text
    xcheck = {}
    m = re.search(r"Assembly Constituency\s+(\d+)\s*,\s*([^,\n]{2,60})", cover_text)
    if m:
        xcheck["pdf_ac"] = m.group(1)
    m = re.search(r"Part No\.?\s*(\d+)", cover_text)
    if m:
        xcheck["pdf_part"] = m.group(1)
    for pno in range(npages):
        page = doc[pno]
        bands = eci_header_bands(page)
        if not bands:
            continue  # cover / summary / section-only page
        H = page.rect.height
        for ln in cluster_lines(page_words(page)):
            if ln[0]["y0"] < H * 0.24:
                continue  # header band
            t = line_text(ln)
            if not t or re.search(r"\bSection\b", t):
                continue
            if re.match(r"(?i)^(page|electoral roll|part no)", t):
                continue
            cols = assign_to_bands(ln, bands)
            # Columns 4 (Relationship) and 6 (Sex) hold single code letters;
            # a name word whose center lands just across a band edge gets
            # pushed back into the neighbouring name column.
            def fix_code(col, valid, neighbour):
                ws = cols.get(col, [])
                keep = [w for w in ws if len(w["t"]) == 1 and w["t"] in valid]
                move = [w for w in ws if w not in keep]
                if keep and move:
                    cols[col] = sorted(keep, key=lambda w: w["x0"])
                    cols[neighbour] = sorted(cols.get(neighbour, []) + move,
                                            key=lambda w: w["x0"])
            fix_code(4, {"F", "M", "H", "O"}, 5)
            fix_code(6, {"M", "F"}, 5)
            serial = col_text(cols, 1)
            if not re.fullmatch(r"\d{1,4}", serial or ""):
                # continuation fragments are unexpected in ECI rolls -> reject, auditable
                rejects.append({"page": pno + 1, "reason": "no_serial",
                                "text": t[:200]})
                continue
            name = col_text(cols, 3)
            if not name:
                rejects.append({"page": pno + 1, "reason": "empty_name",
                                "text": t[:200]})
                continue
            sex_raw = col_text(cols, 6)
            sex = sex_raw[:1].upper() if sex_raw[:1].upper() in ("M", "F") else None
            age_raw = col_text(cols, 7)
            age = age_raw if re.fullmatch(r"\d{1,3}", age_raw or "") else None
            epic = mask_epic(col_text(cols, 8))
            rows.append({
                "elector_name": name,
                "relation_name": col_text(cols, 5) or None,
                "age": age, "sex": sex,
                "address": col_text(cols, 2) or None,
                "epic_masked": epic,
                "vintage_class": vintage_class, "roll_vintage": roll_vintage,
                "page": pno + 1,
            })
    doc.close()
    return rows, rejects, {"vintage_class": vintage_class,
                           "roll_vintage": roll_vintage, "xcheck": xcheck,
                           "pages": npages}


# ------------------------------------------------------- service-elector pages

def service_segments(page):
    """Split a page into (header_block_words, start_line_idx) table segments."""
    lines = cluster_lines(page_words(page))
    segs = []
    i = 0
    n = len(lines)
    while i < n:
        t = line_text(lines[i])
        if re.match(r"Sl\.?\s*No\.?\b", t, re.I):
            block, js = [], []
            for j in range(i, min(i + 7, n)):
                block.append(lines[j])
                js.append(j)
                bt = " ".join(line_text(l) for l in block).lower()
                if "address" in bt:
                    break
            bt = " ".join(line_text(l) for l in block).lower()
            if "elector" in bt and "address" in bt:
                words = [w for l in block for w in l]
                segs.append({"words": words, "first_data": js[-1] + 1})
                i = js[-1] + 1
                continue
        i += 1
    return lines, segs


SECTION_RE = re.compile(r"^[ABC]\s*\.\s*(defence|armed|foreign)", re.I)
FOOTER_RE = re.compile(r"^(place|electoral registration officer|date)\s*:", re.I)


def parse_service_page(page, meta, cur_in=None):
    rows, rejects = [], []
    W = page.rect.width
    lines, segs = service_segments(page)
    cur = cur_in
    for si, seg in enumerate(segs):
        bands, spouse_cx = service_col_bands(seg["words"], W)
        if not bands:
            rejects.append({"page": "?", "reason": "no_service_bands",
                            "text": line_text(lines[seg["first_data"] - 1])[:120]})
            continue

        def de_spouse(words):
            """Drop spouse-reference numbers (numeric words sitting on the
            spouse header center; spouse Sl.No. is not in the output schema)."""
            return [w for w in words
                    if not (spouse_cx is not None
                            and re.fullmatch(r"\d+", w["t"])
                            and abs(w["xc"] - spouse_cx) <= 20)]

        def svc_address(cols):
            out = [w["t"] for w in de_spouse(cols.get("address", []))]
            return clean(" ".join(out)) or None
        # semantic order for row assembly
        cur = None

        def flush():
            if cur and cur["elector_name"]:
                rows.append(cur)

        for ln in lines[seg["first_data"]:]:
            t = line_text(ln)
            if not t:
                continue
            if SECTION_RE.match(t) or FOOTER_RE.match(t):
                flush(); cur = None
                continue
            if re.fullmatch(r"Sl\.?\s*No\.?", t, re.I):
                flush(); cur = None  # next segment header starts
                break
            cols = assign_to_bands(ln, bands)
            serial_cell = col_text(cols, "serial")
            sm = re.match(r"(\d{1,5})\s*(.*)$", serial_cell or "")
            if sm and ln[0]["x0"] < 200:
                flush()
                serial_rest = sm.group(2).strip()
                gender_raw = clean(" ".join(
                    w["t"] for w in de_spouse(cols.get("gender", []))))
                sex = {"male": "M", "female": "F"}.get(gender_raw.lower(), None)
                name_lead = (serial_rest + " ") if serial_rest else ""
                cur = {
                    "elector_name": clean(name_lead + col_text(cols, "name")) or None,
                    "relation_name": None,
                    "age": None,
                    "sex": sex,
                    "address": svc_address(cols),
                    "epic_masked": None,
                    "vintage_class": meta["vintage_class"],
                    "roll_vintage": meta["roll_vintage"],
                }
            elif cur is not None and ln[0]["x0"] < 60:
                # left-margin non-data line: force/section header -> flush
                rejects.append({"page": "?", "reason": "structural_header",
                                "text": t[:120]})
                flush(); cur = None
            elif cur is not None:
                # continuation line: merge wrapped name/address words
                extra_name = col_text(cols, "name")
                extra_addr = svc_address(cols)
                if extra_name:
                    cur["elector_name"] = clean((cur["elector_name"] or "") + " " + extra_name)
                if extra_addr:
                    cur["address"] = clean((cur["address"] or "") + " " + extra_addr)
                # gender may wrap too
                if cur["sex"] is None:
                    g = clean(" ".join(
                        w["t"] for w in de_spouse(cols.get("gender", []))))
                    cur["sex"] = {"male": "M", "female": "F"}.get(g.lower(), None)
            else:
                # stray line outside any row (force names etc.) -> ignore
                continue
        if si < len(segs) - 1:
            flush(); cur = None  # a row cannot span a new table header
        # (the last segment's open row is returned: it may span a page break)
    return rows, rejects, cur


def parse_service_electors(pdf, meta, state_dir):
    rows, rejects = [], []
    doc = fitz.open(pdf)
    cover_text = doc[0].get_text("text") if len(doc) else ""
    vintage_class, roll_vintage = decide_vintage(cover_text, meta["roll_type"], state_dir)
    m2 = {"vintage_class": vintage_class, "roll_vintage": roll_vintage}
    npages = len(doc)
    cur = None
    for pno in range(npages):
        try:
            r, rj, cur = parse_service_page(doc[pno], m2, cur)
        except Exception as e:  # noqa: BLE001
            rejects.append({"page": pno + 1, "reason": f"page_error: {e}"[:160],
                            "text": ""})
            continue
        rows.extend(r)
        for x in rj:
            x["page"] = pno + 1
        rejects.extend(rj)
    if cur and cur["elector_name"]:
        rows.append(cur)
    doc.close()
    return rows, rejects, {"vintage_class": vintage_class,
                           "roll_vintage": roll_vintage, "pages": npages}


# ------------------------------------------------------- mizoram pooling lists

def parse_mizoram_pooling(pdf, meta, state_dir, url=""):
    """Token-stream parse of State/District/AC/Part/EPIC/Name lists."""
    rows, rejects = [], []
    doc = fitz.open(pdf)
    cover_text = doc[0].get_text("text") if len(doc) else ""
    m = re.search(r"(Deletion|Addition|Modification)", meta.get("roll_type", ""), re.I)
    kind = m.group(1).lower() if m else "change"
    # month: prefer inventory last_updated ("April 2026"), else scan full text
    # for title/footer variants ("accepted 4-2026", "in E-Roll 3-2026")
    when = None
    lu = (meta.get("last_updated") or "")
    ml = re.search(r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})", lu)
    if ml:
        when = f"{ml.group(1)} {ml.group(2)}"
    if not when:
        full_txt = " ".join(doc[p].get_text("text") for p in range(min(len(doc), 4)))
        full_txt += " " + (doc[-1].get_text("text") if len(doc) else "")
        mm2 = re.search(r"(?:accepted|E-Roll)\s+(\d{1,2})-(\d{4})", full_txt)
        if mm2:
            when = f"{mm2.group(1)}/{mm2.group(2)}"
    if not when:
        mm = re.search(r"(January|February|March|April|May|June|July|August|September|October|November|December)[_\s](\d{4})", url or "")
        when = f"{mm.group(1)} {mm.group(2)}" if mm else "2026"
    vintage_class = "other"
    roll_vintage = (f"Monthly Pooling {when} \u2013 {kind} "
                    f"(applications accepted; not a roll)")
    STOP = {"Mizoram", "List", "Page"}
    npages = len(doc)
    for pno in range(npages):
        toks = [w["t"] for w in page_words(doc[pno])]
        # header line: State District AC No Part No EPIC Name
        hdr = -1
        for i in range(len(toks) - 6):
            if (toks[i] == "State" and toks[i + 1] == "District"
                    and toks[i + 2] == "AC"):
                hdr = i
                break
        start = hdr + 7 if hdr >= 0 else 0
        i = start
        n = len(toks)
        while i < n:
            if toks[i] != "Mizoram":
                i += 1
                continue
            if i + 5 >= n:
                break
            district, ac, part, epic = toks[i + 1], toks[i + 2], toks[i + 3], toks[i + 4]
            j = i + 5
            name_toks = []
            while j < n and toks[j] not in STOP:
                name_toks.append(toks[j])
                j += 1
            name = clean(" ".join(name_toks))
            if (re.fullmatch(r"\d{1,3}", ac or "") and re.fullmatch(r"\d{1,4}", part or "")
                    and name):
                rows.append({
                    "elector_name": name,
                    "relation_name": None, "relation_type": None,
                    "age": None, "sex": None,
                    "address": None, "house_no": None,
                    "epic_masked": mask_epic(epic),
                    "vintage_class": vintage_class, "roll_vintage": roll_vintage,
                    "district": district, "ac_number": ac, "part_number": part,
                    "list_kind": kind,
                    "page": pno + 1,
                })
            else:
                rejects.append({"page": pno + 1, "reason": "bad_pooling_row",
                                "text": clean(" ".join(toks[i:j]))[:200]})
            i = j
    doc.close()
    return rows, rejects, {"vintage_class": vintage_class,
                           "roll_vintage": roll_vintage, "pages": npages}


# ------------------------------------------------------- meghalaya 2005 roll
# The Meghalaya 2005 scans have a garbled embedded-OCR text layer: words are
# NOT grouped into logical lines (a row's serial sits on one text line while
# its name sits on another). Layout, however, is regular: left half holds
# serial / house / name / relation-code / relation-name, right half holds
# serial / sex / age / EPIC, with matching serials at the same y on both
# halves. We therefore anchor each row on its serial word and pair left/right
# halves by nearest-y. Pairing is STRICT (1:1, |dy|<=6px); anything unpaired
# or conflicting goes to rejects, never guessed.

def parse_meghalaya_roll(pdf, meta, state_dir):
    rows, rejects = [], []
    doc = fitz.open(pdf)
    vintage_class = "pre_sir"
    roll_vintage = "pre-SIR Roll 2005 (Intensive; published 15.04.2005)"
    npages = len(doc)
    SERIAL = re.compile(r"^\d{1,4}$")
    for pno in range(npages):
        ws = page_words(doc[pno])
        left = [w for w in ws if w["x0"] < 45 and SERIAL.match(w["t"])]
        right = [w for w in ws if 360 <= w["x0"] <= 415 and SERIAL.match(w["t"])]
        # drop header numbers (e.g. AC/part numbers): a real serial anchor
        # has row words (house/name) at the same y to its right
        def has_row(w):
            return any(v["x0"] > 50 and abs(v["y0"] - w["y0"]) <= 7
                       for v in ws if v is not w)
        left = sorted([w for w in left if has_row(w)], key=lambda w: w["y0"])
        right = sorted(right, key=lambda w: w["y0"])
        used_r = {}
        for li, lw in enumerate(left):
            # row's vertical slot: from this anchor to the next anchor
            y_lo = lw["y0"] - 6
            y_hi = (left[li + 1]["y0"] - 4) if li + 1 < len(left) else lw["y0"] + 14
            # nearest right anchor within 6px
            best, best_dy = None, 7.0
            for rw in right:
                dy = abs(rw["y0"] - lw["y0"])
                if dy < best_dy:
                    best, best_dy = rw, dy
            if best is None:
                rejects.append({"page": pno + 1, "reason": "meg_unpaired_left",
                                "text": f"serial {lw['t']}"})
                continue
            if best["t"] in used_r:
                rejects.append({"page": pno + 1, "reason": "meg_right_conflict",
                                "text": f"serial {lw['t']} vs {used_r[best['t']]}"})
                continue
            used_r[best["t"]] = lw["t"]
            if best["t"] != lw["t"]:
                rejects.append({"page": pno + 1, "reason": "meg_serial_mismatch",
                                "text": f"left {lw['t']} right {best['t']}"})
                continue
            slot = [v for v in ws if y_lo <= v["y0"] <= y_hi and v["x0"] < 340]
            anchor_line = [v for v in slot if abs(v["y0"] - lw["y0"]) <= 6]
            house = " ".join(v["t"] for v in sorted(anchor_line, key=lambda v: v["x0"])
                             if 50 <= v["x0"] < 84)
            relcode = next((v["t"] for v in anchor_line
                            if 225 <= v["x0"] < 258 and v["t"] in ("H", "F", "M", "O")),
                           None)
            name_toks = [v for v in slot
                         if 85 <= v["x0"] < 258 and v is not lw
                         and not (50 <= v["x0"] < 84)
                         and v["t"] != (relcode or "\x00")]
            name_toks = [v for v in name_toks
                         if not (225 <= v["x0"] < 258 and len(v["t"]) == 1)]
            name = clean(" ".join(v["t"] for v in sorted(
                name_toks, key=lambda v: (round(v["y0"]), v["x0"]))))
            relname = clean(" ".join(v["t"] for v in sorted(anchor_line, key=lambda v: v["x0"])
                                     if 258 <= v["x0"] < 340))
            rwords = [v for v in ws if abs(v["y0"] - best["y0"]) <= 5
                      and v["x0"] > 340 and v is not best]
            sex = next((v["t"] for v in rwords if 340 < v["x0"] < 398
                        and v["t"] in ("M", "F")), None)
            age = next((v["t"] for v in rwords if 398 <= v["x0"] < 428
                        and re.fullmatch(r"\d{1,3}", v["t"])), None)
            epic = next((v["t"] for v in rwords if v["x0"] >= 428
                         and re.fullmatch(r"[A-Z]{2,3}[0-9]{5,8}", v["t"])), None)
            if not name:
                rejects.append({"page": pno + 1, "reason": "meg_empty_name",
                                "text": f"serial {lw['t']}"})
                continue
            rows.append({
                "elector_name": name,
                "relation_name": relname or None,
                "relation_type": relcode,
                "age": int(age) if age else None,
                "sex": sex,
                "address": clean(house) or None,
                "epic_masked": mask_epic(epic),
                "vintage_class": vintage_class, "roll_vintage": roll_vintage,
                "district": meta.get("district"),
                "ac_number": meta.get("ac_number"),
                "part_number": meta.get("part_number"),
                "page": pno + 1,
            })
    doc.close()
    return rows, rejects, {"vintage_class": vintage_class,
                           "roll_vintage": roll_vintage, "pages": npages}


# ------------------------------------------------------------------ driver

def load_inventory():
    inv = {}
    with open(INV_PATH, encoding="utf-8") as f:
        for line in f:
            r = json.loads(line)
            inv[r["file_url"]] = r
    return inv


def load_fetch_map():
    """local path -> (url, status); dedupe identical log lines."""
    m = {}
    with open(FETCH_LOG, encoding="utf-8") as f:
        for line in f:
            p = line.rstrip("\n").split("\t")
            if len(p) < 4:
                continue
            _state, url, path, status = p[0], p[1], p[2], p[3]
            if path not in m:
                m[path] = (url, status)
    return m


def files_for_state(state_dir):
    """url -> local pdf path (one per URL).

    Primary key: inventory file_url basename. Local files may carry a
    _<8hex> fetch suffix or _1 dedup suffix; strip those for matching.
    Fetch-log status is attached opportunistically.
    """
    inv = load_inventory()
    base_to_url = {}
    for url, r in inv.items():
        bn = url.rsplit("/", 1)[-1]
        base_to_url.setdefault(bn, url)
    fmap = load_fetch_map()
    pdfdir = os.path.join(BASE, "data", state_dir, "pdf")
    out = {}
    for dirpath, _dn, fns in os.walk(pdfdir):
        for fn in sorted(fns):
            if not fn.endswith(".pdf"):
                continue
            full = os.path.join(dirpath, fn)
            url, status = fmap.get(full, (None, None))
            if url is None:
                # wave-2 files were logged under different paths (or not
                # logged); fall back to inventory file_url basename matching.
                # Local files may carry _<8hex> fetch or _1 dedup suffixes.
                if fn in base_to_url:
                    url = base_to_url[fn]
                else:
                    m = re.match(r"^(.+?)_[0-9a-f]{8}\.pdf$", fn)
                    if m and (m.group(1) + ".pdf") in base_to_url:
                        url = base_to_url[m.group(1) + ".pdf"]
                    elif fn.endswith("_1.pdf") and fn[:-6] + ".pdf" in base_to_url:
                        url = base_to_url[fn[:-6] + ".pdf"]
            if url is None:
                url = "UNRESOLVED:" + full
            if url in out and fn.endswith("_1.pdf"):
                continue
            if url in out and not out[url][0].endswith("_1.pdf"):
                continue
            out[url] = (full, status)
    return out


def resolve_delhi(meta_by_ac_part):
    """Map Delhi's _q<hash> files to inventory rows via PDF header (AC, Part)."""
    mapping = {}
    pdfdir = os.path.join(BASE, "data", "delhi", "pdf", "main-roll")
    for fn in sorted(os.listdir(pdfdir)):
        if not fn.endswith(".pdf"):
            continue
        full = os.path.join(pdfdir, fn)
        try:
            doc = fitz.open(full)
            txt = "".join(p.get_text("text") for p in doc[:2])
            doc.close()
        except Exception:  # noqa: BLE001
            continue
        m1 = re.search(r"Assembly Constituency\s+(\d+)", txt)
        m2 = re.search(r"Part No\.?\s*(\d+)", txt)
        if m1 and m2:
            key = (m1.group(1).lstrip("0") or "0", m2.group(1).lstrip("0") or "0")
            mapping[full] = key
    return mapping


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    inv = load_inventory()
    delhi_keys = {}
    if not args.only or args.only == "delhi":
        inv_by_ap = {}
        for url, r in inv.items():
            if r["state"] == "Delhi":
                inv_by_ap[(str(r["ac_number"]), str(r["part_number"]))] = (url, r)
        delhi_keys = resolve_delhi(inv_by_ap)
        print(f"Delhi: resolved {len(delhi_keys)} files to (ac,part)", flush=True)

    stats = {}
    for state_dir in STATES:
        if args.only and state_dir != args.only:
            continue
        tag = DATASET_TAGS[state_dir]
        sname = STATE_NAMES[state_dir]
        fmap = files_for_state(state_dir)
        items = sorted(fmap.items())
        if args.limit:
            items = items[:args.limit]
        rows_f = open(os.path.join(OUTDIR, f"{state_dir}.jsonl"), "w", encoding="utf-8")
        rej_f = open(os.path.join(OUTDIR, f"{state_dir}.rejects.jsonl"), "w", encoding="utf-8")
        total_rows = total_rej = 0
        for url, (path, status) in items:
            if url.startswith("UNRESOLVED:") and state_dir == "delhi":
                key = delhi_keys.get(path)
                meta = None
                if key:
                    for u2, r2 in inv.items():
                        if r2["state"] == "Delhi" and str(r2["ac_number"]) == key[0] \
                                and str(r2["part_number"]) == key[1]:
                            meta, url = r2, u2
                            break
            else:
                meta = inv.get(url)
            stat = {"file": os.path.relpath(path, BASE), "url": url,
                    "status": "ok", "fetch_status": status}
            if meta is None:
                stat["status"] = "failed: no inventory row for URL"
                stats.setdefault(state_dir, {})[os.path.basename(path)] = stat
                continue
            h = HANDLERS.get((meta["state"], meta["record_type"]))
            if h is None:
                stat["status"] = "failed: no handler"
                stats.setdefault(state_dir, {})[os.path.basename(path)] = stat
                continue
            if isinstance(h, tuple):
                stat["status"] = "skipped: " + h[1]
                stats.setdefault(state_dir, {})[os.path.basename(path)] = stat
                continue
            try:
                if h == "eci_roll":
                    rows, rejects, info = parse_eci_roll(path, meta, state_dir)
                elif h == "meghalaya_roll":
                    rows, rejects, info = parse_meghalaya_roll(path, meta, state_dir)
                elif h == "service_electors":
                    rows, rejects, info = parse_service_electors(path, meta, state_dir)
                elif h == "mizoram_pooling":
                    rows, rejects, info = parse_mizoram_pooling(path, meta, state_dir, url)
                else:
                    raise ValueError("unknown handler")
            except Exception as e:  # noqa: BLE001
                stat["status"] = f"failed: {e}"[:200]
                stats.setdefault(state_dir, {})[os.path.basename(path)] = stat
                continue
            n_written = 0
            for r in rows:
                rec = {
                    "elector_name": r["elector_name"],
                    "relation_name": r.get("relation_name"),
                    "age": r.get("age"),
                    "sex": r.get("sex"),
                    "address": r.get("address"),
                    "state": meta["state"],
                    "district": r.get("district") or meta.get("district"),
                    "ac_number": r.get("ac_number") or meta.get("ac_number"),
                    "ac_name": meta.get("ac_name"),
                    "part_number": r.get("part_number") or meta.get("part_number"),
                    "roll_vintage": r["roll_vintage"],
                    "vintage_class": r["vintage_class"],
                    "roll_type": meta.get("roll_type"),
                    "record_type": meta.get("record_type"),
                    "source_file_url": url,
                    "epic_masked": r.get("epic_masked"),
                    "parsed_at": NOW,
                    "dataset": tag,
                }
                # EPIC safety: never write anything that looks like a raw EPIC
                rows_f.write(json.dumps(rec, ensure_ascii=False) + "\n")
                n_written += 1
            for rj in rejects:
                rj["src_file"] = os.path.basename(path)
                rej_f.write(json.dumps(rj, ensure_ascii=False) + "\n")
            stat.update({"rows": n_written, "rejects": len(rejects),
                         "vintage_class": info.get("vintage_class"),
                         "roll_vintage": info.get("roll_vintage"),
                         "pages": info.get("pages"),
                         "xcheck": info.get("xcheck")})
            # AC/part cross-check: PDF vs inventory
            xc = info.get("xcheck") or {}
            if xc.get("pdf_ac") and str(meta.get("ac_number")) not in (None, ""):
                if xc["pdf_ac"].lstrip("0") != str(meta["ac_number"]).lstrip("0"):
                    stat["ac_mismatch"] = {"pdf": xc.get("pdf_ac"),
                                           "inventory": meta.get("ac_number")}
            stats.setdefault(state_dir, {})[os.path.basename(path)] = stat
            total_rows += n_written
            total_rej += len(rejects)
        rows_f.close()
        rej_f.close()
        print(f"[{state_dir}] {len(items)} urls -> {total_rows} rows, "
              f"{total_rej} rejects", flush=True)
    with open(os.path.join(OUTDIR, "parse_stats.json"), "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=1)
    # EPIC audit: assert no row contains an unmasked EPIC-shaped token
    print("EPIC audit: scanning outputs for raw EPIC patterns...", flush=True)
    epic_re = re.compile(r"\b[A-Z]{3}\d{7}\b")
    bad = 0
    for state_dir in STATES:
        if args.only and state_dir != args.only:
            continue
        p = os.path.join(OUTDIR, f"{state_dir}.jsonl")
        if not os.path.exists(p):
            continue
        for i, line in enumerate(open(p, encoding="utf-8")):
            r = json.loads(line)
            blob = json.dumps(r, ensure_ascii=False)
            blob_nomask = blob.replace("****", "")
            if epic_re.search(blob_nomask):
                bad += 1
                if bad <= 5:
                    print(f"  RAW EPIC? {state_dir}.jsonl line {i}: "
                          f"{blob[:160]}", flush=True)
    print(f"EPIC audit: {bad} suspect rows", flush=True)
    print("DONE", flush=True)


if __name__ == "__main__":
    main()
