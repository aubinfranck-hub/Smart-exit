-- Smart Exit: authoritative, multi-controller exit validation.
CREATE TABLE IF NOT EXISTS pos_tickets (
  id BIGSERIAL PRIMARY KEY,
  store_id TEXT NOT NULL,
  ticket_number TEXT NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('PAID','UNPAID','REFUNDED','CANCELLED')),
  amount_fcfa BIGINT NOT NULL CHECK (amount_fcfa >= 0),
  article_count INTEGER NOT NULL CHECK (article_count >= 0),
  source_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(store_id,ticket_number)
);
CREATE TABLE IF NOT EXISTS exit_controls (
  id BIGSERIAL PRIMARY KEY,
  store_id TEXT NOT NULL,
  ticket_number TEXT NOT NULL,
  gate_id TEXT NOT NULL,
  controller_id TEXT NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(store_id,ticket_number),
  FOREIGN KEY (store_id,ticket_number) REFERENCES pos_tickets(store_id,ticket_number)
);
CREATE INDEX IF NOT EXISTS idx_exit_controls_store_time ON exit_controls(store_id,checked_at DESC);
