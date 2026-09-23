/**
 * GET /api/phases — the SIR phases as announced by ECI, with provenance.
 */
import { getSql, dbErrorResponse } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let sql;
  try {
    sql = getSql();
  } catch {
    return dbErrorResponse("DATABASE_URL is not configured");
  }

  try {
    const rows = await sql.query(
      `SELECT p.id, p.phase, p.announced_date, p.enumeration_start,
              p.enumeration_end, p.coverage, p.electorate_covered_cr,
              p.source_name, p.source_url, p.ledger_id,
              l.retrieved_at, l.sha256
       FROM sir_phases p
       JOIN ingestion_ledger l ON l.id = p.ledger_id
       WHERE p.id >= $1
       ORDER BY p.id ASC`,
      [1]
    );
    return Response.json({ phases: rows });
  } catch (err) {
    console.error("GET /api/phases failed:", (err as Error).message);
    return dbErrorResponse("database query failed");
  }
}
