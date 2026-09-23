/**
 * GET /api/dissent — objections raised on record by Election Commissioners,
 * newest first. Each row carries its source; nothing is paraphrased into a
 * conclusion.
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
      `SELECT d.id, d.event_date, d.date_precision, d.commissioner,
              d.subject, d.description, d.source_name, d.source_url,
              d.ledger_id, l.retrieved_at
       FROM dissent_events d
       JOIN ingestion_ledger l ON l.id = d.ledger_id
       WHERE d.id >= $1
       ORDER BY d.event_date DESC NULLS LAST, d.id DESC`,
      [1]
    );
    return Response.json({ events: rows, count: rows.length });
  } catch (err) {
    console.error("GET /api/dissent failed:", (err as Error).message);
    return dbErrorResponse("database query failed");
  }
}
