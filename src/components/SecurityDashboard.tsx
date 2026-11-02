import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Clock, 
  FileText, 
  Check, 
  Eye, 
  ArrowUpRight,
  ShieldCheck,
  Building2,
  RefreshCw
} from 'lucide-react';
import { useSmartExit } from '../context/SmartExitContext';
import { AnomalyReport } from '../types';

export const SecurityDashboard: React.FC = () => {
  const { todayStats, anomalies, controlLogs, resolveAnomaly } = useSmartExit();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyReport | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const filteredAnomalies = anomalies.filter(a => {
    if (filterType === 'ALL') return true;
    if (filterType === 'PENDING') return a.statutTraitement === 'EN_ATTENTE' || a.statutTraitement === 'EN_COURS';
    if (filterType === 'RESOLVED') return a.statutTraitement === 'RESOLU';
    return a.type === filterType;
  });

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnomaly) return;
    resolveAnomaly(selectedAnomaly.id, resolutionNote);
    setSelectedAnomaly(null);
    setResolutionNote('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Poste Central de Contrôle • Supermarché Abidjan
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Dashboard Responsable Sécurité
          </h1>
          <p className="text-sm text-slate-400">
            Surveillance en temps réel des contrôles de sortie et gestion des incidents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Direct Flux Sorties 1, 2, 3
          </div>
        </div>
      </div>

      {/* KPI Cards (Exact Section 12 Specification) */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Aujourd'hui — Indicateurs Clés
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {/* Tickets payés */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-medium text-slate-400">Tickets payés</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
              {todayStats.ticketsPayesTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Émis par les caisses</div>
          </div>

          {/* Sorties contrôlées */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-medium text-slate-400">Sorties contrôlées</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">
              {todayStats.sortiesControleesTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1">Validées par vigiles</div>
          </div>

          {/* Anomalies */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-medium text-amber-400">Anomalies totales</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-mono">
              {todayStats.anomaliesTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Signalées ce jour</div>
          </div>

          {/* Tickets déjà contrôlés */}
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-medium text-rose-400">Tickets déjà contrôlés</div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-1 font-mono">
              {todayStats.ticketsDejaControles}
            </div>
            <div className="text-[11px] text-rose-400/80 mt-1">Tentatives réutilisation</div>
          </div>

          {/* Tickets inconnus */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-4 shadow-sm col-span-2 md:col-span-1">
            <div className="text-xs font-medium text-purple-400">Tickets inconnus</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1 font-mono">
              {todayStats.ticketsInconnus}
            </div>
            <div className="text-[11px] text-purple-400/80 mt-1">Sans référence caisse</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Anomalies table & Realtime Exit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Anomalies Management */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Journal des Anomalies & Incidents</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                {anomalies.length}
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: 'Tous' },
                { id: 'PENDING', label: 'En attente' },
                { id: 'TICKET_ALREADY_CONTROLLED', label: 'Déjà sortis' },
                { id: 'TICKET_UNKNOWN', label: 'Inconnus' },
                { id: 'RESOLVED', label: 'Résolus' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    filterType === f.id
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Anomalies List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
            {filteredAnomalies.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Aucune anomalie correspondant au filtre.
              </div>
            ) : (
              filteredAnomalies.map((item) => {
                const isResolved = item.statutTraitement === 'RESOLU';
                return (
                  <div 
                    key={item.id} 
                    className={`p-4 hover:bg-slate-850/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                      isResolved ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-white">
                          Ticket {item.ticketNumero}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          item.type === 'TICKET_ALREADY_CONTROLLED' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : item.type === 'TICKET_UNKNOWN'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : item.type === 'PAYMENT_NOT_VALIDATED'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {item.type === 'TICKET_ALREADY_CONTROLLED' && 'Déjà contrôlé'}
                          {item.type === 'TICKET_UNKNOWN' && 'Inconnu'}
                          {item.type === 'PAYMENT_NOT_VALIDATED' && 'Non Payé'}
                          {item.type === 'TICKET_UNREADABLE' && 'Illisible'}
                          {item.type === 'OTHER' && 'Autre'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {item.date} {item.heure}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          • {item.sortieNom} • Vigile {item.vigileNom}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 bg-slate-850 p-2.5 rounded-xl border border-slate-800">
                        « {item.observation} »
                      </p>

                      {isResolved && item.noteResolution && (
                        <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                          <Check className="w-3.5 h-3.5" />
                          Résolu par {item.resoluPar} : {item.noteResolution}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex sm:flex-col items-end justify-between gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        isResolved
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {isResolved ? 'Résolu' : 'En attente'}
                      </span>

                      {!isResolved && (
                        <button
                          onClick={() => setSelectedAnomaly(item)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                        >
                          Traiter
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Live Validated Exits Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Dernières Sorties</h2>
            </div>
            <span className="text-xs text-slate-400">Temps Réel</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 divide-y divide-slate-800/80 max-h-[540px] overflow-y-auto space-y-2">
            {controlLogs.map((log) => (
              <div key={log.id} className="pt-2 first:pt-0 text-xs">
                <div className="flex justify-between items-center font-mono font-bold text-slate-200">
                  <span>Ticket {log.ticketNumero}</span>
                  <span className="text-emerald-400">✓ {log.statut}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 mt-1 text-[11px]">
                  <span>{log.sortieNom} • {log.vigileNom}</span>
                  <span className="font-mono">{log.heure}</span>
                </div>
                {log.montantFCFA && (
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Montant : {log.montantFCFA.toLocaleString()} FCFA (Caisse {log.caisseNumero})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anomaly Resolution Modal */}
      {selectedAnomaly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">
                Clôturer l'anomalie — Ticket {selectedAnomaly.ticketNumero}
              </h3>
              <button
                onClick={() => setSelectedAnomaly(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-850 rounded-xl text-xs text-slate-300">
              <p><strong>Observation vigile :</strong> {selectedAnomaly.observation}</p>
              <p className="mt-1 text-slate-400">Signalé à {selectedAnomaly.sortieNom} par {selectedAnomaly.vigileNom}</p>
            </div>

            <form onSubmit={handleResolve} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Décision du Responsable Sécurité
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Ex: Client redirigé vers caisse, paiement régularisé ou marchandise retenue..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAnomaly(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Valider la résolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
