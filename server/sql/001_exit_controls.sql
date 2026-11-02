CREATE TABLE IF NOT EXISTS exit_controls (
 id BIGSERIAL PRIMARY KEY,
 store_id TEXT NOT NULL,
 ticket_number TEXT NOT NULL,
 gate_id TEXT NOT NULL,
 controller_id TEXT NOT NULL,
 article_count INTEGER,
 items_note TEXT,
 checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(store_id,ticket_number)
);
CREATE INDEX IF NOT EXISTS exit_controls_by_date ON exit_controls(store_id,checked_at DESC);
