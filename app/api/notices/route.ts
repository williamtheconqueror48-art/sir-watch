/**
 * GET /api/notices — ECI SIR orders / notices / press notes archive.
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
      `SELECT n.id, n.notice_date, n.title, n.issuing_authority, n.summary,
              n.source_url, n.sha256, n.ledger_id, l.retrieved_at
       FROM notices n
       JOIN ingestion_ledger l ON l.id = n.ledger_id
       WHERE n.id >= $1
       ORDER BY n.notice_date DESC NULLS LAST, n.id DESC`,
      [1]
    );
    return Response.json({ notices: rows, count: rows.length });
  } catch (err) {
    console.error("GET /api/notices failed:", (err as Error).message);
    return dbErrorResponse("database query failed");
  }
}
