# Search backend evaluation — SIR-WATCH national rolls (DRAFT)

**Decision deferred until real volumes are known.** The coordinator's fetch
will establish actual row counts per state; only then pick. Rough national
target (~2B rows / 80–100GB) cannot live on GitHub + jsDelivr static shards —
that path caps out around the current 26M-row archive.

## Candidates

| Option | Fit for name search | Cost | Notes |
|---|---|---|---|
| **Neon Postgres + pg_trgm** (already in use) | Good for fuzzy name match; proven by the WB adjudication ledger (39,604 rows) | Free tier limits apply | Current API routes already query it. Question is scale: hundreds of millions of rows need partitioning and index budget. |
| **Self-hosted Typesense/Meilisearch** (single VM) | Excellent typo-tolerant search, built for this | VM cost (~$5–12/mo) or free-tier cloud | Real infra, real bill. Best UX. Needs an operator. |
| **Per-state SQLite shards + client-side** | Works to ~tens of millions of rows per shard with FTS5 | $0 (jsDelivr) | Shard per state; browser downloads only the state's shard. Breaks the "one nationwide search" UX unless a state picker precedes search. |
| **DuckDB-WASM over parquet shards** | Strong analytical queries, $0 hosting | $0 (jsDelivr) | Heavy client download; name search UX worse than a real engine. |
| **Cloudflare D1** | SQLite-compatible, edge | Free tier 5GB — too small | Ruled out on size alone. |

## Decision rule

1. If total fetched rows land **under ~100M**: extend Neon with partitioned
   tables + pg_trgm, keep the current API shape.
2. If **100M–2B**: stand up Typesense on a small VM; bulk-index from the
   parsed JSONL; keep Neon for the adjudication ledger.
3. Never present the rough national scale as acquired data; the dashboard
   shows only reconciled, indexed rows.

## Non-negotiables for any backend

- EPICs stay masked at parse time — the backend never sees a full EPIC.
- Every row carries `source_file_url` + `roll_vintage` + `vintage_class`;
  no row is searchable without provenance.
- Pre-SIR vs post-SIR is a filter on `vintage_class`, not a separate index.
