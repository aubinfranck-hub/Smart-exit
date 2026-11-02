import React from 'react';
import { 
  Tablet, 
  ShieldCheck, 
  Scale, 
  Building2, 
  History, 
  Receipt, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Store,
  FileText
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useSmartExit } from '../context/SmartExitContext';

export type NavTab = 
  | 'TABLET_VIGILE'
  | 'RESPONSABLE_SECURITE'
  | 'RAPPROCHEMENT_CAISSE'
  | 'DASHBOARD_DIRECTION'
  | 'HISTORIQUE'
  | 'TICKETS_TEST'
  | 'FICHE_PDF';

interface Props {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const { resetDemoData } = useSmartExit();
  const [soundEnabled, setSoundEnabled] = React.useState(soundFX.enabled);

  const toggleSound = () => {
    soundFX.enabled = !soundFX.enabled;
    setSoundEnabled(soundFX.enabled);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-lg tracking-tight">SMART EXIT</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                  MVP ABIDJAN
                </span>
              </div>
              <div className="text-[11px] text-slate-400 -mt-0.5 flex items-center gap-1.5">
                <Store className="w-3 h-3 text-slate-500" />
                Système autonome de contrôle des sorties
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('TABLET_VIGILE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'TABLET_VIGILE'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Tablet className="w-4 h-4" />
              Écran Tablette Vigile
            </button>

            <button
              onClick={() => setActiveTab('RESPONSABLE_SECURITE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'RESPONSABLE_SECURITE'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Responsable Sécurité
            </button>

            <button
              onClick={() => setActiveTab('RAPPROCHEMENT_CAISSE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'RAPPROCHEMENT_CAISSE'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Scale className="w-4 h-4" />
              Audit & Rapprochement
            </button>

            <button
              onClick={() => setActiveTab('DASHBOARD_DIRECTION')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'DASHBOARD_DIRECTION'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Dashboard Direction
            </button>

            <button
              onClick={() => setActiveTab('HISTORIQUE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'HISTORIQUE'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4" />
              Historique
            </button>

            <button
              onClick={() => setActiveTab('TICKETS_TEST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'TICKETS_TEST'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
            >
              <Receipt className="w-4 h-4" />
              Tickets Démo
            </button>

            <button
              onClick={() => setActiveTab('FICHE_PDF')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'FICHE_PDF'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40'
                  : 'text-blue-400 hover:text-white hover:bg-blue-500/10 border border-blue-500/30'
              }`}
            >
              <FileText className="w-4 h-4" />
              Fiche PDF
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Direct quick button to open PDF sheet */}
            <button
              onClick={() => setActiveTab('FICHE_PDF')}
              title="Télécharger / Imprimer la Fiche PDF"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Fiche PDF</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Désactiver le bip sonore' : 'Activer le bip sonore'}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700/80 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset Demo State */}
            <button
              onClick={() => {
                if (window.confirm('Réinitialiser les données de démonstration ?')) {
                  resetDemoData();
                }
              }}
              title="Réinitialiser la démonstration"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700/80 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto pb-2 gap-1.5 scrollbar-none">
          {[
            { id: 'TABLET_VIGILE', label: '📱 Tablette Vigile' },
            { id: 'FICHE_PDF', label: '📄 Fiche PDF' },
            { id: 'RESPONSABLE_SECURITE', label: '🛡️ Sécurité' },
            { id: 'RAPPROCHEMENT_CAISSE', label: '⚖️ Audit & Rapprochement' },
            { id: 'DASHBOARD_DIRECTION', label: '📊 Direction' },
            { id: 'HISTORIQUE', label: '📜 Historique' },
            { id: 'TICKETS_TEST', label: '🧾 Tickets Démo' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === item.id
                  ? item.id === 'FICHE_PDF' ? 'bg-blue-600 text-white font-black' : 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
