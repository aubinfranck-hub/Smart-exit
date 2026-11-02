import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, AlertCircle, Sparkles, Keyboard, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSmartExit } from '../context/SmartExitContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CameraScannerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { processTicketScan } = useSmartExit();
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'smart-exit-camera-stream';

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    let isMounted = true;

    const startScanner = async () => {
      setCameraError(null);
      try {
        const scanner = new Html5Qrcode(scannerContainerId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.UPC_A,
          ],
          verbose: false,
        });
        scannerRef.current = scanner;

        const config = {
          fps: 15,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        };

        await scanner.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (!isMounted) return;
            stopScanner();
            onClose();
            processTicketScan(decodedText);
          },
          () => {
            // Frame parse error, normal when scanning
          }
        );

        if (isMounted) {
          setIsScanning(true);
        }
      } catch (err) {
        console.warn('Camera access unavailable or iframe restricted:', err);
        if (isMounted) {
          setCameraError(
            "Caméra non disponible ou accès restreint. Utilisez la détection optique simulée ou les tickets types ci-dessous."
          );
          setIsScanning(false);
        }
      }
    };

    const timer = setTimeout(() => {
      startScanner();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen]);

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
          setIsScanning(false);
        })
        .catch(() => {
          scannerRef.current = null;
          setIsScanning(false);
        });
    } else {
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  const handleSimulatedScan = (code: string) => {
    stopScanner();
    onClose();
    processTicketScan(code);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    stopScanner();
    onClose();
    processTicketScan(manualCode.trim());
    setManualCode('');
  };

  if (!isOpen) return null;

  return (
    <div 
      id="camera-scanner-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md"
    >
      <div 
        id="camera-scanner-modal-card"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800/80 border-b border-slate-700/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">Scanner En-tête Ticket</h3>
              <p className="text-xs text-slate-400">Pointez l'objectif sur le QR code ou le code-barres</p>
            </div>
          </div>
          <button
            id="close-camera-modal-btn"
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="w-9 h-9 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Camera Viewport */}
        <div className="relative bg-black flex-1 min-h-[280px] max-h-[340px] flex items-center justify-center overflow-hidden">
          <div id={scannerContainerId} className="w-full h-full object-cover"></div>

          {/* Scanner Overlay Visual Target */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
            <div className="relative w-56 h-56 border-2 border-dashed border-emerald-400/70 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              {/* Corner markers */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg"></div>

              {/* Animated Laser Scanning Bar */}
              <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse"></div>

              <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded bg-slate-950/70 text-emerald-300 backdrop-blur-sm border border-emerald-500/20">
                Zone En-tête Ticket
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-300 font-medium px-3 py-1 bg-slate-900/80 rounded-full border border-slate-700/50">
              Cadrer le QR Code ou Code-Barres du ticket
            </p>
          </div>

          {/* Camera fallback message if camera is blocked in browser or iframe */}
          {cameraError && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-10">
              <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
              <h4 className="text-sm font-semibold text-white">Simulation Rapide Disponible</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                La caméra directe est restreinte dans la prévisualisation. Sélectionnez un ticket de test réel ci-dessous pour déclencher la vérification instantanée.
              </p>
            </div>
          )}
        </div>

        {/* Quick Test Bar / Scenario presets directly from the MVP spec */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Tester un ticket type du supermarché
            </span>
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Keyboard className="w-3.5 h-3.5" />
              {showManualInput ? 'Masquer saisie' : 'Saisir N°'}
            </button>
          </div>

          {showManualInput && (
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ex: 458721 ou TICKET 458721"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Vérifier
              </button>
            </form>
          )}

          <div className="grid grid-cols-2 gap-2">
            {/* 1. Ticket Valide (Exemple du prompt 458721) */}
            <button
              id="test-ticket-valid-458721"
              onClick={() => handleSimulatedScan('SMARTEXIT:TK=458721:CS=08:DT=2026-09-09T18:42:00:MT=87450')}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  N° 458721 (Valide)
                </span>
                <span className="text-[10px] text-slate-400">87 450 F</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Caisse 08 • 14 articles • Payé
              </p>
            </button>

            {/* 2. Ticket Déjà Contrôlé (Doublon / Fraude) */}
            <button
              id="test-ticket-duplicate-458715"
              onClick={() => handleSimulatedScan('SMARTEXIT:TK=458715:CS=05:DT=2026-09-09T17:35:00:MT=54000')}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  N° 458715 (Déjà sorti)
                </span>
                <span className="text-[10px] text-slate-400">Sortie 2</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Contrôlé à 17:48 par Koffi
              </p>
            </button>

            {/* 3. Ticket Non Payé (Impayé / Annulé) */}
            <button
              id="test-ticket-unpaid-458710"
              onClick={() => handleSimulatedScan('SMARTEXIT:TK=458710:CS=01:DT=2026-09-09T18:15:00:MT=46800')}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-rose-500/30 hover:border-rose-500/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-rose-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  N° 458710 (Non Payé)
                </span>
                <span className="text-[10px] text-slate-400">46 800 F</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Caisse 01 • Reste à payer
              </p>
            </button>

            {/* 4. Ticket Inconnu / Faux */}
            <button
              id="test-ticket-unknown-999999"
              onClick={() => handleSimulatedScan('SMARTEXIT:TK=999999:CS=99:DT=2026-09-09T00:00:00:MT=0')}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-purple-500/30 hover:border-purple-500/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  N° 999999 (Inconnu)
                </span>
                <span className="text-[10px] text-slate-400">Introuvable</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Aucune transaction caisse
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
