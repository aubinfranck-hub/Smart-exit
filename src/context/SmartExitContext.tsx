import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Vigile, 
  ExitGate, 
  CashTransaction, 
  ExitControlLog, 
  AnomalyReport, 
  AnomalyType 
} from '../types';
import { 
  INITIAL_VIGILES, 
  INITIAL_GATES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CONTROL_LOGS, 
  INITIAL_ANOMALIES,
  BASELINE_KPI 
} from '../data/mockData';
import { soundFX } from '../utils/audio';

export type ScanVerificationState = 
  | { type: 'IDLE' }
  | { 
      type: 'AUTHORIZED'; 
      ticket: CashTransaction; 
      scannedCode: string;
    }
  | { 
      type: 'ALREADY_CONTROLLED'; 
      ticket: CashTransaction; 
      previousLog: ExitControlLog; 
      scannedCode: string;
    }
  | { 
      type: 'UNPAID'; 
      ticket: CashTransaction; 
      scannedCode: string;
    }
  | { 
      type: 'UNKNOWN'; 
      scannedCode: string; 
      rawTicketNumber: string;
    }
  | {
      type: 'EXIT_VALIDATED_SUCCESS';
      log: ExitControlLog;
    };

interface SmartExitContextType {
  vigiles: Vigile[];
  activeVigile: Vigile;
  setActiveVigile: (v: Vigile) => void;
  gates: ExitGate[];
  activeGate: ExitGate;
  setActiveGate: (g: ExitGate) => void;
  transactions: CashTransaction[];
  controlLogs: ExitControlLog[];
  anomalies: AnomalyReport[];
  scanState: ScanVerificationState;
  setScanState: React.Dispatch<React.SetStateAction<ScanVerificationState>>;
  isCameraModalOpen: boolean;
  setIsCameraModalOpen: (open: boolean) => void;
  isAnomalyModalOpen: boolean;
  setIsAnomalyModalOpen: (open: boolean) => void;
  anomalyModalInitialType?: AnomalyType;
  anomalyModalTicketNumber?: string;
  openAnomalyModal: (type?: AnomalyType, ticketNumber?: string) => void;
  
  // Actions
  processTicketScan: (rawCode: string) => ScanVerificationState;
  confirmExitValidation: () => ExitControlLog | null;
  submitAnomaly: (type: AnomalyType, observation: string, ticketNumber?: string) => AnomalyReport;
  resolveAnomaly: (anomalyId: string, note?: string) => void;
  resetScanState: () => void;
  addNewTransaction: (tx: CashTransaction) => void;
  resetDemoData: () => void;

  // Stats calculation
  todayStats: {
    controlees: number;
    anomalies: number;
    ticketsPayesTotal: number;
    sortiesControleesTotal: number;
    anomaliesTotal: number;
    ticketsDejaControles: number;
    ticketsInconnus: number;
    paiementsNonValides: number;
    aAnalyser: number;
    tauxControle: number;
    directionPayes: number;
    directionControlees: number;
    directionAControler: number;
    directionAnomalies: number;
    repartitionSorties: Record<string, number>;
  };
}

const SmartExitContext = createContext<SmartExitContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'smart_exit_abidjan_mvp_v1';

export const SmartExitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [vigiles] = useState<Vigile[]>(INITIAL_VIGILES);
  const [gates] = useState<ExitGate[]>(INITIAL_GATES);
  const [activeVigile, setActiveVigile] = useState<Vigile>(() => {
    return INITIAL_VIGILES.find(v => v.id === 'VIG-004') || INITIAL_VIGILES[0];
  });
  const [activeGate, setActiveGate] = useState<ExitGate>(() => {
    return INITIAL_GATES.find(g => g.id === 'SORTIE-2') || INITIAL_GATES[0];
  });

  const [transactions, setTransactions] = useState<CashTransaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tx`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [controlLogs, setControlLogs] = useState<ExitControlLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_CONTROL_LOGS;
  });

  const [anomalies, setAnomalies] = useState<AnomalyReport[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_anomalies`);
    return saved ? JSON.parse(saved) : INITIAL_ANOMALIES;
  });

  const [scanState, setScanState] = useState<ScanVerificationState>({ type: 'IDLE' });
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);
  const [anomalyModalInitialType, setAnomalyModalInitialType] = useState<AnomalyType | undefined>();
  const [anomalyModalTicketNumber, setAnomalyModalTicketNumber] = useState<string | undefined>();

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tx`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_logs`, JSON.stringify(controlLogs));
  }, [controlLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_anomalies`, JSON.stringify(anomalies));
  }, [anomalies]);

  // Helper to extract ticket number and optional metadata from QR code payload or raw scan
  const extractTicketInfo = (rawCode: string): {
    ticketNum: string;
    caisse?: string;
    montant?: number;
    articles?: number;
    statut?: 'PAID' | 'UNPAID';
  } => {
    const clean = rawCode.trim();
    
    // Case 1: SMARTEXIT format: SMARTEXIT:TK=458721:CS=08:DT=2026-09-09T18:42:00:MT=87450
    if (clean.includes('SMARTEXIT:') || clean.includes('TK=')) {
      const tkMatch = clean.match(/TK=([A-Za-z0-9_-]+)/i);
      const csMatch = clean.match(/CS=([0-9]{1,3})/i);
      const mtMatch = clean.match(/MT=([0-9]+)/i);
      const artMatch = clean.match(/ART=([0-9]+)/i);
      const stMatch = clean.match(/ST=([A-Z]+)/i);

      return {
        ticketNum: tkMatch ? tkMatch[1] : clean,
        caisse: csMatch ? csMatch[1].padStart(2, '0') : undefined,
        montant: mtMatch ? parseInt(mtMatch[1], 10) : undefined,
        articles: artMatch ? parseInt(artMatch[1], 10) : undefined,
        statut: stMatch && stMatch[1] === 'UNPAID' ? 'UNPAID' : 'PAID',
      };
    }

    // Case 2: TICKET N° 458721 or TICKET:458721
    const ticketMatch = clean.match(/TICKET\s*(?:N°|#|:)?\s*([0-9]{4,10})/i);
    if (ticketMatch && ticketMatch[1]) {
      return { ticketNum: ticketMatch[1] };
    }

    // Case 3: Barcode 458721080909 -> begins with ticket 458721 (6 digits) + caisse 08
    if (/^[0-9]{12}$/.test(clean)) {
      return { 
        ticketNum: clean.substring(0, 6),
        caisse: clean.substring(6, 8)
      };
    }

    // Case 4: direct digits 458721
    const numOnly = clean.replace(/[^0-9]/g, '');
    if (numOnly.length >= 4 && numOnly.length <= 10) {
      return { ticketNum: numOnly };
    }

    return { ticketNum: clean };
  };

  // Main verification logic for Autonomous Exit Control
  const processTicketScan = (rawCode: string): ScanVerificationState => {
    soundFX.beep();
    const info = extractTicketInfo(rawCode);
    const ticketNum = info.ticketNum;

    // 1. PRIORITÉ ABSOLUE : Vérification anti-réutilisation (Ticket déjà contrôlé aujourd'hui)
    // Fonctionne 100% de manière autonome dans SMART EXIT sans dépendre d'un serveur caisse
    const existingLog = controlLogs.find(
      log => log.ticketNumero.toLowerCase() === ticketNum.toLowerCase() && log.statut === 'SORTIE_VALIDEE'
    );

    if (existingLog) {
      // ⚠️ ATTENTION TICKET DÉJÀ CONTRÔLÉ (Alerte doublon / réutilisation)
      soundFX.warning();
      const existingTx = transactions.find(t => t.ticketNumero === ticketNum) || {
        ticketNumero: ticketNum,
        caisseNumero: existingLog.caisseNumero || info.caisse || '01',
        caissierId: 'CS-01',
        date: existingLog.date,
        heure: existingLog.heure,
        montantTotal: existingLog.montantFCFA || info.montant || 25000,
        nombreArticles: info.articles || 3,
        statutPaiement: 'PAID',
        modePaiement: 'ESPECES',
      };

      const state: ScanVerificationState = {
        type: 'ALREADY_CONTROLLED',
        ticket: existingTx,
        previousLog: existingLog,
        scannedCode: rawCode,
      };
      setScanState(state);
      return state;
    }

    // 2. Vérification si transaction pré-enregistrée ou statut spécifique
    const matchedTx = transactions.find(
      tx => tx.ticketNumero === ticketNum || 
            tx.codeBarre === rawCode || 
            tx.qrPayload === rawCode ||
            rawCode.includes(tx.ticketNumero)
    );

    // Test spécifique pour simulation d'anomalie 'Ticket inconnu / frauduleux' (ex: 998412)
    if (ticketNum === '998412' || (rawCode.toLowerCase().includes('inconnu') && !matchedTx)) {
      soundFX.alarm();
      const state: ScanVerificationState = {
        type: 'UNKNOWN',
        scannedCode: rawCode,
        rawTicketNumber: ticketNum || rawCode,
      };
      setScanState(state);
      return state;
    }

    // 3. Vérification du statut de paiement
    if (matchedTx && matchedTx.statutPaiement !== 'PAID') {
      // 🔴 PAIEMENT NON VALIDÉ
      soundFX.warning();
      const state: ScanVerificationState = {
        type: 'UNPAID',
        ticket: matchedTx,
        scannedCode: rawCode,
      };
      setScanState(state);
      return state;
    }

    // 4. Ticket conforme (soit trouvé dans transactions, soit extrait directement du ticket physique/QR en mode autonome)
    const validTicket: CashTransaction = matchedTx || {
      ticketNumero: ticketNum,
      caisseNumero: info.caisse || '02',
      caissierId: `CS-${info.caisse || '02'}`,
      date: new Date().toISOString().slice(0, 10),
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      montantTotal: info.montant || 35000,
      nombreArticles: info.articles || 4,
      statutPaiement: 'PAID',
      modePaiement: 'ESPECES',
    };

    // Si nouveau ticket autonome valide, on l'ajoute silencieusement à la liste locale si non présent
    if (!matchedTx) {
      setTransactions(prev => [validTicket, ...prev]);
    }

    // Screen 4: Vérification automatique & Sortie Autorisée (Première présentation)
    const state: ScanVerificationState = {
      type: 'AUTHORIZED',
      ticket: validTicket,
      scannedCode: rawCode,
    };
    setScanState(state);
    return state;
  };

  // Confirm exit validation (Section 5)
  const confirmExitValidation = (): ExitControlLog | null => {
    if (scanState.type !== 'AUTHORIZED') return null;

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const heureFormatted = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const dateFormatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    const newLog: ExitControlLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      ticketNumero: scanState.ticket.ticketNumero,
      caisseNumero: scanState.ticket.caisseNumero,
      statut: 'SORTIE_VALIDEE',
      date: dateFormatted,
      heure: heureFormatted,
      sortieId: activeGate.id,
      sortieNom: activeGate.nom,
      vigileId: activeVigile.id,
      vigileNom: activeVigile.nom,
      montantFCFA: scanState.ticket.montantTotal,
      estPremiereSortie: true,
    };

    setControlLogs(prev => [newLog, ...prev]);
    soundFX.success();

    setScanState({
      type: 'EXIT_VALIDATED_SUCCESS',
      log: newLog,
    });

    return newLog;
  };

  const openAnomalyModal = (type?: AnomalyType, ticketNumber?: string) => {
    setAnomalyModalInitialType(type);
    setAnomalyModalTicketNumber(ticketNumber);
    setIsAnomalyModalOpen(true);
  };

  // Submit anomaly report (Section 9)
  const submitAnomaly = (
    type: AnomalyType, 
    observation: string, 
    ticketNumber?: string
  ): AnomalyReport => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const heureFormatted = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const dateFormatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    const tNum = ticketNumber || (
      scanState.type === 'AUTHORIZED' || scanState.type === 'ALREADY_CONTROLLED' || scanState.type === 'UNPAID'
        ? scanState.ticket.ticketNumero
        : scanState.type === 'UNKNOWN'
        ? scanState.rawTicketNumber
        : 'INCONNU'
    );

    const newAnomaly: AnomalyReport = {
      id: `ANO-${Date.now().toString().slice(-4)}`,
      ticketNumero: tNum,
      type,
      date: dateFormatted,
      heure: heureFormatted,
      sortieNom: activeGate.nom,
      vigileNom: activeVigile.nom,
      observation: observation.trim() || 'Signalement vigile sans commentaire.',
      statutTraitement: 'EN_ATTENTE',
    };

    setAnomalies(prev => [newAnomaly, ...prev]);
    setIsAnomalyModalOpen(false);
    setScanState({ type: 'IDLE' });
    return newAnomaly;
  };

  const resolveAnomaly = (anomalyId: string, note?: string) => {
    setAnomalies(prev => prev.map(a => {
      if (a.id === anomalyId) {
        return {
          ...a,
          statutTraitement: 'RESOLU',
          resoluPar: 'Chef Sécurité',
          noteResolution: note || 'Anomalie vérifiée et clôturée.',
        };
      }
      return a;
    }));
  };

  const resetScanState = () => {
    setScanState({ type: 'IDLE' });
  };

  const addNewTransaction = (tx: CashTransaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const resetDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setControlLogs(INITIAL_CONTROL_LOGS);
    setAnomalies(INITIAL_ANOMALIES);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_tx`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_logs`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_anomalies`);
    setScanState({ type: 'IDLE' });
  };

  // Dynamic calculated stats merging baseline + active session increments
  const extraControlees = controlLogs.length - INITIAL_CONTROL_LOGS.length;
  const extraAnomalies = anomalies.length - INITIAL_ANOMALIES.length;

  const todayStats = {
    // Tablet local metrics (Section 2: Contrôlés: 1 248, Anomalies: 7)
    controlees: 1248 + Math.max(0, extraControlees),
    anomalies: 7 + Math.max(0, extraAnomalies),

    // Responsable Sécurité metrics (Section 12)
    ticketsPayesTotal: BASELINE_KPI.ticketsPayesTotal + (transactions.length - INITIAL_TRANSACTIONS.length),
    sortiesControleesTotal: BASELINE_KPI.sortiesControleesTotal + Math.max(0, extraControlees),
    anomaliesTotal: BASELINE_KPI.anomaliesTotal + Math.max(0, extraAnomalies),
    ticketsDejaControles: BASELINE_KPI.ticketsDejaControles + anomalies.filter(a => a.type === 'TICKET_ALREADY_CONTROLLED' && !INITIAL_ANOMALIES.find(i => i.id === a.id)).length,
    ticketsInconnus: BASELINE_KPI.ticketsInconnus + anomalies.filter(a => a.type === 'TICKET_UNKNOWN' && !INITIAL_ANOMALIES.find(i => i.id === a.id)).length,
    paiementsNonValides: BASELINE_KPI.paiementsNonValides + anomalies.filter(a => a.type === 'PAYMENT_NOT_VALIDATED' && !INITIAL_ANOMALIES.find(i => i.id === a.id)).length,

    // Rapprochement & Direction metrics (Section 14 & 15)
    directionPayes: BASELINE_KPI.directionPayes + (transactions.length - INITIAL_TRANSACTIONS.length),
    directionControlees: BASELINE_KPI.directionControlees + Math.max(0, extraControlees),
    directionAControler: Math.max(0, (BASELINE_KPI.directionPayes + (transactions.length - INITIAL_TRANSACTIONS.length)) - (BASELINE_KPI.directionControlees + Math.max(0, extraControlees))),
    directionAnomalies: BASELINE_KPI.directionAnomalies + Math.max(0, extraAnomalies),
    aAnalyser: Math.max(0, (BASELINE_KPI.directionPayes + (transactions.length - INITIAL_TRANSACTIONS.length)) - (BASELINE_KPI.directionControlees + Math.max(0, extraControlees))),
    tauxControle: Math.round(((BASELINE_KPI.directionControlees + Math.max(0, extraControlees)) / (BASELINE_KPI.directionPayes + (transactions.length - INITIAL_TRANSACTIONS.length))) * 1000) / 10,
    repartitionSorties: {
      'SORTIE 1': BASELINE_KPI.sortiesRepartition['SORTIE 1'] + controlLogs.filter(l => l.sortieNom === 'SORTIE 1' && !INITIAL_CONTROL_LOGS.find(i => i.id === l.id)).length,
      'SORTIE 2': BASELINE_KPI.sortiesRepartition['SORTIE 2'] + controlLogs.filter(l => l.sortieNom === 'SORTIE 2' && !INITIAL_CONTROL_LOGS.find(i => i.id === l.id)).length,
      'SORTIE 3': BASELINE_KPI.sortiesRepartition['SORTIE 3'] + controlLogs.filter(l => l.sortieNom === 'SORTIE 3' && !INITIAL_CONTROL_LOGS.find(i => i.id === l.id)).length,
    }
  };

  return (
    <SmartExitContext.Provider
      value={{
        vigiles,
        activeVigile,
        setActiveVigile,
        gates,
        activeGate,
        setActiveGate,
        transactions,
        controlLogs,
        anomalies,
        scanState,
        setScanState,
        isCameraModalOpen,
        setIsCameraModalOpen,
        isAnomalyModalOpen,
        setIsAnomalyModalOpen,
        anomalyModalInitialType,
        anomalyModalTicketNumber,
        openAnomalyModal,
        processTicketScan,
        confirmExitValidation,
        submitAnomaly,
        resolveAnomaly,
        resetScanState,
        addNewTransaction,
        resetDemoData,
        todayStats,
      }}
    >
      {children}
    </SmartExitContext.Provider>
  );
};

export const useSmartExit = () => {
  const context = useContext(SmartExitContext);
  if (!context) {
    throw new Error('useSmartExit must be used within a SmartExitProvider');
  }
  return context;
};
