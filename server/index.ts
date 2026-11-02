import 'dotenv/config';
import express from 'express';
import {Pool} from 'pg';
import {createHash,timingSafeEqual} from 'node:crypto';
import {validateExit} from './validateExit';

const app=express();
app.disable('x-powered-by');
app.use(express.json({limit:'16kb'}));
app.use((_req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
const pool=new Pool({connectionString:process.env.DATABASE_URL});
type Controller={id:string;storeId:string;gateId:string;token:string};
const controllers:Controller[]=JSON.parse(process.env.CONTROLLERS_JSON||'[]');
function equal(a:string,b:string){if(!a||!b)return false;return timingSafeEqual(createHash('sha256').update(a).digest(),createHash('sha256').update(b).digest());}
function who(req:express.Request){const t=/^Bearer (.+)$/i.exec(req.header('authorization')||'')?.[1]||'';return controllers.find(c=>equal(c.token,t));}
function ticket(v:unknown):v is string{return typeof v==='string'&&/^[a-zA-Z0-9_-]{4,80}$/.test(v);}
app.get('/api/health',async(_req,res)=>{try{await pool.query('SELECT 1');res.json({ok:true});}catch{res.status(503).json({error:'UNAVAILABLE'});}});
app.get('/api/me',(req,res)=>{const c=who(req);if(!c){res.status(401).json({error:'UNAUTHORIZED'});return;}res.json({controllerId:c.id,storeId:c.storeId,gateId:c.gateId});});
app.post('/api/verify',async(req,res)=>{
 const c=who(req);if(!c){res.status(401).json({error:'UNAUTHORIZED'});return;}
 const t=req.body?.ticketNumber;if(!ticket(t)){res.status(400).json({error:'INVALID_TICKET'});return;}
 try{const r=await pool.query('SELECT gate_id,controller_id,checked_at FROM exit_controls WHERE store_id=$1 AND ticket_number=$2',[c.storeId,t]);res.json(r.rowCount?{status:'ALREADY_CONTROLLED',previous:r.rows[0]}:{status:'NOT_YET_CONTROLLED'});}
 catch{res.status(503).json({error:'UNAVAILABLE'});}
});
app.post('/api/exit',async(req,res)=>{
 const c=who(req);if(!c){res.status(401).json({error:'UNAUTHORIZED'});return;}
 const {ticketNumber,articleCount,itemsNote}=req.body||{};
 if(!ticket(ticketNumber)||(articleCount!==undefined&&(!Number.isInteger(articleCount)||articleCount<0||articleCount>10000))||(itemsNote!==undefined&&(typeof itemsNote!=='string'||itemsNote.length>3000))){res.status(400).json({error:'INVALID_INPUT'});return;}
 try{const result=await validateExit(pool,{storeId:c.storeId,ticketNumber,gateId:c.gateId,controllerId:c.id,articleCount,itemsNote});res.status(result.status==='VALIDATED'?201:409).json(result);}
 catch{res.status(503).json({error:'UNAVAILABLE'});}
});
app.get('/api/history',async(req,res)=>{
 const c=who(req);if(!c){res.status(401).json({error:'UNAUTHORIZED'});return;}
 try{const r=await pool.query('SELECT ticket_number,gate_id,controller_id,article_count,items_note,checked_at FROM exit_controls WHERE store_id=$1 ORDER BY checked_at DESC LIMIT 500',[c.storeId]);res.json(r.rows);}
 catch{res.status(503).json({error:'UNAVAILABLE'});}
});
if(!process.env.DATABASE_URL||controllers.length===0||controllers.some(c=>!c.id||!c.storeId||!c.gateId||!c.token))throw new Error('Configure DATABASE_URL and CONTROLLERS_JSON');
app.listen(Number(process.env.API_PORT||3001));
