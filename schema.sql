-- SIR-WATCH schema: Special Intensive Revision (SIR) of electoral rolls tracker.
-- Every fact carries its source. Competing claims coexist as separate rows;
-- they are never merged into a single figure.

CREATE TABLE IF NOT EXISTS ingestion_ledger (
  id SERIAL PRIMARY KEY,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  retrieved_at TIMESTAMPTZ NOT NULL,
  sha256 TEXT NOT NULL,
  row_count INTEGER NOT NULL
);

-- The SIR phases as announced by ECI.
CREATE TABLE IF NOT EXISTS sir_phases (
  id SERIAL PRIMARY KEY,
  phase TEXT NOT NULL,
  announced_date DATE,
  enumeration_start DATE,
  enumeration_end DATE,
  coverage TEXT NOT NULL,
  electorate_covered_cr NUMERIC,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  ledger_id INTEGER REFERENCES ingestion_ledger(id)
);

-- Per (state, phase, source) aggregate figures. One row per source so that
-- ECI press-note figures and opposition/analyst claims sit side by side.
CREATE TABLE IF NOT EXISTS state_snapshots (
  id SERIAL PRIMARY KEY,
  state TEXT NOT NULL,
  phase TEXT NOT NULL,
  pre_sir_electors BIGINT,
  post_sir_electors BIGINT,
  deletions BIGINT,
  deletion_pct NUMERIC,
  notices_issued BIGINT,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  ledger_id INTEGER REFERENCES ingestion_ledger(id)
);
CREATE INDEX IF NOT EXISTS idx_snapshots_state ON state_snapshots(state);

-- Objections raised on record by Election Commissioners (e.g. the 14
-- objections reported by The Indian Express, 2026-09-23).
CREATE TABLE IF NOT EXISTS dissent_events (
  id SERIAL PRIMARY KEY,
  event_date DATE,
  date_precision TEXT NOT NULL DEFAULT 'exact',
  commissioner TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  ledger_id INTEGER REFERENCES ingestion_ledger(id)
);

-- Archive of ECI SIR orders / notices / press notes.
CREATE TABLE IF NOT EXISTS notices (
  id SERIAL PRIMARY KEY,
  notice_date DATE,
  title TEXT NOT NULL,
  issuing_authority TEXT NOT NULL,
  summary TEXT,
  source_url TEXT NOT NULL,
  sha256 TEXT,
  ledger_id INTEGER REFERENCES ingestion_ledger(id)
);

-- Supreme Court case tracker (ADR vs ECI and connected matters).
CREATE TABLE IF NOT EXISTS sc_events (
  id SERIAL PRIMARY KEY,
  event_date DATE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source_url TEXT NOT NULL,
  ledger_id INTEGER REFERENCES ingestion_ledger(id)
);

-- Name-level deletion records recovered from published rolls / deletion
-- lists. Presented exactly as published in the source. EPIC numbers are
-- never displayed.
CREATE TABLE IF NOT EXISTS deletion_records (
  id SERIAL PRIMARY KEY,
  state TEXT NOT NULL,
  district TEXT,
  ac_name TEXT,
  booth_no TEXT,
  booth_name TEXT,
  voter_name TEXT NOT NULL,
  deletion_reason TEXT,
  phase TEXT,
  source_url TEXT NOT NULL,
  ledger_id INTEGER REFERENCES ingestion_ledger(id)
);
CREATE INDEX IF NOT EXISTS idx_deletion_state ON deletion_records(state);
CREATE INDEX IF NOT EXISTS idx_deletion_name ON deletion_records(voter_name);
CREATE INDEX IF NOT EXISTS idx_deletion_ac ON deletion_records(ac_name);
