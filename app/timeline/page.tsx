"use client";

/**
 * /timeline — the dissent timeline: objections raised on record by Election
 * Commissioners, plus SIR phase milestones. Newest first.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "../home-client";

type DissentEvent = {
  id: number;
  event_date: string | null;
  date_precision: string;
  commissioner: string;
  subject: string;
  description: string;
  source_name: string;
  source_url: string;
  ledger_id: number;
  retrieved_at: string;
};

export default function TimelinePage() {
  const [events, setEvents] = useState<DissentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dissent");
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
      <SiteHeader active="/timeline" />
      <main className="bl-main">
        <h1 className="bl-h1">DISSENT TIMELINE</h1>
        <p className="bl-p">
          Objections raised on record by Election Commissioners Sukhbir Singh
          Sandhu and Vivek Joshi during the SIR — as reported, with each
          entry&apos;s source. The Election Commission of India has denied
          that any formal dissent was recorded and states all decisions were
          unanimous; that denial is itself part of the record and is cited
          wherever it applies.
        </p>
        <p className="bl-p bl-dim bl-small">
          Each entry is a reported fact about an objection, not a finding
          about who was right. See{" "}
          <Link href="/methodology">METHODOLOGY</Link>.
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
            NO DISSENT EVENTS INGESTED YET. The Indian Express investigation of
            2026-09-23 reported at least 14 on-record objections; they are
            being extracted and verified before display. Nothing is shown
            until it is sourced.
          </div>
        ) : (
          <div style={{ marginTop: 24 }}>
            {events.map((e) => (
              <div className="bl-timeline-item" key={e.id}>
                <div className="bl-small bl-dim">
                  {e.event_date ? e.event_date.slice(0, 10) : "DATE NOT STATED IN SOURCE"}
                  {e.date_precision !== "exact" ? ` (${e.date_precision})` : ""}
                  {" · "}
                  {e.commissioner.toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, margin: "4px 0" }}>
                  {e.subject}
                </div>
                <p className="bl-p bl-small">{e.description}</p>
                <p className="bl-p bl-dim bl-small">
                  SOURCE: {e.source_name} ·{" "}
                  <a href={e.source_url} target="_blank" rel="noreferrer">
                    OPEN
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
