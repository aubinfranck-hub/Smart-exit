import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Layers, 
  Check, 
  Award,
  ArrowRight
} from 'lucide-react';
import { useSmartExit } from '../context/SmartExitContext';

export const DirectionDashboard: React.FC = () => {
  const { todayStats } = useSmartExit();

  const totalSorties = 
    (todayStats.repartitionSorties['SORTIE 1'] || 0) +
    (todayStats.repartitionSorties['SORTIE 2'] || 0) +
    (todayStats.repartitionSorties['SORTIE 3'] || 0);

  const pct1 = totalSorties > 0 ? Math.round(((todayStats.repartitionSorties['SORTIE 1'] || 0) / totalSorties) * 100) : 33;
  const pct2 = totalSorties > 0 ? Math.round(((todayStats.repartitionSorties['SORTIE 2'] || 0) / totalSorties) * 100) : 35;
  const pct3 = totalSorties > 0 ? Math.round(((todayStats.repartitionSorties['SORTIE 3'] || 0) / totalSorties) * 100) : 32;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            Direction Générale & Exploitation • Abidjan
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Dashboard Stratégique Direction
          </h1>
          <p className="text-sm text-slate-400">
            Synthèse exécutive du flux magasin, performance des portes et prévention des pertes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Rapport consolidé du jour
        </div>
      </div>

      {/* Section 15 ASCII Board Replica */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center max-w-md mx-auto mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
            SMART EXIT CONSOLIDÉ
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Synthèse des Flux Magasin
          </h2>
        </div>

        {/* The 4 Major Direction KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Transactions Payées
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white mt-2 font-mono">
              {todayStats.directionPayes.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Caisse centrale</div>
          </div>

          <div className="bg-slate-850 border border-emerald-500/30 rounded-2xl p-5 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Sorties Contrôlées
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-2 font-mono">
              {todayStats.directionControlees.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1">Scannées par vigiles</div>
          </div>

          <div className="bg-slate-850 border border-amber-500/30 rounded-2xl p-5 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              À Contrôler / Écart
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 mt-2 font-mono">
              {todayStats.directionAControler.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Clients en magasin ou résiduel</div>
          </div>

          <div className="bg-slate-850 border border-rose-500/30 rounded-2xl p-5 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Anomalies
            </div>
            <div className="text-3xl sm:text-4xl font-black text-rose-400 mt-2 font-mono">
              {todayStats.directionAnomalies.toLocaleString()}
            </div>
            <div className="text-[11px] text-rose-400/80 mt-1">Tentatives détectées</div>
          </div>
        </div>

        {/* Divider & Breakdown by Exit Gate (Section 15: SORTIE 1: 3250, SORTIE 2: 3480, SORTIE 3: 3120) */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Répartition du Flux par Sortie
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total sorties : {totalSorties.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sortie 1 */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-white text-sm">SORTIE 1</div>
                  <div className="text-[11px] text-slate-400">Galerie Marchande Ouest</div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {pct1}%
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono mt-3">
                {todayStats.repartitionSorties['SORTIE 1'].toLocaleString()}
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct1}%` }}></div>
              </div>
            </div>

            {/* Sortie 2 */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-white text-sm">SORTIE 2</div>
                  <div className="text-[11px] text-slate-400">Parking Principal Est</div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {pct2}%
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono mt-3">
                {todayStats.repartitionSorties['SORTIE 2'].toLocaleString()}
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct2}%` }}></div>
              </div>
            </div>

            {/* Sortie 3 */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-white text-sm">SORTIE 3</div>
                  <div className="text-[11px] text-slate-400">Niveau 1 Express VGE</div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {pct3}%
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono mt-3">
                {todayStats.repartitionSorties['SORTIE 3'].toLocaleString()}
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct3}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Comparison (Section 20: Résumé pour la Direction) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Évaluation ROI : Situation Actuelle vs Solution SMART EXIT
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Situation Actuelle */}
          <div className="bg-slate-850/60 border border-rose-500/20 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <span>✕</span> Avant (Processus Manuel)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ticket papier → Le vigile marque au bic ou met un coup de tampon → <strong>Aucune donnée exploitable</strong>.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Impossible de savoir si un ticket est représenté 10 minutes plus tard</li>
              <li>Aucun horodatage réel ni identification fiable du vigile</li>
              <li>Faux tickets ou duplicatas indétectables à l'œil nu</li>
              <li>Zéro rapprochement possible avec le chiffre d'affaires caisse</li>
            </ul>
          </div>

          {/* Solution SMART EXIT */}
          <div className="bg-slate-850/60 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>✓</span> Après (SMART EXIT Numérique)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ticket → Scan immédiat vigile → Vérification anti-doublon → <strong>Traçabilité et Poinçonnage Numérique</strong>.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono text-[11px]">
              <li className="text-emerald-400">
                Ticket 458721 — Contrôlé Sortie 2 — 18:48 — Vigile VIG-004
              </li>
              <li>Blocage instantané de toute tentative de réutilisation (anti-repasse)</li>
              <li>Fonctionnement 100% autonome sans modifier le logiciel de caisse</li>
              <li>Possibilité d'audit et rapprochement différé des flux en fin de journée</li>
            </ul>
          </div>
        </div>

        {/* Bénéfices de l'architecture non interconnectée */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Avantages Clés : Système Autonome Dédié au Contrôle de Sortie
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
              <div className="font-bold text-white mb-1">1. Zéro Risque Caisse</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Aucune modification nécessaire sur votre logiciel d'encaissement. Les caisses continuent de tourner à 100% sans jamais être ralenties.
              </p>
            </div>

            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
              <div className="font-bold text-white mb-1">2. Résistance aux Pannes</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Même en cas de coupure de réseau caisse, les tablettes vigiles restent 100% opérationnelles aux portes pour filtrer les sorties.
              </p>
            </div>

            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
              <div className="font-bold text-white mb-1">3. Audit Indépendant</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                La sécurité dispose de son propre registre étanche, évitant tout conflit d'intérêt ou falsification entre caissiers et vigiles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
