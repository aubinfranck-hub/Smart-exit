import React,{useState} from 'react';
type Log={ticket_number:string;gate_id:string;controller_id:string;article_count:number|null;items_note:string|null;checked_at:string};
export function ExitHistoryOnline(){
 const [token,setToken]=useState(''),[rows,setRows]=useState<Log[]>([]),[error,setError]=useState('');
 async function load(){
  try{const r=await fetch('/api/history',{headers:{Authorization:'Bearer '+token},cache:'no-store'});if(!r.ok)throw Error('Accès refusé ou serveur indisponible');setRows(await r.json());setError('');}
  catch(e){setError(String(e));}
 }
 function csv(){
  const lines=[['Ticket','Contrôleur','Porte','Date/heure','Articles','Observations'],...rows.map(x=>[x.ticket_number,x.controller_id,x.gate_id,x.checked_at,String(x.article_count??''),x.items_note||''])];
  const data='\ufeff'+lines.map(line=>line.map(v=>'"'+v.replace(/"/g,'""')+'"').join(';')).join('\r\n');
  const url=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='smart-exit-sorties.csv';a.click();URL.revokeObjectURL(url);
 }
 return <section className="space-y-4"><h2 className="text-2xl font-black">Registre des sorties</h2>
 <p className="text-sm text-slate-400">Historique réel du serveur Smart Exit, indépendant des caisses.</p>
 <input type="password" aria-label="Jeton" placeholder="Jeton du poste" value={token} onChange={e=>setToken(e.target.value)} className="p-3 rounded bg-slate-800"/>
 <button onClick={load} className="bg-blue-600 p-3 rounded mx-2">Actualiser</button>
 <button onClick={csv} disabled={!rows.length} className="bg-emerald-600 p-3 rounded disabled:opacity-40">Exporter CSV</button>
 {error&&<p role="alert" className="text-red-400">{error}</p>}
 <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr>{['Ticket','Vigile','Sortie','Date','Articles','Observations'].map(h=><th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>
 {rows.map((r,i)=><tr key={r.ticket_number+'-'+i} className="border-t border-slate-700"><td className="p-3">{r.ticket_number}</td><td>{r.controller_id}</td><td>{r.gate_id}</td><td>{new Date(r.checked_at).toLocaleString('fr-FR')}</td><td>{r.article_count??'—'}</td><td>{r.items_note||'—'}</td></tr>)}
 </tbody></table></div><p>{rows.length} sorties chargées (500 dernières au maximum).</p></section>;
}
