import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  User, 
  MapPin, 
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { useSmartExit } from '../context/SmartExitContext';

export const HistoryView: React.FC = () => {
  const { controlLogs, vigiles, gates } = useSmartExit();

  const [searchTicket, setSearchTicket] = useState('');
  const [selectedVigile, setSelectedVigile] = useState('ALL');
  const [selectedGate, setSelectedGate] = useState('ALL');
  const [selectedCaisse, setSelectedCaisse] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('ALL');

  const filteredLogs = controlLogs.filter((log) => {
    const matchTicket = log.ticketNumero.toLowerCase().includes(searchTicket.trim().toLowerCase());
    const matchVigile = selectedVigile === 'ALL' || log.vigileId === selectedVigile;
    const matchGate = selectedGate === 'ALL' || log.sortieNom === selectedGate;
    const matchCaisse = selectedCaisse === 'ALL' || log.caisseNumero === selectedCaisse;
    const matchDate = selectedDate === 'ALL' || log.date === selectedDate;
    return matchTicket && matchVigile && matchGate && matchCaisse && matchDate;
  });

  const exportCSV = () => {
    const headers = ['ID_LOG', 'NUMERO_TICKET', 'CAISSE', 'STATUT', 'DATE', 'HEURE', 'POSTE_SORTIE', 'ID_VIGILE', 'NOM_VIGILE', 'MONTANT_FCFA'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.ticketNumero,
      l.caisseNumero,
      l.statut,
      l.date,
      l.heure,
      l.sortieNom,
      l.vigileId,
      l.vigileNom,
      l.montantFCFA || 0
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `smart_exit_historique_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            Traçabilité & Contrôle d'Accès
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Historique des Contrôles de Sortie
          </h1>
          <p className="text-sm text-slate-400">
            Recherche exhaustive par ticket, date, caisse, vigile et porte de sortie.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700"
        >
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Filter Bar (Section 13) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Ticket search */}
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Numéro de Ticket
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTicket}
              onChange={(e) => setSearchTicket(e.target.value)}
              placeholder="Ex: 458721"
              className="w-full bg-slate-850 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Vigile Filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Vigile
          </label>
          <select
            value={selectedVigile}
            onChange={(e) => setSelectedVigile(e.target.value)}
            className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">Tous les vigiles</option>
            {vigiles.map(v => (
              <option key={v.id} value={v.id}>
                {v.id} - {v.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Sortie Filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Poste de Sortie
          </label>
          <select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">Toutes les sorties</option>
            {gates.map(g => (
              <option key={g.id} value={g.nom}>
                {g.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Caisse Filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Caisse d'Origine
          </label>
          <select
            value={selectedCaisse}
            onChange={(e) => setSelectedCaisse(e.target.value)}
            className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">Toutes les caisses</option>
            {['01', '02', '03', '04', '05', '06', '07', '08'].map(c => (
              <option key={c} value={c}>Caisse {c}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">Toutes dates</option>
            <option value="2026-09-09">Aujourd'hui (09/09/2026)</option>
          </select>
        </div>
      </div>

      {/* History Feed List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
        <div className="p-3.5 bg-slate-850/60 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Résultats ({filteredLogs.length} contrôles enregistrés)</span>
          <span>Horodatage officiel SMART EXIT</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            Aucun enregistrement ne correspond à vos filtres de recherche.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className="p-4 hover:bg-slate-850/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono font-extrabold text-sm text-white">
                    {log.ticketNumero}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {log.date}
                  </span>
                  <span className="font-semibold text-slate-300">
                    CAISSE {log.caisseNumero}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    PAYÉ
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    SORTIE VALIDÉE
                  </span>
                </div>

                {log.montantFCFA && (
                  <div className="text-slate-400 text-[11px]">
                    Montant de la commande : <strong className="text-white font-mono">{log.montantFCFA.toLocaleString()} FCFA</strong>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-slate-300 font-mono text-xs shrink-0">
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-white font-bold">{log.heure}</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{log.sortieNom}</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-bold text-white">{log.vigileId}</span>
                  <span className="text-slate-400">({log.vigileNom})</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
