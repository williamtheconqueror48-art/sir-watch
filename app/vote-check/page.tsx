"use client";

/**
 * /vote-check — "did SIR affect my vote": name search against parsed
 * pre-SIR and post-SIR electoral rolls, shown side by side.
 *
 * Data contract: parsed roll rows arrive through searchShards() over the
 * `inv-rolls` shard dataset. Each row carries voter_name, relative_name,
 * age, sex, district, ac_name, part_number, vintage_label, vintage_class
 * (pre_sir | post_sir | other), record_type, source_url, epic_masked.
 *
 * Honesty rules (methodology §5): a comparison is shown only where both
 * vintages exist for that state. vintage_class=other rows are applications
 * / claims & objections lists — shown separately, never as roll presence.
 * Absence from results proves nothing: name matching is on parsed text,
 * and spelling/transliteration variants can miss.
 */
import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "../home-client";
import {
  searchShards,
  getShardManifest,
  type ShardRecord,
} from "../../lib/shards";

type NeonRecord = {
  id: number;
  state: string;
  district: string | null;
  ac_name: string | null;
  booth_no: string | null;
  voter_name: string;
  epic_masked: string | null;
  deletion_reason: string | null;
  phase: string | null;
  source_url: string;
  retrieved_at: string;
};

type VintageGroup = {
  pre: ShardRecord[];
  post: ShardRecord[];
  other: ShardRecord[];
};

const inr = (n: number) => n.toLocaleString("en-IN");

function groupByState(hits: ShardRecord[]): Map<string, VintageGroup> {
  const m = new Map<string, VintageGroup>();
  for (const r of hits) {
    let g = m.get(r.state);
    if (!g) {
      g = { pre: [], post: [], other: [] };
      m.set(r.state, g);
    }
    if (r.vintage_class === "pre_sir") g.pre.push(r);
    else if (r.vintage_class === "post_sir") g.post.push(r);
    else g.other.push(r);
  }
  return m;
}

function vintageLabels(rows: ShardRecord[]): string {
  const labels = [...new Set(rows.map((r) => r.vintage_label ?? "vintage not labeled"))];
  return labels.join(" · ");
}

function RollRow({ r }: { r: ShardRecord }) {
  return (
    <tr>
      <td>{r.voter_name}</td>
      <td className="bl-dim">{r.relative_name ?? "—"}</td>
      <td>{r.age ?? "—"}</td>
      <td className="bl-dim">{r.sex ?? "—"}</td>
      <td className="bl-dim">{r.district ?? "—"}</td>
      <td className="bl-dim">{r.ac_name ?? "—"}</td>
      <td>{r.booth_no ?? "—"}</td>
      <td className="bl-dim">{r.epic_masked ?? "NOT AVAILABLE IN SOURCE DATA"}</td>
      <td>
        {r.source_url.startsWith("http") ? (
          <a href={r.source_url} target="_blank" rel="noreferrer" title={r.source_label}>
            ROLL
          </a>
        ) : (
          <span className="bl-dim">NOT AVAILABLE IN SOURCE DATA</span>
        )}
      </td>
    </tr>
  );
}

function RollTable({ rows }: { rows: ShardRecord[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="bl-table">
        <thead>
          <tr>
            <th>VOTER NAME</th>
            <th>RELATIVE</th>
            <th>AGE</th>
            <th>SEX</th>
            <th>DISTRICT</th>
            <th>ASSEMBLY SEAT</th>
            <th>PART</th>
            <th>EPIC</th>
            <th>SOURCE</th>
            </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <RollRow key={i} r={r} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function VoteCheckPage() {
  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const [ac, setAc] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsedLive, setParsedLive] = useState<boolean | null>(null);
  const [parsedRowsTotal, setParsedRowsTotal] = useState<number | null>(null);
  const [groups, setGroups] = useState<Map<string, VintageGroup>>(new Map());
  const [serviceRows, setServiceRows] = useState<ShardRecord[]>([]);
  const [serviceRowsTotal, setServiceRowsTotal] = useState<number | null>(null);
  const [neon, setNeon] = useState<NeonRecord[]>([]);
  const [neonError, setNeonError] = useState(false);

  async function runSearch() {
    const qq = q.trim();
    if (qq.length < 2) return;
    setLoading(true);
    setSearched(true);
    setNeonError(false);
    try {
      const man = await getShardManifest();
      const invMeta = man?.["inv-rolls"] as { rows?: number } | undefined;
      const hasInv = !!invMeta && typeof invMeta.rows === "number" && invMeta.rows > 0;
      setParsedLive(hasInv);
      setParsedRowsTotal(hasInv ? (invMeta!.rows as number) : null);

      let invHits: ShardRecord[] = [];
      let svcHits: ShardRecord[] = [];
      if (hasInv) {
        const hits = await searchShards(qq, 400);
        invHits = hits.filter((r) => r.dataset === "inv-rolls");
        svcHits = hits.filter(
          (r) =>
            r.dataset === "kerala-service-2017" ||
            r.dataset === "uttarakhand-service-2026"
        );
        const sNeedle = state.trim().toLowerCase();
        const acNeedle = ac.trim().toLowerCase();
        const filt = (r: ShardRecord) =>
          (!sNeedle || r.state.toLowerCase().includes(sNeedle)) &&
          (!acNeedle || (r.ac_name ?? "").toLowerCase().includes(acNeedle));
        invHits = invHits.filter(filt);
        svcHits = svcHits.filter(filt);
      }
      setGroups(groupByState(invHits));
      setServiceRows(svcHits);
      const svcRows =
        (man?.["kerala-service-2017"] as { rows?: number } | undefined)?.rows ??
        0;
      const ukRows =
        (man?.["uttarakhand-service-2026"] as { rows?: number } | undefined)
          ?.rows ?? 0;
      setServiceRowsTotal(svcRows + ukRows > 0 ? svcRows + ukRows : null);

      try {
        const params = new URLSearchParams({ page: "1", pageSize: "50" });
        params.set("q", qq);
        if (state.trim()) params.set("state", state.trim());
        const res = await fetch(`/api/deletions?${params}`);
        if (!res.ok) throw new Error("api");
        const data = await res.json();
        setNeon((data.records ?? []) as NeonRecord[]);
      } catch {
        setNeonError(true);
        setNeon([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const stateNames = [...groups.keys()].sort();

  return (
    <>
      <SiteHeader active="/vote-check" />
      <main className="bl-main">
        <h1 className="bl-h1">VOTE CHECK — DID SIR AFFECT MY VOTE?</h1>
        <p className="bl-p">
          Enter a voter name. If this state&apos;s rolls have been parsed,
          matching rows from the <strong>pre-SIR roll</strong> and the{" "}
          <strong>post-SIR roll</strong> appear side by side, each with its
          source file. Every row carries provenance — the roll it came from,
          not a claim about it.
        </p>
        <p className="bl-p bl-dim bl-small">
          Name matching is on the parsed roll text as published; spelling and
          transliteration variants can miss.{" "}
          <strong>Absence from these results proves nothing</strong> — it may
          mean the roll has not been parsed yet, the name is spelled
          differently, or the record sits in a file not yet fetched. EPIC
          numbers are shown masked only, never in full. See{" "}
          <Link href="/methodology">METHODOLOGY</Link>.
        </p>

        <form
          style={{ display: "flex", gap: 12, margin: "16px 0", flexWrap: "wrap" }}
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
        >
          <input
            className="bl-input"
            placeholder="Voter name (min 2 characters)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Voter name"
          />
          <input
            className="bl-input"
            placeholder="State (optional)…"
            value={state}
            onChange={(e) => setState(e.target.value)}
            aria-label="State filter"
          />
          <input
            className="bl-input"
            placeholder="Assembly seat (optional)…"
            value={ac}
            onChange={(e) => setAc(e.target.value)}
            aria-label="Assembly constituency filter"
          />
          <button className="bl-input" type="submit" style={{ cursor: "pointer" }}>
            CHECK
          </button>
        </form>

        {loading && <p className="bl-dim">SEARCHING PARSED ROLLS…</p>}

        {searched && !loading && (
          <>
            {parsedLive === false && (
              <div className="bl-empty" style={{ marginBottom: 16 }}>
                ROLL PARSING IS IN PROGRESS — NO PARSED ROLL ROWS HAVE BEEN
                PUBLISHED YET. This page activates automatically when the
                parse pipeline lands. The adjudication ledger below is
                unaffected.
              </div>
            )}
            {parsedLive === true && (
              <p className="bl-p bl-dim bl-small">
                PARSED ROLLS SEARCHED:{" "}
                <span className="bl-data">
                  {parsedRowsTotal === null ? "…" : inr(parsedRowsTotal)}
                </span>{" "}
                ROWS IN THE inv-rolls DATASET · MANIFEST-VERIFIED
                {serviceRowsTotal !== null && (
                  <>
                    {" "}·{" "}
                    <span className="bl-data">{inr(serviceRowsTotal)}</span>{" "}
                    SERVICE-ELECTOR ROWS (KERALA 2017 + UTTARAKHAND 2026 —
                    SHOWN SEPARATELY, NOT PART OF THE COMPARISON)
                  </>
                )}
              </p>
            )}

            {stateNames.length === 0 && parsedLive === true && (
              <div className="bl-empty" style={{ marginBottom: 16 }}>
                NO MATCHES IN THE PARSED ROLLS FOR THIS NAME
                {state ? ` IN ${state.toUpperCase()}` : ""}. This proves
                nothing — see the caveats above. Try a spelling variant, or
                check the full name search on <Link href="/deletions">/deletions</Link>.
              </div>
            )}

            {stateNames.map((sname) => {
              const g = groups.get(sname)!;
              const both = g.pre.length > 0 && g.post.length > 0;
              return (
                <section className="bl-panel" style={{ marginTop: 24 }} key={sname}>
                  <div className="bl-panel-head">
                    <span>{sname.toUpperCase()}</span>
                    <span className="bl-dim">
                      PRE-SIR MATCHES: {inr(g.pre.length)} · POST-SIR MATCHES:{" "}
                      {inr(g.post.length)}
                    </span>
                  </div>
                  <div className="bl-panel-body">
                    {both ? (
                      <div className="bl-grid-2">
                        <div>
                          <h2 className="bl-h1">PRE-SIR ROLL</h2>
                          <p className="bl-p bl-dim bl-small">{vintageLabels(g.pre)}</p>
                          <RollTable rows={g.pre} />
                        </div>
                        <div>
                          <h2 className="bl-h1">POST-SIR ROLL</h2>
                          <p className="bl-p bl-dim bl-small">{vintageLabels(g.post)}</p>
                          <RollTable rows={g.post} />
                        </div>
                      </div>
                    ) : (
                      <>
                        {g.pre.length > 0 && (
                          <>
                            <p className="bl-p bl-amber bl-small">
                              ONLY THE PRE-SIR ROLL HAS BEEN PARSED FOR{" "}
                              {sname.toUpperCase()} SO FAR — NO COMPARISON IS
                              POSSIBLE YET. ({vintageLabels(g.pre)})
                            </p>
                            <RollTable rows={g.pre} />
                          </>
                        )}
                        {g.post.length > 0 && (
                          <>
                            <p className="bl-p bl-amber bl-small">
                              ONLY THE POST-SIR ROLL HAS BEEN PARSED FOR{" "}
                              {sname.toUpperCase()} SO FAR — NO COMPARISON IS
                              POSSIBLE YET. ({vintageLabels(g.post)})
                            </p>
                            <RollTable rows={g.post} />
                          </>
                        )}
                      </>
                    )}
                    {g.other.length > 0 && (
                      <div style={{ marginTop: 24 }}>
                        <h2 className="bl-h1">APPLICATIONS, CLAIMS &amp; OBJECTIONS — NOT ROLLS</h2>
                        <p className="bl-p bl-dim bl-small">
                          These rows come from claims / objections lists
                          attached to the parsed files. They are applications,
                          not roll presence — they say nothing about whether
                          the voter is on any roll. ({vintageLabels(g.other)})
                        </p>
                        <RollTable rows={g.other} />
                      </div>
                    )}
                  </div>
                </section>
              );
            })}

            {parsedLive === true && serviceRows.length > 0 && (
              <section className="bl-panel" style={{ marginTop: 24 }}>
                <div className="bl-panel-head">
                  <span>SERVICE-ELECTOR ROLLS — NOT PART OF THE SIR COMPARISON</span>
                  <span className="bl-dim">
                    MATCHES: {inr(serviceRows.length)}
                  </span>
                </div>
                <div className="bl-panel-body">
                  <p className="bl-p bl-dim bl-small">
                    Service-elector rolls list defence and armed-police
                    personnel posted away from home — they are a separate
                    roll, not the civilian roll, and{" "}
                    <strong>cannot answer whether SIR affected a vote</strong>.
                    KERALA = 2017 Special Summary Revision (final publication
                    10-01-2017; NOT pre/post-SIR). UTTARAKHAND = 2026
                    post-SIR draft service entries.
                  </p>
                  <RollTable rows={serviceRows} />
                </div>
              </section>
            )}

            <section style={{ marginTop: 32 }}>
              <h2 className="bl-h1">ADJUDICATION LEDGER (WEST BENGAL)</h2>
              {neonError ? (
                <p className="bl-p bl-dim bl-small">
                  LEDGER OFFLINE — COULD NOT QUERY ADJUDICATION RECORDS.
                </p>
              ) : neon.length === 0 ? (
                <p className="bl-p bl-dim bl-small">
                  NO ADJUDICATION-LEDGER MATCHES FOR THIS NAME. THE LEDGER
                  HOLDS ONLY BHABANIPUR (AC-159) AND BALLYGUNGE (AC-161),
                  KOLKATA — RECORDS UNDER ADJUDICATION, NOT DELETIONS.
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="bl-table">
                    <thead>
                      <tr>
                        <th>VOTER NAME</th>
                        <th>EPIC</th>
                        <th>ASSEMBLY SEAT</th>
                        <th>BOOTH</th>
                        <th>STATUS</th>
                        <th>SOURCE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {neon.map((r) => (
                        <tr key={r.id}>
                          <td>{r.voter_name}</td>
                          <td className="bl-dim">{r.epic_masked ?? "NOT IN SOURCE DATA"}</td>
                          <td className="bl-dim">{r.ac_name ?? "—"}</td>
                          <td className="bl-dim">{r.booth_no ?? "—"}</td>
                          <td>UNDER ADJUDICATION — DECISION NOT STATED IN SOURCE</td>
                          <td>
                            {r.source_url.startsWith("http") ? (
                              <a href={r.source_url} target="_blank" rel="noreferrer">
                                ROLL
                              </a>
                            ) : (
                              <span className="bl-dim">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        <footer className="bl-footer">
          SIR-WATCH · VOTE CHECK COMPARES PARSED ROLLS ONLY · EVERY ROW CARRIES
          ITS SOURCE · <Link href="/methodology">METHODOLOGY</Link>
        </footer>
      </main>
    </>
  );
}
