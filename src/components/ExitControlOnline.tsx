import React,{useState} from 'react';
export function ExitControlOnline(){
 const [token,setToken]=useState(''),[ticket,setTicket]=useState(''),[note,setNote]=useState(''),[count,setCount]=useState(''),[status,setStatus]=useState(''),[ready,setReady]=useState(false);
 async function call(path:string,body?:object){
  const r=await fetch('/api/'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
  const d=await r.json();if(!r.ok&&r.status!==409)throw Error(d.error||'Réseau indisponible');return d;
 }
 async function run(action:'me'|'verify'|'exit'){
  setReady(false);
  try{
   const d=await call(action,action==='me'?undefined:action==='verify'?{ticketNumber:ticket}:{ticketNumber:ticket,articleCount:count===''?undefined:Number(count),itemsNote:note});
   setStatus(action==='me'?'Poste connecté : '+d.controllerId+' / '+d.gateId:d.status==='NOT_YET_CONTROLLED'?'Ticket jamais contrôlé':d.status==='VALIDATED'?'SORTIE ENREGISTRÉE':d.status==='ALREADY_CONTROLLED'?'ALERTE : TICKET DÉJÀ UTILISÉ':d.status);
   if(action==='me')setReady(true);
   if(action==='verify'&&d.status==='NOT_YET_CONTROLLED')setReady(true);
  }catch(e){setStatus('CONTRÔLE IMPOSSIBLE : '+String(e));}
 }
 return <section className="max-w-xl mx-auto rounded-2xl bg-slate-900 p-6 space-y-4">
  <h2 className="text-2xl font-bold">Smart Exit — Sortie autonome</h2>
  <input aria-label="Jeton du contrôleur" type="password" placeholder="Jeton du contrôleur" value={token} onChange={e=>setToken(e.target.value)} className="w-full p-3 rounded bg-slate-800"/>
  <button onClick={()=>run('me')} className="bg-blue-600 p-3 rounded">Connecter le poste</button>
  <input aria-label="Ticket" placeholder="Numéro du ticket" value={ticket} onChange={e=>{setTicket(e.target.value);setReady(false);}} className="w-full p-3 rounded bg-slate-800"/>
  <button onClick={()=>run('verify')} className="bg-blue-600 p-3 rounded">Vérifier doublon</button>
  <input aria-label="Nombre articles" type="number" min="0" placeholder="Nombre d'articles (facultatif)" value={count} onChange={e=>setCount(e.target.value)} className="w-full p-3 rounded bg-slate-800"/>
  <textarea aria-label="Articles et observations" placeholder="Articles relevés et observations" value={note} onChange={e=>setNote(e.target.value)} className="w-full p-3 rounded bg-slate-800"/>
  <button disabled={!ready||!ticket} onClick={()=>run('exit')} className="bg-emerald-600 p-3 rounded disabled:opacity-30">Enregistrer la sortie</button>
  <p role="status" className="font-bold">{status}</p>
  <p className="text-xs text-slate-400">Serveur requis. Vérification anti-doublon définitive lors de l'enregistrement.</p>
 </section>;
}
