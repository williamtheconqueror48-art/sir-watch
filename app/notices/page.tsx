"use client";

/**
 * /notices — archive of ECI SIR orders, notices and press notes.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "../home-client";

type Notice = {
  id: number;
  notice_date: string | null;
  title: string;
  issuing_authority: string;
  summary: string | null;
  source_url: string;
  sha256: string | null;
  ledger_id: number;
  retrieved_at: string;
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/notices");
        if (!res.ok) throw new Error("API unreachable");
        const data = await res.json();
        if (!cancelled) setNotices(data.notices ?? []);
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
      <SiteHeader active="/notices" />
      <main className="bl-main">
        <h1 className="bl-h1">NOTICE ARCHIVE</h1>
        <p className="bl-p">
          Every Election Commission order, notice and press note on the
          Special Intensive Revision, archived with retrieval date and
          SHA-256. The paper trail of the exercise, in one place.
        </p>

        {apiError && (
          <div className="bl-empty" style={{ marginBottom: 16 }}>
            DATA SOURCE OFFLINE — {apiError}.
          </div>
        )}

        {loading ? (
          <p className="bl-dim">LOADING…</p>
        ) : notices.length === 0 ? (
          <div className="bl-empty">
            NO NOTICES ARCHIVED YET. ECI SIR orders are being collected from
            eci.gov.in and PIB; each is hashed and sealed before display.
          </div>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 16 }}>
            <table className="bl-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>TITLE</th>
                  <th>AUTHORITY</th>
                  <th>SUMMARY</th>
                  <th>SOURCE</th>
                  <th>LEDGER</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((n) => (
                  <tr key={n.id}>
                    <td>{n.notice_date ?? "—"}</td>
                    <td>{n.title}</td>
                    <td>{n.issuing_authority}</td>
                    <td>{n.summary ?? "—"}</td>
                    <td>
                      <a
                        href={n.source_url}
                        target="_blank"
                        rel="noreferrer"
                        title={
                          n.sha256 ? `SHA-256 ${n.sha256.slice(0, 16)}…` : undefined
                        }
                      >
                        OPEN
                      </a>
                    </td>
                    <td>#{n.ledger_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="bl-footer">
          SIR-WATCH · <Link href="/methodology">METHODOLOGY</Link>
        </footer>
      </main>
    </>
  );
}
