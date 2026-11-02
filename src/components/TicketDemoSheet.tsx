import React, { useEffect, useRef } from 'react';
import { QrCode, Scan, CheckCircle2, ShieldAlert, AlertCircle, ShoppingBag, Printer } from 'lucide-react';
import { useSmartExit } from '../context/SmartExitContext';

// Simple lightweight QR matrix generator on canvas so no heavy external QR library is needed
const drawFakeQR = (canvas: HTMLCanvasElement, text: string) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const size = 100;
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#0f172a';

  // Seeded pseudo-random pattern based on string hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  const moduleSize = 4;
  const count = Math.floor(size / moduleSize);

  // Draw 3 corner finder patterns
  const drawFinder = (x: number, y: number) => {
    ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };

  drawFinder(moduleSize, moduleSize);
  drawFinder(size - 8 * moduleSize, moduleSize);
  drawFinder(moduleSize, size - 8 * moduleSize);

  // Fill pseudo-random modules
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      // Avoid finder areas
      if ((r < 9 && c < 9) || (r < 9 && c > count - 9) || (r > count - 9 && c < 9)) {
        continue;
      }
      const val = Math.sin(r * 13 + c * 7 + hash) > 0.1;
      if (val) {
        ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
      }
    }
  }
};

interface TicketReceiptProps {
  ticketNum: string;
  caisse: string;
  date: string;
  heure: string;
  montant: number;
  articles: number;
  badge: {
    label: string;
    color: string;
    desc: string;
  };
  payload: string;
  onScan: () => void;
}

const TicketCard: React.FC<TicketReceiptProps> = ({
  ticketNum,
  caisse,
  date,
  heure,
  montant,
  articles,
  badge,
  payload,
  onScan,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawFakeQR(canvasRef.current, payload);
    }
  }, [payload]);

  return (
    <div className="bg-amber-50/95 text-slate-900 rounded-2xl p-5 shadow-xl border-t-8 border-slate-900 font-mono text-xs flex flex-col justify-between relative overflow-hidden group">
      {/* Receipt Top Zigzag effect */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900"></div>

      <div>
        {/* Scenario Badge */}
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${badge.color}`}>
            {badge.label}
          </span>
          <span className="text-[10px] text-slate-500 font-sans">{badge.desc}</span>
        </div>

        {/* Supermarket Header */}
        <div className="text-center pb-3 border-b border-dashed border-slate-400 space-y-0.5">
          <div className="font-extrabold text-sm tracking-tight font-sans">
            HYPERMARCHÉ ABIDJAN
          </div>
          <div className="text-[10px] text-slate-600 font-sans">
            Bld Valéry Giscard d'Estaing • Marcory
          </div>
          <div className="text-[10px] text-slate-500">
            RCCM: CI-ABJ-2024-B-1082 • N° CC: 9812034 P
          </div>
        </div>

        {/* Ticket ID & Caisse Header (The part scanned by guard) */}
        <div className="py-2.5 border-b border-dashed border-slate-400 bg-white/60 -mx-5 px-5 my-2">
          <div className="flex justify-between font-bold text-slate-950 text-sm">
            <span>TICKET N° {ticketNum}</span>
            <span>CAISSE {caisse}</span>
          </div>
          <div className="flex justify-between text-slate-600 text-[11px] mt-0.5">
            <span>DATE : {date}</span>
            <span>HEURE : {heure}</span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="py-2 space-y-1 text-[11px] text-slate-700">
          <div className="flex justify-between">
            <span>Nombre d'articles :</span>
            <span className="font-bold text-slate-950">{articles}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-950 text-sm pt-1 border-t border-slate-300">
            <span>TOTAL TTC :</span>
            <span>{montant.toLocaleString()} FCFA</span>
          </div>
        </div>

        {/* QR & Barcode Section */}
        <div className="pt-3 border-t border-dashed border-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-sm">
            <canvas ref={canvasRef} className="w-20 h-20 block" />
          </div>
          <div className="text-center">
            {/* Fake 1D barcode lines */}
            <div className="h-6 flex items-center justify-center gap-0.5 px-4 overflow-hidden">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 2, 3, 2, 1, 3, 2, 4].map((w, i) => (
                <div key={i} className="bg-slate-900 h-full" style={{ width: `${w}px` }}></div>
              ))}
            </div>
            <div className="text-[10px] text-slate-600 font-mono tracking-widest mt-0.5">
              *{ticketNum}{caisse}0909*
            </div>
          </div>
        </div>
      </div>

      {/* Direct Quick Scan Trigger Button */}
      <div className="mt-4 pt-3 border-t border-dashed border-slate-400">
        <button
          onClick={onScan}
          className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all shadow group-hover:bg-emerald-600"
        >
          <Scan className="w-4 h-4" />
          Scanner ce ticket sur la tablette
        </button>
      </div>
    </div>
  );
};

export const TicketDemoSheet: React.FC<{ onSwitchToTablet: () => void }> = ({ onSwitchToTablet }) => {
  const { processTicketScan } = useSmartExit();

  const handleTestScan = (code: string) => {
    processTicketScan(code);
    onSwitchToTablet();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            Tickets types de caisse • Supermarché Abidjan
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Planche de Démonstration & Test Tickets
          </h1>
          <p className="text-sm text-slate-400">
            Scannez ces tickets avec la caméra de votre téléphone/tablette ou cliquez pour tester instantanément chaque cas métier.
          </p>
        </div>
      </div>

      {/* Grid of sample receipts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Ticket 1: 458721 - Valide normal (Prompt Example) */}
        <TicketCard
          ticketNum="458721"
          caisse="08"
          date="09/09/2026"
          heure="18:42"
          montant={87450}
          articles={14}
          badge={{
            label: '1. Ticket Valide',
            color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            desc: 'Cas nominal',
          }}
          payload="SMARTEXIT:TK=458721:CS=08:DT=2026-09-09T18:42:00:MT=87450"
          onScan={() => handleTestScan('SMARTEXIT:TK=458721:CS=08:DT=2026-09-09T18:42:00:MT=87450')}
        />

        {/* Ticket 2: 458715 - Déjà contrôlé */}
        <TicketCard
          ticketNum="458715"
          caisse="05"
          date="09/09/2026"
          heure="17:35"
          montant={54000}
          articles={9}
          badge={{
            label: '2. Déjà Contrôlé',
            color: 'bg-amber-100 text-amber-800 border-amber-300',
            desc: 'Alerte fraude / doublon',
          }}
          payload="SMARTEXIT:TK=458715:CS=05:DT=2026-09-09T17:35:00:MT=54000"
          onScan={() => handleTestScan('SMARTEXIT:TK=458715:CS=05:DT=2026-09-09T17:35:00:MT=54000')}
        />

        {/* Ticket 3: 458710 - Impayé */}
        <TicketCard
          ticketNum="458710"
          caisse="01"
          date="09/09/2026"
          heure="18:15"
          montant={46800}
          articles={7}
          badge={{
            label: '3. Non Payé',
            color: 'bg-rose-100 text-rose-800 border-rose-300',
            desc: 'Transaction non réglée',
          }}
          payload="SMARTEXIT:TK=458710:CS=01:DT=2026-09-09T18:15:00:MT=46800"
          onScan={() => handleTestScan('SMARTEXIT:TK=458710:CS=01:DT=2026-09-09T18:15:00:MT=46800')}
        />

        {/* Ticket 4: 998412 - Faux ticket / Inconnu */}
        <TicketCard
          ticketNum="998412"
          caisse="99"
          date="09/09/2026"
          heure="19:00"
          montant={31000}
          articles={3}
          badge={{
            label: '4. Ticket Inconnu',
            color: 'bg-purple-100 text-purple-800 border-purple-300',
            desc: 'Faux ticket suspect',
          }}
          payload="SMARTEXIT:TK=998412:CS=99:DT=2026-09-09T19:00:00:MT=31000"
          onScan={() => handleTestScan('SMARTEXIT:TK=998412:CS=99:DT=2026-09-09T19:00:00:MT=31000')}
        />
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center justify-between">
        <div>
          💡 <strong>Astuce de présentation :</strong> Vous pouvez également ouvrir cette page sur un autre écran/smartphone et filmer les QR codes avec la caméra de la tablette.
        </div>
        <button
          onClick={onSwitchToTablet}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors shrink-0 ml-4"
        >
          Aller à l'Écran Tablette
        </button>
      </div>
    </div>
  );
};
