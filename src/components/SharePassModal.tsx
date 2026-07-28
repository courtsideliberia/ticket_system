import React, { useState, useRef } from 'react';
import { PassTicket } from '../types';
import { X, Download, MessageSquare, Mail, Share2, Copy, Check, Sparkles, Send, Phone, ShieldCheck, Ticket } from 'lucide-react';
import { toPng } from 'html-to-image';
import { PASS_TEMPLATES } from '../lib/ticketTemplateMap';
import { QRCodeSVG } from 'qrcode.react';
import { TicketRenderer } from './TicketRenderer';

interface SharePassModalProps {
  isOpen?: boolean;
  onClose: () => void;
  ticket: PassTicket | null;
  customLogoUrl?: string;
}

export const SharePassModal: React.FC<SharePassModalProps> = ({
  isOpen,
  onClose,
  ticket,
  customLogoUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'whatsapp' | 'email'>('whatsapp');
  const [phone, setPhone] = useState(ticket?.holderPhone || '');
  const [email, setEmail] = useState(ticket?.holderEmail || '');
  const [copiedText, setCopiedText] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const shouldDisplay = isOpen !== undefined ? (isOpen && Boolean(ticket)) : Boolean(ticket);
  if (!shouldDisplay || !ticket) return null;

  const template = PASS_TEMPLATES[ticket.category] || PASS_TEMPLATES.general_access;

  // Construct formatted WhatsApp message
  const whatsappMessage = `🎟️ *COURTSIDE DIGITAL ENTRY PASS* 🏀
━━━━━━━━━━━━━━━━━━━━
📍 *Event:* ${ticket.eventName}
📅 *Date:* ${ticket.eventDate} ${ticket.eventTime ? `@ ${ticket.eventTime}` : ''}
🏟️ *Venue:* ${ticket.venue}

👤 *Holder:* ${ticket.holderName}
🏷️ *Tier:* ${ticket.category.replace('_', ' ').toUpperCase()}
🔢 *Ticket Code:* \`${ticket.ticketCode}\`
🪑 *Seat / Gate:* ${ticket.section || 'General'} | Row ${ticket.row || '-'} | Seat ${ticket.seatNumber || '-'}

⚡ *Pass Status:* ${ticket.status.toUpperCase()}
📱 Present this barcode / code at SKD Complex Entry Gates for fast validation.
━━━━━━━━━━━━━━━━━━━━
Verified by Courtside Liberia Platform`;

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `Pass_${ticket.ticketCode}_${(ticket.holderName || 'Guest').replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate pass PNG image', err);
      alert('Could not generate PNG image directly. You can copy or screenshot the pass preview.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyWhatsAppText = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(whatsappMessage);
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`
      : `https://api.whatsapp.com/send?text=${encodedMsg}`;
    window.open(url, '_blank');
  };

  const handleSendEmailSimulated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      alert(`Digital pass for ${ticket.ticketCode} sent successfully to ${email}`);
      onClose();
    }, 1200);
  };

  const handleOpenMailClient = () => {
    const subject = encodeURIComponent(`🎟️ Your Courtside Pass: ${ticket.eventName} (${ticket.ticketCode})`);
    const body = encodeURIComponent(
      `Hello ${ticket.holderName},\n\nHere is your official digital entry pass for ${ticket.eventName}.\n\nTicket Code: ${ticket.ticketCode}\nCategory: ${ticket.category.toUpperCase()}\nDate: ${ticket.eventDate}\nVenue: ${ticket.venue}\nSeat: ${ticket.section || 'General'} / Row ${ticket.row || '-'} / Seat ${ticket.seatNumber || '-'}\n\nPlease present this ticket code at the entrance gates.\n\nThank you,\nCourtside Liberia`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading uppercase tracking-wider">
                Export & Dispatch Pass
              </h2>
              <p className="text-xs text-slate-400">
                {ticket.ticketCode} • {ticket.holderName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-300" /> WhatsApp Direct
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'image'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Download className="w-4 h-4 text-blue-300" /> Image (PNG)
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'email'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mail className="w-4 h-4 text-purple-300" /> Email Pass
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          {/* WHATSAPP TAB */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> Instant WhatsApp Pass Dispatch
                </div>
                <p>Send ticket details, holder credentials, and QR check-in codes directly to WhatsApp.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Recipient Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +231886123456"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Message Preview
                  </label>
                  <button
                    onClick={handleCopyWhatsAppText}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText ? 'Copied to Clipboard' : 'Copy Message'}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={9}
                  value={whatsappMessage}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyWhatsAppText}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <Copy className="w-4 h-4" /> Copy Text
                </button>
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" /> Launch WhatsApp Dispatch
                </button>
              </div>
            </div>
          )}

          {/* IMAGE PNG TAB */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300">
                <p className="font-bold text-blue-400">High-Resolution PNG Pass Exporter</p>
                <p className="text-[11px] text-slate-400 pt-0.5">Render the exact pass layout with custom logo & QR code into a downloadable PNG file.</p>
              </div>

              {/* Render Target Card */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-center overflow-x-auto">
                <div ref={cardRef} className="p-2 bg-slate-950 rounded-2xl">
                  <TicketRenderer ticket={ticket} />
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadPNG}
                disabled={isDownloading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all uppercase tracking-wider"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Generating PNG...' : 'Download Pass Image (.PNG)'}
              </button>
            </div>
          )}

          {/* EMAIL TAB */}
          {activeTab === 'email' && (
            <form onSubmit={handleSendEmailSimulated} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-300">
                <p className="font-bold text-purple-400">Email Pass Dispatch Service</p>
                <p className="text-[11px] text-slate-400 pt-0.5">Send official pass confirmation & check-in credentials via email.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Holder Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="holder@domain.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subject:</span>
                  <span className="font-mono text-white">🎟️ Your Courtside Pass: {ticket.eventName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Ticket Code:</span>
                  <span className="font-mono text-blue-400 font-bold">{ticket.ticketCode}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Holder:</span>
                  <span className="text-white font-bold">{ticket.holderName}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenMailClient}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <Mail className="w-4 h-4" /> Open Email Client
                </button>
                <button
                  type="submit"
                  disabled={emailSent}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  {emailSent ? 'Sending Pass...' : 'Dispatch Pass Email'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
