import React from 'react';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert, 
  UserCheck, 
  MapPin, 
  RotateCcw, 
  Check, 
  ArrowRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useSmartExit } from '../context/SmartExitContext';

export const VigileScannerView: React.FC = () => {
  const {
    activeVigile,
    setActiveVigile,
    vigiles,
    activeGate,
    setActiveGate,
    gates,
    scanState,
    setIsCameraModalOpen,
    confirmExitValidation,
    resetScanState,
    openAnomalyModal,
    todayStats,
  } = useSmartExit();

  const handleValidateExit = () => {
    const log = confirmExitValidation();
    if (log) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col min-h-[calc(100vh-5rem)] justify-between py-2">
      {/* Top Tablet Bar: Poste & Vigile */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg backdrop-blur-md mb-4">
        <div className="flex items-center justify-between gap-3">
          {/* Post Selection */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Poste Actif</div>
              <div className="relative inline-block">
                <select
                  value={activeGate.id}
                  onChange={(e) => {
                    const gate = gates.find(g => g.id === e.target.value);
                    if (gate) setActiveGate(gate);
                  }}
                  aria-label="Sélectionner le poste de sortie actif"
                  className="appearance-none bg-transparent font-bold text-sm text-white pr-5 cursor-pointer focus:outline-none focus:ring-0"
                >
                  {gates.map((g) => (
                    <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                      {g.nom} • {g.magasin}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Vigile Selection */}
          <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Vigile en service</div>
              <div className="relative inline-block">
                <select
                  value={activeVigile.id}
                  onChange={(e) => {
                    const v = vigiles.find(item => item.id === e.target.value);
                    if (v) setActiveVigile(v);
                  }}
                  aria-label="Sélectionner le vigile en service"
                  className="appearance-none bg-transparent font-bold text-sm text-white pr-5 cursor-pointer focus:outline-none focus:ring-0"
                >
                  {vigiles.map((v) => (
                    <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                      {v.id} {v.nom}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Screen Content according to Scan State */}
      <div className="flex-1 flex flex-col justify-center">
        {scanState.type === 'IDLE' && (
          /* SECTION 2: ÉCRAN TABLETTE INITIAL */
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
            {/* Background subtle glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-5">
                <ShieldCheck className="w-4 h-4" />
                CONTRÔLE DE SORTIE INDÉPENDANT • ABIDJAN
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                CONTRÔLE DES TICKETS
              </h2>
              <p className="text-slate-400 text-sm mt-1.5 max-w-md mx-auto">
                Scannez le ticket client pour bloquer toute réutilisation frauduleuse et enregistrer le poinçonnage numérique.
              </p>

              {/* Huge Scan Button as shown in ASCII spec */}
              <div className="my-8">
                <button
                  id="open-camera-scan-btn"
                  onClick={() => setIsCameraModalOpen(true)}
                  className="w-full group relative py-6 sm:py-7 px-6 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.98] text-slate-950 font-black text-lg sm:text-xl shadow-xl shadow-emerald-500/25 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer border border-emerald-400/40"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-950/15 flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform">
                    <Camera className="w-9 h-9 stroke-[2.5]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📷 SCANNER TICKET</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider bg-slate-950/20 text-slate-950 px-3.5 py-1 rounded-full">
                    [ OUVRIR LA CAMÉRA ]
                  </span>
                </button>
              </div>

              {/* Direct Quick Scan Helper */}
              <div className="flex items-center justify-center gap-3 text-xs text-slate-400 mb-6">
                <span>Pas de caméra sous la main ?</span>
                <button
                  onClick={() => setIsCameraModalOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 decoration-emerald-500/50"
                >
                  Sélectionner un ticket test
                </button>
              </div>

              {/* Divider & Today Metrics (Aujourd'hui: Contrôlés / Anomalies) */}
              <div className="pt-6 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-left">
                  Aujourd'hui à ce poste
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-850/80 border border-slate-800 rounded-2xl p-4 text-left">
                    <div className="text-xs text-slate-400 font-medium">Contrôlés</div>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
                      {todayStats.controlees.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Sorties validées
                    </div>
                  </div>

                  <div className="bg-slate-850/80 border border-slate-800 rounded-2xl p-4 text-left">
                    <div className="text-xs text-slate-400 font-medium">Anomalies</div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-mono">
                      {todayStats.anomalies.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-amber-400/90 mt-1 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      Signalées
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: VÉRIFICATION AUTOMATIQUE & SORTIE AUTORISÉE */}
        {scanState.type === 'AUTHORIZED' && (
          <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 text-center relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header Ticket Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-mono text-sm font-bold mb-4">
              TICKET {scanState.ticket.ticketNumero}
            </div>

            {/* Verification Checkmarks */}
            <div className="space-y-1.5 my-3">
              <div className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                TICKET CONFORME & NON ENCORE CONTRÔLÉ
              </div>
              <div className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                PREMIÈRE PRÉSENTATION EN SORTIE
              </div>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-850/80 border border-slate-800 rounded-2xl p-4 my-5 text-left text-sm space-y-2.5 font-medium">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Montant Total :</span>
                <span className="font-extrabold text-white text-base font-mono">
                  {scanState.ticket.montantTotal.toLocaleString()} FCFA
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Articles :</span>
                <span className="text-white font-bold">{scanState.ticket.nombreArticles}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Caisse :</span>
                <span className="text-white font-bold">{scanState.ticket.caisseNumero}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Date & Heure :</span>
                <span className="text-slate-300 font-mono text-xs">
                  {scanState.ticket.date} • {scanState.ticket.heure}
                </span>
              </div>
            </div>

            {/* Prominent Status */}
            <div className="py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-lg sm:text-xl flex items-center justify-center gap-2 tracking-wide mb-6">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              🟢 SORTIE AUTORISÉE
            </div>

            {/* Validate Button as specified in Section 5 */}
            <button
              id="validate-exit-btn"
              onClick={handleValidateExit}
              className="w-full py-5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black text-lg sm:text-xl shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-300/40"
            >
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              ✅ VALIDER SORTIE
            </button>

            <div className="flex gap-2 mt-4">
              <button
                onClick={resetScanState}
                className="flex-1 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => openAnomalyModal('OTHER', scanState.ticket.ticketNumero)}
                className="flex-1 py-2.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                Signaler un doute
              </button>
            </div>
          </div>
        )}

        {/* SECTION 5: SUCCÈS VALIDATION ENREGISTRÉE */}
        {scanState.type === 'EXIT_VALIDATED_SUCCESS' && (
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 mb-4">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              SORTIE VALIDÉE
            </h3>
            <p className="text-xs text-emerald-400 font-semibold mt-1">
              Contrôle terminé et archivé avec succès
            </p>

            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4 my-5 text-left font-mono text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Ticket :</span>
                <span className="text-white font-bold">{scanState.log.ticketNumero}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Statut :</span>
                <span className="text-emerald-400 font-bold">{scanState.log.statut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date :</span>
                <span className="text-white">{scanState.log.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Heure :</span>
                <span className="text-white font-bold">{scanState.log.heure}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Poste :</span>
                <span className="text-white">{scanState.log.sortieNom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vigile :</span>
                <span className="text-white font-bold">{scanState.log.vigileId} ({scanState.log.vigileNom})</span>
              </div>
            </div>

            <button
              id="next-scan-success-btn"
              onClick={() => {
                resetScanState();
                setIsCameraModalOpen(true);
              }}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Camera className="w-5 h-5" />
              SCANNER TICKET SUIVANT
            </button>
          </div>
        )}

        {/* SECTION 6: ALERTE TICKET DÉJÀ CONTRÔLÉ (DOUBLON / FRAUDE) */}
        {scanState.type === 'ALREADY_CONTROLLED' && (
          <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-in shake duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mx-auto text-amber-400 mb-4">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">
              ⚠️ ATTENTION
            </div>
            <h3 className="text-2xl font-black text-amber-400 tracking-tight">
              TICKET DÉJÀ CONTRÔLÉ
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Ce ticket a déjà été validé à la sortie du magasin.
            </p>

            <div className="bg-slate-850 border border-amber-500/30 rounded-2xl p-4 my-5 text-left text-sm space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Ticket :</span>
                <span className="font-mono font-bold text-white text-base">
                  {scanState.ticket.ticketNumero}
                </span>
              </div>

              <div className="pt-1">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">
                  Première sortie enregistrée :
                </div>
                <div className="font-mono text-xs text-slate-300 space-y-1">
                  <div>Date & Heure : <span className="text-white font-bold">{scanState.previousLog.date} — {scanState.previousLog.heure}</span></div>
                  <div>Sortie : <span className="text-white font-bold">{scanState.previousLog.sortieNom}</span></div>
                  <div>Vigile : <span className="text-white font-bold">{scanState.previousLog.vigileId} ({scanState.previousLog.vigileNom})</span></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 mb-5 text-left font-medium">
              🔒 <strong>Sortie bloquée :</strong> Le système ne permet pas une deuxième validation normale. Signalez immédiatement cette anomalie au responsable sécurité.
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="report-already-controlled-btn"
                onClick={() => openAnomalyModal('TICKET_ALREADY_CONTROLLED', scanState.ticket.ticketNumero)}
                className="flex-1 py-4 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <ShieldAlert className="w-4 h-4" />
                [ SIGNALER L'ANOMALIE ]
              </button>
              <button
                onClick={resetScanState}
                className="py-4 px-5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-sm transition-colors"
              >
                Retour
              </button>
            </div>
          </div>
        )}

        {/* SECTION 7: TICKET INCONNU */}
        {scanState.type === 'UNKNOWN' && (
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-in shake duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto text-rose-400 mb-4">
              <XCircle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-rose-400 mb-1">
              🔴 TICKET NON RECONNU
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-rose-400">
              Aucune transaction trouvée
            </h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
              Aucune transaction correspondant à cet identifiant dans la base caisse du supermarché.
            </p>

            <div className="my-5 p-3 rounded-xl bg-slate-850 border border-slate-800 font-mono text-xs text-slate-300">
              Code scanné : <span className="text-white font-bold">{scanState.rawTicketNumber}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="unknown-scan-retry-btn"
                onClick={() => {
                  resetScanState();
                  setIsCameraModalOpen(true);
                }}
                className="flex-1 py-4 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                [ NOUVEAU SCAN ]
              </button>
              <button
                id="unknown-report-btn"
                onClick={() => openAnomalyModal('TICKET_UNKNOWN', scanState.rawTicketNumber)}
                className="flex-1 py-4 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                [ SIGNALER ]
              </button>
            </div>
          </div>
        )}

        {/* SECTION 8: TRANSACTION NON PAYÉE */}
        {scanState.type === 'UNPAID' && (
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-in shake duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto text-rose-400 mb-4">
              <XCircle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-rose-400 mb-1">
              🔴 PAIEMENT NON VALIDÉ
            </div>
            <h3 className="text-2xl font-black text-rose-400 tracking-tight">
              Ticket : {scanState.ticket.ticketNumero}
            </h3>
            <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto">
              La transaction n'est pas considérée comme réglée en caisse. Sortie non autorisée.
            </p>

            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4 my-5 text-left text-xs font-mono space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Caisse :</span>
                <span className="text-white font-bold">{scanState.ticket.caisseNumero}</span>
              </div>
              <div className="flex justify-between">
                <span>Montant réclamé :</span>
                <span className="text-rose-400 font-bold">{scanState.ticket.montantTotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Statut Caisse :</span>
                <span className="text-rose-400 font-bold uppercase">{scanState.ticket.statutPaiement} (NON RÉGLÉ)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="unpaid-ok-btn"
                onClick={resetScanState}
                className="flex-1 py-4 px-5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-sm transition-colors"
              >
                [ OK ]
              </button>
              <button
                id="unpaid-report-btn"
                onClick={() => openAnomalyModal('PAYMENT_NOT_VALIDATED', scanState.ticket.ticketNumero)}
                className="flex-1 py-4 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                [ SIGNALER CAISSE ]
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer info tablet */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1.5">
        <div>SMART EXIT • Système de Contrôle de Sortie Autonome</div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Mode Autonome Actif (Sans dépendance réseau caisse)
        </div>
      </div>
    </div>
  );
};
