/**
 * GET /api/deletions — name-level deletion records recovered from published
 * rolls / deletion lists. ?q= searches voter name; ?state= filters state.
 * EPIC numbers are never stored or displayed.
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
  const q = url.searchParams.get("q")?.trim() || null;
  const state = url.searchParams.get("state")?.trim() || null;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("pageSize") || "50", 10))
  );
  const offset = (page - 1) * pageSize;

  try {
    const where = `WHERE r.id >= $1
      AND ($2::text IS NULL OR r.voter_name ILIKE $2)
      AND ($3::text IS NULL OR r.state ILIKE $3)`;
    const totalRows = await sql.query(
      `SELECT COUNT(*)::int AS total FROM deletion_records r ${where}`,
      [1, q ? `%${q}%` : null, state ? `%${state}%` : null]
    );
    const rows = await sql.query(
      `SELECT r.id, r.state, r.district, r.ac_name, r.booth_no, r.booth_name,
              r.voter_name, r.deletion_reason, r.phase,
              r.source_url, r.ledger_id, l.retrieved_at
       FROM deletion_records r
       JOIN ingestion_ledger l ON l.id = r.ledger_id
       ${where}
       ORDER BY r.state ASC, r.voter_name ASC
       LIMIT $4 OFFSET $5`,
      [1, q ? `%${q}%` : null, state ? `%${state}%` : null, pageSize, offset]
    );
    return Response.json({
      records: rows,
      total: totalRows[0]?.total ?? 0,
      page,
      pageSize,
    });
  } catch (err) {
    console.error("GET /api/deletions failed:", (err as Error).message);
    return dbErrorResponse("database query failed");
  }
}
