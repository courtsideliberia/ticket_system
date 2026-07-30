import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PassCategory, PassTicket, TicketCanvasThemeId, EventRecord, PassTypeKind, TemplateCustomization } from '../types';
import { DEFAULT_EVENT_INFO } from '../lib/ticketTemplateMap';
import { TicketRenderer } from './TicketRenderer';
import { TicketTemplateManager } from './TicketTemplateManager';
import { downloadTicketPdf, downloadTicketPng, exportPassToCanvasImage } from '../lib/ticketExport';
import {
  Ticket,
  UserCheck,
  QrCode,
  Sparkles,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Printer,
  Download,
  Share2,
  Users,
  Palette,
  Camera,
  Layers,
  FileText,
  ImageDown,
  PackageCheck,
  Loader2
} from 'lucide-react';

interface PassGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (newTickets: PassTicket[]) => void;
  events?: EventRecord[];
}

// Sample preset logos for quick 1-click testing
const PRESET_LOGOS = [
  { name: 'LBA Championship', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=120&auto=format&fit=crop&q=80' },
  { name: 'Gold Trophy Emblem', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=120&auto=format&fit=crop&q=80' },
  { name: 'Liberia Sports League', url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=120&auto=format&fit=crop&q=80' },
];

// Sample staff avatar photo presets
const PRESET_PHOTOS = [
  { name: 'Elsa Moon', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { name: 'Marcus Vance', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { name: 'Sarah Connor', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
];

export const PassGeneratorModal: React.FC<PassGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  events = [],
}) => {
  if (!isOpen) return null;

  // Selected Pass Type Mode (Ticket vs Staff Pass vs QR Code)
  const [passType, setPassType] = useState<PassTypeKind>('ticket');

  // Copies count
  const [copiesCount, setCopiesCount] = useState<number>(1);

  // Selected Theme (for landscape tickets)
  const [selectedThemeId, setSelectedThemeId] = useState<TicketCanvasThemeId>('gold_championship');
  const [templateCustomization, setTemplateCustomization] = useState<TemplateCustomization>({});
  const [templateThemeMode, setTemplateThemeMode] = useState<'dark' | 'light'>('dark');
  const [sponsorLogoUrl, setSponsorLogoUrl] = useState<string | undefined>(undefined);

  // Form Fields - Event Info
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('18:00 GMT');
  const [venue, setVenue] = useState('');
  const [price, setPrice] = useState<number | ''>(35);
  const [currency, setCurrency] = useState<'USD' | 'LRD'>('USD');
  const [category, setCategory] = useState<PassCategory>('regular');

  React.useEffect(() => {
    if (isOpen) {
      if (events.length > 0) {
        const evt = events.find((e) => e.id === selectedEventId) || events[0];
        setSelectedEventId(evt.id);
        setEventName(evt.name);
        setEventDate(evt.date);
        setEventTime(evt.time || '18:00 GMT');
        setVenue(evt.venue);
        if (evt.currency) setCurrency(evt.currency as 'USD' | 'LRD');
      } else {
        setSelectedEventId('');
        setEventName('');
        setEventDate('');
        setEventTime('18:00 GMT');
        setVenue('');
      }
    }
  }, [isOpen, events]);

  // Custom Logo & Photo Upload State
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('');
  const [holderPhotoUrl, setHolderPhotoUrl] = useState<string>('');

  // Holder details (Optional!)
  const [holderName, setHolderName] = useState('');
  const [holderEmail, setHolderEmail] = useState('');
  const [holderPhone, setHolderPhone] = useState('');
  const [holderRole, setHolderRole] = useState('Marketing Team');

  // Gate Seating details (Optional!)
  const [section, setSection] = useState('');
  const [row, setRow] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [gateEntry, setGateEntry] = useState('');
  const [notes, setNotes] = useState('');

  // Generated success state
  const [generatedSuccess, setGeneratedSuccess] = useState<PassTicket[] | null>(null);

  // Real export state (PNG capture refs, per-card/zip loading indicators)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);

  // Pick created event handler
  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    if (!eventId) return;
    const found = events.find((e) => e.id === eventId);
    if (found) {
      setEventName(found.name);
      setEventDate(found.date);
      setEventTime(found.time || '18:00 GMT');
      setVenue(found.venue);
      if (found.currency) setCurrency(found.currency as 'USD' | 'LRD');
    }
  };

  // Logo upload
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) setCustomLogoUrl(evt.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Person Photo upload
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) setHolderPhotoUrl(evt.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Live preview pass ticket object
  const livePreviewTicket: PassTicket = {
    id: 'preview-ticket-01',
    ticketCode: 'CRT-2026-PASS-9982',
    passType,
    holderName: holderName.trim() || undefined,
    holderEmail: holderEmail.trim() || undefined,
    holderPhone: holderPhone.trim() || undefined,
    holderPhotoUrl: holderPhotoUrl || undefined,
    holderRole: holderRole.trim() || undefined,
    category,
    themeId: selectedThemeId,
    templateCustomization,
    templateThemeMode,
    sponsorLogoUrl,
    eventName: eventName.trim() || 'SAMPLE EVENT NAME',
    eventDate: eventDate.trim() || undefined as any,
    eventTime: eventTime.trim() || undefined,
    venue: venue.trim() || undefined,
    section: section.trim() || undefined,
    row: row.trim() || undefined,
    seatNumber: seatNumber.trim() || undefined,
    gateEntry: gateEntry.trim() || undefined,
    price: typeof price === 'number' ? price : 0,
    currency,
    status: 'valid',
    issuedAt: new Date().toISOString(),
    customLogoUrl: customLogoUrl || undefined,
    qrCodeData: `CRT-2026-${passType.toUpperCase()}-PREVIEW`,
    notes,
  };

  function getCodePrefix(pType: PassTypeKind): string {
    if (pType === 'staff_badge') return 'STF';
    if (pType === 'qr_only') return 'QR';
    return 'TCK';
  }

  const captureNode = async (node: HTMLDivElement) => {
    // Warm-up pass then real capture — avoids blank/partial exports on first render
    // (fonts/QR canvas sometimes aren't fully painted on the very first snapshot).
    await toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: '#0f172a' });
    return toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: '#0f172a' });
  };

  const handleDownloadOne = async (t: PassTicket) => {
    setDownloadingId(t.id);
    try {
      await downloadTicketPng(t, `Courtside_${t.ticketCode.replace(/[^a-z0-9-_]/gi, '_')}`);
    } catch (err) {
      console.error('PNG export failed', err);
      alert('Could not export this pass as an image. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);

  const handleDownloadOnePdf = async (t: PassTicket) => {
    setDownloadingPdfId(t.id);
    try {
      await downloadTicketPdf(t, `Courtside_${t.ticketCode.replace(/[^a-z0-9-_]/gi, '_')}`);
    } catch (err) {
      console.error('PDF export failed', err);
      alert('Could not export this pass as a PDF. Please try again.');
    } finally {
      setDownloadingPdfId(null);
    }
  };

  const handleDownloadAllZip = async () => {
    if (!generatedSuccess) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      for (const t of generatedSuccess) {
        const dataUrl = await exportPassToCanvasImage(t, 'png');
        const base64 = dataUrl.split(',')[1];
        zip.file(`Courtside_${t.ticketCode.replace(/[^a-z0-9-_]/gi, '_')}.png`, base64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `Courtside_Liberia_Passes_${new Date().toISOString().slice(0, 10)}.zip`);
    } catch (err) {
      console.error('ZIP export failed', err);
      alert('Could not export the batch as a ZIP. Please try again, or download passes individually.');
    } finally {
      setZipping(false);
    }
  };

  const handlePrintAll = () => {
    if (!generatedSuccess) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print your passes.');
      return;
    }

    const cardsHtml = generatedSuccess.map((t) => {
      // Encode the same qrCodeData used on-screen so printed QR codes match the
      // digital ones exactly (serial stays hidden for qr_only passes here too).
      const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(t.qrCodeData || t.ticketCode)}`;

      if (t.passType === 'qr_only') {
        return `
          <div style="page-break-inside: avoid; width: 220px; padding: 20px; background: #0f172a; border-radius: 20px; display: inline-flex; flex-direction: column; align-items: center; gap: 10px; margin: 10px; border: 2px solid #f59e0b;">
            <div style="font-size: 12px; font-weight:800; color:#f59e0b; text-transform:uppercase;">${t.eventName}</div>
            <img src="${qrImgUrl}" style="width: 180px; height: 180px; border-radius: 12px; background: white; padding: 8px;" />
            ${t.holderName ? `<div style="font-size:11px;font-weight:700;color:white;">${t.holderName}</div>` : ''}
          </div>
        `;
      }
      if (t.passType === 'staff_badge') {
        return `
          <div style="page-break-inside: avoid; width: 260px; padding: 18px; background: white; border-radius: 20px; display: inline-flex; flex-direction: column; align-items: center; gap: 8px; margin: 10px; border: 2px solid #dc2626; text-align:center;">
            <div style="font-size: 15px; font-weight:900; color:#dc2626; text-transform:uppercase;">${t.eventName}</div>
            ${t.holderPhotoUrl ? `<img src="${t.holderPhotoUrl}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #f59e0b;" />` : ''}
            ${t.holderName ? `<div style="font-size:14px;font-weight:800;color:#0f172a;">${t.holderName}</div>` : ''}
            <div style="font-size:10px;font-weight:800;color:white;background:#dc2626;padding:4px 10px;border-radius:999px;text-transform:uppercase;">${t.holderRole || 'EVENT STAFF'}</div>
            <img src="${qrImgUrl}" style="width: 110px; height: 110px;" />
            <div style="font-size:10px;color:#64748b;font-family:monospace;">${t.ticketCode}</div>
          </div>
        `;
      }
      // Landscape ticket
      return `
        <div style="page-break-inside: avoid; width: 620px; border: 2px solid #f59e0b; border-radius: 20px; padding: 18px; margin: 12px; background: #0f172a; color: white; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
          <div style="text-align:left;">
            <div style="font-size: 10px; color: #f59e0b; font-weight: 800; text-transform: uppercase;">Courtside Liberia Official Ticket</div>
            <div style="font-size: 20px; font-weight: 900; margin-top: 4px; color:#fbbf24;">${t.eventName}</div>
            ${t.eventDate ? `<div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">${t.eventDate} ${t.eventTime || ''}</div>` : ''}
            ${t.holderName ? `<div style="font-size: 12px; color: #f59e0b; font-weight:700; margin-top: 6px;">Pass Holder: ${t.holderName}</div>` : ''}
            <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-top: 6px;">No: ${t.ticketCode}</div>
          </div>
          <img src="${qrImgUrl}" style="width: 110px; height: 110px; background:white; border-radius:12px; padding:6px;" />
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Generated Passes — Courtside Liberia</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; background: #000; padding: 20px; text-align: center; }
            @media print { body { background: #fff; } }
          </style>
        </head>
        <body>
          <h2 style="color:#fff;margin-bottom:16px;">Courtside Liberia — Batch (${generatedSuccess.length} Passes)</h2>
          <div style="display:flex;flex-wrap:wrap;justify-content:center;">${cardsHtml}</div>
          <script>setTimeout(() => { window.print(); }, 700);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName.trim()) {
      alert('Please provide an Event Name.');
      return;
    }

    const countToMake = Math.max(1, copiesCount || 1);
    const generatedList: PassTicket[] = [];
    const batchId = `batch-${Date.now()}`;

    for (let i = 1; i <= countToMake; i++) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const prefix = getCodePrefix(passType);
      const ticketCode = `CRT-2026-${prefix}-${randomSuffix}`;

      // Name handling for multiple copies
      let finalHolderName = holderName.trim();
      if (countToMake > 1 && finalHolderName) {
        finalHolderName = `${finalHolderName} #${i}`;
      } else if (countToMake > 1 && !finalHolderName) {
        if (passType === 'staff_badge') finalHolderName = `Staff Member #${i}`;
        else if (passType === 'ticket') finalHolderName = `Pass Holder #${i}`;
      }

      generatedList.push({
        id: `crt-${Date.now()}-${i}`,
        ticketCode,
        passType,
        holderName: finalHolderName || undefined,
        holderEmail: holderEmail.trim() || undefined,
        holderPhone: holderPhone.trim() || undefined,
        holderPhotoUrl: holderPhotoUrl || undefined,
        holderRole: holderRole.trim() || (passType === 'staff_badge' ? 'EVENT STAFF' : undefined),
        category: category,
        themeId: selectedThemeId,
        templateCustomization,
        templateThemeMode,
        sponsorLogoUrl,
        eventName: eventName.trim(),
        eventDate: eventDate.trim(),
        eventTime: eventTime.trim() || undefined,
        venue: venue.trim() || undefined,
        section: section.trim() || undefined,
        row: row.trim() || undefined,
        seatNumber: seatNumber.trim() || undefined,
        gateEntry: gateEntry.trim() || undefined,
        price: typeof price === 'number' ? price : 0,
        currency,
        status: 'valid',
        issuedAt: new Date().toISOString(),
        customLogoUrl: customLogoUrl || undefined,
        qrCodeData: `${ticketCode}|${eventName}|${finalHolderName || 'PASS'}`,
        notes: notes || (countToMake > 1 ? `Batch ID: ${batchId}` : undefined),
        batchId: countToMake > 1 ? batchId : undefined,
      });
    }

    onGenerate(generatedList);
    setGeneratedSuccess(generatedList);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] sm:max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-lg font-heading font-black text-white uppercase tracking-wider truncate">
                Pass & Ticket Studio
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Choose Pass Type, customize event text, and generate digital passes
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setGeneratedSuccess(null);
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {generatedSuccess ? (
          /* SUCCESS STATE — full results gallery, same real export logic for
             all three pass types (Ticket / Staff Pass / QR-only). */
          <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <Check className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-2xl font-heading font-black text-white uppercase mt-3 sm:mt-4">
                {generatedSuccess.length === 1 ? 'Pass Generated Successfully!' : `${generatedSuccess.length} Passes Generated!`}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Saved to your workspace matrix. Export any pass below, or the whole batch at once.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2 sm:gap-3 pb-2">
              <button
                onClick={handleDownloadAllZip}
                disabled={zipping}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {zipping ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <PackageCheck className="w-4 h-4 text-emerald-400" />}
                {zipping ? 'Zipping…' : 'Download All (ZIP)'}
              </button>
              <button
                onClick={handlePrintAll}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
              <button
                onClick={() => {
                  setGeneratedSuccess(null);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 text-center"
              >
                Back to Matrix
              </button>
            </div>

            {/* Grid of every generated pass, each individually exportable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
              {generatedSuccess.map((t, idx) => (
                <div key={t.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div
                    ref={(el) => { cardRefs.current[t.id] = el; }}
                    className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-3 flex justify-center"
                  >
                    <TicketRenderer ticket={t} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="font-mono text-slate-300">Pass #{idx + 1} of {generatedSuccess.length}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDownloadOne(t)}
                        disabled={downloadingId === t.id}
                        className="text-emerald-400 hover:underline flex items-center gap-1 disabled:opacity-60"
                      >
                        {downloadingId === t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageDown className="w-3 h-3" />}
                        {downloadingId === t.id ? 'Exporting…' : 'PNG'}
                      </button>
                      <button
                        onClick={() => handleDownloadOnePdf(t)}
                        disabled={downloadingPdfId === t.id}
                        className="text-amber-400 hover:underline flex items-center gap-1 disabled:opacity-60"
                        title="Export as a 300 DPI print-ready PDF"
                      >
                        {downloadingPdfId === t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                        {downloadingPdfId === t.id ? 'Exporting…' : 'PDF (300 DPI)'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* GENERATOR STUDIO FORMS + LIVE PREVIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto custom-scrollbar">
            {/* Left 7 Columns: Generator Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 p-5 sm:p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-800">
              {/* 1. CHOOSE WHAT YOU ARE GENERATING */}
              <div className="space-y-3">
                <label className="text-xs font-heading font-extrabold text-white uppercase tracking-wider block">
                  1. Choose What You Are Generating *
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {/* Option 1: Landscape Ticket */}
                  <button
                    type="button"
                    onClick={() => setPassType('ticket')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      passType === 'ticket'
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg ring-2 ring-amber-400/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Ticket className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold font-heading uppercase">1. Ticket</span>
                    <span className="text-[10px] text-slate-400">Landscape Theme</span>
                  </button>

                  {/* Option 2: Staff Pass */}
                  <button
                    type="button"
                    onClick={() => setPassType('staff_badge')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      passType === 'staff_badge'
                        ? 'bg-red-500/20 border-red-400 text-white shadow-lg ring-2 ring-red-400/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <UserCheck className="w-5 h-5 text-red-400" />
                    <span className="text-xs font-bold font-heading uppercase">2. Staff Pass</span>
                    <span className="text-[10px] text-slate-400">Portrait Badge</span>
                  </button>

                  {/* Option 3: Just QR Code */}
                  <button
                    type="button"
                    onClick={() => setPassType('qr_only')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      passType === 'qr_only'
                        ? 'bg-blue-500/20 border-blue-400 text-white shadow-lg ring-2 ring-blue-400/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold font-heading uppercase">3. Just QR Code</span>
                    <span className="text-[10px] text-slate-400">Hidden Serial</span>
                  </button>
                </div>
              </div>

              {/* COPIES TO GENERATE */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white uppercase block">
                    Amount of Copies to Generate
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Input how many pass copies/serials to create in batch
                  </p>
                </div>

                <div className="w-28">
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={copiesCount}
                    onChange={(e) => setCopiesCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/50 text-white font-mono font-bold text-sm text-center focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* IF PASS TYPE = TICKET: FULL TEMPLATE ENGINE (gallery, customization, live preview) */}
              {passType === 'ticket' && (
                <TicketTemplateManager
                  selectedThemeId={selectedThemeId}
                  onSelectTheme={setSelectedThemeId}
                  customization={templateCustomization}
                  onChangeCustomization={setTemplateCustomization}
                  themeMode={templateThemeMode}
                  onChangeThemeMode={setTemplateThemeMode}
                  sponsorLogoUrl={sponsorLogoUrl}
                  onChangeSponsorLogoUrl={setSponsorLogoUrl}
                  previewTicket={livePreviewTicket}
                />
              )}

              {/* 2. BOLD EVENT DETAILS & LOGO */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="text-xs font-heading font-extrabold text-white uppercase tracking-wider block">
                  2. Event Name & Logo
                </label>

                {events.length > 0 && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Pick Existing Event</label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => handleEventSelect(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Select Created Event --</option>
                      {events.map((evt) => (
                        <option key={evt.id} value={evt.id}>
                          {evt.name} ({evt.date})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-extrabold text-amber-400 uppercase tracking-wide mb-1">
                    Event Name (Renders Bold on Pass) *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. COOK & TASTE EXPO / LIBERIA BASKETBALL FINALS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/50 text-white font-bold text-xs focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Event Date (Optional)</label>
                    <input
                      type="text"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      placeholder="11. 09. 2034 or 2026-08-15"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Event Time (Optional)</label>
                    <input
                      type="text"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      placeholder="18:00 GMT / 6:00 PM"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>

                {passType !== 'qr_only' && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Venue / Location (Optional)</label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="SKD Sports Complex, Monrovia"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                )}

                {/* Ticket Category / Tier Selector */}
                {passType === 'ticket' && (
                  <div className="space-y-2 pt-1">
                    <label className="block text-[11px] font-extrabold text-amber-400 uppercase tracking-wide">
                      Select Ticket Category / Access Tier *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'regular', label: 'Regular', badge: 'REGULAR' },
                        { id: 'vip', label: 'VIP', badge: 'VIP' },
                        { id: 'vvip', label: 'VVIP', badge: 'VVIP' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id as PassCategory)}
                          className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between ${
                            category === cat.id
                              ? 'bg-amber-500/20 border-amber-400 text-white font-bold ring-1 ring-amber-400/50'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[11px] font-bold truncate">{cat.label}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-extrabold">
                            {cat.badge}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="block text-[11px] font-extrabold text-amber-400 uppercase tracking-wide mb-1.5">
                        Ticket Price & Currency *
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                            {currency === 'LRD' ? 'L$' : '$'}
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={price}
                            onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                            placeholder={currency === 'LRD' ? '7000' : '35'}
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-1 shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => setCurrency('USD')}
                            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${
                              currency === 'USD'
                                ? 'bg-amber-500 text-slate-950 shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            USD ($)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrency('LRD')}
                            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${
                              currency === 'LRD'
                                ? 'bg-emerald-500 text-slate-950 shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            LRD (L$)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Code Pass Category Selector */}
                {passType === 'qr_only' && (
                  <div className="space-y-2 pt-1">
                    <label className="block text-[11px] font-extrabold text-amber-400 uppercase tracking-wide">
                      Select Pass Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'regular', label: 'Regular', badge: 'REGULAR' },
                        { id: 'vip', label: 'VIP', badge: 'VIP' },
                        { id: 'vvip', label: 'VVIP', badge: 'VVIP' },
                        { id: 'all_access', label: 'All Access Pass', badge: 'ALL ACCESS' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id as PassCategory)}
                          className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between ${
                            category === cat.id
                              ? 'bg-amber-500/20 border-amber-400 text-white font-bold ring-1 ring-amber-400/50'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[11px] font-bold truncate">{cat.label}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-extrabold">
                            {cat.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* LOGO UPLOAD */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-3">
                    {customLogoUrl ? (
                      <img src={customLogoUrl} alt="Logo" className="h-10 w-10 object-contain rounded bg-slate-900 border border-blue-500 p-1" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">Event Logo (Optional)</p>
                      <p className="text-[10px] text-slate-400">Displays on pass header banner</p>
                    </div>

                    <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{customLogoUrl ? 'Change' : 'Upload'}</span>
                      <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
                    </label>

                    {customLogoUrl && (
                      <button type="button" onClick={() => setCustomLogoUrl('')} className="text-xs text-rose-400 hover:underline">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. STAFF PASS SPECIFIC DETAILS (PHOTO & ROLE) */}
              {passType === 'staff_badge' && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <label className="text-xs font-heading font-extrabold text-white uppercase tracking-wider block">
                    3. Staff Pass Details
                  </label>

                  {/* Staff Pass Category Selector */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-[11px] font-extrabold text-amber-400 uppercase tracking-wide">
                      Select Pass Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'regular', label: 'Regular', badge: 'REGULAR' },
                        { id: 'vip', label: 'VIP', badge: 'VIP' },
                        { id: 'vvip', label: 'VVIP', badge: 'VVIP' },
                        { id: 'all_access', label: 'All Access Pass', badge: 'ALL ACCESS' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id as PassCategory)}
                          className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between ${
                            category === cat.id
                              ? 'bg-amber-500/20 border-amber-400 text-white font-bold ring-1 ring-amber-400/50'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[11px] font-bold truncate">{cat.label}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-extrabold">
                            {cat.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Staff / Person Name (Optional)</label>
                      <input
                        type="text"
                        value={holderName}
                        onChange={(e) => setHolderName(e.target.value)}
                        placeholder="e.g. ELSA H. MOON"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Role / Position Title</label>
                      <input
                        type="text"
                        value={holderRole}
                        onChange={(e) => setHolderRole(e.target.value)}
                        placeholder="e.g. Marketing Team / Security"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                      />
                    </div>
                  </div>

                  {/* STAFF PHOTO UPLOAD */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-3">
                      {holderPhotoUrl ? (
                        <img src={holderPhotoUrl} alt="Staff" className="h-12 w-12 object-cover rounded-full border-2 border-red-500" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
                          <Camera className="w-5 h-5" />
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="text-xs font-bold text-white">Staff Photo Picture (Optional)</p>
                        <p className="text-[10px] text-slate-400">Renders inside circle badge frame</p>
                      </div>

                      <label className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{holderPhotoUrl ? 'Change' : 'Upload Photo'}</span>
                        <input type="file" accept="image/*" onChange={handlePhotoFileUpload} className="hidden" />
                      </label>

                      {holderPhotoUrl && (
                        <button type="button" onClick={() => setHolderPhotoUrl('')} className="text-xs text-rose-400 hover:underline">
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Presets for fast testing */}
                    <div className="pt-2 border-t border-slate-900">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                        Or Pick Sample Staff Photo:
                      </span>
                      <div className="flex gap-2">
                        {PRESET_PHOTOS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setHolderPhotoUrl(p.url)}
                            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1"
                          >
                            <img src={p.url} alt={p.name} className="w-4 h-4 rounded-full object-cover" />
                            <span>{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. OPTIONAL HOLDER & SEATING DETAILS (FOR TICKET TYPE) */}
              {passType === 'ticket' && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-heading font-extrabold text-white uppercase tracking-wider block">
                      3. Pass Holder & Gate Seating (OPTIONAL)
                    </label>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      If left blank, will not display on ticket
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Pass Holder Name</label>
                      <input
                        type="text"
                        value={holderName}
                        onChange={(e) => setHolderName(e.target.value)}
                        placeholder="e.g. Olivia Smith (Optional)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Section</label>
                      <input
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="COURTSIDE ROW 1 (Optional)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 sm:col-span-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Row</label>
                        <input
                          type="text"
                          value={row}
                          onChange={(e) => setRow(e.target.value)}
                          placeholder="A"
                          className="w-full px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs text-center font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Seat</label>
                        <input
                          type="text"
                          value={seatNumber}
                          onChange={(e) => setSeatNumber(e.target.value)}
                          placeholder="01"
                          className="w-full px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs text-center font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Gate</label>
                        <input
                          type="text"
                          value={gateEntry}
                          onChange={(e) => setGateEntry(e.target.value)}
                          placeholder="GATE 02"
                          className="w-full px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Action Footer */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  Generate {copiesCount} {passType === 'staff_badge' ? 'Staff Pass' : passType === 'qr_only' ? 'QR Code' : 'Ticket'}{copiesCount > 1 ? 's' : ''}
                </button>
              </div>
            </form>

            {/* Right 5 Columns: Realtime Studio Live Canvas Preview */}
            <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-950/60 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <h3 className="text-xs font-heading font-black text-white uppercase tracking-wider">
                      Live Studio Pass Preview
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
                    REALTIME CANVAS
                  </span>
                </div>

                {/* Realtime Canvas Ticket Card */}
                <div className="p-1 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden flex justify-center">
                  <TicketRenderer ticket={livePreviewTicket} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
                <p className="font-bold text-amber-300">💡 Studio Smart Rule:</p>
                <p>
                  Any field left empty (such as Holder Name or Gate Seating) will automatically stay hidden from the output pass canvas!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
