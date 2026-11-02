import 'dotenv/config';
import express from 'express';
import { Pool } from 'pg';
import { createHash, timingSafeEqual } from 'node:crypto';
import { validateExit } from './validateExit';

type Controller = { id: string; storeId: string; gateId: string; token: string };
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: true } : undefined });
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));
app.use((_req,res,next) => { res.setHeader('Cache-Control','no-store'); next(); });
const controllers: Controller[] = JSON.parse(process.env.CONTROLLERS_JSON || '[]');
const adminToken = process.env.POS_IMPORT_TOKEN || '';
function equalSecret(a: string,b: string) {
  if (!a || !b) return false;
  const ah = createHash('sha256').update(a).digest(), bh = createHash('sha256').update(b).digest();
  return timingSafeEqual(ah,bh);
}
function bearer(req: express.Request) { return /^Bearer (.+)$/i.exec(req.header('authorization') || '')?.[1] || ''; }
function controller(req: express.Request): Controller | undefined {
  const token = bearer(req);
  return controllers.find(c => equalSecret(c.token,token));
}
function validText(s: unknown, max=80): s is string {
  return typeof s === 'string' && s.length > 0 && s.length <= max && /^[a-zA-Z0-9_-]+$/.test(s);
}
app.get('/api/health', async (_req,res) => {
  try { await pool.query('SELECT 1'); res.json({status:'ok'}); }
  catch { res.status(503).json({error:'DATABASE_UNAVAILABLE'}); }
});
app.get('/api/me', (req,res) => {
  const c=controller(req);
  if (!c) { res.status(401).json({error:'UNAUTHORIZED'}); return; }
  res.json({controllerId:c.id,storeId:c.storeId,gateId:c.gateId});
});
app.post('/api/verify', async (req,res) => {
  const c=controller(req);
  if (!c) { res.status(401).json({error:'UNAUTHORIZED'}); return; }
  const ticketNumber=req.body?.ticketNumber;
  if (!validText(ticketNumber)) { res.status(400).json({error:'INVALID_TICKET'}); return; }
  try {
    const result=await pool.query(
      `SELECT t.payment_status,t.amount_fcfa,t.article_count,
       EXISTS(SELECT 1 FROM exit_controls e WHERE e.store_id=t.store_id AND e.ticket_number=t.ticket_number) AS already_controlled
       FROM pos_tickets t WHERE t.store_id=$1 AND t.ticket_number=$2`,
      [c.storeId,ticketNumber]);
    if (!result.rowCount) { res.json({status:'UNKNOWN'}); return; }
    const row=result.rows[0];
    res.json({status:row.already_controlled?'ALREADY_CONTROLLED':row.payment_status==='PAID'?'AUTHORIZED':'UNPAID',paymentStatus:row.payment_status,amountFCFA:String(row.amount_fcfa),articleCount:row.article_count});
  } catch { res.status(503).json({error:'VERIFICATION_UNAVAILABLE'}); }
});
app.post('/api/exit', async (req,res) => {
  const c=controller(req);
  if (!c) { res.status(401).json({error:'UNAUTHORIZED'}); return; }
  const ticketNumber=req.body?.ticketNumber;
  if (!validText(ticketNumber)) { res.status(400).json({error:'INVALID_TICKET'}); return; }
  try {
    const result=await validateExit(pool,{storeId:c.storeId,ticketNumber,gateId:c.gateId,controllerId:c.id});
    res.status(result.status==='VALIDATED'?201:409).json(result);
  } catch { res.status(503).json({error:'VALIDATION_UNAVAILABLE'}); }
});
app.post('/api/pos/tickets',async (req,res) => {
  if (!equalSecret(bearer(req),adminToken)) { res.status(401).json({error:'UNAUTHORIZED'}); return; }
  const {storeId,ticketNumber,paymentStatus,amountFCFA,articleCount}=req.body || {};
  if (!validText(storeId)||!validText(ticketNumber)||!['PAID','UNPAID','REFUNDED','CANCELLED'].includes(paymentStatus)||!Number.isSafeInteger(amountFCFA)||amountFCFA<0||!Number.isSafeInteger(articleCount)||articleCount<0) {
    res.status(400).json({error:'INVALID_TRANSACTION'});return;
  }
  try {
    await pool.query(
      `INSERT INTO pos_tickets(store_id,ticket_number,payment_status,amount_fcfa,article_count)
       VALUES ($1,$2,$3,$4,$5) ON CONFLICT(store_id,ticket_number)
       DO UPDATE SET payment_status=EXCLUDED.payment_status,amount_fcfa=EXCLUDED.amount_fcfa,article_count=EXCLUDED.article_count,source_updated_at=NOW()`,
      [storeId,ticketNumber,paymentStatus,amountFCFA,articleCount]);
    res.status(204).end();
  } catch { res.status(503).json({error:'IMPORT_UNAVAILABLE'}); }
});
app.get('/api/stats',async(req,res)=>{
  const c=controller(req);
  if(!c){res.status(401).json({error:'UNAUTHORIZED'});return;}
  try{
    const r=await pool.query(`SELECT
      (SELECT COUNT(*)::int FROM pos_tickets WHERE store_id=$1 AND payment_status='PAID') AS paid,
      (SELECT COUNT(*)::int FROM exit_controls WHERE store_id=$1) AS validated,
      (SELECT COUNT(*)::int FROM pos_tickets t WHERE store_id=$1 AND payment_status='PAID'
       AND NOT EXISTS(SELECT 1 FROM exit_controls e WHERE e.store_id=t.store_id AND e.ticket_number=t.ticket_number)) AS pending`,[c.storeId]);
    res.json(r.rows[0]);
  }catch{res.status(503).json({error:'STATS_UNAVAILABLE'});}
});
const port=Number(process.env.API_PORT || 3001);
if (!process.env.DATABASE_URL || !controllers.length || !adminToken || controllers.some(c=>!c.token||!c.id||!c.gateId||!c.storeId)) {
  throw new Error('Set DATABASE_URL, POS_IMPORT_TOKEN and CONTROLLERS_JSON before starting the API');
}
app.listen(port,()=>{ console.info('Smart Exit API listening on port '+port); });
