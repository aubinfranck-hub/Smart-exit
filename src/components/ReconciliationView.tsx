import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Search, 
  ArrowRight, 
  Plus, 
  FileSpreadsheet, 
  Clock, 
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import { useSmartExit } from '../context/SmartExitContext';
import { CashTransaction } from '../types';

export const ReconciliationView: React.FC = () => {
  const { 
    transactions, 
    controlLogs, 
    todayStats, 
    addNewTransaction,
    processTicketScan,
    setIsCameraModalOpen
  } = useSmartExit();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaisse, setSelectedCaisse] = useState<string>('ALL');
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // New simulated transaction form
  const [newTicketNum, setNewTicketNum] = useState(`458${Math.floor(730 + Math.random() * 200)}`);
  const [newCaisse, setNewCaisse] = useState('04');
  const [newAmount, setNewAmount] = useState('45000');
  const [newArticles, setNewArticles] = useState('6');

  // Identify which transactions are controlled vs pending
  const controlledTicketNumbers = new Set(
    controlLogs
      .filter(l => l.statut === 'SORTIE_VALIDEE')
      .map(l => l.ticketNumero)
  );

  const pendingTransactions = transactions.filter(
    tx => tx.statutPaiement === 'PAID' && !controlledTicketNumbers.has(tx.ticketNumero)
  );

  const controlledTransactions = transactions.filter(
    tx => tx.statutPaiement === 'PAID' && controlledTicketNumbers.has(tx.ticketNumero)
  );

  const filteredPending = pendingTransactions.filter(tx => {
    const matchesSearch = tx.ticketNumero.includes(searchTerm) || tx.caisseNumero.includes(searchTerm);
    const matchesCaisse = selectedCaisse === 'ALL' || tx.caisseNumero === selectedCaisse;
    return matchesSearch && matchesCaisse;
  });

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const createdTx: CashTransaction = {
      ticketNumero: newTicketNum,
      caisseNumero: newCaisse,
      caissierId: `CS-${newCaisse}`,
      date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      heure: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
      montantTotal: parseInt(newAmount) || 25000,
      nombreArticles: parseInt(newArticles) || 4,
      statutPaiement: 'PAID',
      modePaiement: 'ORANGE_MONEY',
      codeBarre: `${newTicketNum}${newCaisse}0909`,
      qrPayload: `SMARTEXIT:TK=${newTicketNum}:CS=${newCaisse}:DT=2026-09-09T18:50:00:MT=${newAmount}`,
    };
    addNewTransaction(createdTx);
    setIsSimulateModalOpen(false);
    setNewTicketNum(`458${Math.floor(730 + Math.random() * 200)}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            Audit & Contrôle Différé
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Rapprochement Caisse & Contrôle des Sorties
          </h1>
          <p className="text-sm text-slate-400">
            Confrontation entre les ventes déclarées par le logiciel de caisse et les tickets physiquement contrôlés aux portes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            Simuler Ticket Caisse
          </button>
        </div>
      </div>

      {/* Notice : Architecture Non-interconnectée */}
      <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4.5 flex items-start gap-3.5 text-xs text-slate-300">
        <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
          <Scale className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <span>Systèmes Non Interconnectés en Direct • Fonctionnement pour Contrôle</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono">
              MODE AUDIT DIFFÉRÉ
            </span>
          </div>
          <p className="leading-relaxed text-slate-300">
            Le logiciel de caisse et le système <strong>SMART EXIT</strong> sont <strong>volontairement non interconnectés</strong> :
            les tablettes vigiles aux sorties fonctionnent en autonomie totale pour contrôler les tickets physiques et interdire immédiatement toute réutilisation frauduleuse (anti-repasse).
            Le rapprochement ci-dessous est un <strong>outil d'audit</strong> qui confronte les données de caisse (import journalier CSV/Excel ou saisie Z) aux sorties enregistrées par les vigiles.
          </p>
        </div>
      </div>

      {/* The Core Mathematical Model (Section 14) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Équation de Contrôle Quotidien (Magasin Abidjan)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Box 1: Caisse */}
          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 text-center">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Logiciel de Caisse
            </div>
            <div className="text-sm font-semibold text-slate-300 mt-1">Transactions Payées</div>
            <div className="text-3xl sm:text-4xl font-black text-white my-2 font-mono">
              {todayStats.directionPayes.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">Tickets enregistrés avec encaissement</div>
          </div>

          {/* Box 2: SMART EXIT */}
          <div className="bg-slate-850 border border-emerald-500/30 rounded-2xl p-5 text-center relative">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              SMART EXIT
            </div>
            <div className="text-sm font-semibold text-slate-300 mt-1">Sorties Contrôlées</div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 my-2 font-mono">
              {todayStats.directionControlees.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400/90 font-medium">
              Taux de contrôle : {todayStats.tauxControle}%
            </div>
          </div>

          {/* Box 3: Difference -> À Analyser */}
          <div className="bg-slate-850 border border-amber-500/40 rounded-2xl p-5 text-center relative">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Différence
            </div>
            <div className="text-sm font-semibold text-amber-300 mt-1">🟠 À Analyser</div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 my-2 font-mono">
              {todayStats.directionAControler.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">Transactions en attente ou écart</div>
          </div>
        </div>

        {/* Business Context explanation from user prompt */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">
              Note méthodologique du rapprochement supermarché :
            </p>
            <p>
              Une transaction payée mais non encore contrôlée à la sortie ne signifie pas nécessairement une fraude. 
              Elle correspond principalement à : 
              (1) des clients encore dans la galerie marchande ou au rayon frais, 
              (2) un passage avec chariot volumineux orienté vers la sortie marchandises, ou 
              (3) un ticket émis il y a moins de 15 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown: Transactions en attente de sortie */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Transactions Payées en Attente de Contrôle Sortie ({pendingTransactions.length})
            </h2>
            <p className="text-xs text-slate-400">
              Tickets payés en caisse non encore scannés aux portes 1, 2 ou 3.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher ticket ou caisse..."
                className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={selectedCaisse}
              onChange={(e) => setSelectedCaisse(e.target.value)}
              aria-label="Filtrer par numéro de caisse"
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">Toutes caisses</option>
              <option value="01">Caisse 01</option>
              <option value="02">Caisse 02</option>
              <option value="03">Caisse 03</option>
              <option value="04">Caisse 04</option>
              <option value="05">Caisse 05</option>
              <option value="06">Caisse 06</option>
              <option value="07">Caisse 07</option>
              <option value="08">Caisse 08</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Caisse</th>
                  <th className="py-3 px-4">Heure Paiement</th>
                  <th className="py-3 px-4">Articles</th>
                  <th className="py-3 px-4">Montant</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Statut Sortie</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredPending.map((tx) => (
                  <tr key={tx.ticketNumero} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {tx.ticketNumero}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      Caisse {tx.caisseNumero}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {tx.heure}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {tx.nombreArticles}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                      {tx.montantTotal.toLocaleString()} FCFA
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {tx.modePaiement}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                        En magasin / Non sorti
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          processTicketScan(tx.ticketNumero);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-[11px] font-semibold rounded-lg transition-colors"
                      >
                        Tester Contrôle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Simulated POS sync modal */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">
                Simuler une nouvelle vente en caisse
              </h3>
              <button
                onClick={() => setIsSimulateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Cette action simule l'émission d'un ticket payé par le logiciel de caisse du supermarché. 
              Le ticket sera immédiatement disponible pour scan à la sortie.
            </p>

            <form onSubmit={handleCreateTx} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Numéro Ticket
                </label>
                <input
                  type="text"
                  required
                  value={newTicketNum}
                  onChange={(e) => setNewTicketNum(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Caisse
                  </label>
                  <select
                    value={newCaisse}
                    onChange={(e) => setNewCaisse(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  >
                    <option value="01">Caisse 01</option>
                    <option value="02">Caisse 02</option>
                    <option value="03">Caisse 03</option>
                    <option value="04">Caisse 04</option>
                    <option value="08">Caisse 08</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Articles
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newArticles}
                    onChange={(e) => setNewArticles(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Montant (FCFA)
                </label>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSimulateModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Émettre Ticket Caisse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
