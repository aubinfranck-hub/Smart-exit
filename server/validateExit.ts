import type { Pool, PoolClient } from 'pg';

/** Call only after authenticating the controller and verifying their gate/store membership. */
export async function validateExit(
  pool: Pool,
  input: { storeId: string; ticketNumber: string; gateId: string; controllerId: string }
): Promise<{ status: 'VALIDATED' | 'UNKNOWN' | 'UNPAID' | 'ALREADY_CONTROLLED'; controlId?: string }> {
  const { storeId, ticketNumber, gateId, controllerId } = input;
  if (![storeId, ticketNumber, gateId, controllerId].every(v => typeof v === 'string' && v.trim().length > 0)) {
    throw new Error('Missing validated identity or ticket');
  }
  const client: PoolClient = await pool.connect();
  try {
    await client.query('BEGIN');
    // Serialize competing validations of the same paid ticket across all gates.
    const ticket = await client.query(
      'SELECT payment_status FROM pos_tickets WHERE store_id=$1 AND ticket_number=$2 FOR UPDATE',
      [storeId, ticketNumber]
    );
    if (ticket.rowCount === 0) {
      await client.query('ROLLBACK');
      return { status: 'UNKNOWN' };
    }
    if (ticket.rows[0].payment_status !== 'PAID') {
      await client.query('ROLLBACK');
      return { status: 'UNPAID' };
    }
    const inserted = await client.query(
      `INSERT INTO exit_controls (store_id,ticket_number,gate_id,controller_id)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (store_id,ticket_number) DO NOTHING RETURNING id`,
      [storeId, ticketNumber, gateId, controllerId]
    );
    await client.query('COMMIT');
    if (inserted.rowCount === 0) return { status: 'ALREADY_CONTROLLED' };
    return { status: 'VALIDATED', controlId: String(inserted.rows[0].id) };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
