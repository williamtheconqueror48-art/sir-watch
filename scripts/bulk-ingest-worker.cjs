#!/usr/bin/env node
/**
 * Bulk-ingest name-level deletion records into SIR-WATCH Neon DB.
 *
 * Reads parsed public bucket JSONs (Karnataka SIR datasets), transforms each
 * row verbatim into deletion_records, and inserts via batched unnest INSERTs
 * with bounded concurrency. Nothing is invented: every field comes from the
 * source bucket or its published manifest/dict files.
 *
 * Env: SIRWATCH_DB_URI (postgres URI, in memory only)
 * Args: --dataset asd|notices|asddo --repo <extracted repo dir>
 *       --ledger <ledger_id> [--limit <max rows, for testing>]
 */
const fs = require("fs");
const path = require("path");
const { neon } = require("/home/hatch/workspace/skills/neon/bin/node_modules/@neondatabase/serverless");

const BATCH = 5000;
const CONCURRENCY = 8;

function args() {
  const a = {};
  for (let i = 2; i < process.argv.length; i += 2) a[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
  return a;
}

function* walkJson(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walkJson(p);
    else if (e.name.endsWith(".json") && !e.name.includes("manifest")) yield p;
  }
}

async function main() {
  const a = args();
  const { dataset, repo, ledger } = a;
  const limit = a.limit ? parseInt(a.limit, 10) : Infinity;
  const ledgerId = parseInt(ledger, 10);
  if (!dataset || !repo || !ledgerId) throw new Error("need --dataset --repo --ledger");
  const sql = neon(process.env.SIRWATCH_DB_URI);

  let bucketRoot, manifest, acs, transform;
  const GH_ASD = "https://github.com/gouthamganeshm/Karnataka_Draft_Roll_2026/blob/main/";

  if (dataset === "asd") {
    bucketRoot = path.join(repo, "docs", "data-asd", "roll");
    manifest = JSON.parse(fs.readFileSync(path.join(repo, "docs", "data-asd", "manifest.json"), "utf8"));
    acs = manifest.acs; // {acNo: {name, nameKn, district}}
    transform = (t, relPath) => {
      // [suffix, ac, part, serial, reasonCode, oldPart, oldSerial, name, relativeName]
      const ac = acs[String(t[1])] || {};
      return {
        state: "Karnataka",
        district: ac.district || null,
        ac_name: ac.name || null,
        booth_no: t[2] != null ? String(t[2]) : null,
        booth_name: null,
        voter_name: t[7],
        epic_masked: null, // hash suffix only; full EPIC never published by source
        deletion_reason: t[4] || null,
        phase: "Phase 3",
        source_url: GH_ASD + "docs/data-asd/roll/" + relPath,
      };
    };
  } else if (dataset === "notices") {
    bucketRoot = path.join(repo, "docs", "data-notices", "roll");
    manifest = JSON.parse(fs.readFileSync(path.join(repo, "docs", "data-notices", "manifest.json"), "utf8"));
    acs = manifest.acs;
    transform = (t, relPath) => {
      // [suffix, AC, part, serial, notice_type, age, gender, name, drive_file_id]
      const ac = acs[String(t[1])] || {};
      return {
        state: "Karnataka",
        district: ac.district || null,
        ac_name: ac.name || null,
        booth_no: t[2] != null ? String(t[2]) : null,
        booth_name: null,
        voter_name: t[7],
        epic_masked: null,
        deletion_reason: t[4] ? "Notice: " + t[4] : null,
        phase: "Phase 3",
        source_url: GH_ASD + "docs/data-notices/roll/" + relPath,
      };
    };
  } else if (dataset === "asddo") {
    bucketRoot = path.join(repo, "docs", "data", "asddo");
    manifest = JSON.parse(fs.readFileSync(path.join(repo, "docs", "data", "manifest.json"), "utf8"));
    const dicts = manifest.dicts; // {districts:[], acs:[[acNo,acName,districtIdx]], reasons:[], relations:[]}
    const partsCache = new Map();
    const getPart = (acIdx, fileIdx) => {
      const key = acIdx + ":" + fileIdx;
      if (!partsCache.has(key)) {
        try {
          const list = JSON.parse(fs.readFileSync(path.join(repo, "docs", "data", "parts", acIdx + ".json"), "utf8"));
          partsCache.set(key, list[fileIdx] || null);
        } catch { partsCache.set(key, null); }
      }
      return partsCache.get(key);
    };
    transform = (t) => {
      // [suffix, name, relative, relIdx, age, serial, reasonIdx, acIdx, fileIdx, dupEpicMasked]
      const acEntry = dicts.acs[t[7]] || [];
      const part = getPart(t[7], t[8]); // [fileUrl, partNo, boothName, generatedOn]
      return {
        state: "Karnataka",
        district: dicts.districts[acEntry[2]] || null,
        ac_name: acEntry[1] || null,
        booth_no: part ? String(part[1]) : null,
        booth_name: part ? part[2] || null : null,
        voter_name: t[1],
        epic_masked: t[9] || null, // already masked by source (ABC****XYZ)
        deletion_reason: dicts.reasons[t[6]] || null,
        phase: "Phase 3",
        source_url: part && part[0] ? part[0] : "https://github.com/omshivaprakash/karnataka-asddo-dashboard",
      };
    };
  } else if (dataset === "jsonl") {
    // Generic newline-delimited JSON: each line already carries the full
    // deletion_records row (state included). EPICs must already be masked.
    const input = a.input;
    if (!input) throw new Error("jsonl dataset needs --input <file>");
    var jsonlRows = fs.readFileSync(input, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
    transform = (r) => r;
  } else throw new Error("unknown dataset " + dataset);

  const files = dataset === "jsonl" ? ["__jsonl__"] : [...walkJson(bucketRoot)];
  console.log(`dataset=${dataset} buckets=${files.length}`);

  const cols = ["state", "district", "ac_name", "booth_no", "booth_name", "voter_name", "epic_masked", "deletion_reason", "phase", "source_url"];
  const INSERT =
    `INSERT INTO deletion_records (state, district, ac_name, booth_no, booth_name, voter_name, epic_masked, deletion_reason, phase, source_url, ledger_id) ` +
    `SELECT t.* FROM unnest($1::text[],$2::text[],$3::text[],$4::text[],$5::text[],$6::text[],$7::text[],$8::text[],$9::text[],$10::text[],$11::int[]) ` +
    `AS t(state, district, ac_name, booth_no, booth_name, voter_name, epic_masked, deletion_reason, phase, source_url, ledger_id)`;

  let batch = [], inFlight = 0, done = 0, fileCount = 0, errors = 0;
  const waiters = [];
  const waitSlot = () => (inFlight >= CONCURRENCY ? new Promise((r) => waiters.push(r)) : Promise.resolve());
  const release = () => { inFlight--; const w = waiters.shift(); if (w) w(); };

  async function flush() {
    if (!batch.length) return;
    const rows = batch; batch = [];
    await waitSlot();
    inFlight++;
    const arrays = cols.map((c) => rows.map((r) => r[c] ?? null));
    arrays.push(rows.map(() => ledgerId));
    try {
      await sql.query(INSERT, arrays);
      done += rows.length;
    } catch (e) {
      errors++;
      console.error("INSERT failed:", String(e && e.message || e).slice(0, 200));
      if (errors > 3) throw new Error("too many insert errors, aborting");
      // single retry
      await sql.query(INSERT, arrays);
      done += rows.length;
    } finally { release(); }
    if (done % 100000 < BATCH) console.log(`  inserted ${done.toLocaleString("en-IN")}`);
  }

  async function feedRows(rows, rel) {
    for (const t of rows) {
      if (dataset === "jsonl") {
        if (!t || !t.voter_name || !t.state) continue;
        batch.push(transform(t));
      } else {
        if (!t || t[1] == null) continue;
        const r = dataset === "asddo" ? transform(t) : transform(t, rel);
        if (!r.voter_name) continue;
        batch.push(r);
      }
      if (batch.length >= BATCH) await flush();
      if (done >= limit) break;
    }
  }

  if (dataset === "jsonl") {
    await feedRows(jsonlRows, "");
  } else {
    for (const f of files) {
      if (done >= limit) break;
      const rel = path.relative(bucketRoot, f).split(path.sep).join("/");
      let rows;
      try { rows = JSON.parse(fs.readFileSync(f, "utf8")); }
      catch (e) { console.error("bad json", f); continue; }
      await feedRows(rows, rel);
      if (++fileCount % 5000 === 0) console.log(`  files ${fileCount}/${files.length}`);
    }
  }
  await flush();
  while (inFlight > 0) await new Promise((r) => setTimeout(r, 200));
  console.log(`DONE dataset=${dataset} inserted=${done.toLocaleString("en-IN")} errors=${errors}`);
}

main().catch((e) => { console.error("FATAL", e.message); process.exit(1); });
