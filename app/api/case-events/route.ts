/**
 * GET /api/case-events — Supreme Court case tracker (ADR vs ECI and
 * connected matters), chronological.
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
      `SELECT c.id, c.event_date, c.event_type, c.title, c.description,
              c.source_url, c.ledger_id, l.retrieved_at
       FROM sc_events c
       JOIN ingestion_ledger l ON l.id = c.ledger_id
       WHERE c.id >= $1
       ORDER BY c.event_date ASC NULLS LAST, c.id ASC`,
      [1]
    );
    return Response.json({ events: rows, count: rows.length });
  } catch (err) {
    console.error("GET /api/case-events failed:", (err as Error).message);
    return dbErrorResponse("database query failed");
  }
}
