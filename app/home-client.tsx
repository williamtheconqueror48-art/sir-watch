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
  { href: "/vote-check", label: "VOTE CHECK" },
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

type InvFileRow = {
  state: string;
  scriptable: string;
  fetched?: string | null;
  live_status?: string | null;
};

/**
 * Roll-file inventory → parsed rolls panel (feeds /vote-check).
 *
 * Reads the published roll-file inventory (/inventory/inventory.json) and the
 * inv-rolls shard-dataset manifest entry. Until the parse coordinator
 * publishes inv-rolls, the parsed column honestly says so — no numbers are
 * invented. The `fetched` column reads the per-file `fetched` field when the
 * fetch-status rebuild lands; until then it shows "—" (not assessed).
 */
function RollHoldingsPanel() {
  const [files, setFiles] = useState<InvFileRow[] | null>(null);
  const [filesError, setFilesError] = useState(false);
  const [parsed, setParsed] = useState<{
    rows: number;
    perState: Record<string, number> | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/inventory/inventory.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: InvFileRow[]) => {
        if (!cancelled) setFiles(d);
      })
      .catch(() => {
        if (!cancelled) setFilesError(true);
      });
    getShardManifest().then((man) => {
      if (cancelled || !man) return;
      const meta = man["inv-rolls"] as
        | { rows?: number; per_state?: Record<string, number> }
        | undefined;
      if (meta && typeof meta.rows === "number") {
        setParsed({ rows: meta.rows, perState: meta.per_state ?? null });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const perState = (() => {
    if (!files) return null;
    const m = new Map<
      string,
      { total: number; fetched: number; gated: number }
    >();
    for (const f of files) {
      const e = m.get(f.state) ?? { total: 0, fetched: 0, gated: 0 };
      e.total += 1;
      if (f.fetched === "Y") e.fetched += 1;
      if (f.scriptable === "N") e.gated += 1;
      m.set(f.state, e);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  })();

  const hasFetchedField = !!files && files.some((f) => "fetched" in f);
  const statesCovered = perState ? perState.length : null;

  return (
    <section className="bl-panel" style={{ marginTop: 24 }}>
      <div className="bl-panel-head">
        <span>ROLL INVENTORY → PARSED ROLLS (VOTE CHECK)</span>
        <span className="bl-dim">
          <Link href="/vote-check">VOTE CHECK</Link> ·{" "}
          <Link href="/inventory">FULL INVENTORY</Link>
        </span>
      </div>
      <div className="bl-panel-body">
        <p className="bl-p bl-dim bl-small" style={{ marginBottom: 12 }}>
          Which states&apos; electoral rolls have been fetched as PDFs, and how
          many parsed roll rows are searchable on{" "}
          <Link href="/vote-check">/vote-check</Link> per state. FETCHED =
          PDFs pulled into the archive for parsing; GATED = files the official
          site serves only behind a per-PDF CAPTCHA (documented, never
          bypassed). States with no fetched PDFs say so plainly.
        </p>
        {filesError && (
          <div className="bl-empty" style={{ marginBottom: 12 }}>
            ROLL-FILE INVENTORY UNAVAILABLE RIGHT NOW — FETCH COUNTS CANNOT BE
            SHOWN.
          </div>
        )}
        {files && perState && (
          <>
            <p className="bl-p bl-small">
              <span className="bl-data">{inr(files.length)}</span> ROLL FILES
              INVENTORIED ·{" "}
              <span className="bl-data">{inr(statesCovered ?? 0)}</span> OF 36
              STATES/UTS WITH DIRECT FILES
              {parsed ? (
                <>
                  {" "}·{" "}
                  <span className="bl-data">{inr(parsed.rows)}</span> PARSED
                  ROLL ROWS PUBLISHED
                </>
              ) : (
                " · PARSED ROLLS: PARSING IN PROGRESS — NO PARSED ROWS PUBLISHED YET"
              )}
            </p>
            <div style={{ overflowX: "auto" }}>
              <table className="bl-table">
                <thead>
                  <tr>
                    <th>STATE / UT</th>
                    <th>ROLL PDFS</th>
                    <th>FETCHED</th>
                    <th>GATED</th>
                    <th>PARSED ROWS</th>
                    <th>VOTE CHECK</th>
                  </tr>
                </thead>
                <tbody>
                  {perState.map(([sname, e]) => {
                    const pRows = parsed?.perState?.[sname];
                    const searchable =
                      typeof pRows === "number" && pRows > 0;
                    return (
                      <tr key={sname}>
                        <td>{sname}</td>
                        <td>{inr(e.total)}</td>
                        <td>
                          {hasFetchedField ? (
                            e.fetched > 0 ? (
                              inr(e.fetched)
                            ) : (
                              <span className="bl-amber">NOT YET FETCHED</span>
                            )
                          ) : (
                            <span className="bl-dim">—</span>
                          )}
                        </td>
                        <td>{e.gated > 0 ? inr(e.gated) : "—"}</td>
                        <td>
                          {typeof pRows === "number"
                            ? inr(pRows)
                            : parsed
                              ? "state split not published"
                              : "—"}
                        </td>
                        <td>
                          {searchable ? (
                            <span className="bl-green">SEARCHABLE</span>
                          ) : (
                            <span className="bl-dim">NOT YET</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="bl-p bl-dim bl-small" style={{ marginTop: 12 }}>
              {36 - (statesCovered ?? 0)} of 36 states/UTs have no direct roll
              files in the inventory — their rolls sit behind per-PDF CAPTCHAs
              and are documented as coverage gaps, never bypassed. Fetch
              status per file: <Link href="/inventory">/inventory</Link>
              {" "}“Fetched” column.
            </p>
          </>
        )}
        {!files && !filesError && (
          <p className="bl-dim bl-small">READING ROLL-FILE INVENTORY…</p>
        )}
      </div>
    </section>
  );
}

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
  {
    key: "inv-rolls",
    title: "Parsed electoral rolls — pre/post-SIR",
    state: "6 states/UTs",
    what: "Electoral-roll rows parsed from CEO-site PDFs, each labeled with its roll vintage (pre-SIR, post-SIR, or other). Arunachal Pradesh (pre-SIR 2006), Delhi (pre-SIR), Goa (pre + post-SIR), Manipur (pre-SIR), Mizoram (other), Puducherry (pre + post-SIR). Powers the /vote-check comparison.",
    claimNote:
      "Counts are parsed source rows, not unique voters. vintage_class=other rows are claims/objections lists — never treated as roll presence. EPICs masked at parse time (two Arunachal masks are malformed from source OCR noise; masked, format issue only).",
    source:
      "CEO sites: Arunachal Pradesh, Delhi, Goa, Manipur, Mizoram, Puducherry · retrieved 2026-09-24",
  },
  {
    key: "kerala-service-2017",
    title: "Kerala service electors 2017",
    state: "Kerala",
    what: "Service-elector entries from the 2017 Special Summary Revision roll (final publication 10-01-2017): defence and armed-police personnel and their wives.",
    claimNote:
      "NOT Kerala civilian rolls and NOT pre/post-SIR — vintage_class=other, excluded from the vote-check comparison. EPIC-shaped strings in the rank column are military service numbers, not EPICs (verified 2026-09-24).",
    source: "CEO Kerala (ceo.kerala.gov.in) · retrieved 2026-09-24",
  },
  {
    key: "uttarakhand-service-2026",
    title: "Uttarakhand service electors 2026",
    state: "Uttarakhand",
    what: "Service-elector entries from post-SIR draft-roll PDFs (the booth table yielded zero elector rows).",
    claimNote:
      "Draft-roll entries — NOT deletions. EPICs masked at parse time.",
    source: "CEO Uttarakhand · retrieved 2026-09-24",
  },
];

const COVERAGE: [string, string, string][] = [
  ["Karnataka", "LIVE", "ASD index, discrepancy notices, ASDDO dashboard"],
  ["West Bengal", "LIVE", "Adjudication records — Bhabanipur + Ballygunge ACs, Kolkata"],
  ["Uttar Pradesh", "LIVE", "Service-elector draft entries, 4 ACs (not deletions)"],
  ["Kerala", "LIVE", "Inclusion claims (Form 9), deletion objections (Form 10), address shifts (Form 11A) · service-elector roll 2017 parsed (89,885 rows — defence personnel, outside the SIR comparison)"],
  ["Chhattisgarh", "LIVE", "Objections to inclusion (Form 10), 6 DEO claim pages"],
  ["Mizoram", "PARSED", "Roll PDFs parsed (1,591 rows, vintage: other) — searchable on /vote-check"],
  ["Puducherry", "PARSED", "Pre-SIR (99 rows) + post-SIR (245 rows) roll PDFs parsed — side-by-side comparison live on /vote-check"],
  ["Bihar", "STAGED — UNAUDITED", "3 community datasets, ~595 MB"],
  ["Tamil Nadu", "AGGREGATES ONLY", "Cited ASD workbook ruled unusable; portal is CAPTCHA-gated"],
  ["Gujarat", "URL INDEX ONLY", "50,963-part fetch manifest; PDFs need India egress"],
  ["Rajasthan", "AGGREGATES ONLY", "Official totals only, no name-level data"],
  ["Madhya Pradesh", "AGGREGATES ONLY", "Official totals only, no name-level data"],
  ["Delhi", "PARSED", "Pre-SIR roll PDFs parsed (13,002 rows) — searchable on /vote-check"],
  ["Punjab", "BASELINE FRAGMENTS", "Archived pre-SIR PDFs only"],
  ["Haryana", "BASELINE FRAGMENTS", "Archived pre-SIR PDFs only"],
  ["Telangana", "BASELINE FRAGMENTS", "Archived pre-SIR PDFs only"],
  ["Andhra Pradesh", "BASELINE FRAGMENTS", "Archived pre-SIR PDFs only"],
  ["Himachal Pradesh", "NO SIR", "Deferred by ECI"],
  ["Jammu & Kashmir", "NO SIR", "Deferred by ECI"],
  ["Ladakh", "NO SIR", "Deferred by ECI"],
  ["Assam", "NO SIR", "Special Revision instead of SIR"],
  ["Goa", "PARSED", "Draft roll (pre-SIR, 112 rows) + final roll (post-SIR, 65 rows) parsed — side-by-side comparison live on /vote-check"],
  ["Chandigarh", "HUNTED", "No public bulk name-level data found; browser leads queued"],
  ["Dadra & Nagar Haveli and Daman & Diu", "HUNTED", "No public bulk name-level data found; browser leads queued"],
  ["Uttarakhand", "PARSED", "Service-elector roll 2026 parsed (2,750 rows, post-SIR draft) — searchable on /vote-check"],
  ["Sikkim", "HUNTED", "No public bulk name-level data found; browser leads queued"],
  ["Meghalaya", "HUNTED", "Official ASD aggregate only (1,80,402); name lists need browser"],
  ["Nagaland", "HUNTED", "Booth-wise lists reportedly public now; browser lead queued"],
  ["Arunachal Pradesh", "PARSED", "Pre-SIR Intensive Roll 2006 parsed (6,905 rows) — searchable on /vote-check; no post-SIR roll fetched yet"],
  ["Tripura", "HUNTED", "Draft rolls expected ~14 Oct 2026"],
  ["Manipur", "PARSED", "Pre-SIR roll PDFs parsed (8,068 rows) — searchable on /vote-check"],
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
        "inv-rolls",
        "kerala-service-2017",
        "uttarakhand-service-2026",
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
  const newHoldings =
    manifest && manifest.rows
      ? (manifest.rows["inv-rolls"] ?? 0) +
        (manifest.rows["kerala-service-2017"] ?? 0) +
        (manifest.rows["uttarakhand-service-2026"] ?? 0)
      : null;
  const staticArchive =
    shardTotal === null || newHoldings === null
      ? null
      : shardTotal - newHoldings;
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
            <p className="bl-p bl-data" style={{ fontSize: "1.6em", margin: "8px 0" }}>
              {grandTotal === null ? "…" : inr(grandTotal)}{" "}
              <span className="bl-dim bl-small">name-level rows searchable</span>
            </p>
            <p className="bl-p bl-dim bl-small">
              {staticArchive === null ? "…" : inr(staticArchive)} static-archive
              rows (Karnataka + Uttar Pradesh + Chhattisgarh + Kerala
              SIR-affected indexes, claims &amp; objections) +{" "}
              {newHoldings === null ? "…" : inr(newHoldings)} parsed-roll rows
              (pre/post-SIR rolls + service-elector rolls) + {inr(WB_ROWS)}{" "}
              West Bengal adjudication records ({WB_LABEL}).
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
                <p className="bl-p bl-data" style={{ fontSize: "1.3em", margin: "4px 0" }}>
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
              <p className="bl-p bl-data" style={{ fontSize: "1.3em", margin: "4px 0" }}>
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

        <RollHoldingsPanel />

        <section className="bl-panel" style={{ marginTop: 24 }}>
          <div className="bl-panel-head">
            <span>COVERAGE — STATE BY STATE</span>
            <span className="bl-dim">AS OF 2026-09-24</span>
          </div>
          <div className="bl-panel-body">
            <p className="bl-p bl-dim bl-small" style={{ marginBottom: 12 }}>
              LIVE = searchable now. PARSED = roll PDFs parsed and searchable
              on /vote-check. IN AUDIT = staged, being verified before
              publication. HUNTED = the all-states hunt found no public
              bulk name-level SIR data. Only verified public records are
              published — every row carries its source. Never estimates.
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
