"use client";

/**
 * /inventory — all-India CEO-site electoral-roll file catalogue.
 *
 * Every row is a directly-observed official file link (or listing page) from a
 * CEO site or the ECI portal — never guessed, never bypassed. Rows are typed
 * (record_type) so council rolls, statistics, press notes and listing pages can
 * never be mistaken for name-level electoral rolls. Coverage is partial: states
 * whose rolls sit behind per-PDF CAPTCHAs have documented coverage gaps.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "../home-client";

type Row = {
  state: string;
  district: string | null;
  ac_number: string | number | null;
  ac_name: string | null;
  part_number: string | number | null;
  roll_type: string | null;
  record_type: string | null;
  file_url: string;
  format: string | null;
  scriptable: string;
  fetched?: string | null;
  live_status: string | null;
  live_http_status: string | null;
  live_content_type: string | null;
  last_updated: string | null;
};

const RECORD_TYPE_LABELS: Record<string, string> = {
  main_roll: "Main roll",
  service_elector_roll: "Service-elector roll",
  supplement: "Supplement",
  claims_objections: "Claims / objections",
  asdd_list: "ASDD / deletion list",
  council_roll: "Council roll (not Assembly)",
  statistics: "Statistics (not a roll)",
  press_notice: "Press notice",
  instruction: "Instruction doc",
  listing_page: "Listing page",
};

export default function InventoryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState("");
  const [rtype, setRtype] = useState("");
  const [scriptable, setScriptable] = useState("");
  const [fetched, setFetched] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/inventory/inventory.json")
      .then((r) => {
        if (!r.ok) throw new Error(`inventory.json: HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => setRows(d))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const states = useMemo(
    () => [...new Set(rows.map((r) => r.state))].sort(),
    [rows]
  );
  const rtypes = useMemo(
    () => [...new Set(rows.map((r) => r.record_type).filter(Boolean))].sort(),
    [rows]
  ) as string[];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (state && r.state !== state) return false;
      if (rtype && r.record_type !== rtype) return false;
      if (scriptable && r.scriptable !== scriptable) return false;
      if (fetched && (r.fetched ?? "") !== fetched) return false;
      if (needle) {
        const hay =
          `${r.district ?? ""} ${r.ac_name ?? ""} ${r.ac_number ?? ""} ` +
          `${r.part_number ?? ""} ${r.roll_type ?? ""} ${r.file_url}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, state, rtype, scriptable, fetched, q]);

  const liveCount = rows.filter((r) => r.live_status === "verified_live").length;
  const hasFetchedField = rows.some((r) => "fetched" in r);
  const fetchedCount = rows.filter((r) => r.fetched === "Y").length;

  function fetchedCell(r: Row) {
    if (!("fetched" in r) || r.fetched == null)
      return <span className="bl-dim">—</span>;
    if (r.fetched === "Y") return <span className="bl-green">Y</span>;
    if (r.fetched === "N") return <span className="bl-amber">N</span>;
    return <span className="bl-dim">{r.fetched}</span>;
  }

  return (
    <main className="bl-page">
      <SiteHeader active="inventory" />
      <div className="bl-wrap">
        <h1 className="bl-h1">ROLL-FILE INVENTORY — ALL INDIA</h1>
        <p className="bl-lede">
          Every electoral-roll, service-elector, claims/objections and deletion-list
          file directly observed on official CEO sites and the ECI portal, state by
          state. File URLs and metadata only — no voter names, no EPIC numbers.
        </p>

        <div className="bl-caveats">
          <strong>Read this first.</strong> Coverage is <em>partial by design</em>:
          most states serve per-part rolls behind a per-PDF CAPTCHA, and those files
          are documented as coverage gaps — never bypassed, never guessed. Rows are
          typed: council rolls, statistics annexures, press notes and listing pages
          are labelled as such and are <em>not</em> name-level electoral rolls.
          “Direct” means the URL was fetched or indexed from an official source with
          a plain GET; a live check was run on 2026-09-24 and dead links were
          downgraded. The <strong>Fetched</strong> column marks which PDFs have
          been pulled into the archive for parsing — <strong>Y</strong> means
          fetched, <strong>N</strong> means not yet fetched, and <strong>—</strong>{" "}
          means the fetch status has not been assessed yet.
        </div>

        {loading && <p>Loading inventory…</p>}
        {error && <p className="bl-error">Failed to load inventory: {error}</p>}

        {!loading && !error && (
          <>
            <div className="bl-inv-stats">
              <span><strong>{rows.length}</strong> file rows</span>
              <span><strong>{states.length}</strong> states/UTs with files</span>
              <span><strong>{liveCount}</strong> links verified live</span>
              {hasFetchedField && (
                <span><strong>{fetchedCount}</strong> PDFs fetched for parsing</span>
              )}
              <span>
                <strong>
                  {36 - new Set(rows.map((r) => r.state)).size - 0}
                </strong>{" "}
                states/UTs: no direct files (gated)
              </span>
            </div>

            <div className="bl-legend" style={{ marginBottom: 8 }}>
              <span>
                <i className="bl-green" /> Y — PDF FETCHED INTO THE ARCHIVE FOR PARSING
              </span>
              <span>
                <i className="bl-amber" /> N — NOT YET FETCHED
              </span>
              <span>
                <i className="bl-dim" /> — — FETCH STATUS NOT YET ASSESSED
              </span>
            </div>

            <div className="bl-filters">
              <label>
                State
                <select value={state} onChange={(e) => setState(e.target.value)}>
                  <option value="">All</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                File type
                <select value={rtype} onChange={(e) => setRtype(e.target.value)}>
                  <option value="">All</option>
                  {rtypes.map((t) => (
                    <option key={t} value={t}>
                      {RECORD_TYPE_LABELS[t] ?? t}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Scriptable
                <select
                  value={scriptable}
                  onChange={(e) => setScriptable(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Y">Y — direct fetch</option>
                  <option value="N">N — gated / dead</option>
                </select>
              </label>
              <label>
                Fetched
                <select
                  value={fetched}
                  onChange={(e) => setFetched(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Y">Y — fetched</option>
                  <option value="N">N — not yet fetched</option>
                </select>
              </label>
              <label className="bl-filter-search">
                Search
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="district, AC, part, URL…"
                />
              </label>
            </div>

            <p className="bl-count">
              Showing {filtered.length} of {rows.length} rows
            </p>

            <div className="bl-table-scroll">
              <table className="bl-table bl-table-inv">
                <thead>
                  <tr>
                    <th>State</th>
                    <th>District</th>
                    <th>AC</th>
                    <th>Part</th>
                    <th>Roll type</th>
                    <th>File type</th>
                    <th>Direct</th>
                    <th>Live check</th>
                    <th>Fetched</th>
                    <th>File</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 500).map((r, i) => (
                    <tr key={i}>
                      <td>{r.state}</td>
                      <td>{r.district ?? "—"}</td>
                      <td>
                        {r.ac_number ?? ""}{" "}
                        {r.ac_name ? <span className="bl-dim">{r.ac_name}</span> : "—"}
                      </td>
                      <td>{r.part_number ?? "—"}</td>
                      <td className="bl-dim">{r.roll_type ?? "—"}</td>
                      <td>
                        <span
                          className={`bl-tag bl-tag-${r.record_type ?? "unknown"}`}
                        >
                          {RECORD_TYPE_LABELS[r.record_type ?? ""] ?? r.record_type}
                        </span>
                      </td>
                      <td>{r.scriptable}</td>
                      <td className="bl-dim">
                        {r.live_status === "verified_live"
                          ? `✓ ${r.live_http_status}`
                          : r.live_status === "gated_or_listing"
                            ? "gated"
                            : r.live_status ?? "—"}
                      </td>
                      <td>{fetchedCell(r)}</td>
                      <td>
                        <a
                          href={r.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="bl-link"
                        >
                          open ↗
                        </a>
                        <div className="bl-dim bl-url">{r.format ?? ""}</div>
                      </td>
                      <td className="bl-dim">{r.last_updated ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length > 500 && (
              <p className="bl-dim">
                First 500 rows shown — refine filters to narrow.
              </p>
            )}

            <p className="bl-foot">
              Method: 36 parallel state workers inventoried official CEO sites on
              2026-09-24; every URL was directly observed (never guessed); gated
              files were recorded as not scriptable and never bypassed. Full
              methodology: <Link href="/methodology">/methodology</Link>. Raw data:{" "}
              <a href="/inventory/inventory.csv" className="bl-link">
                inventory.csv
              </a>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
