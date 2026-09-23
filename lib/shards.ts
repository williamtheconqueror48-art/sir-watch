/**
 * Client-side search over the static name-sharded JSON datasets.
 *
 * The bulk name-level rows (millions) live as gzipped shards, not in the
 * transactional DB. Shard key = first 2 alnum chars of the uppercased name
 * (any script); hot prefixes are split to 3 chars. See shards/manifest.json
 * and SHARDS.md.
 */

export type ShardDatasetKey = "ka-asd" | "ka-notices" | "ka-asddo";

type ShardManifest = {
  v: number;
  built_at: string;
  [k: string]: unknown;
  "ka-asd"?: DatasetMeta;
  "ka-notices"?: DatasetMeta;
  "ka-asddo"?: DatasetMeta;
};

type ShardEntry = {
  /** single-file shard (legacy shape) */
  file?: string;
  /** chunked shard: every file must be fetched and concatenated */
  files?: string[];
  count: number;
};

type DatasetMeta = {
  key: string;
  fields: string[];
  rows: number;
  shard_count: number;
  shards: Record<string, ShardEntry>;
  provenance: {
    source_project: string;
    source_branch: string;
    tarball_sha256: string;
    retrieved_at: string;
    note: string;
  };
};

export type ShardRecord = {
  dataset: ShardDatasetKey;
  voter_name: string;
  epic_masked: string | null;
  state: string;
  district: string | null;
  ac_name: string | null;
  booth_no: string | null;
  booth_name: string | null;
  deletion_reason: string | null;
  source_url: string;
  source_label: string;
};

const SHARD_BASE =
  process.env.NEXT_PUBLIC_SHARD_BASE ?? "https://sir-watch-shards.example.invalid";

let manifestCache: ShardManifest | null = null;
let manifestFailed = false;

export async function getShardManifest(): Promise<ShardManifest | null> {
  if (manifestCache) return manifestCache;
  if (manifestFailed) return null;
  try {
    const res = await fetch(`${SHARD_BASE}/manifest.json`, { cache: "force-cache" });
    if (!res.ok) throw new Error(`manifest ${res.status}`);
    manifestCache = (await res.json()) as ShardManifest;
    return manifestCache;
  } catch {
    manifestFailed = true;
    return null;
  }
}

function normKey(name: string, n: number): string {
  const chars = Array.from(name.toUpperCase()).filter((c) => /[\p{L}\p{N}]/u.test(c));
  if (!chars.length) return "0".repeat(n);
  const k = chars.slice(0, n).join("");
  return k.length === n ? k : k + "0".repeat(n - k.length);
}

async function fetchShardGz(path: string): Promise<{ rows: unknown[][] } | null> {
  try {
    const res = await fetch(`${SHARD_BASE}/${path}`, { cache: "force-cache" });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const ds = new DecompressionStream("gzip");
    const stream = new Blob([buf]).stream().pipeThrough(ds);
    const text = await new Response(stream).text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const ASD_BLOB = (bucket: string) =>
  `https://github.com/gouthamganeshm/Karnataka_Draft_Roll_2026/blob/main/docs/data-asd/roll/${bucket}.json`;
const driveUrl = (id: string | null) =>
  id ? `https://drive.google.com/file/d/${id}/view` : "NOT AVAILABLE IN SOURCE DATA";

const DATASET_LABEL: Record<ShardDatasetKey, string> = {
  "ka-asd": "Karnataka draft-roll ASD index (Absent/Shifted/Dead — community parser project)",
  "ka-notices": "Karnataka SIR discrepancy notices (district election offices)",
  "ka-asddo": "Karnataka CEO ASDDO dashboard (community mirror)",
};

function toRecord(ds: ShardDatasetKey, fields: string[], row: unknown[]): ShardRecord {
  const g = (name: string): string | null => {
    const i = fields.indexOf(name);
    const v = i >= 0 ? (row[i] as string | null) : null;
    return v == null || v === "" ? null : v;
  };
  let reason: string | null = null;
  let source_url = "NOT AVAILABLE IN SOURCE DATA";
  if (ds === "ka-asd") {
    reason = g("reason_code");
    const b = g("src_bucket");
    source_url = b ? ASD_BLOB(b) : source_url;
  } else if (ds === "ka-notices") {
    const rt = g("reason_text");
    reason = rt ? `Notice issued — ${rt}` : "Notice issued (reason not stated)";
    source_url = driveUrl(g("drive_file_id"));
  } else {
    reason = g("reason");
    source_url = driveUrl(g("drive_file_id"));
  }
  return {
    dataset: ds,
    voter_name: (g("name") ?? "") as string,
    epic_masked: g("epic_masked"),
    state: "Karnataka",
    district: g("district"),
    ac_name: g("ac_name"),
    booth_no: g("part"),
    booth_name: g("booth_name"),
    deletion_reason: reason,
    source_url,
    source_label: DATASET_LABEL[ds],
  };
}

/** Prefix search over all shard datasets (case-insensitive).
 *
 * The shard is chosen from the first 2-3 alphanumeric characters of the
 * query, so only names STARTING with the query prefix are found — this is
 * not a global substring search. Rows within the shard are then filtered
 * with a substring match on the name.
 */
export async function searchShards(query: string, limit = 200): Promise<ShardRecord[]> {
  const man = await getShardManifest();
  if (!man) return [];
  const q = query.trim().toUpperCase();
  if (q.length < 2) return [];
  const out: ShardRecord[] = [];
  const keys: ShardDatasetKey[] = ["ka-asd", "ka-notices", "ka-asddo"];
  await Promise.all(
    keys.map(async (dk) => {
      const meta = man[dk];
      if (!meta) return;
      // Prefer the 3-char shard when the manifest carries one for this prefix.
      const k3 = normKey(q, 3);
      const k2 = normKey(q, 2);
      const entry = meta.shards[k3] ?? meta.shards[k2];
      if (!entry) return;
      // Oversize shards are split into sequential chunks; fetch them all.
      const files = entry.files ?? (entry.file ? [entry.file] : []);
      const parts = await Promise.all(files.map(fetchShardGz));
      for (const shard of parts) {
        if (!shard) continue;
        for (const row of shard.rows) {
          const rec = toRecord(dk, meta.fields, row);
          if (rec.voter_name.toUpperCase().includes(q)) {
            out.push(rec);
            if (out.length >= limit) break;
          }
        }
        if (out.length >= limit) break;
      }
    })
  );
  return out.slice(0, limit);
}

export function shardProvenanceNote(man: ShardManifest | null): string | null {
  if (!man) return null;
  return `Static shards built ${man.built_at}. See manifest for per-dataset source hashes.`;
}
