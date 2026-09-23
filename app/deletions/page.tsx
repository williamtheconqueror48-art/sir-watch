"use client";

/**
 * /deletions — name-level search over recovered deletion records.
 * Presented exactly as published in the source rolls / deletion lists.
 * EPIC numbers are never stored or displayed.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "../home-client";

type Record = {
  id: number;
  state: string;
  district: string | null;
  ac_name: string | null;
  booth_no: string | null;
  booth_name: string | null;
  voter_name: string;
  epic_masked: string | null;
  deletion_reason: string | null;
  phase: string | null;
  source_url: string;
  ledger_id: number;
  retrieved_at: string;
};

export default function DeletionsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const [submitted, setSubmitted] = useState({ q: "", state: "" });

  async function runSearch(p: number, qq: string, ss: string) {
    setLoading(true);
    setApiError(null);
    try {
      const params = new URLSearchParams({
        page: String(p),
        pageSize: "50",
      });
      if (qq) params.set("q", qq);
      if (ss) params.set("state", ss);
      const res = await fetch(`/api/deletions?${params}`);
      if (!res.ok) throw new Error("API unreachable");
      const data = await res.json();
      setRecords(data.records ?? []);
      setTotal(data.total ?? 0);
      setPage(data.page ?? 1);
    } catch (err) {
      setApiError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch(1, "", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SiteHeader active="/deletions" />
      <main className="bl-main">
        <h1 className="bl-h1">NAME SEARCH</h1>
        <p className="bl-p">
          Name-by-name deletion records recovered from published electoral
          rolls and deletion lists. Search a name to see where it was
          recorded as deleted, with the source roll for every row.
        </p>
        <p className="bl-p bl-dim bl-small">
          Records are shown exactly as published in the source. Absence of a
          name here proves nothing — coverage depends on which rolls have
          been recovered and parsed so far. EPIC numbers are never stored
          or displayed.
        </p>

        {apiError && (
          <div className="bl-empty" style={{ marginBottom: 16 }}>
            DATA SOURCE OFFLINE — {apiError}.
          </div>
        )}

        <form
          style={{ display: "flex", gap: 12, margin: "16px 0", flexWrap: "wrap" }}
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted({ q, state });
            runSearch(1, q, state);
          }}
        >
          <input
            className="bl-input"
            placeholder="Voter name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search voter name"
          />
          <input
            className="bl-input"
            placeholder="State…"
            value={state}
            onChange={(e) => setState(e.target.value)}
            aria-label="Filter by state"
          />
          <button className="bl-input" type="submit" style={{ cursor: "pointer" }}>
            SEARCH
          </button>
        </form>

        {loading ? (
          <p className="bl-dim">LOADING…</p>
        ) : total === 0 ? (
          <div className="bl-empty">
            NO NAME-LEVEL RECORDS RECOVERED YET. Roll PDFs and deletion lists
            are being hunted across CEO archives, the Wayback Machine,
            journalistic investigations and public datasets. This page will
            populate as verified records are sealed into the ledger. Nothing
            is displayed until its source is cited.
          </div>
        ) : (
          <>
            <p className="bl-p bl-dim bl-small">
              {total.toLocaleString("en-IN")} RECORDS
              {submitted.q ? ` MATCHING "${submitted.q}"` : ""}
              {submitted.state ? ` IN ${submitted.state.toUpperCase()}` : ""} ·
              PAGE {page}
            </p>
            <div style={{ overflowX: "auto" }}>
              <table className="bl-table">
                <thead>
                  <tr>
                    <th>VOTER NAME</th>
                    <th>EPIC</th>
                    <th>STATE</th>
                    <th>DISTRICT</th>
                    <th>ASSEMBLY SEAT</th>
                    <th>BOOTH</th>
                    <th>REASON</th>
                    <th>PHASE</th>
                    <th>SOURCE</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id}>
                      <td>{r.voter_name}</td>
                      <td>{r.epic_masked ?? "NOT IN SOURCE DATA"}</td>
                      <td>{r.state}</td>
                      <td>{r.district ?? "—"}</td>
                      <td>{r.ac_name ?? "—"}</td>
                      <td>
                        {r.booth_no ?? "—"}
                        {r.booth_name ? ` · ${r.booth_name}` : ""}
                      </td>
                      <td>{r.deletion_reason ?? "NOT STATED IN SOURCE"}</td>
                      <td>{r.phase ?? "—"}</td>
                      <td>
                        <a
                          href={r.source_url}
                          target="_blank"
                          rel="noreferrer"
                          title={`Ledger #${r.ledger_id} · retrieved ${r.retrieved_at?.slice(0, 10)}`}
                        >
                          ROLL
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button
                className="bl-input"
                style={{ cursor: "pointer" }}
                disabled={page <= 1}
                onClick={() => runSearch(page - 1, submitted.q, submitted.state)}
              >
                ← PREV
              </button>
              <button
                className="bl-input"
                style={{ cursor: "pointer" }}
                disabled={page * 50 >= total}
                onClick={() => runSearch(page + 1, submitted.q, submitted.state)}
              >
                NEXT →
              </button>
            </div>
          </>
        )}

        <footer className="bl-footer">
          SIR-WATCH · <Link href="/methodology">METHODOLOGY</Link>
        </footer>
      </main>
    </>
  );
}
