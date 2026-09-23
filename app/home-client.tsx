"use client";

/**
 * SIR-WATCH dashboard — state x phase figures per source, phase cards,
 * and the honesty contract: competing claims are shown side by side,
 * never merged.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Snapshot = {
  id: number;
  state: string;
  phase: string;
  pre_sir_electors: string | null;
  post_sir_electors: string | null;
  deletions: string | null;
  deletion_pct: string | null;
  notices_issued: string | null;
  source_name: string;
  source_url: string;
  ledger_id: number;
  retrieved_at: string;
  sha256: string;
};

type Phase = {
  id: number;
  phase: string;
  announced_date: string | null;
  enumeration_start: string | null;
  enumeration_end: string | null;
  coverage: string;
  electorate_covered_cr: string | null;
  source_name: string;
  source_url: string;
  ledger_id: number;
  retrieved_at: string;
};

const NAV = [
  { href: "/", label: "DASHBOARD" },
  { href: "/timeline", label: "DISSENT TIMELINE" },
  { href: "/notices", label: "NOTICES" },
  { href: "/case", label: "SC CASE" },
  { href: "/deletions", label: "NAME SEARCH" },
  { href: "/methodology", label: "METHODOLOGY" },
];

export function SiteHeader({ active }: { active: string }) {
  return (
    <header className="bl-header">
      <div>
        <div className="bl-wordmark">SIR-WATCH</div>
        <div className="bl-tagline">
          SPECIAL INTENSIVE REVISION OF ELECTORAL ROLLS — PUBLIC RECORD,
          STRUCTURED
        </div>
      </div>
      <nav className="bl-nav">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            style={n.href === active ? { color: "#fff" } : undefined}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function fmt(n: string | null): string {
  if (n === null || n === undefined) return "—";
  const v = Number(n);
  if (Number.isNaN(v)) return n;
  return v.toLocaleString("en-IN");
}

export default function HomeClient() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [stateFilter, setStateFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sRes, pRes] = await Promise.all([
          fetch("/api/snapshots"),
          fetch("/api/phases"),
        ]);
        if (!sRes.ok || !pRes.ok) throw new Error("API unreachable");
        const sData = await sRes.json();
        const pData = await pRes.json();
        if (!cancelled) {
          setSnapshots(sData.snapshots ?? []);
          setSources(sData.sources ?? []);
          setPhases(pData.phases ?? []);
        }
      } catch (err) {
        if (!cancelled) setApiError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      snapshots.filter(
        (s) =>
          (!stateFilter ||
            s.state.toLowerCase().includes(stateFilter.toLowerCase())) &&
          (!sourceFilter || s.source_name === sourceFilter)
      ),
    [snapshots, stateFilter, sourceFilter]
  );

  const eciTotal = useMemo(() => {
    let d = 0;
    for (const s of snapshots) {
      if (/election commission|eci/i.test(s.source_name) && s.deletions) {
        d += Number(s.deletions);
      }
    }
    return d;
  }, [snapshots]);

  return (
    <>
      <SiteHeader active="/" />
      <main className="bl-main">
        <p className="bl-p">
          SIR-WATCH structures the public record of the Election Commission of
          India&apos;s Special Intensive Revision (SIR) of electoral rolls —
          state-by-state figures, the on-record objections of Election
          Commissioners, the notice archive, and the Supreme Court case —
          in one queryable place.
        </p>
        <p className="bl-p bl-dim bl-small">
          Descriptive facts only. Where sources disagree on a number, both
          figures are shown side by side with their sources — never averaged,
          never merged. See{" "}
          <Link href="/methodology">METHODOLOGY</Link> for the rules.
        </p>

        {apiError && (
          <div className="bl-empty" style={{ marginBottom: 16 }}>
            DATA SOURCE OFFLINE — {apiError}. Showing empty states; no data is
            invented in its place.
          </div>
        )}

        <div className="bl-grid-2" style={{ marginTop: 24 }}>
          {phases.map((p) => (
            <section className="bl-panel" key={p.id} aria-label={p.phase}>
              <div className="bl-panel-head">
                <span>{p.phase.toUpperCase()}</span>
                <span className="bl-dim">LEDGER #{p.ledger_id}</span>
              </div>
              <div className="bl-panel-body">
                <p className="bl-p">{p.coverage}</p>
                <p className="bl-p bl-dim bl-small">
                  ANNOUNCED: {p.announced_date ?? "—"} · ENUMERATION:{" "}
                  {p.enumeration_start ?? "—"} → {p.enumeration_end ?? "—"}
                  {p.electorate_covered_cr
                    ? ` · ELECTORATE: ${p.electorate_covered_cr} CRORE`
                    : ""}
                </p>
                <p className="bl-p bl-dim bl-small">
                  SOURCE: {p.source_name} ·{" "}
                  <a href={p.source_url} target="_blank" rel="noreferrer">
                    OPEN
                  </a>{" "}
                  · RETRIEVED {p.retrieved_at?.slice(0, 10)}
                </p>
              </div>
            </section>
          ))}
        </div>

        <section className="bl-panel" style={{ marginTop: 24 }}>
          <div className="bl-panel-head">
            <span>STATE × PHASE FIGURES — PER SOURCE</span>
            <span className="bl-dim">
              {eciTotal > 0
                ? `ECI-SOURCED DELETIONS ON RECORD: ${eciTotal.toLocaleString("en-IN")}`
                : `${filtered.length} ROWS`}
            </span>
          </div>
          <div className="bl-panel-body">
            <div
              style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}
            >
              <input
                className="bl-input"
                placeholder="Filter state…"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                aria-label="Filter by state"
              />
              <select
                className="bl-input"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                aria-label="Filter by source"
              >
                <option value="">All sources</option>
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {loading ? (
              <p className="bl-dim">LOADING…</p>
            ) : filtered.length === 0 ? (
              <div className="bl-empty">
                NO ROWS. Either the filters exclude everything or no snapshot
                batches have been ingested yet — check /api/ledger.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="bl-table">
                  <thead>
                    <tr>
                      <th>STATE</th>
                      <th>PHASE</th>
                      <th>PRE-SIR</th>
                      <th>POST-SIR</th>
                      <th>DELETIONS</th>
                      <th>DEL %</th>
                      <th>NOTICES</th>
                      <th>SOURCE</th>
                      <th>LEDGER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.id}>
                        <td>{s.state}</td>
                        <td>{s.phase}</td>
                        <td>{fmt(s.pre_sir_electors)}</td>
                        <td>{fmt(s.post_sir_electors)}</td>
                        <td>{fmt(s.deletions)}</td>
                        <td>
                          {s.deletion_pct !== null
                            ? `${Number(s.deletion_pct).toFixed(1)}%`
                            : "—"}
                        </td>
                        <td>{fmt(s.notices_issued)}</td>
                        <td>
                          <a
                            href={s.source_url}
                            target="_blank"
                            rel="noreferrer"
                            title={`Retrieved ${s.retrieved_at?.slice(0, 10)} · SHA-256 ${s.sha256?.slice(0, 12)}…`}
                          >
                            {s.source_name}
                          </a>
                        </td>
                        <td>#{s.ledger_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="bl-p bl-dim bl-small" style={{ marginTop: 12 }}>
              COMPETING-CLAIMS RULE: rows from different sources describing the
              same state and phase are displayed as separate rows. No figure
              here is an average or a reconciliation of sources.
            </p>
          </div>
        </section>

        <footer className="bl-footer">
          SIR-WATCH · PUBLIC-DISCLOSURE DATA ONLY · EVERY ROW CARRIES ITS
          SOURCE · <Link href="/methodology">METHODOLOGY</Link>
        </footer>
      </main>
    </>
  );
}
