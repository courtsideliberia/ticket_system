import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { PassTicket, ScannerLog } from '../types';
import { PASS_TEMPLATES } from '../lib/ticketTemplateMap';
import { QrCode, Camera, CheckCircle2, XCircle, AlertTriangle, Search, Volume2, VolumeX, ShieldCheck, RefreshCw, Sparkles, Clock, User, AlertCircle } from 'lucide-react';

interface ScannerTabProps {
  tickets: PassTicket[];
  onScanPass: (ticketCode: string, gateName: string) => { success: boolean; ticket?: PassTicket; message: string; code: 'valid' | 'already_used' | 'invalid' | 'revoked' };
  scannerLogs: ScannerLog[];
}

export const ScannerTab: React.FC<ScannerTabProps> = ({
  tickets,
  onScanPass,
  scannerLogs,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [gateName, setGateName] = useState('Regular Gate');
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    ticket?: PassTicket;
    message: string;
    code: 'valid' | 'already_used' | 'invalid' | 'revoked';
    timestamp: string;
  } | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Optical Camera Frame Decoding Loop via jsQR
  useEffect(() => {
    if (!isCameraActive) return;

    let stream: MediaStream | null = null;
    let animId: number | null = null;
    let canvas: HTMLCanvasElement | null = document.createElement('canvas');
    let ctx = canvas.getContext('2d', { willReadFrequently: true });
    let lastScannedCode = '';
    let lastScannedTime = 0;

    const startCamera = async () => {
      setCameraError(null);
      try {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();

          const scanFrame = () => {
            if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
              animId = requestAnimationFrame(scanFrame);
              return;
            }

            if (canvas && ctx) {
              canvas.width = videoRef.current.videoWidth || 640;
              canvas.height = videoRef.current.videoHeight || 480;
              ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert'
              });

              if (qrCode && qrCode.data) {
                const now = Date.now();
                const foundCode = qrCode.data.trim();

                if (foundCode && (foundCode !== lastScannedCode || now - lastScannedTime > 2000)) {
                  lastScannedCode = foundCode;
                  lastScannedTime = now;
                  handleProcessCode(foundCode);
                }
              }
            }

            animId = requestAnimationFrame(scanFrame);
          };

          animId = requestAnimationFrame(scanFrame);
        }
      } catch (err: any) {
        console.error('Camera stream error:', err);
        setCameraError('Camera access denied or unavailable. Allow camera access in browser site permissions.');
        setIsCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      canvas = null;
      ctx = null;
    };
  }, [isCameraActive]);

  const toggleCamera = () => {
    setIsCameraActive((prev) => !prev);
  };
  const playAudioChime = (type: 'success' | 'error') => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(160, ctx.currentTime + 0.15); // lower buzz
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // Audio fallback
    }
  };

  const handleProcessCode = (codeToScan: string) => {
    if (!codeToScan.trim()) return;

    // Handle string format in case QR contains extra payload (e.g., CRT-123|Name|Type)
    const cleanCode = codeToScan.split('|')[0].trim().toUpperCase();

    const res = onScanPass(cleanCode, gateName);

    setLastScanResult({
      ...res,
      timestamp: new Date().toLocaleTimeString(),
    });

    if (res.code === 'valid') {
      playAudioChime('success');
    } else {
      playAudioChime('error');
    }

    setManualCode('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessCode(manualCode);
  };

  return (
    <div className="space-y-6">
      {/* Scanner Control Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <QrCode className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white font-heading">Courtside Gate Scanner</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time gate verification with duplicate scan detection & instant access logs.
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-2 ${
            soundEnabled
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
          title={soundEnabled ? 'Mute Chime Sound' : 'Enable Chime Sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'Sound On' : 'Sound Muted'}</span>
        </button>
      </div>

      {/* Gate Station Selection Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Select Scanning Gate Station *
          </label>
          <span className="text-[11px] text-amber-300 font-mono font-bold bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
            Active: {gateName}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'Regular Gate', label: 'Regular Gate', badge: 'REGULAR', desc: 'Standard Ticket Entry' },
            { id: 'VIP Gate', label: 'VIP Gate', badge: 'VIP', desc: 'VIP Ticket Access' },
            { id: 'VVIP Gate', label: 'VVIP Gate', badge: 'VVIP', desc: 'Courtside & Premium' },
          ].map((gate) => {
            const isSelected = gateName === gate.id;
            return (
              <button
                key={gate.id}
                type="button"
                onClick={() => setGateName(gate.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? gate.id === 'VVIP Gate'
                      ? 'bg-purple-500/20 border-purple-400 text-white shadow-lg ring-2 ring-purple-400/40'
                      : gate.id === 'VIP Gate'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg ring-2 ring-amber-400/40'
                      : 'bg-blue-500/20 border-blue-400 text-white shadow-lg ring-2 ring-blue-400/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs text-white">{gate.label}</span>
                  <span
                    className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded border ${
                      gate.id === 'VVIP Gate'
                        ? 'bg-purple-950 text-purple-300 border-purple-700'
                        : gate.id === 'VIP Gate'
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-blue-950 text-blue-300 border-blue-700'
                    }`}
                  >
                    {gate.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{gate.desc}</p>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-amber-400/90 font-medium pt-1">
          ✨ Note: <strong className="text-amber-300">All Access Passes</strong> can enter at any gate (Regular, VIP, or VVIP).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Scan Input Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Manual / Barcode Scanner Input Box */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-400" /> Fast Code Entry / Hardware Barcode Reader
            </h3>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Scan or type ticket code e.g. CRT-2026-CVIP-8801"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-blue-500/30 text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 shrink-0"
              >
                Scan Ticket
              </button>
            </form>

            <p className="text-[11px] text-slate-500">
              💡 Tip: Plug in any USB / Bluetooth QR scanner or type pass codes directly.
            </p>

            {/* Quick Demo Scan Buttons */}
            <div className="pt-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Test Sample Tickets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tickets.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleProcessCode(t.ticketCode)}
                    className="px-2.5 py-1 rounded-md bg-slate-950 hover:bg-blue-500/10 border border-slate-800 hover:border-blue-500/40 text-[11px] font-mono text-slate-300 hover:text-blue-300 transition-all"
                  >
                    {t.ticketCode} ({(t.holderName || 'Guest').split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Camera View */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-400" /> Optical Camera Scanner
              </h3>
              <button
                onClick={toggleCamera}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                  isCameraActive
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                {isCameraActive ? 'Stop Camera' : 'Start Camera Scan'}
              </button>
            </div>

            {cameraError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{cameraError}</span>
              </div>
            )}

            <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              {isCameraActive ? (
                <>
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-dashed border-blue-400/80 rounded-2xl relative shadow-2xl animate-pulse">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-400 -mt-1 -ml-1 rounded-tl-sm" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-400 -mt-1 -mr-1 rounded-tr-sm" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-400 -mb-1 -ml-1 rounded-bl-sm" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-400 -mb-1 -mr-1 rounded-br-sm" />
                    </div>
                    <span className="mt-3 text-[11px] font-mono font-bold text-blue-300 bg-slate-950/80 px-3 py-1 rounded-full border border-blue-500/30 shadow-lg">
                      📷 Point camera at pass QR code
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-2 text-slate-500">
                  <QrCode className="w-12 h-12 mx-auto text-slate-700" />
                  <p className="text-xs">Camera viewfinder inactive. Tap "Start Camera Scan" above.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Scan Result & Live Stream Feed */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Result Card */}
          {lastScanResult ? (
            <div
              className={`p-6 rounded-2xl border shadow-2xl transition-all duration-300 ${
                lastScanResult.code === 'valid'
                  ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/50 shadow-emerald-500/10'
                  : lastScanResult.code === 'already_used'
                  ? 'bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-950 border-blue-500/50 shadow-blue-500/10'
                  : 'bg-gradient-to-br from-rose-950/80 via-slate-900 to-slate-950 border-rose-500/50 shadow-rose-500/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {lastScanResult.code === 'valid' && (
                    <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  )}
                  {lastScanResult.code === 'already_used' && (
                    <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40">
                      <Clock className="w-8 h-8" />
                    </div>
                  )}
                  {(lastScanResult.code === 'invalid' || lastScanResult.code === 'revoked') && (
                    <div className="p-3 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      <XCircle className="w-8 h-8" />
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      SCAN RESULT • {lastScanResult.timestamp}
                    </span>
                    <h3 className="text-xl font-bold text-white font-heading mt-0.5">
                      {lastScanResult.message}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Scanned Pass Info Details */}
              {lastScanResult.ticket && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-slate-400">Pass Holder:</span>
                    <strong className="text-white text-sm">{lastScanResult.ticket.holderName}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Tier Category:</span>
                    <span className="font-bold text-blue-400 uppercase">
                      {PASS_TEMPLATES[lastScanResult.ticket.category]?.badgeText || lastScanResult.ticket.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Section / Seat:</span>
                    <span className="text-slate-200">
                      {lastScanResult.ticket.section} - Seat {lastScanResult.ticket.seatNumber}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 mx-auto text-blue-400/60" />
              <h4 className="text-base font-bold text-white">Ready for Gate Verification</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Scan or enter ticket code above to record entry and validate credentials.
              </p>
            </div>
          )}

          {/* Recent Gate Activity Log */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> Live Gate Activity Stream
              </h3>
              <span className="text-xs text-slate-500 font-mono">{scannerLogs.length} Scans</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {scannerLogs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No scans recorded in this session yet.</p>
              ) : (
                scannerLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {log.status === 'valid' ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      ) : log.status === 'already_used' ? (
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                      )}
                      <div>
                        <p className="font-bold text-slate-200">{log.holderName || log.ticketCode}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{log.ticketCode} • {log.gate}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          log.status === 'valid'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : log.status === 'already_used'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {log.status}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{log.scannedAt}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
