/**
 * GET /api/snapshots — state x phase aggregate figures, one row per SOURCE.
 * Competing claims (ECI press note vs opposition/analyst) are returned as
 * separate rows and never merged. ?state= &phase= &source= filters.
 */
import { getSql, dbErrorResponse } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  let sql;
  try {
    sql = getSql();
  } catch {
    return dbErrorResponse("DATABASE_URL is not configured");
  }

  const url = new URL(req.url);
  const state = url.searchParams.get("state")?.trim() || null;
  const phase = url.searchParams.get("phase")?.trim() || null;
  const source = url.searchParams.get("source")?.trim() || null;

  try {
    const rows = await sql.query(
      `SELECT s.id, s.state, s.phase, s.pre_sir_electors, s.post_sir_electors,
              s.deletions, s.deletion_pct, s.notices_issued,
              s.source_name, s.source_url, s.ledger_id,
              l.retrieved_at, l.sha256
       FROM state_snapshots s
       JOIN ingestion_ledger l ON l.id = s.ledger_id
       WHERE s.id >= $1
         AND ($2::text IS NULL OR s.state ILIKE $2)
         AND ($3::text IS NULL OR s.phase = $3)
         AND ($4::text IS NULL OR s.source_name ILIKE $4)
       ORDER BY s.state ASC, s.phase ASC, s.source_name ASC`,
      [1, state ? `%${state}%` : null, phase, source ? `%${source}%` : null]
    );
    const sources = await sql.query(
      `SELECT DISTINCT source_name FROM state_snapshots WHERE id >= $1 ORDER BY source_name ASC`,
      [1]
    );
    return Response.json({
      snapshots: rows,
      sources: (sources as Array<{ source_name: string }>).map(
        (r) => r.source_name
      ),
    });
  } catch (err) {
    console.error("GET /api/snapshots failed:", (err as Error).message);
    return dbErrorResponse("database query failed");
  }
}
