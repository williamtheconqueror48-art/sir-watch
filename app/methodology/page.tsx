import Link from "next/link";
import { SiteHeader } from "../home-client";

/**
 * /methodology — the honesty contract of SIR-WATCH.
 */
export default function MethodologyPage() {
  return (
    <>
      <SiteHeader active="/methodology" />
      <main className="bl-main bl-method">
        <h1 className="bl-h1">METHODOLOGY</h1>

        <h2>1. WHAT THIS TOOL IS</h2>
        <p className="bl-p">
          SIR-WATCH structures the public record of the Election Commission
          of India&apos;s Special Intensive Revision (SIR) of electoral rolls:
          the phases announced, state-by-state figures as reported by each
          source, objections raised on record by Election Commissioners, the
          archive of ECI orders and notices, the Supreme Court proceedings,
          and — as they are recovered — name-by-name deletion records from
          published rolls.
        </p>

        <h2>2. CANONICAL VERBATIM RULE</h2>
        <p className="bl-p">
          Every figure and every description on this site is reproduced
          exactly as published in its cited source. Wording is not
          paraphrased into conclusions; numbers are not rounded into
          narratives. Where a source gives a figure, the row shows that
          figure. Where a source does not give a figure, the cell shows a
          dash — never an estimate, never an interpolation.
        </p>

        <h2>3. COMPETING CLAIMS ARE NEVER MERGED</h2>
        <p className="bl-p">
          ECI press notes, opposition statements, and journalistic analyses
          frequently give different numbers for the same state and phase.
          Each is stored as a separate row carrying its own source. No
          figure on this site is an average, a reconciliation, or a
          &quot;consensus&quot; of sources. The dashboard shows them side by
          side so the reader — not the tool — judges.
        </p>

        <h2>4. PROVENANCE OF EVERY ROW</h2>
        <p className="bl-p">
          Every ingestion batch is sealed into a public ledger with the
          exact source URL, retrieval date, SHA-256 hash of the raw file,
          and row count. Every displayed record carries its ledger ID.
          Raw files are archived untouched; parsing is mechanical and the
          parsing rules are documented with each batch.
        </p>

        <h2>5. WHAT IS NOT CLAIMED</h2>
        <p className="bl-p">
          A deletion recorded here is a record that a name was removed from
          a published roll for the reason the source states — nothing more.
          This tool does not determine why any individual was removed,
          whether a removal was lawful, or what any aggregate figure
          implies. Objections listed on the dissent timeline are reported
          facts about objections raised, not findings about who was right.
          The ECI&apos;s denials are part of the record and are cited where
          they apply.
        </p>

        <h2>6. NAME-LEVEL RECORDS</h2>
        <p className="bl-p">
          Deletion records are reproduced exactly as published in the
          source rolls and deletion lists: voter name, district, assembly
          constituency, booth, and the reason stated by the source. EPIC
          (voter ID) numbers appear only in masked (“starred”) form, e.g.
          ABC****123 — full EPICs are never stored or displayed. Where a
          source provides no EPIC at all, the field reads NOT IN SOURCE
          DATA. Absence of a name from this search proves nothing — coverage
          reflects only which rolls have been recovered and parsed so far, and
          the coverage statement on the search page says so plainly.
        </p>

        <h2>7. CONSTITUTIONAL CONTEXT</h2>
        <p className="bl-p">
          Article 325 of the Constitution of India provides that no person
          shall be ineligible for inclusion in an electoral roll on grounds
          of religion, race, caste or sex. Article 326 provides for adult
          suffrage — elections on the basis of universal adult franchise.
          This tool takes no position on whether the SIR complies with
          these provisions; it exists so that the underlying records can be
          inspected by anyone.
        </p>

        <h2>8. CORRECTIONS</h2>
        <p className="bl-p">
          Errors are corrected by sealing a new ledger batch that
          supersedes the old row — the old row remains visible with its
          original provenance. Nothing is silently overwritten.
        </p>

        <p className="bl-p bl-dim bl-small" style={{ marginTop: 32 }}>
          <Link href="/">← DASHBOARD</Link>
        </p>
      </main>
    </>
  );
}
