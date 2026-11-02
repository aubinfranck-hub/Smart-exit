import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Send, ShieldAlert, Check } from 'lucide-react';
import { AnomalyType } from '../types';
import { useSmartExit } from '../context/SmartExitContext';

const QUICK_OBSERVATIONS: Record<AnomalyType, string[]> = {
  TICKET_ALREADY_CONTROLLED: [
    'Client affirme être sorti fumer puis revenu dans le magasin',
    'Tentative de sortie par un tiers avec le même ticket',
    'Client muni de 2 caddies distincts pour un seul ticket',
  ],
  TICKET_UNKNOWN: [
    'Numéro de ticket absent de la base caisse',
    'Ticket suspect / papier différent du rouleau magasin',
    'Client déclare avoir acheté dans un autre magasin',
  ],
  PAYMENT_NOT_VALIDATED: [
    'Client demande vérification caisse',
    'Paiement carte bancaire / Wave interrompu en caisse',
    'Ticket de proforma ou devis présenté comme ticket payé',
  ],
  TICKET_UNREADABLE: [
    'Ticket froissé, encre thermique effacée',
    'Code-barres déchiré ou taché',
    'Client en attente de duplicata caisse',
  ],
  OTHER: [
    'Comportement suspect à la sortie',
    'Refus de contrôle initial par le client',
    'Problème de réseau sur la tablette',
  ],
};

const ANOMALY_TYPE_LABELS: Record<AnomalyType, { label: string; desc: string }> = {
  TICKET_ALREADY_CONTROLLED: {
    label: 'Ticket déjà contrôlé',
    desc: 'Ce ticket a déjà été validé à une autre heure ou sortie',
  },
  TICKET_UNKNOWN: {
    label: 'Ticket inconnu',
    desc: 'Aucune transaction ne correspond à ce numéro',
  },
  PAYMENT_NOT_VALIDATED: {
    label: 'Paiement non validé',
    desc: 'La caisse indique transaction impayée ou annulée',
  },
  TICKET_UNREADABLE: {
    label: 'Ticket illisible',
    desc: 'Code-barres / QR abîmé ou encre thermique absente',
  },
  OTHER: {
    label: 'Autre problème',
    desc: 'Incident spécifique ou observation particulière',
  },
};

export const AnomalyReportModal: React.FC = () => {
  const { 
    isAnomalyModalOpen, 
    setIsAnomalyModalOpen, 
    anomalyModalInitialType, 
    anomalyModalTicketNumber,
    activeGate,
    activeVigile,
    submitAnomaly
  } = useSmartExit();

  const [selectedType, setSelectedType] = useState<AnomalyType>('OTHER');
  const [observation, setObservation] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (anomalyModalInitialType) {
      setSelectedType(anomalyModalInitialType);
    }
    if (anomalyModalTicketNumber) {
      setTicketNumber(anomalyModalTicketNumber);
    } else {
      setTicketNumber('');
    }
    setObservation('');
    setIsSubmitted(false);
  }, [anomalyModalInitialType, anomalyModalTicketNumber, isAnomalyModalOpen]);

  if (!isAnomalyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAnomaly(selectedType, observation, ticketNumber);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 1200);
  };

  return (
    <div 
      id="anomaly-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md"
    >
      <div 
        id="anomaly-modal-card"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-850 border-b border-slate-700/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Signaler une Anomalie</h3>
              <p className="text-xs text-slate-400">
                {activeGate.nom} • Vigile {activeVigile.nom}
              </p>
            </div>
          </div>
          <button
            id="close-anomaly-modal-btn"
            onClick={() => setIsAnomalyModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Ticket Number Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Numéro de Ticket
            </label>
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="Ex: 458721"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Type of anomaly */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Motif du signalement
            </label>
            <div className="space-y-1.5">
              {(Object.keys(ANOMALY_TYPE_LABELS) as AnomalyType[]).map((type) => {
                const isSelected = selectedType === type;
                const { label, desc } = ANOMALY_TYPE_LABELS[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 text-white'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <AlertTriangle className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                        {label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{desc}</div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Observations fréquentes (1 clic)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(QUICK_OBSERVATIONS[selectedType] || []).map((quick, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setObservation(quick)}
                  className="text-[11px] bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-lg px-2.5 py-1 text-left transition-colors"
                >
                  « {quick} »
                </button>
              ))}
            </div>
          </div>

          {/* Observation text */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Observation / Note du vigile
            </label>
            <textarea
              rows={3}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: Client demande vérification caisse 4..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAnomalyModalOpen(false)}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 text-sm font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitted}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              {isSubmitted ? 'Enregistré !' : 'Enregistrer Anomalie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
