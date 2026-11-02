import type { Pool } from 'pg';
export type ExitInput = {storeId:string;ticketNumber:string;gateId:string;controllerId:string;articleCount?:number;itemsNote?:string};
export async function validateExit(pool:Pool,input:ExitInput) {
 const {storeId,ticketNumber,gateId,controllerId,articleCount,itemsNote}=input;
 if (![storeId,ticketNumber,gateId,controllerId].every(x=>typeof x==='string'&&x.length>0)) throw new Error('INVALID_INPUT');
 const r=await pool.query(
  `INSERT INTO exit_controls(store_id,ticket_number,gate_id,controller_id,article_count,items_note)
   VALUES ($1,$2,$3,$4,$5,$6)
   ON CONFLICT(store_id,ticket_number) DO NOTHING RETURNING id,checked_at`,
  [storeId,ticketNumber,gateId,controllerId,articleCount??null,itemsNote??null]);
 if(r.rowCount) return {status:'VALIDATED',controlId:String(r.rows[0].id),checkedAt:r.rows[0].checked_at};
 const prior=await pool.query(
  'SELECT gate_id,controller_id,checked_at FROM exit_controls WHERE store_id=$1 AND ticket_number=$2',
  [storeId,ticketNumber]);
 return {status:'ALREADY_CONTROLLED',previous:prior.rows[0]??null};
}
