import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PassTicket, TicketCanvasThemeId } from '../types';
import { TICKET_TEMPLATES, FONT_FAMILY_CLASS } from '../lib/ticketTemplates';
import { BaseWashSVG, TicketArtProps } from './ticket-templates/TicketBackgroundArt';
import {
  getBorderClass, getBorderGlowStyle,
  getCornerClass, getCornerClipPath
} from './ticket-templates/TicketStyleParts';
import { Calendar, MapPin, Trophy, User, QrCode, Clock } from 'lucide-react';

import { formatCurrency } from '../lib/currency';

interface TicketRendererProps {
  ticket: PassTicket;
  showStub?: boolean;
  compact?: boolean;
  className?: string;
  onPrint?: () => void;
  isExport?: boolean;
}

// Default Event Logo SVG Emblem when no custom image is uploaded
const DefaultEventLogoSVG: React.FC<{ className?: string; color?: string }> = ({
  className = 'h-20 w-auto',
  color = '#f59e0b',
}) => (
  <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Shield */}
    <path
      d="M80 8L140 32V80C140 118 80 152 80 152C80 152 20 118 20 80V32L80 8Z"
      fill="#0f172a"
      stroke={color}
      strokeWidth="5"
    />
    <path
      d="M80 16L132 37V78C132 110 80 140 80 140C80 140 28 110 28 78V37L80 16Z"
      fill="#1e293b"
      stroke="#334155"
      strokeWidth="2"
    />
    {/* Basketball Emblem */}
    <circle cx="80" cy="68" r="32" fill="#ea580c" stroke="#ffffff" strokeWidth="3" />
    <path d="M48 68H112" stroke="#ffffff" strokeWidth="2.5" />
    <path d="M80 36V100" stroke="#ffffff" strokeWidth="2.5" />
    <path d="M58 48C68 58 68 78 58 88" stroke="#ffffff" strokeWidth="2.5" fill="none" />
    <path d="M102 48C92 58 92 78 102 88" stroke="#ffffff" strokeWidth="2.5" fill="none" />
    {/* Banner Ribbon */}
    <path
      d="M24 112L40 102H120L136 112L120 128H40L24 112Z"
      fill={color}
      stroke="#ffffff"
      strokeWidth="2"
    />
    <text x="80" y="120" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
      CHAMPIONSHIP
    </text>
    {/* Top Star */}
    <path d="M80 20L82.5 26.5H89.5L84 30.5L86 37L80 33L74 37L76 30.5L70.5 26.5H77.5L80 20Z" fill="#ffffff" />
  </svg>
);

// Format Category Label for Badge
const getCategoryLabel = (category?: string): string => {
  if (!category) return 'REGULAR';
  const c = category.toLowerCase();
  if (c === 'vvip') return 'VVIP';
  if (c === 'vip' || c === 'courtside_vip') return 'VIP';
  if (c === 'all_access') return 'ALL ACCESS';
  if (c === 'media') return 'MEDIA';
  if (c === 'player_staff' || c === 'staff') return 'STAFF';
  if (c === 'courtside_floor' || c === 'courtside_box') return 'COURTSIDE';
  if (c === 'regular' || c === 'general_access') return 'REGULAR';
  return category.replace(/_/g, ' ').toUpperCase();
};

export const TicketRenderer: React.FC<TicketRendererProps> = ({
  ticket,
  showStub = true,
  className = '',
  isExport = false,
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
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

          {hasDate && (
            <div className="inline-block px-3 py-1 rounded-md bg-white/20 border border-white/30 text-[11px] font-mono font-bold tracking-widest text-white mb-2 shadow-sm">
              {ticket.eventDate} {ticket.eventTime ? `• ${ticket.eventTime}` : ''}
            </div>
          )}

          {ticket.customLogoUrl ? (
            <div className="mb-2 flex justify-center">
              <img
                src={ticket.customLogoUrl}
                alt="Event Logo"
                className="h-12 w-auto max-w-[140px] object-contain rounded bg-white/90 p-1 shadow-md"
              />
            </div>
          ) : (
            <div className="mb-2 flex justify-center">
              <DefaultEventLogoSVG className="h-14 w-auto" color="#f59e0b" />
            </div>
          )}

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

          {hasHolder && (
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase font-heading tracking-wide">
                {ticket.holderName}
              </h3>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="inline-block px-3.5 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
              {ticket.holderRole || 'EVENT STAFF'}
            </span>
            <span className="inline-block px-3 py-1 rounded-full bg-slate-900 text-amber-300 border border-amber-400/60 font-extrabold text-xs uppercase tracking-wider shadow-md">
              {getCategoryLabel(ticket.category)}
            </span>
          </div>

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

        <div className="bg-slate-900 text-slate-300 py-2 px-4 text-[10px] font-mono text-center border-t border-slate-800 flex justify-between items-center">
          <span>COURTIQ CREDENTIAL</span>
          <span className="text-red-400 font-bold uppercase">
            {getCategoryLabel(ticket.category)} PASS
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
              {getCategoryLabel(ticket.category)} QR
            </span>
          </div>

          <span className="px-2 py-0.5 rounded bg-slate-900 border border-amber-400/50 text-[10px] font-mono text-amber-300 font-extrabold uppercase">
            {getCategoryLabel(ticket.category)}
          </span>
        </div>

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

        <div className="my-6 p-4 bg-white rounded-2xl shadow-2xl border-2 border-amber-400 flex flex-col items-center justify-center mx-auto w-fit">
          <QRCodeSVG value={ticket.qrCodeData || ticket.ticketCode} size={160} level="H" />
        </div>

        {hasHolder && (
          <div className="text-center font-mono">
            <p className="text-xs font-bold text-slate-200 uppercase">{ticket.holderName}</p>
          </div>
        )}
      </div>
    );
  }

  // =========================================================
  // TYPE 1: PREMIUM LANDSCAPE EVENT TICKET (1400x600 ASPECT RATIO 7:3)
  // =========================================================
  const templateId: TicketCanvasThemeId = ticket.themeId || (
    ticket.category === 'courtside_vip' ? 'gold_championship' :
    ticket.category === 'vip' ? 'violet_allstar' :
    ticket.category === 'vvip' ? 'platinum_vvip' :
    ticket.category === 'courtside_floor' ? 'midnight_neon' :
    ticket.category === 'media' ? 'media_press_pass' :
    ticket.category === 'courtside_box' ? 'ice_arena' : 'royal_courtside'
  );

  const template = TICKET_TEMPLATES[templateId] || TICKET_TEMPLATES.royal_courtside;

  const custom = ticket.templateCustomization || {};
  const themeMode = ticket.templateThemeMode || template.themeMode;
  const primaryColor = custom.primaryColor || template.defaults.primaryColor;
  const secondaryColor = custom.secondaryColor || template.defaults.secondaryColor;
  const accentColor = custom.accentColor || '#f59e0b';
  const fontColor = custom.fontColor || '#ffffff';
  const fontClass = FONT_FAMILY_CLASS[custom.fontFamily || template.defaults.fontFamily];
  const borderStyle = custom.borderStyle || template.defaults.borderStyle;
  const cornerStyle = custom.cornerStyle || template.defaults.cornerStyle;
  const orientation = custom.orientation || template.defaults.orientation;
  const bgImage = custom.backgroundImageUrl ?? template.backgroundImageUrl ?? template.defaults.backgroundImageUrl;
  const overlayOpacity = custom.bgOverlayOpacity ?? template.defaults.bgOverlayOpacity ?? 0.35;
  const isPortrait = orientation === 'portrait';
  const uid = ticket.id.replace(/[^a-zA-Z0-9]/g, '').slice(-8) || 'x';

  const artProps: TicketArtProps = { primaryColor, secondaryColor, accentColor, themeMode, uid };
  const cardBg = bgImage ? (themeMode === 'dark' ? 'bg-slate-950/40' : 'bg-white/40') : (themeMode === 'dark' ? 'bg-slate-950/60' : 'bg-white/70');
  const cardText = themeMode === 'dark' ? 'text-white' : 'text-slate-900';
  const mutedText = themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600';

  const cornerClipPath = getCornerClipPath(cornerStyle);
  const cornerClass = getCornerClass(cornerStyle);

  const categoryLabel = getCategoryLabel(ticket.category);

  // ---------------------------------------------------------
  // 1. EXACT EXPORT CANVAS (FIXED 1400px x 600px AT 7:3 ASPECT RATIO)
  // ---------------------------------------------------------
  if (isExport) {
    const exportWidth = isPortrait ? 600 : 1400;
    const exportHeight = isPortrait ? 1000 : 600;

    return (
      <div
        id={`ticket-pass-${ticket.id}`}
        data-ticket-json={JSON.stringify(ticket)}
        className={`relative overflow-hidden shadow-2xl bg-slate-950 ${getBorderClass(borderStyle)} ${cornerClass} ${cardText} ${fontClass}`}
        style={{
          width: `${exportWidth}px`,
          height: `${exportHeight}px`,
          minWidth: `${exportWidth}px`,
          minHeight: `${exportHeight}px`,
          maxWidth: `${exportWidth}px`,
          maxHeight: `${exportHeight}px`,
          boxSizing: 'border-box',
          overflow: 'hidden',
          ...getBorderGlowStyle(borderStyle, accentColor),
          clipPath: cornerClipPath,
        }}
      >
        {/* Graphic Background Artwork Image OR Layered Vector SVG */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {bgImage ? (
            <>
              <img
                src={bgImage}
                alt="Ticket Graphic Background"
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: themeMode === 'dark' ? '#020617' : '#ffffff',
                  opacity: overlayOpacity,
                }}
              />
            </>
          ) : (
            <>
              <BaseWashSVG {...artProps} />
              {template.artLayers.map((Layer, i) => (
                <Layer key={i} {...artProps} />
              ))}
            </>
          )}
        </div>

        <div className="relative flex flex-row flex-nowrap items-stretch w-[1400px] h-[600px] overflow-hidden box-sizing-border-box">
          {/* Left Accent Strip */}
          <div
            className="font-black text-xs tracking-widest uppercase flex flex-col items-center justify-center p-3 w-[52px] h-[600px] shrink-0 border-r select-none box-sizing-border-box"
            style={{ backgroundColor: accentColor, color: themeMode === 'dark' ? '#0f172a' : '#ffffff', borderColor: `${accentColor}40` }}
          >
            <span className="-rotate-90 whitespace-nowrap font-mono tracking-widest text-sm font-black">
              ★ OFFICIAL TICKET ★
            </span>
          </div>

          {/* Main Ticket Body */}
          <div className="p-8 flex-1 h-[600px] flex flex-col justify-between relative overflow-hidden box-sizing-border-box">
            {/* Header Row: Large Event Logo (Left), Centered Title (Center), Ticket Type Badge (Right) */}
            <div className="flex items-center justify-between gap-6 border-b pb-4" style={{ borderColor: `${accentColor}30` }}>
              {/* Event Logo Placement (70-90px Prominent) */}
              <div className="shrink-0 flex items-center min-w-[180px]">
                {ticket.customLogoUrl ? (
                  <img
                    src={ticket.customLogoUrl}
                    alt="Event Logo"
                    className="h-20 w-auto max-w-[200px] object-contain filter drop-shadow-lg"
                  />
                ) : (
                  <DefaultEventLogoSVG className="h-20 w-auto" color={accentColor} />
                )}
              </div>

              {/* Event Title (Centered, Primary Visual Focus, NO 'EVENT TITLE' Label) */}
              <div className="flex-1 text-center px-4">
                <h2
                  className={`text-4xl font-black uppercase tracking-tight leading-tight drop-shadow-lg ${fontClass}`}
                  style={{ color: fontColor }}
                >
                  {ticket.eventName}
                </h2>
              </div>

              {/* Ticket Type Badge (Top Right) */}
              <div className="shrink-0 min-w-[140px] flex justify-end">
                <span
                  className="inline-block px-5 py-2 rounded-full border-2 font-black text-sm tracking-widest uppercase shadow-xl backdrop-blur-md"
                  style={{
                    borderColor: accentColor,
                    color: accentColor,
                    backgroundColor: `${accentColor}18`,
                    boxShadow: `0 0 15px ${accentColor}30`,
                  }}
                >
                  {categoryLabel}
                </span>
              </div>
            </div>

            {/* Middle Info Bar (Date, Time, Venue) */}
            <div className="grid grid-cols-3 gap-6 py-4 px-6 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md font-mono my-2">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                  <Calendar className="w-6 h-6" style={{ color: accentColor }} />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-white text-base truncate">
                    {ticket.eventDate || 'EVENT DATE'}
                  </p>
                  <p className="text-xs font-semibold text-slate-400 truncate">
                    SATURDAY
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                  <Clock className="w-6 h-6" style={{ color: accentColor }} />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-white text-base truncate">
                    {ticket.eventTime || '06:00 PM'}
                  </p>
                  <p className="text-xs font-semibold text-slate-400 truncate">
                    DOORS OPEN 05:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                  <MapPin className="w-6 h-6" style={{ color: accentColor }} />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-white text-base truncate">
                    {ticket.venue || 'SKD SPORTS COMPLEX'}
                  </p>
                  <p className="text-xs font-semibold text-slate-400 truncate">
                    MONROVIA, LIBERIA
                  </p>
                </div>
              </div>
            </div>

            {/* Recipient & Seating Details (if present) */}
            {(hasHolder || hasSeating) && (
              <div className="grid grid-cols-4 gap-4 p-3.5 rounded-xl bg-black/30 border border-white/10 text-xs font-mono">
                {hasHolder && (
                  <div className={hasSeating ? 'col-span-2' : 'col-span-4'}>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: accentColor }}>PASS HOLDER</p>
                    <p className="font-extrabold text-sm truncate text-white">{ticket.holderName}</p>
                  </div>
                )}
                {ticket.section && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: accentColor }}>SECTION</p>
                    <p className="font-bold text-xs text-amber-400">{ticket.section}</p>
                  </div>
                )}
                {(ticket.row || ticket.seatNumber) && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: accentColor }}>ROW / SEAT</p>
                    <p className="font-bold text-xs text-white">{ticket.row || '-'}/{ticket.seatNumber || '-'}</p>
                  </div>
                )}
                {ticket.gateEntry && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: accentColor }}>GATE</p>
                    <p className="font-bold text-xs text-emerald-400">{ticket.gateEntry}</p>
                  </div>
                )}
              </div>
            )}

            {/* Price & Single Dedicated Ticket Number */}
            <div className="flex items-end justify-between font-mono pt-2">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  TICKET PRICE
                </p>
                <p className="text-2xl font-black text-white tracking-tight" style={{ color: accentColor }}>
                  {hasPrice ? formatCurrency(ticket.price, ticket.currency) : '$35 USD'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  TICKET NO.
                </p>
                <p className="text-base font-extrabold text-amber-400 tracking-wider">
                  {ticket.ticketCode}
                </p>
              </div>
            </div>
          </div>

          {/* Perforated Divider + Stub Section with QR Code */}
          {showStub && (
            <div className="relative p-6 w-[340px] h-[600px] bg-slate-950/80 border-l-2 border-dashed border-slate-700/60 flex flex-col items-center justify-center gap-4 shrink-0 box-sizing-border-box">
              {/* Top & Bottom Perforation Notches */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-slate-950 rounded-full z-10 border border-slate-800" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-950 rounded-full z-10 border border-slate-800" />

              {/* Clean White QR Container with NO Watermark */}
              <div className="p-4 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 shrink-0">
                <QRCodeSVG value={ticket.qrCodeData || ticket.ticketCode} size={180} level="H" />
              </div>

              {/* Subtitle ONLY - NO ticket number repeat */}
              <div className="text-center font-mono">
                <p className="text-sm font-black text-slate-200 tracking-[0.2em] uppercase">
                  SCAN FOR ENTRY
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // 2. RESPONSIVE PREVIEW CANVAS (SCALES PROPORTIONALLY IN BROWSER)
  // ---------------------------------------------------------
  return (
    <div
      id={`ticket-pass-${ticket.id}`}
      data-ticket-json={JSON.stringify(ticket)}
      className={`relative w-full max-w-[850px] aspect-[7/3] mx-auto overflow-hidden shadow-2xl bg-slate-950 ${getBorderClass(borderStyle)} ${cornerClass} ${cardText} ${fontClass} transition-all ${className}`}
      style={{
        ...getBorderGlowStyle(borderStyle, accentColor),
        clipPath: cornerClipPath,
      }}
    >
      {/* Graphic Background Artwork Image OR Layered Vector SVG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bgImage ? (
          <>
            <img
              src={bgImage}
              alt="Ticket Graphic Background"
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: themeMode === 'dark' ? '#020617' : '#ffffff',
                opacity: overlayOpacity,
              }}
            />
          </>
        ) : (
          <>
            <BaseWashSVG {...artProps} />
            {template.artLayers.map((Layer, i) => (
              <Layer key={i} {...artProps} />
            ))}
          </>
        )}
      </div>

      <div className="relative flex flex-row flex-nowrap items-stretch w-full h-full overflow-hidden">
        {/* Left Accent Strip */}
        <div
          className="font-black text-[9px] sm:text-xs tracking-widest uppercase flex flex-col items-center justify-center p-1.5 sm:p-2.5 w-7 sm:w-10 h-full shrink-0 border-r select-none"
          style={{ backgroundColor: accentColor, color: themeMode === 'dark' ? '#0f172a' : '#ffffff', borderColor: `${accentColor}40` }}
        >
          <span className="-rotate-90 whitespace-nowrap font-mono tracking-widest font-black">
            ★ OFFICIAL TICKET ★
          </span>
        </div>

        {/* Main Ticket Body */}
        <div className="p-3 sm:p-5 lg:p-6 flex-1 min-w-0 h-full flex flex-col justify-between relative overflow-hidden">
          {/* Header Row: Large Event Logo (Left), Centered Title (Center), Ticket Type Badge (Right) */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 border-b pb-2 sm:pb-3" style={{ borderColor: `${accentColor}30` }}>
            {/* Event Logo Placement (Prominent) */}
            <div className="shrink-0 flex items-center min-w-[70px] sm:min-w-[110px]">
              {ticket.customLogoUrl ? (
                <img
                  src={ticket.customLogoUrl}
                  alt="Event Logo"
                  className="h-10 sm:h-14 lg:h-16 w-auto max-w-[90px] sm:max-w-[140px] object-contain filter drop-shadow-md"
                />
              ) : (
                <DefaultEventLogoSVG className="h-10 sm:h-14 lg:h-16 w-auto" color={accentColor} />
              )}
            </div>

            {/* Event Title (Centered, Primary Focus, NO 'EVENT TITLE' Label) */}
            <div className="flex-1 text-center px-2 min-w-0">
              <h2
                className={`text-sm sm:text-xl lg:text-2xl font-black uppercase tracking-tight leading-tight drop-shadow-md truncate ${fontClass}`}
                style={{ color: fontColor }}
              >
                {ticket.eventName}
              </h2>
            </div>

            {/* Ticket Type Badge (Top Right) */}
            <div className="shrink-0">
              <span
                className="inline-block px-2.5 py-0.5 sm:px-4 sm:py-1.5 rounded-full border sm:border-2 font-black text-[9px] sm:text-xs tracking-widest uppercase shadow-md backdrop-blur-md"
                style={{
                  borderColor: accentColor,
                  color: accentColor,
                  backgroundColor: `${accentColor}18`,
                  boxShadow: `0 0 10px ${accentColor}25`,
                }}
              >
                {categoryLabel}
              </span>
            </div>
          </div>

          {/* Middle Info Bar (Date, Time, Venue) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 py-2 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md font-mono my-1">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              <div className="p-1 sm:p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: accentColor }} />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-white text-[10px] sm:text-xs truncate">
                  {ticket.eventDate || 'EVENT DATE'}
                </p>
                <p className="text-[8px] sm:text-[10px] font-semibold text-slate-400 truncate">
                  SATURDAY
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 border-l border-white/10 pl-2 sm:pl-3 min-w-0">
              <div className="p-1 sm:p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: accentColor }} />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-white text-[10px] sm:text-xs truncate">
                  {ticket.eventTime || '06:00 PM'}
                </p>
                <p className="text-[8px] sm:text-[10px] font-semibold text-slate-400 truncate">
                  DOORS OPEN 05:00 PM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 border-l border-white/10 pl-2 sm:pl-3 min-w-0">
              <div className="p-1 sm:p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: accentColor }} />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-white text-[10px] sm:text-xs truncate">
                  {ticket.venue || 'SKD SPORTS COMPLEX'}
                </p>
                <p className="text-[8px] sm:text-[10px] font-semibold text-slate-400 truncate">
                  MONROVIA, LIBERIA
                </p>
              </div>
            </div>
          </div>

          {/* Recipient & Seating Details (if present) */}
          {(hasHolder || hasSeating) && (
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-1.5 sm:p-2.5 rounded-lg bg-black/30 border border-white/10 text-[9px] sm:text-xs font-mono">
              {hasHolder && (
                <div className={hasSeating ? 'col-span-2' : 'col-span-4'}>
                  <p className="text-[8px] uppercase tracking-wider font-bold" style={{ color: accentColor }}>PASS HOLDER</p>
                  <p className="font-extrabold text-[10px] sm:text-xs truncate text-white">{ticket.holderName}</p>
                </div>
              )}
              {ticket.section && (
                <div>
                  <p className="text-[8px] uppercase tracking-wider font-bold" style={{ color: accentColor }}>SECTION</p>
                  <p className="font-bold text-[10px] sm:text-xs text-amber-400">{ticket.section}</p>
                </div>
              )}
              {(ticket.row || ticket.seatNumber) && (
                <div>
                  <p className="text-[8px] uppercase tracking-wider font-bold" style={{ color: accentColor }}>ROW / SEAT</p>
                  <p className="font-bold text-[10px] sm:text-xs text-white">{ticket.row || '-'}/{ticket.seatNumber || '-'}</p>
                </div>
              )}
              {ticket.gateEntry && (
                <div>
                  <p className="text-[8px] uppercase tracking-wider font-bold" style={{ color: accentColor }}>GATE</p>
                  <p className="font-bold text-[10px] sm:text-xs text-emerald-400">{ticket.gateEntry}</p>
                </div>
              )}
            </div>
          )}

          {/* Price & Single Dedicated Ticket Number */}
          <div className="flex items-end justify-between font-mono pt-1">
            <div>
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                TICKET PRICE
              </p>
              <p className="text-sm sm:text-lg lg:text-xl font-black text-white tracking-tight" style={{ color: accentColor }}>
                {hasPrice ? formatCurrency(ticket.price, ticket.currency) : '$35 USD'}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                TICKET NO.
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-amber-400 tracking-wider">
                {ticket.ticketCode}
              </p>
            </div>
          </div>
        </div>

        {/* Perforated Divider + Stub Section with QR Code */}
        {showStub && (
          <div className="relative p-2.5 sm:p-4 w-[160px] sm:w-[220px] lg:w-[260px] bg-slate-950/80 border-l-2 border-dashed border-slate-700/60 flex flex-col items-center justify-center gap-2 shrink-0">
            {/* Top & Bottom Perforation Notches */}
            <div className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-slate-950 rounded-full z-10 border border-slate-800" />
            <div className="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-slate-950 rounded-full z-10 border border-slate-800" />

            {/* Clean White QR Container with NO Watermark */}
            <div className="p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 shrink-0">
              <QRCodeSVG
                value={ticket.qrCodeData || ticket.ticketCode}
                size={110}
                level="H"
                className="w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] lg:w-[130px] lg:h-[130px]"
              />
            </div>

            {/* Subtitle ONLY - NO ticket number repeat */}
            <div className="text-center font-mono">
              <p className="text-[9px] sm:text-xs font-black text-slate-200 tracking-[0.2em] uppercase">
                SCAN FOR ENTRY
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

