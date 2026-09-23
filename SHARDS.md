# SIR-WATCH static shard pipeline

The bulk name-level rows (millions per state) are **not** stored in the
transactional database. They live as name-sharded, gzipped static JSON,
queried client-side. This keeps the project at $0: no database can hold
15M+ rows on a free tier, and the source projects this mirrors already
prove the pattern (10.77M rows served as static buckets).

## Layout

```
data/shards/
  manifest.json          # per-dataset: fields, shard index, counts, provenance
  ka-asd/MA.json.gz      # {"v":1,"dataset":"ka-asd","shard":"MA","count":N,"rows":[[...]]}
  ka-notices/...
  ka-asddo/...
```

- Shard key: first 2 alphanumeric chars of the uppercased name, any script
  (Kannada names shard on Kannada chars). Empty/non-alnum names → `00`.
- Hot shards (>150k rows) are split by 3rd char (`MAH.json.gz`); the
  manifest lists every shard file explicitly, so the app never guesses.
- Any shard file that would exceed 15MB gzipped (jsDelivr serves files up
  to 20MB) is split into sequential chunks `SK.p0.json.gz`, `SK.p1.json.gz`,
  …; the manifest entry then carries `{"files": [...], "count"}` and the
  client fetches and concatenates all parts. Key depth never exceeds 3 chars.
- Rows are compact arrays; field order is per-dataset `fields` in the manifest.
- Provenance per dataset: source project, branch, tarball SHA-256,
  retrieval date, expected vs actual row counts. A count mismatch aborts
  loudly (exit 1) — it does not silently ship.

## Adding new findings (ongoing SIR ingestion)

1. **Stage** the new source under `data/raw/<name>/` with a
   `.provenance.json` sidecar (source URL, retrieval date, SHA-256,
   row count) and register it in `data/SOURCES_MANIFEST.json`.
2. **Add a builder** in `scripts/build_shards.py`: a `dataset_<key>()`
   function returning `{key, fields, rows(), provenance}`. Verify the
   tuple schema against the real files first — never assume it.
3. **Run** `python3 scripts/build_shards.py --out data/shards --only <key>`
   (omit `--only` to rebuild all). Confirm the printed row count matches
   the source manifest.
4. **Publish** the new `<key>/` directory + updated `manifest.json` to the
   shard host (see below). Bump nothing else; the app reads the manifest.
5. **Verify** in the app: search a known name from the new dataset.

## Hosting

Production shards are served from `{SHARD_BASE}` (env
`NEXT_PUBLIC_SHARD_BASE`). Current: GitHub release repos + jsDelivr CDN,
`.json.gz` decompressed in-browser via `DecompressionStream`. If a
`NEXT_PUBLIC_SHARD_BASE` is unset or the manifest is unreachable, the
app shows ledger-database results only and marks the archive offline —
it never fabricates shard results.

When budget allows, the proper home is object storage (Cloudflare R2);
the layout is host-agnostic by design.

## App contract (`lib/shards.ts`)

- `getShardManifest()` — cached manifest fetch.
- `searchShards(query, limit)` — resolves the 3-char then 2-char shard
  per dataset, gunzips, filters `name includes query` (case-insensitive).
- Source URLs are reconstructed client-side from short refs stored in
  the row (bucket path → GitHub blob URL; Drive file id → Drive viewer).
  A missing ref renders `NOT AVAILABLE IN SOURCE DATA`, never a guess.
