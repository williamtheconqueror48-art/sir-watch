"use client";

/**
 * /case — Supreme Court case tracker: ADR vs ECI (WP Civil 640/2025)
 * and connected matters.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "../home-client";

type CaseEvent = {
  id: number;
  event_date: string | null;
  event_type: string;
  title: string;
  description: string | null;
  source_url: string;
  ledger_id: number;
  retrieved_at: string;
};

export default function CasePage() {
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/case-events");
        if (!res.ok) throw new Error("API unreachable");
        const data = await res.json();
        if (!cancelled) setEvents(data.events ?? []);
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

  return (
    <>
      <SiteHeader active="/case" />
      <main className="bl-main">
        <h1 className="bl-h1">SUPREME COURT CASE TRACKER</h1>
        <p className="bl-p">
          <strong>ADR vs ECI (Writ Petition Civil 640/2025)</strong> and
          connected petitions challenging the Special Intensive Revision —
          filings, hearings and orders in chronological order. Bench:
          Justices Surya Kant and Joymalya Bagchi (as constituted at filing).
        </p>
        <p className="bl-p bl-dim bl-small">
          Procedural record only. No commentary on the merits; read the
          filings themselves via the source links.
        </p>

        {apiError && (
          <div className="bl-empty" style={{ marginBottom: 16 }}>
            DATA SOURCE OFFLINE — {apiError}.
          </div>
        )}

        {loading ? (
          <p className="bl-dim">LOADING…</p>
        ) : events.length === 0 ? (
          <div className="bl-empty">
            NO CASE EVENTS INGESTED YET. Filings and orders are being
            collected from court records and verified reporting.
          </div>
        ) : (
          <div style={{ marginTop: 24 }}>
            {events.map((e) => (
              <div className="bl-timeline-item" key={e.id}>
                <div className="bl-small bl-dim">
                  {e.event_date ?? "DATE NOT STATED"} ·{" "}
                  {e.event_type.toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, margin: "4px 0" }}>
                  {e.title}
                </div>
                {e.description && (
                  <p className="bl-p bl-small">{e.description}</p>
                )}
                <p className="bl-p bl-dim bl-small">
                  <a href={e.source_url} target="_blank" rel="noreferrer">
                    SOURCE
                  </a>{" "}
                  · LEDGER #{e.ledger_id} · RETRIEVED{" "}
                  {e.retrieved_at?.slice(0, 10)}
                </p>
              </div>
            ))}
          </div>
        )}

        <footer className="bl-footer">
          SIR-WATCH · <Link href="/methodology">METHODOLOGY</Link>
        </footer>
      </main>
    </>
  );
}
