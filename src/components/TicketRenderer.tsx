import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PassTicket, TicketCanvasThemeId, TemplateCustomization } from '../types';
import { CANVAS_THEMES, PASS_TEMPLATES, getAllThemes, CanvasThemeDefinition } from '../lib/ticketTemplateMap';
import { renderPattern, SecurityWatermarkPattern } from './ticket-patterns/TicketPatterns';
import { Calendar, MapPin, Trophy, Sparkles, Award, Gamepad2, User, QrCode } from 'lucide-react';

import { formatCurrency } from '../lib/currency';

interface TicketRendererProps {
  ticket: PassTicket;
  showStub?: boolean;
  compact?: boolean;
  className?: string;
  onPrint?: () => void;
}

const FONT_CLASS: Record<string, string> = {
  sans: 'font-sans',
  heading: 'font-heading',
  serif: 'font-serif',
  mono: 'font-mono',
  display: 'font-heading uppercase tracking-tight',
  stencil: 'font-mono uppercase tracking-[0.2em]',
};

const CORNER_CLASS: Record<string, string> = {
  notch_cutouts: 'rounded-2xl [clip-path:polygon(16px_0,calc(100%-16px)_0,100%_16px,100%_calc(100%-16px),calc(100%-16px)_100%,16px_100%,0_calc(100%-16px),0_16px)]',
  rounded_lg: 'rounded-3xl',
  sharp_square: 'rounded-none',
  pill_edges: 'rounded-[2.5rem]',
};

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
  // TYPE 1: TICKET — fully template-engine driven
  // =========================================================
  const themeKey: TicketCanvasThemeId = ticket.themeId || (
    ticket.category === 'courtside_vip' ? 'gold_foil_vip' :
    ticket.category === 'vip' ? 'purple_gold_sports' :
    ticket.category === 'courtside_floor' ? 'neon_esports' :
    ticket.category === 'media' ? 'sleek_black_match' : 'courtside_classic'
  );

  const allThemes = getAllThemes();
  const theme: CanvasThemeDefinition = allThemes[themeKey] || CANVAS_THEMES.gold_foil_vip;
  const legacyTpl = PASS_TEMPLATES[ticket.category] || PASS_TEMPLATES.general_access;
  const c: TemplateCustomization = ticket.customization || {};

  // Resolve effective values: per-ticket customization overrides win, theme is the default.
  const mode = c.mode || theme.mode;
  const isLight = mode === 'light';
  const colors = {
    primary: c.primaryColor || theme.colors.primary,
    secondary: c.secondaryColor || theme.colors.secondary,
    accent: c.accentColor || theme.colors.accent,
  };
  const orientation = c.orientation || theme.defaultOrientation;
  const isPortrait = orientation === 'portrait';
  const cornerStyle = c.cornerStyle || theme.cornerStyle;
  const borderStyle = c.borderStyle || theme.borderStyle;
  const badgeStyle = c.badgeStyle || theme.badgeStyle;
  const qrFrameStyle = c.qrFrameStyle || theme.qrFrameStyle;
  const fontFamily = c.fontFamily || theme.fontFamily;
  const sponsorPos = c.sponsorLogoPosition || theme.sponsorLogoPosition;
  const watermark = c.securityWatermark || theme.securityWatermark;
  const fontColor = c.fontColor;

  const fontClass = FONT_CLASS[fontFamily] || 'font-sans';
  const cornerClass = CORNER_CLASS[cornerStyle] || 'rounded-3xl';

  // Border rendering per style — each produces a distinct premium finish
  // without fighting the corner clip-path above.
  const borderStyleProps: React.CSSProperties = (() => {
    switch (borderStyle) {
      case 'solid_gold':
        return { border: `2px solid ${colors.accent}` };
      case 'neon_glow':
        return { border: `1.5px solid ${colors.accent}`, boxShadow: `0 0 24px ${colors.accent}66, 0 0 2px ${colors.accent}` };
      case 'double_metallic':
        return { border: `2px solid ${colors.accent}`, boxShadow: `0 0 0 4px ${colors.primary}, 0 0 0 5px ${colors.accent}55` };
      case 'dashed_stub':
        return { border: `2px dashed ${colors.accent}99` };
      case 'chamfer':
        return { border: `2px solid ${colors.accent}`, boxShadow: `inset 0 0 0 3px ${colors.secondary}` };
      case 'none':
      default:
        return { border: '1px solid rgba(255,255,255,0.06)' };
    }
  })();

  const panelBg = isLight ? 'bg-white/70 border-black/10' : 'bg-black/50 border-white/10';
  const panelText = isLight ? 'text-slate-900' : 'text-white';
  const mutedText = isLight ? 'text-slate-500' : 'text-slate-300';
  const bgBase = isLight ? 'bg-gradient-to-br from-white via-slate-50 to-slate-100' : `bg-gradient-to-br ${theme.bgClass}`;

  const BadgeShape: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const base = 'text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1 shrink-0 px-2.5 sm:px-3 py-1';
    switch (badgeStyle) {
      case 'shield_crest':
        return (
          <div
            className={`${base} [clip-path:polygon(50%_0,100%_18%,100%_75%,50%_100%,0_75%,0_18%)] px-3.5`}
            style={{ background: `${colors.accent}33`, color: colors.accent, border: `1px solid ${colors.accent}` }}
          >
            {children}
          </div>
        );
      case 'metallic_ribbon':
        return (
          <div
            className={`${base} [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]`}
            style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.primary})`, color: isLight ? '#1e293b' : '#fff' }}
          >
            {children}
          </div>
        );
      case 'gold_tag':
        return (
          <div
            className={`${base} rounded-l-full [clip-path:polygon(0_0,85%_0,100%_50%,85%_100%,0_100%)]`}
            style={{ background: colors.accent, color: '#1e293b' }}
          >
            {children}
          </div>
        );
      case 'minimal_block':
        return (
          <div className={`${base} rounded-none`} style={{ border: `1px solid ${colors.accent}`, color: colors.accent }}>
            {children}
          </div>
        );
      case 'pill_stars':
      default:
        return (
          <div className={`${base} rounded-full`} style={{ background: `${colors.accent}22`, color: colors.accent, border: `1px solid ${colors.accent}88` }}>
            {children}
          </div>
        );
    }
  };

  const QrFrame: React.FC<{ size: number }> = ({ size }) => {
    const qrNode = <QRCodeSVG value={ticket.qrCodeData || ticket.ticketCode} size={size} level="H" />;
    switch (qrFrameStyle) {
      case 'gold_metallic':
        return (
          <div className="relative p-2 rounded-xl" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary}, ${colors.accent})` }}>
            <div className="bg-white rounded-lg p-1.5">{qrNode}</div>
          </div>
        );
      case 'corner_crosshairs':
        return (
          <div className="relative p-2 bg-white rounded-lg">
            {qrNode}
            {(['-top-1 -left-1 border-t-2 border-l-2', '-top-1 -right-1 border-t-2 border-r-2', '-bottom-1 -left-1 border-b-2 border-l-2', '-bottom-1 -right-1 border-b-2 border-r-2']).map((pos, i) => (
              <span key={i} className={`absolute w-3 h-3 ${pos}`} style={{ borderColor: colors.accent }} />
            ))}
          </div>
        );
      case 'glass_card':
        return (
          <div className="p-2.5 rounded-xl backdrop-blur-md bg-white/80 border border-white/60 shadow-lg">
            {qrNode}
          </div>
        );
      case 'minimal':
        return <div className="p-1.5 bg-white rounded-md">{qrNode}</div>;
      case 'security_glow':
      default:
        return (
          <div className="relative p-2.5 bg-white rounded-xl shadow-lg" style={{ boxShadow: `0 0 18px ${colors.accent}77` }}>
            {qrNode}
          </div>
        );
    }
  };

  return (
    <div
      id={`ticket-pass-${ticket.id}`}
      className={`relative w-full ${isPortrait ? 'max-w-[420px]' : 'max-w-[720px]'} mx-auto overflow-hidden shadow-2xl ${bgBase} ${panelText} ${fontClass} ${cornerClass} transition-all ${className}`}
      style={borderStyleProps}
    >
      {/* Layered SVG background pattern — pure vector, scales cleanly for export */}
      {renderPattern(theme.patternId, { primary: colors.primary, secondary: colors.secondary, accent: colors.accent })}

      <div className={`relative flex ${isPortrait ? 'flex-col' : 'flex-col sm:flex-row'} items-stretch`}>
        {/* Left/Top Accent Strip */}
        <div
          className={`font-black text-[10px] tracking-widest uppercase flex ${isPortrait ? '' : 'sm:flex-col'} items-center justify-between ${isPortrait ? '' : 'sm:justify-center'} p-2 sm:p-2.5 w-full ${isPortrait ? '' : 'sm:w-10'} shrink-0 border-b ${isPortrait ? '' : 'sm:border-b-0 sm:border-r'} select-none`}
          style={{ background: colors.accent, color: isLight ? '#1e293b' : '#000', borderColor: `${colors.accent}80` }}
        >
          <span className={`${isPortrait ? '' : 'sm:-rotate-90'} whitespace-nowrap font-mono tracking-widest`}>
            OFFICIAL TICKET ★ {ticket.category.replace('_', ' ').toUpperCase()}
          </span>
          <span className="sm:hidden text-[9px] font-mono font-bold">{ticket.ticketCode}</span>
        </div>

        {/* Main Body */}
        <div className="relative p-3.5 sm:p-6 flex-1 space-y-3 sm:space-y-4">
          {/* Header Bar */}
          <div className={`flex items-center justify-between gap-2 sm:gap-4 border-b pb-2.5 sm:pb-3`} style={{ borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2 sm:gap-3">
              {ticket.customLogoUrl && sponsorPos === 'top_header' ? (
                <img src={ticket.customLogoUrl} alt="Logo" className="h-8 sm:h-10 w-auto max-w-[100px] sm:max-w-[120px] object-contain rounded-lg border border-white/20 bg-black/40 p-1" />
              ) : (
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center font-extrabold text-base sm:text-lg" style={{ background: `${colors.accent}22`, border: `1px solid ${colors.accent}88` }}>
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.accent }} />
                </div>
              )}
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase block" style={{ color: colors.accent }}>
                  {theme.tagline}
                </span>
                <span className={`text-[10px] sm:text-xs font-semibold tracking-wider block ${mutedText}`}>
                  VERIFIED ADMISSION PASS
                </span>
              </div>
            </div>

            <BadgeShape>
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{theme.badgeText}</span>
            </BadgeShape>
          </div>

          {/* BOLD Event Name Headline */}
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest" style={{ color: `${colors.accent}cc` }}>EVENT TITLE</p>
            <h2 className={`text-lg sm:text-2xl font-black uppercase tracking-tight leading-tight drop-shadow-md ${isLight ? '' : ''}`} style={{ color: isLight ? colors.primary : colors.accent }}>
              {ticket.eventName}
            </h2>

            {(hasDate || hasVenue) && (
              <div className={`flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-1 text-[11px] sm:text-xs font-medium ${panelText}`}>
                {hasDate && (
                  <span className="flex items-center gap-1 font-bold" style={{ color: colors.accent }}>
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {ticket.eventDate} {ticket.eventTime ? `• ${ticket.eventTime}` : ''}
                  </span>
                )}
                {hasVenue && (
                  <span className={`flex items-center gap-1 ${mutedText}`}>
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: colors.accent }} />
                    {ticket.venue}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Recipient & Seating Box — glassmorphism panel, ONLY IF PRESENT */}
          {(hasHolder || hasSeating) && (
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-2xl backdrop-blur-md border text-xs font-mono ${panelBg}`}>
              {hasHolder && (
                <div className={hasSeating ? 'col-span-2' : 'col-span-4'}>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold" style={{ color: colors.accent }}>PASS HOLDER</p>
                  <p className={`font-extrabold text-xs sm:text-sm truncate ${panelText}`}>{ticket.holderName}</p>
                </div>
              )}
              {ticket.section && (
                <div>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold" style={{ color: colors.accent }}>SECTION</p>
                  <p className="font-bold text-xs" style={{ color: colors.accent }}>{ticket.section}</p>
                </div>
              )}
              {(ticket.row || ticket.seatNumber) && (
                <div>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold" style={{ color: colors.accent }}>ROW / SEAT</p>
                  <p className={`font-bold text-xs ${panelText}`}>{ticket.row || '-'} / {ticket.seatNumber || '-'}</p>
                </div>
              )}
              {ticket.gateEntry && (
                <div>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold" style={{ color: colors.accent }}>GATE</p>
                  <p className="font-bold text-xs text-emerald-400">{ticket.gateEntry}</p>
                </div>
              )}
            </div>
          )}

          {/* Price & Serial */}
          <div className="flex items-center justify-between text-xs font-mono pt-0.5 sm:pt-1">
            <span className="font-bold text-xs sm:text-sm" style={{ color: colors.accent }}>
              {hasPrice ? formatCurrency(ticket.price, ticket.currency) : 'ADMISSION TICKET'}
            </span>
            <span className={`font-bold text-[10px] sm:text-[11px] ${mutedText}`}>
              NO : {ticket.ticketCode}
            </span>
          </div>

          {/* Sponsor logo in footer position */}
          {ticket.customLogoUrl && sponsorPos === 'footer' && (
            <div className="flex justify-center pt-1">
              <img src={ticket.customLogoUrl} alt="Sponsor" className="h-6 w-auto max-w-[110px] object-contain opacity-80" />
            </div>
          )}
        </div>

        {/* Stub Section with QR Code + hidden watermark behind it */}
        {showStub && (
          <div
            className={`relative p-3.5 sm:p-5 w-full ${isPortrait ? '' : 'sm:w-48'} border-t ${isPortrait ? '' : 'sm:border-t-0 sm:border-l'} border-dashed flex flex-row ${isPortrait ? '' : 'sm:flex-col'} items-center justify-between ${isPortrait ? '' : 'sm:justify-center'} gap-3 sm:space-y-3 shrink-0 overflow-hidden`}
            style={{ borderColor: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)', background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.35)' }}
          >
            {watermark !== 'none' && <SecurityWatermarkPattern color={colors.accent} />}
            <div className="relative shrink-0">
              <QrFrame size={isPortrait ? 110 : 90} />
            </div>

            <div className="relative text-right sm:text-center font-mono space-y-0.5">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.accent }}>SCAN FOR ENTRY</p>
              <p className={`text-xs sm:text-[11px] font-extrabold ${panelText}`}>{ticket.ticketCode}</p>
            </div>

            {ticket.customLogoUrl && sponsorPos === 'bottom_stub' && (
              <img src={ticket.customLogoUrl} alt="Sponsor" className="hidden sm:block h-6 w-auto max-w-[90px] object-contain opacity-80 relative" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
