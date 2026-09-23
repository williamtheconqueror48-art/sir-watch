/**
 * GET /api/ledger — every ingestion batch ever sealed, newest last.
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
      `SELECT id, source_name, source_url, retrieved_at, sha256, row_count
       FROM ingestion_ledger
       WHERE id >= $1
       ORDER BY id ASC`,
      [1]
    );
    return Response.json({ batches: rows });
  } catch (err) {
    console.error("GET /api/ledger failed:", (err as Error).message);
    return dbErrorResponse("database query failed");
  }
}
