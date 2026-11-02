export type TicketStatus = 'PAID' | 'UNPAID' | 'REFUNDED';

export type ExitStatus = 'PENDING' | 'VALIDATED' | 'BLOCKED_ALREADY_CONTROLLED' | 'BLOCKED_UNPAID' | 'BLOCKED_UNKNOWN';

export type AnomalyType = 
  | 'TICKET_ALREADY_CONTROLLED'
  | 'TICKET_UNKNOWN'
  | 'PAYMENT_NOT_VALIDATED'
  | 'TICKET_UNREADABLE'
  | 'OTHER';

export interface Vigile {
  id: string; // e.g. 'VIG-001'
  nom: string; // e.g. 'KOUASSI'
  prenom?: string;
  telephone?: string;
  actif: boolean;
}

export interface ExitGate {
  id: string; // e.g. 'SORTIE-1'
  nom: string; // e.g. 'SORTIE 1'
  magasin: string; // e.g. 'MAGASIN ABIDJAN'
  localisation: string; // e.g. 'Rez-de-chaussée Ouest'
}

export interface TicketItem {
  id: string;
  nom: string;
  quantite: number;
  prixUnitaire: number;
}

export interface CashTransaction {
  ticketNumero: string; // e.g. '458721'
  caisseNumero: string; // e.g. '08'
  caissierId: string;
  date: string; // YYYY-MM-DD
  heure: string; // HH:mm
  montantTotal: number; // in FCFA (e.g. 87450)
  nombreArticles: number;
  statutPaiement: TicketStatus;
  modePaiement: 'ESPECES' | 'ORANGE_MONEY' | 'WAVE' | 'CARTE_BANCAIRE' | 'MOOV_MONEY' | 'MTN_MOMO';
  codeBarre: string;
  qrPayload: string;
}

export interface ExitControlLog {
  id: string;
  ticketNumero: string;
  caisseNumero: string;
  statut: 'SORTIE_VALIDEE' | 'REFUSEE';
  date: string; // YYYY-MM-DD
  heure: string; // HH:mm:ss
  sortieId: string;
  sortieNom: string;
  vigileId: string;
  vigileNom: string;
  montantFCFA?: number;
  observation?: string;
  estPremiereSortie: boolean;
}

export interface AnomalyReport {
  id: string;
  ticketNumero: string;
  type: AnomalyType;
  date: string;
  heure: string;
  sortieNom: string;
  vigileNom: string;
  observation: string;
  statutTraitement: 'EN_ATTENTE' | 'EN_COURS' | 'RESOLU';
  resoluPar?: string;
  noteResolution?: string;
}

export interface DailySummaryStats {
  ticketsPayes: number;
  sortiesControlees: number;
  aControler: number;
  anomaliesTotales: number;
  ticketsDejaControles: number;
  ticketsInconnus: number;
  paiementsNonValides: number;
  ticketsIllisibles: number;
  tauxControle: number;
  montantTotalVentes: number;
  montantTotalControle: number;
  sortiesParPoste: Record<string, number>;
}
