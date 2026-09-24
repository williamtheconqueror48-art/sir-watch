"use client";

/**
 * SIR-WATCH dashboard — what the archive actually holds.
 *
 * Every number on this page is read live from the published shard manifest
 * (or labeled with its ledger batch). Nothing here is estimated, averaged,
 * or carried over from press claims. See /methodology for the rules and
 * /deletions for the name search itself.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { getShardManifest } from "../lib/shards";

const NAV = [
  { href: "/", label: "DASHBOARD" },
  { href: "/timeline", label: "DISSENT TIMELINE" },
  { href: "/notices", label: "NOTICES" },
  { href: "/case", label: "SC CASE" },
  { href: "/deletions", label: "NAME SEARCH" },
  { href: "/inventory", label: "ROLL INVENTORY" },
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

const inr = (n: number) => n.toLocaleString("en-IN");

/** West Bengal adjudication records live in Neon (ledger batch #11). */
const WB_ROWS = 39604;
const WB_LABEL = "Neon ledger batch #11 · retrieved 2026-09-23";

type DatasetCard = {
  key: string;
  title: string;
  state: string;
  what: string;
  claimNote: string;
  source: string;
};

const CARD_META: DatasetCard[] = [
  {
    key: "ka-asd",
    title: "Karnataka ASD index",
    state: "Karnataka",
    what: "Absent / Shifted / Dead electors compiled from the draft electoral roll.",
    claimNote:
      "Community parser over ECI draft-roll PDFs. EPICs were hashed at the source and are not stored here. Overlaps substantially with the ASDDO dashboard below — counts are source rows, not unique voters.",
    source: "gouthamganeshm/Karnataka_Draft_Roll_2026 · retrieved 2026-09-23",
  },
  {
    key: "ka-asddo",
    title: "CEO Karnataka ASDDO dashboard (community mirror)",
    state: "Karnataka",
    what: "Mirror of the CEO Karnataka ASD-deletion dashboard data.",
    claimNote:
      "EPICs masked at the source (ABC****XYZ). Overlaps substantially with the ASD index above — counts are source rows, not unique voters.",
    source: "omshivaprakash/karnataka-asddo-dashboard · retrieved 2026-09-23",
  },
  {
    key: "ka-notices",
    title: "Karnataka SIR discrepancy notices",
    state: "Karnataka",
    what: "Discrepancy / no-mapping notices compiled from district election office PDFs.",
    claimNote: "Notices are NOT deletions. A notice means the record was flagged, not removed.",
    source: "gouthamganeshm/Karnataka_Draft_Roll_2026 · retrieved 2026-09-23",
  },
  {
    key: "up-draftroll",
    title: "UP draft roll 2026 — service electors",
    state: "Uttar Pradesh",
    what: "Service-elector entries from the 'Last Part' of the draft roll, 4 Assembly Constituencies (Baraut, Baghpat, Muhammadabad-Gohna, Mau).",
    claimNote:
      "Full draft-roll entries — NOT deletions. The source PDFs carry no EPIC field at all.",
    source: "CEO Uttar Pradesh / district NIC sites via cdn.s3waas.gov.in · retrieved 2026-09-23",
  },
  {
    key: "cg-form10",
    title: "Chhattisgarh SIR objections (Form 10)",
    state: "Chhattisgarh",
    what: "Objections to inclusion of names received in Form 7 during the SIR-2026 claims & objections period (23.12.2025–22.01.2026), from DEO claim pages of Balodabazar-Bhatapara, Bemetara, Dantewada, Dhamtari, Mahasamund and Marwahi.",
    claimNote:
      "Objections received — NOT deletions, NOT adjudication records. Zero plaintext EPICs found in any row (independent scan 2026-09-23).",
    source: "DEO sites (Balodabazar-Bhatapara, Bemetara, Dantewada, Dhamtari, Mahasamund, Marwahi) · retrieved 2026-09-23",
  },
  {
    key: "kl-form9",
    title: "Kerala SIR inclusion claims (Form 9)",
    state: "Kerala",
    what: "Applications for inclusion of name received in Form 6, published by CEO Kerala as Form-9 lists (27 PDFs, 7,486 rows; serials verified contiguous per file).",
    claimNote:
      "Claims for inclusion — NOT registered voters, NOT deletions. Zero plaintext EPICs found in any row (independent scan 2026-09-23).",
    source: "CEO Kerala (ceo.kerala.gov.in) · retrieved 2026-09-23",
  },
  {
    key: "kl-form10",
    title: "Kerala SIR deletion objections (Form 10)",
    state: "Kerala",
    what: "Applications for objection to inclusion of names received in Form 7, published by CEO Kerala as Form-10 lists (14 PDFs, 46 rows).",
    claimNote:
      "Objections — NOT adjudicated deletions. Zero plaintext EPICs found in any row (independent scan 2026-09-23).",
    source: "CEO Kerala (ceo.kerala.gov.in) · retrieved 2026-09-23",
  },
  {
    key: "kl-form11a",
    title: "Kerala SIR address-shift applications (Form 11A)",
    state: "Kerala",
    what: "Applications for shifting of address within the constituency received in Form 8, published by CEO Kerala as Form-11A lists (8 PDFs, 58 rows).",
    claimNote:
      "Address shifts within the constituency — NOT corrections, NOT deletions. Zero plaintext EPICs found in any row (independent scan 2026-09-23).",
    source: "CEO Kerala (ceo.kerala.gov.in) · retrieved 2026-09-23",
  },
];

const COVERAGE: [string, string, string][] = [
  ["Karnataka", "LIVE", "ASD index, discrepancy notices, ASDDO dashboard"],
  ["West Bengal", "LIVE", "Adjudication records — Bhabanipur + Ballygunge ACs, Kolkata"],
  ["Uttar Pradesh", "LIVE", "Service-elector draft entries, 4 ACs (not deletions)"],
  ["Kerala", "LIVE", "Inclusion claims (Form 9), deletion objections (Form 10), address shifts (Form 11A)"],
  ["Chhattisgarh", "LIVE", "Objections to inclusion (Form 10), 6 DEO claim pages"],
  ["Mizoram", "IN AUDIT", "6 rows + documents staged"],
  ["Puducherry", "IN AUDIT", "9 rows (5 deletions + 4 additions) staged"],
  ["Bihar", "STAGED — UNAUDITED", "3 community datasets, ~595 MB"],
  ["Tamil Nadu", "AGGREGATES ONLY", "Cited ASD workbook ruled unusable; portal is CAPTCHA-gated"],
  ["Gujarat", "URL INDEX ONLY", "50,963-part fetch manifest; PDFs need India egress"],
  ["Rajasthan", "AGGREGATES ONLY", "Official totals only, no name-level data"],
  ["Madhya Pradesh", "AGGREGATES ONLY", "Official totals only, no name-level data"],
  ["Delhi", "BASELINE FRAGMENTS", "Archived pre-SIR PDFs only"],
  ["Punjab", "BASELINE FRAGMENTS", "Archived pre-SIR PDFs only"],
  ["Haryana", "BASELINE FRAGMENTS", "Archived pre-SIR PDFs only"],
  ["Telangana", "BASELINE FRAGMENTS", "Archived pre-SIR PDFs only"],
  ["Andhra Pradesh", "BASELINE FRAGMENTS", "Archived pre-SIR PDFs only"],
  ["Himachal Pradesh", "NO SIR", "Deferred by ECI"],
  ["Jammu & Kashmir", "NO SIR", "Deferred by ECI"],
  ["Ladakh", "NO SIR", "Deferred by ECI"],
  ["Assam", "NO SIR", "Special Revision instead of SIR"],
  ["Goa", "HUNTED", "No public bulk name-level data found; browser leads queued"],
  ["Chandigarh", "HUNTED", "No public bulk name-level data found; browser leads queued"],
  ["Dadra & Nagar Haveli and Daman & Diu", "HUNTED", "No public bulk name-level data found; browser leads queued"],
  ["Uttarakhand", "HUNTED", "No public bulk name-level data found; browser leads queued"],
  ["Sikkim", "HUNTED", "No public bulk name-level data found; browser leads queued"],
  ["Meghalaya", "HUNTED", "Official ASD aggregate only (1,80,402); name lists need browser"],
  ["Nagaland", "HUNTED", "Booth-wise lists reportedly public now; browser lead queued"],
  ["Arunachal Pradesh", "HUNTED", "Baseline sample only; ASD portal needs browser"],
  ["Tripura", "HUNTED", "Draft rolls expected ~14 Oct 2026"],
  ["Manipur", "HUNTED", "Baseline claim rows only"],
  ["Odisha", "HUNTED", "2002-baseline pilot only"],
  ["Andaman & Nicobar Islands", "HUNTED", "Service-roll entries only; draft/ASD lists need browser"],
  ["Lakshadweep", "HUNTED", "Official PDFs only (island-wise ASD table)"],
];

export default function HomeClient() {
  const [manifest, setManifest] = useState<{
    rows: Record<string, number>;
    built_at: string;
  } | null>(null);
  const [manifestError, setManifestError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const man = await getShardManifest();
      if (cancelled) return;
      if (!man) {
        setManifestError(true);
        return;
      }
      const rows: Record<string, number> = {};
      for (const k of [
        "ka-asd",
        "ka-asddo",
        "ka-notices",
        "up-draftroll",
        "cg-form10",
        "kl-form9",
        "kl-form10",
        "kl-form11a",
      ]) {
        const d = man[k] as { rows?: number } | undefined;
        if (d && typeof d.rows === "number") rows[k] = d.rows;
      }
      setManifest({ rows, built_at: String(man.built_at ?? "NOT AVAILABLE IN SOURCE DATA") });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const shardTotal = manifest
    ? Object.values(manifest.rows).reduce((a, b) => a + b, 0)
    : null;
  const grandTotal = shardTotal === null ? null : shardTotal + WB_ROWS;

  return (
    <>
      <SiteHeader active="/" />
      <main className="bl-main">
        <p className="bl-p">
          SIR-WATCH is a name-searchable public archive of SIR-affected
          electoral-roll records. This page shows exactly what the archive
          holds today — every number below is read live from the published
          data manifest, or labeled with its ledger batch. Where the hunt
          found nothing, that is stated too.
        </p>
        <p className="bl-p bl-dim bl-small">
          <Link href="/deletions">NAME SEARCH</Link> ·{" "}
          <Link href="/methodology">METHODOLOGY</Link>
        </p>

        {manifestError && (
          <div className="bl-empty" style={{ marginBottom: 16 }}>
            DATA MANIFEST OFFLINE — holdings cannot be counted right now. No
            numbers are shown in its place.
          </div>
        )}

        <section className="bl-panel" style={{ marginTop: 24 }}>
          <div className="bl-panel-head">
            <span>THE ARCHIVE TODAY</span>
            <span className="bl-dim">
              {manifest ? `MANIFEST BUILT ${manifest.built_at}` : "READING MANIFEST…"}
            </span>
          </div>
          <div className="bl-panel-body">
            <p className="bl-p" style={{ fontSize: "1.6em", margin: "8px 0" }}>
              {grandTotal === null ? "…" : inr(grandTotal)}{" "}
              <span className="bl-dim bl-small">name-level rows searchable</span>
            </p>
            <p className="bl-p bl-dim bl-small">
              {shardTotal === null ? "…" : inr(shardTotal)} static-archive rows
              (Karnataka + Uttar Pradesh + Chhattisgarh + Kerala) + {inr(WB_ROWS)} West Bengal
              adjudication records ({WB_LABEL}).
            </p>
            <p className="bl-p bl-dim bl-small">
              COUNTING RULE: Karnataka&apos;s ASD index and ASDDO dashboard
              overlap substantially — the total counts source rows, not unique
              voters. UP service-elector entries and WB adjudication records
              are not deletions; each row&apos;s dataset says what it is.
            </p>
          </div>
        </section>

        <div className="bl-grid-2" style={{ marginTop: 24 }}>
          {CARD_META.map((c) => (
            <section className="bl-panel" key={c.key} aria-label={c.title}>
              <div className="bl-panel-head">
                <span>{c.title.toUpperCase()}</span>
                <span className="bl-dim">{c.state.toUpperCase()}</span>
              </div>
              <div className="bl-panel-body">
                <p className="bl-p" style={{ fontSize: "1.3em", margin: "4px 0" }}>
                  {manifest && manifest.rows[c.key] !== undefined
                    ? inr(manifest.rows[c.key])
                    : "…"}
                  <span className="bl-dim bl-small"> rows</span>
                </p>
                <p className="bl-p">{c.what}</p>
                <p className="bl-p bl-dim bl-small">{c.claimNote}</p>
                <p className="bl-p bl-dim bl-small">SOURCE: {c.source}</p>
              </div>
            </section>
          ))}
          <section className="bl-panel" aria-label="West Bengal adjudication records">
            <div className="bl-panel-head">
              <span>WEST BENGAL ADJUDICATION RECORDS</span>
              <span className="bl-dim">WEST BENGAL</span>
            </div>
            <div className="bl-panel-body">
              <p className="bl-p" style={{ fontSize: "1.3em", margin: "4px 0" }}>
                {inr(WB_ROWS)}
                <span className="bl-dim bl-small"> rows</span>
              </p>
              <p className="bl-p">
                Records under adjudication from Bhabanipur (AC-159) and
                Ballygunge (AC-161), Kolkata — SIR final roll revision 1.
              </p>
              <p className="bl-p bl-dim bl-small">
                The source states no decision. These are under adjudication —
                NOT deletions. EPICs masked at parse time.
              </p>
              <p className="bl-p bl-dim bl-small">
                SOURCE: Alt News SIR Data Decoded · {WB_LABEL}
              </p>
            </div>
          </section>
        </div>

        <section className="bl-panel" style={{ marginTop: 24 }}>
          <div className="bl-panel-head">
            <span>COVERAGE — STATE BY STATE</span>
            <span className="bl-dim">AS OF 2026-09-23</span>
          </div>
          <div className="bl-panel-body">
            <p className="bl-p bl-dim bl-small" style={{ marginBottom: 12 }}>
              LIVE = searchable now. IN AUDIT = staged, being verified before
              publication. HUNTED = the all-states hunt found no public
              bulk name-level SIR data. Only verified SIR-affected records are
              published — never full rolls, never estimates.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table className="bl-table">
                <thead>
                  <tr>
                    <th>STATE / UT</th>
                    <th>STATUS</th>
                    <th>NOTE</th>
                  </tr>
                </thead>
                <tbody>
                  {COVERAGE.map(([state, status, note]) => (
                    <tr key={state}>
                      <td>{state}</td>
                      <td>{status}</td>
                      <td className="bl-dim">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
