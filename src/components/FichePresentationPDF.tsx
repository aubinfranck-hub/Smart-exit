import React, { useState } from 'react';
import { 
  Printer, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Building2, 
  Store, 
  Users, 
  Clock, 
  Smartphone, 
  FileText, 
  HelpCircle,
  Eye,
  Download,
  Calendar,
  Mail,
  MapPin,
  Check,
  X
} from 'lucide-react';
import { useSmartExit } from '../context/SmartExitContext';

export const FichePresentationPDF: React.FC = () => {
  const { todayStats } = useSmartExit();
  const [selectedClient, setSelectedClient] = useState<string>('Supermarché Pilote Abidjan');
  const [documentMode, setDocumentMode] = useState<'SYNTHESE' | 'COMPLET'>('SYNTHESE');
  const [previewTheme, setPreviewTheme] = useState<'LIGHT' | 'DARK'>('LIGHT');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Action & Configuration Bar (Hidden in Print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            Support Commercial & Présentation Direction
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Fiche de Présentation Officielle (Format Imprimable & PDF)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dossier de présentation complet prêt à être imprimé ou enregistré en PDF pour vos rendez-vous de négociation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Client Target Customizer */}
          <div className="relative">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Supermarché Pilote Abidjan">Cible : Supermarché Pilote</option>
              <option value="Groupe Prosuma (Prima, Hayat, Cap Sud)">Cible : Groupe Prosuma</option>
              <option value="Carrefour Côte d'Ivoire (Playce Marcory / Palmeraie)">Cible : Carrefour / CFAO Retail</option>
              <option value="CDCI Supermarché">Cible : CDCI</option>
              <option value="Sococé Abidjan">Cible : Sococé</option>
              <option value="Direction Générale du Magasin">Cible : Direction Générale</option>
            </select>
          </div>

          {/* Document Mode Toggle */}
          <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setDocumentMode('SYNTHESE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                documentMode === 'SYNTHESE'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Synthèse (2 pages)
            </button>
            <button
              onClick={() => setDocumentMode('COMPLET')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                documentMode === 'COMPLET'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dossier Complet
            </button>
          </div>

          {/* Theme preview toggle */}
          <button
            onClick={() => setPreviewTheme(previewTheme === 'LIGHT' ? 'DARK' : 'LIGHT')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            title="Basculer le style de prévisualisation à l'écran"
          >
            <Eye className="w-3.5 h-3.5" />
            {previewTheme === 'LIGHT' ? 'Aperçu Papier Blanc' : 'Aperçu Sombre'}
          </button>

          {/* Primary Action Button: Print / Save to PDF */}
          <button
            onClick={handlePrint}
            id="print-pdf-presentation-btn"
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            TÉLÉCHARGER / IMPRIMER PDF
          </button>
        </div>
      </div>

      {/* Helper notice for PDF export */}
      <div className="no-print bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center gap-2.5">
        <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Astuce pour créer un fichier PDF :</strong> Cliquez sur le bouton vert ci-dessus, puis dans la fenêtre d'impression de votre navigateur, choisissez la destination <em>« Enregistrer au format PDF »</em>. La mise en page A4 et les en-têtes sont automatiquement appliqués.
        </span>
      </div>

      {/* ========================================================================= */}
      {/* THE PRINTABLE SHEET CONTAINER                                            */}
      {/* ========================================================================= */}
      <div 
        id="pdf-presentation-sheet" 
        className={`rounded-3xl shadow-2xl transition-colors duration-200 overflow-hidden ${
          previewTheme === 'LIGHT' 
            ? 'bg-white text-slate-900 border border-slate-300' 
            : 'bg-slate-900 text-slate-100 border border-slate-800'
        }`}
      >
        {/* PAGE 1: EN-TÊTE & CONTEXTE & SOLUTION */}
        <div className="p-8 sm:p-12 border-b border-slate-200 dark:border-slate-800 relative">
          {/* Header Cartouche */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-600/30">
                  <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      SMART EXIT
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 text-[11px] font-black tracking-wide border border-emerald-300 dark:border-emerald-500/30">
                      SOLUTION ABIDJAN
                    </span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Contrôle Numérique des Sorties par Ticket de Caisse
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl font-medium pt-1">
                La solution autonome d'éradication du coulage et de la réutilisation frauduleuse de tickets de caisse dans la grande distribution à Abidjan.
              </p>
            </div>

            {/* Document metadata block */}
            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 w-full sm:w-72 shrink-0">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <span>DOCUMENT OFFICIEL</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">PITCH-2026-V1</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 pt-1">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold truncate">{selectedClient}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Abidjan, Côte d'Ivoire</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Septembre 2026 • Projet Pilote</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[11px]">aubinfranck@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Section 1: Le Problème Réel en Magasin */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              1. Le Constat & La Vulnérabilité Actuelle des Sorties
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Pourquoi le marquage manuel au stylo ou au tampon ne protège plus vos marges
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Dans la grande majorité des supermarchés d'Abidjan, le contrôle en sortie repose exclusivement sur un vigile qui trace un trait au stylo à bille ou appose un coup de tampon sur le ticket de caisse papier présenté par le client. Cette pratique manuelle génère des failles majeures :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl space-y-2">
                <div className="text-xs font-black text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                  Faille N°1 : Réutilisation (Anti-Repasse)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Un complice récupère un ticket déjà validé ou ramasse un ticket jeté dans un chariot, remplit un 2e caddie de produits identiques ou de valeur équivalente, et sort sans payer. Le vigile ne peut pas mémoriser les tickets.
                </p>
              </div>

              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl space-y-2">
                <div className="text-xs font-black text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                  Faille N°2 : Zéro Preuve & Traçabilité
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Un trait de bic ne fournit aucun horodatage vérifiable, aucune identification formelle du vigile ayant contrôlé, et aucune preuve exploitable par la direction lors d'un audit de perte ou de plainte client.
                </p>
              </div>

              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl space-y-2">
                <div className="text-xs font-black text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                  Faille N°3 : Tickets Faux ou Non Soldés
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Impossible pour le vigile de distinguer à l'œil nu une impression proforma non encaissée, un ticket d'abandon de caisse ou un ticket falsifié. Le coulage demeure invisible jusqu'à l'inventaire annuel.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: La Solution SMART EXIT */}
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              2. La Solution SMART EXIT : Le Poinçonnage Numérique
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Remplacer le trait au stylo par un scan instantané sur tablette vigile
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>SMART EXIT</strong> est un système autonome déployé sur des tablettes tactiles remises aux agents de sécurité aux portes de sortie. En moins de 2 secondes, le vigile scanne le ticket client.
            </p>

            {/* Step by step workflow cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center mx-auto text-sm">
                  1
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">TICKET PRÉSENTÉ</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Le client arrive à la sortie avec son ticket imprimé.</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center mx-auto text-sm">
                  2
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">SCAN VIGILE</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Lecture optique caméra QR/Code-barres en &lt; 2 secondes.</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center mx-auto text-sm">
                  3
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">CONTRÔLE DOUBLON</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Vérification immédiate : ce ticket est-il déjà sorti ?</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center mx-auto text-sm">
                  4
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">POINÇONNAGE</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Sortie validée avec horodatage, ID vigile et porte.</div>
              </div>
            </div>
          </div>

          {/* Key Architectural Principle Banner */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 p-4 rounded-2xl flex items-start gap-3 text-xs">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="font-extrabold text-blue-900 dark:text-blue-300 text-sm">
                Atout Stratégique Majeur : Système Autonome Dédié au Contrôle
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                <strong>Le logiciel de caisse et SMART EXIT ne sont pas interconnectés en direct</strong>. Cela garantit : 
                (1) Zéro ralentissement ou blocage des caissières en ligne de caisse, 
                (2) Zéro dépendance technique ou risque informatique sur le progiciel de caisse du magasin, 
                (3) Continuité totale du contrôle même en cas de coupure réseau ou panne serveur caisse, 
                (4) Audit indépendant des flux sans conflit d'intérêt.
              </p>
            </div>
          </div>
        </div>

        {/* PAGE BREAK FOR CLEAN PRINTING */}
        <div className="page-break-after"></div>

        {/* PAGE 2: COMPARATIF, TABLEAUX DE BORD & DÉPLOIEMENT PILOTE */}
        <div className="p-8 sm:p-12 space-y-8">
          {/* Section 3: Tableau Comparatif Avant vs Après */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              <Building2 className="w-4 h-4" />
              3. Tableau Comparatif : Situation Actuelle vs SMART EXIT
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Une transformation opérationnelle radicale sans complexité technique
            </h2>

            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">Critère de Sécurité</th>
                    <th className="p-3 bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400">
                      Avant (Stylo à bille / Tampon Manuel)
                    </th>
                    <th className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400">
                      Après (SMART EXIT Numérique)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Détection des réutilisations (doubles sorties)
                    </td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <X className="w-4 h-4 shrink-0" />
                      Impossible : le vigile ne retient pas les numéros de ticket
                    </td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      Instantanée : alerte sonore et visuelle dès le 2e scan
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Traçabilité du contrôle
                    </td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <X className="w-4 h-4 shrink-0" />
                      Nulle : simple trait de bic sans horodatage
                    </td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      Totale : Date, heure précise à la seconde, porte, matricule vigile
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Temps de contrôle par client
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      3 à 6 secondes (chercher le stylo, viser le ticket, signer)
                    </td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">
                      Moins de 2 secondes (visée caméra directe)
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Dépendance & impact sur les caisses
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      Aucune dépendance
                    </td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">
                      Aucune dépendance (fonctionnement autonome sur tablette)
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Rapprochement de fin de journée
                    </td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <X className="w-4 h-4 shrink-0" />
                      Impossible : aucun registre des tickets contrôlés
                    </td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      Audit différé : comparaison tickets vendus vs tickets sortis
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Données & Reporting pour la Direction
                    </td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <X className="w-4 h-4 shrink-0" />
                      Zéro visibilité, aucune statistique
                    </td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      Dashboard complet : flux par porte, anomalies, export CSV
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Performance KPI indicators */}
            <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Taux de Contrôle Visé</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  {todayStats.tauxControle > 0 ? `${todayStats.tauxControle}%` : '> 95%'}
                </div>
                <div className="text-[10px] text-slate-400">Couverture des flux</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Vitesse par Ticket</div>
                <div className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                  &lt; 2,0 sec
                </div>
                <div className="text-[10px] text-slate-400">Fluidité de sortie</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Détection Doublons</div>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                  100%
                </div>
                <div className="text-[10px] text-slate-400">Anti-réutilisation</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Disponibilité Caisse</div>
                <div className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono mt-0.5">
                  100%
                </div>
                <div className="text-[10px] text-slate-400">Système autonome</div>
              </div>
            </div>
          </div>

          {/* Section 4: Les 3 Interfaces SMART EXIT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              <Smartphone className="w-4 h-4" />
              4. Les 3 Niveaux d'Utilisation
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Une solution adaptée à chaque profil du supermarché
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Level 1 */}
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  NIVEAU 1 : VIGILE (TABLETTE)
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Écran Tactile Haute Visibilité
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Conçu pour un usage debout en porte. Bouton unique <em>« SCANNER TICKET »</em>, retour visuel vert/rouge sans ambiguïté et bips sonores distincts adaptés à l'ambiance du magasin.
                </p>
              </div>

              {/* Level 2 */}
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  NIVEAU 2 : CHEF SÉCURITÉ
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Supervision des Anomalies
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Flux des contrôles en direct, alertes immédiates sur les tentatives de double sortie, levée de doute et historisation infalsifiable des incidents pour rapport de police ou direction.
                </p>
              </div>

              {/* Level 3 */}
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                  NIVEAU 3 : DIRECTION & AUDIT
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Rapprochement & Décision
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Confrontation des ventes de caisse avec les sorties réelles contrôlées. Suivi du chiffre d'affaires sécurisé (en FCFA), du taux de contrôle et de la performance des vigiles par porte.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Modalités du Projet Pilote (Abidjan) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              <Clock className="w-4 h-4" />
              5. Proposition de Déploiement Pilote (14 Jours)
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Une mise en service immédiate sans investissement lourd
            </h2>

            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-500/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Matériel Requis</div>
                <div className="text-slate-600 dark:text-slate-400">
                  1 à 2 tablettes Android standard (ou smartphones dédiés avec support) par porte de sortie.
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Durée du Test</div>
                <div className="text-slate-600 dark:text-slate-400">
                  14 jours sur vos 2 portes les plus fréquentées pour mesurer le taux d'interception.
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Formation Vigiles</div>
                <div className="text-slate-600 dark:text-slate-400">
                  Moins de 15 minutes par agent de sécurité. Interface intuitive sans saisie complexe.
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Impact Informatique</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                  ZÉRO modification sur votre logiciel de caisse actuel.
                </div>
              </div>
            </div>
          </div>

          {/* Document Sign-off / Contact Footer */}
          <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                SMART EXIT • Contrôle Numérique des Sorties
              </div>
              <div>Projet d'innovation anti-coulage pour la grande distribution à Abidjan</div>
            </div>

            <div className="text-left sm:text-right font-mono text-[11px] space-y-0.5">
              <div>Contact Projet : <strong>Aubin Franck</strong></div>
              <div>Email : <span className="text-blue-600 dark:text-blue-400">aubinfranck@gmail.com</span></div>
              <div>Abidjan, Côte d'Ivoire • Septembre 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
