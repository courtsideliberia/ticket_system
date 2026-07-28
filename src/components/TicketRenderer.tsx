import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PassTicket, TicketCanvasThemeId } from '../types';
import { CANVAS_THEMES, PASS_TEMPLATES } from '../lib/ticketTemplateMap';
import { Calendar, MapPin, Trophy, Sparkles, Award, Gamepad2, User, QrCode } from 'lucide-react';

interface TicketRendererProps {
  ticket: PassTicket;
  showStub?: boolean;
  compact?: boolean;
  className?: string;
  onPrint?: () => void;
}

// Authentic SVG Barcode Generator Component
const BarcodeSVG: React.FC<{ code: string; className?: string }> = ({ code, className = 'h-8 text-slate-100' }) => {
  const barPattern = React.useMemo(() => {
    const bars: { x: number; w: number }[] = [];
    let currentX = 2;
    for (let i = 0; i < 42; i++) {
      const charVal = code.charCodeAt(i % code.length) || 70;
      const barW = (charVal % 3) + 1;
      const gapW = ((charVal * 2) % 3) + 1;
      bars.push({ x: currentX, w: barW });
      currentX += barW + gapW;
    }
    return { bars, totalWidth: currentX + 2 };
  }, [code]);

  return (
    <svg viewBox={`0 0 ${barPattern.totalWidth} 40`} preserveAspectRatio="none" className={className}>
      {barPattern.bars.map((b, idx) => (
        <rect key={idx} x={b.x} y="0" width={b.w} height="40" fill="currentColor" />
      ))}
    </svg>
  );
};

export const TicketRenderer: React.FC<TicketRendererProps> = ({
  ticket,
  showStub = true,
  className = '',
}) => {
  const passType = ticket.passType || 'ticket';

  // Has holder info?
  const hasHolder = Boolean(ticket.holderName && ticket.holderName.trim());

  // Has seating details?
  const hasSeating = Boolean(
    (ticket.section && ticket.section.trim()) ||
    (ticket.row && ticket.row.trim()) ||
    (ticket.seatNumber && ticket.seatNumber.trim()) ||
    (ticket.gateEntry && ticket.gateEntry.trim())
  );

  // Has venue?
  const hasVenue = Boolean(ticket.venue && ticket.venue.trim());

  // Has date/time?
  const hasDate = Boolean(ticket.eventDate && ticket.eventDate.trim());

  // Has price?
  const hasPrice = typeof ticket.price === 'number' && ticket.price > 0;

  // =========================================================
  // TYPE 2: STAFF PASS / LANYARD BADGE (PORTRAIT FORMAT)
  // =========================================================
  if (passType === 'staff_badge') {
    return (
      <div
        id={`ticket-pass-${ticket.id}`}
        className={`relative w-full max-w-[360px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-red-500/60 bg-white text-slate-900 transition-all ${className}`}
      >
        {/* Top Lanyard Clip Hole Visual */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 flex justify-center items-center">
          <div className="w-14 h-3 rounded-full bg-slate-800 border-2 border-slate-300 shadow-inner" />
        </div>

        {/* Top Red Event Banner */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-rose-800 text-white p-5 text-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

          {/* Optional Event Date Badge */}
          {hasDate && (
            <div className="inline-block px-3 py-1 rounded-md bg-white/20 border border-white/30 text-[11px] font-mono font-bold tracking-widest text-white mb-2 shadow-sm">
              {ticket.eventDate} {ticket.eventTime ? `• ${ticket.eventTime}` : ''}
            </div>
          )}

          {/* Custom Logo if available */}
          {ticket.customLogoUrl && (
            <div className="mb-2 flex justify-center">
              <img
                src={ticket.customLogoUrl}
                alt="Event Logo"
                className="h-10 w-auto max-w-[140px] object-contain rounded bg-white/90 p-1 shadow-md"
              />
            </div>
          )}

          {/* BOLD EVENT NAME */}
          <h2 className="text-xl sm:text-2xl font-black uppercase font-heading tracking-tight leading-tight text-white drop-shadow">
            {ticket.eventName}
          </h2>

          {hasVenue && (
            <p className="text-[11px] text-red-100/90 font-medium mt-1 truncate">
              {ticket.venue}
            </p>
          )}
        </div>

        {/* Middle Body: Photo, Name & Role */}
        <div className="p-6 text-center space-y-4 bg-slate-50">
          {/* Person Photo Frame */}
          <div className="relative w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-red-600 to-amber-400 shadow-xl">
            {ticket.holderPhotoUrl ? (
              <img
                src={ticket.holderPhotoUrl}
                alt={ticket.holderName || 'Staff Member'}
                className="w-full h-full object-cover rounded-full border-2 border-white bg-slate-200"
              />
            ) : (
              <div className="w-full h-full rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-400">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Holder Name (Optional/Fallback) */}
          {hasHolder && (
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase font-heading tracking-wide">
                {ticket.holderName}
              </h3>
            </div>
          )}

          {/* Role / Position Tag & Category Tag */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="inline-block px-3.5 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
              {ticket.holderRole || 'EVENT STAFF'}
            </span>
            {ticket.category && (
              <span className="inline-block px-3 py-1 rounded-full bg-slate-900 text-amber-300 border border-amber-400/60 font-extrabold text-xs uppercase tracking-wider shadow-md">
                {ticket.category === 'all_access' ? 'ALL ACCESS' : ticket.category.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>

          {/* ID Serial Number & QR Code */}
          <div className="pt-3 border-t border-slate-200 flex flex-col items-center gap-2">
            <div className="p-2.5 bg-white rounded-xl border border-slate-300 shadow-md">
              <QRCodeSVG value={ticket.qrCodeData || ticket.ticketCode} size={95} level="H" />
            </div>

            <div className="font-mono text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">OFFICIAL BADGE ID</p>
              <p className="text-xs font-black text-slate-800">{ticket.ticketCode}</p>
            </div>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="bg-slate-900 text-slate-300 py-2 px-4 text-[10px] font-mono text-center border-t border-slate-800 flex justify-between items-center">
          <span>COURTSIDE CREDENTIAL</span>
          <span className="text-red-400 font-bold uppercase">
            {ticket.category === 'all_access' ? 'ALL ACCESS PASS' : ticket.category ? `${ticket.category.replace('_', ' ')} PASS` : 'STAFF ACCESS'}
          </span>
        </div>
      </div>
    );
  }

  // =========================================================
  // TYPE 3: JUST THE QR CODE (STANDALONE QR CARD)
  // =========================================================
  if (passType === 'qr_only') {
    return (
      <div
        id={`ticket-pass-${ticket.id}`}
        className={`relative w-full max-w-[340px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/60 bg-slate-950 text-white p-6 transition-all ${className}`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            {ticket.customLogoUrl ? (
              <img src={ticket.customLogoUrl} alt="Logo" className="h-8 w-auto object-contain rounded bg-slate-900 p-1" />
            ) : (
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <QrCode className="w-4 h-4" />
              </div>
            )}
            <span className="text-xs font-heading font-black text-amber-400 uppercase tracking-wider">
              {ticket.category === 'all_access' ? 'ALL ACCESS QR' : ticket.category ? `${ticket.category.replace('_', ' ')} QR` : 'GATE ACCESS QR'}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded bg-slate-900 border border-amber-400/50 text-[10px] font-mono text-amber-300 font-extrabold uppercase">
            {ticket.category === 'all_access' ? 'ALL ACCESS' : ticket.category ? ticket.category.replace('_', ' ').toUpperCase() : 'VERIFIED'}
          </span>
        </div>

        {/* Event Title */}
        <div className="mt-4 text-center space-y-1">
          <h3 className="text-lg font-black text-white uppercase font-heading tracking-tight leading-snug">
            {ticket.eventName}
          </h3>
          {hasDate && (
            <p className="text-xs text-amber-300/90 font-mono font-medium">
              {ticket.eventDate} {ticket.eventTime ? `• ${ticket.eventTime}` : ''}
            </p>
          )}
        </div>

        {/* Central QR Code */}
        <div className="my-6 p-4 bg-white rounded-2xl shadow-2xl border-2 border-amber-400 flex flex-col items-center justify-center mx-auto w-fit">
          <QRCodeSVG value={ticket.qrCodeData || ticket.ticketCode} size={160} level="H" />
        </div>

        {/* Holder name only (optional) — the serial/ticket code is intentionally
            NOT shown as visible text here. It's encoded inside the QR data
            (ticket.qrCodeData) so it stays hidden from anyone looking at the
            card, and is only revealed by scanning. */}
        {hasHolder && (
          <div className="text-center font-mono">
            <p className="text-xs font-bold text-slate-200 uppercase">{ticket.holderName}</p>
          </div>
        )}
      </div>
    );
  }

  // =========================================================
  // TYPE 1: TICKET (LANDSCAPE FORMAT)
  // =========================================================
  const themeKey: TicketCanvasThemeId = ticket.themeId || (
    ticket.category === 'courtside_vip' ? 'gold_foil_vip' :
    ticket.category === 'vip' ? 'purple_gold_sports' :
    ticket.category === 'courtside_floor' ? 'neon_esports' :
    ticket.category === 'media' ? 'sleek_black_match' : 'courtside_classic'
  );

  const theme = CANVAS_THEMES[themeKey] || CANVAS_THEMES.gold_foil_vip;
  const legacyTpl = PASS_TEMPLATES[ticket.category] || PASS_TEMPLATES.general_access;

  return (
    <div
      id={`ticket-pass-${ticket.id}`}
      className={`relative w-full max-w-[720px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 ${theme.borderClass} bg-gradient-to-br ${theme.bgClass} text-white transition-all ${className}`}
    >
      {/* Always rendered as a row (never stacks to a column) so the exported
          image/print output is guaranteed landscape at any container width,
          as requested — tickets should always be landscape. */}
      <div className="relative flex flex-row items-stretch">
        {/* Left Side Accent Strip */}
        <div className="bg-amber-500 text-black font-black text-[10px] tracking-widest uppercase flex items-center justify-center p-2.5 w-10 shrink-0 border-r border-amber-400/50 select-none">
          <span className="-rotate-90 whitespace-nowrap font-mono tracking-widest">
            OFFICIAL TICKET ★ {ticket.category.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Main Body */}
        <div className="p-5 sm:p-6 flex-1 space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              {ticket.customLogoUrl ? (
                <img src={ticket.customLogoUrl} alt="Logo" className="h-10 w-auto max-w-[120px] object-contain rounded-lg border border-white/20 bg-black/40 p-1" />
              ) : (
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 font-extrabold text-lg">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
              )}
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase block">
                  COURTSIDE EVENT PASS
                </span>
                <span className="text-xs text-slate-300 font-semibold tracking-wider">
                  VERIFIED ADMISSION PASS
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/80 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{ticket.category.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>

          {/* BOLD Event Name Headline */}
          <div>
            <p className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest">EVENT TITLE</p>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 uppercase tracking-tight font-heading leading-tight drop-shadow-md">
              {ticket.eventName}
            </h2>

            {(hasDate || hasVenue) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-200 font-medium">
                {hasDate && (
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    {ticket.eventDate} {ticket.eventTime ? `• ${ticket.eventTime}` : ''}
                  </span>
                )}
                {hasVenue && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {ticket.venue}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Recipient & Seating Box — ONLY DISPLAY IF PRESENT! */}
          {(hasHolder || hasSeating) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono">
              {hasHolder && (
                <div className={hasSeating ? 'col-span-2' : 'col-span-4'}>
                  <p className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">PASS HOLDER</p>
                  <p className="font-extrabold text-white text-sm truncate">{ticket.holderName}</p>
                </div>
              )}

              {ticket.section && (
                <div>
                  <p className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">SECTION</p>
                  <p className="font-bold text-amber-300">{ticket.section}</p>
                </div>
              )}

              {(ticket.row || ticket.seatNumber) && (
                <div>
                  <p className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">ROW / SEAT</p>
                  <p className="font-bold text-white">{ticket.row || '-'} / {ticket.seatNumber || '-'}</p>
                </div>
              )}

              {ticket.gateEntry && (
                <div>
                  <p className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">GATE</p>
                  <p className="font-bold text-emerald-400">{ticket.gateEntry}</p>
                </div>
              )}
            </div>
          )}

          {/* Price & Serial */}
          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <span className="text-amber-400 font-bold text-sm">
              {hasPrice ? `$${ticket.price} ${ticket.currency}` : 'ADMISSION TICKET'}
            </span>
            <span className="text-slate-400 font-bold text-[11px]">
              NO : {ticket.ticketCode}
            </span>
          </div>
        </div>

        {/* Right Stub Section with QR Code */}
        {showStub && (
          <div className="p-5 w-48 bg-black/40 border-l border-dashed border-white/20 flex flex-col items-center justify-center space-y-3 shrink-0 relative">
            <div className="p-2 bg-white rounded-xl shadow-lg border border-amber-300">
              <QRCodeSVG value={ticket.qrCodeData || ticket.ticketCode} size={110} level="H" />
            </div>

            <div className="text-center font-mono space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">SCAN FOR ENTRY</p>
              <p className="text-[11px] font-extrabold text-white">{ticket.ticketCode}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
