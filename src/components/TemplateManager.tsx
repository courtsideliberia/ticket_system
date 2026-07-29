import React, { useMemo, useRef, useState } from 'react';
import {
  PassTicket,
  TicketCanvasThemeId,
  TemplateCustomization,
  FontFamilyOption,
  BorderStyleOption,
  BadgeStyleOption,
  QRFrameStyleOption,
  CornerStyleOption,
  TicketOrientation,
  SponsorLogoPlacement,
  SecurityWatermarkStyle,
  ThemeMode,
} from '../types';
import {
  getAllThemes,
  CANVAS_THEMES,
  saveCustomTheme,
  deleteCustomTheme,
  getCustomThemes,
  CanvasThemeDefinition,
} from '../lib/ticketTemplateMap';
import { TicketRenderer } from './TicketRenderer';
import { downloadPng, downloadPdf, getPhysicalSizeIn } from '../lib/exportTicket';
import {
  Palette, Sparkles, Download, FileDown, Save, Trash2, Sun, Moon,
  Loader2, Check, RefreshCcw, LayoutGrid,
} from 'lucide-react';

const FONT_OPTIONS: FontFamilyOption[] = ['sans', 'heading', 'serif', 'mono', 'display', 'stencil'];
const BORDER_OPTIONS: BorderStyleOption[] = ['solid_gold', 'neon_glow', 'double_metallic', 'dashed_stub', 'none', 'chamfer'];
const BADGE_OPTIONS: BadgeStyleOption[] = ['pill_stars', 'shield_crest', 'metallic_ribbon', 'gold_tag', 'minimal_block'];
const QR_FRAME_OPTIONS: QRFrameStyleOption[] = ['security_glow', 'gold_metallic', 'corner_crosshairs', 'glass_card', 'minimal'];
const CORNER_OPTIONS: CornerStyleOption[] = ['notch_cutouts', 'rounded_lg', 'sharp_square', 'pill_edges'];
const SPONSOR_OPTIONS: SponsorLogoPlacement[] = ['top_header', 'bottom_stub', 'footer', 'none'];
const WATERMARK_OPTIONS: SecurityWatermarkStyle[] = ['shield_logo', 'starburst_hologram', 'official_seal', 'none'];

const labelize = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

function buildSampleTicket(themeId: TicketCanvasThemeId, customization: TemplateCustomization): PassTicket {
  return {
    id: 'preview-ticket',
    ticketCode: 'CRT-2026-TCK-0001',
    passType: 'ticket',
    holderName: 'Josephine Dennis',
    category: (CANVAS_THEMES[themeId]?.categoryDefault) || 'vip',
    themeId,
    customization,
    eventName: 'LBA Championship Finals 2026',
    eventDate: 'August 15, 2026',
    eventTime: '18:00',
    venue: 'SKD Sports Complex',
    section: 'A',
    row: '12',
    seatNumber: '25',
    gateEntry: 'Gate A',
    price: 75,
    currency: 'USD',
    status: 'valid',
    issuedAt: new Date().toISOString(),
    qrCodeData: 'CRT-2026-TCK-0001|LBA Championship|Josephine Dennis',
  };
}

export const TemplateManager: React.FC = () => {
  const [themesVersion, setThemesVersion] = useState(0); // bump to refresh custom theme list
  const allThemes = useMemo(() => getAllThemes(), [themesVersion]);
  const customIds = useMemo(() => new Set(getCustomThemes().map((t) => t.id)), [themesVersion]);

  const [selectedThemeId, setSelectedThemeId] = useState<TicketCanvasThemeId>('gold_foil_vip');
  const [customization, setCustomization] = useState<TemplateCustomization>({});
  const [saveName, setSaveName] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const theme = allThemes[selectedThemeId] || CANVAS_THEMES.gold_foil_vip;
  const sampleTicket = useMemo(() => buildSampleTicket(selectedThemeId, customization), [selectedThemeId, customization]);

  const updateCustomization = (patch: Partial<TemplateCustomization>) => {
    setCustomization((prev) => ({ ...prev, ...patch }));
  };

  const resetCustomization = () => setCustomization({});

  const effectiveMode: ThemeMode = customization.mode || theme.mode;

  const handleSaveCustomTemplate = () => {
    const name = saveName.trim() || `${theme.name} (Custom)`;
    const id = `custom_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Date.now().toString(36)}` as TicketCanvasThemeId;
    const newTheme: CanvasThemeDefinition = {
      ...theme,
      id,
      name,
      mode: customization.mode || theme.mode,
      colors: {
        primary: customization.primaryColor || theme.colors.primary,
        secondary: customization.secondaryColor || theme.colors.secondary,
        accent: customization.accentColor || theme.colors.accent,
      },
      borderStyle: customization.borderStyle || theme.borderStyle,
      badgeStyle: customization.badgeStyle || theme.badgeStyle,
      qrFrameStyle: customization.qrFrameStyle || theme.qrFrameStyle,
      cornerStyle: customization.cornerStyle || theme.cornerStyle,
      fontFamily: customization.fontFamily || theme.fontFamily,
      sponsorLogoPosition: customization.sponsorLogoPosition || theme.sponsorLogoPosition,
      securityWatermark: customization.securityWatermark || theme.securityWatermark,
      defaultOrientation: customization.orientation || theme.defaultOrientation,
    };
    saveCustomTheme(newTheme);
    setThemesVersion((v) => v + 1);
    setSelectedThemeId(id);
    setSaveName('');
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleDeleteCustom = (id: string) => {
    deleteCustomTheme(id);
    setThemesVersion((v) => v + 1);
    if (selectedThemeId === id) setSelectedThemeId('gold_foil_vip');
  };

  const handleExportPng = async () => {
    if (!previewRef.current) return;
    setExporting('png');
    try {
      await downloadPng(previewRef.current, `Template_${theme.name.replace(/\s+/g, '_')}_Preview.png`, theme.mode === 'light' ? '#ffffff' : '#0f172a');
    } catch (err) {
      console.error(err);
      alert('Could not export preview as PNG. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handleExportPdf = async () => {
    if (!previewRef.current) return;
    setExporting('pdf');
    try {
      const orientation = customization.orientation || theme.defaultOrientation;
      const size = getPhysicalSizeIn('ticket', orientation);
      await downloadPdf(previewRef.current, `Template_${theme.name.replace(/\s+/g, '_')}_300DPI.pdf`, {
        ...size,
        backgroundColor: effectiveMode === 'light' ? '#ffffff' : '#0f172a',
      });
    } catch (err) {
      console.error(err);
      alert('Could not export preview as PDF. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" /> Ticket Template Manager
          </h2>
          <p className="text-xs text-slate-400">
            {Object.keys(allThemes).length} premium templates — fully customizable, live-previewed, exportable at 300 DPI.
          </p>
        </div>
      </div>

      {/* Template Gallery */}
      <section className="space-y-3">
        <h3 className="text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <LayoutGrid className="w-3.5 h-3.5 text-amber-400" /> Choose a Template
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.values(allThemes).map((t) => {
            const isSelected = t.id === selectedThemeId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { setSelectedThemeId(t.id as TicketCanvasThemeId); resetCustomization(); }}
                className={`relative p-3 rounded-2xl border text-left transition-all group ${
                  isSelected ? 'border-amber-400 bg-slate-800 ring-1 ring-amber-400' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className={`h-14 w-full rounded-xl mb-2 ${t.previewGradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/90 drop-shadow">{t.badgeText}</span>
                  </div>
                  {t.mode === 'light' && (
                    <span className="absolute top-1 right-1 text-[8px] font-bold bg-white/80 text-slate-800 px-1.5 py-0.5 rounded">LIGHT</span>
                  )}
                </div>
                <p className="text-[11px] font-bold text-white truncate">{t.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{t.tagline}</p>
                {customIds.has(t.id) && (
                  <span
                    onClick={(e) => { e.stopPropagation(); handleDeleteCustom(t.id); }}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-rose-500/20 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete custom template"
                  >
                    <Trash2 className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Live Animated Preview */}
        <section className="space-y-3">
          <h3 className="text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider">Live Preview</h3>
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-x-auto">
            <div ref={previewRef} className="template-preview-animated">
              <TicketRenderer ticket={sampleTicket} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportPng}
              disabled={exporting !== null}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
            >
              {exporting === 'png' ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Download className="w-4 h-4 text-emerald-400" />}
              Export PNG
            </button>
            <button
              onClick={handleExportPdf}
              disabled={exporting !== null}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
            >
              {exporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <FileDown className="w-4 h-4 text-blue-400" />}
              Export PDF (300 DPI)
            </button>
          </div>
        </section>

        {/* Customization Panel */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider">Customize</h3>
            <button onClick={resetCustomization} className="text-[11px] text-slate-500 hover:text-white flex items-center gap-1">
              <RefreshCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            {/* Theme Mode */}
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Theme Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {(['dark', 'light'] as ThemeMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateCustomization({ mode: m })}
                    className={`py-2 rounded-xl border text-xs font-bold uppercase flex items-center justify-center gap-1.5 ${
                      effectiveMode === m ? 'border-amber-400 bg-amber-500/10 text-amber-300' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    {m === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />} {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-3 gap-2">
              {([
                ['primaryColor', 'Primary', theme.colors.primary],
                ['secondaryColor', 'Secondary', theme.colors.secondary],
                ['accentColor', 'Accent', theme.colors.accent],
              ] as [keyof TemplateCustomization, string, string][]).map(([key, label, fallback]) => (
                <div key={key}>
                  <label className="text-[10px] text-slate-400 mb-1 block">{label}</label>
                  <input
                    type="color"
                    value={(customization[key] as string) || fallback}
                    onChange={(e) => updateCustomization({ [key]: e.target.value } as Partial<TemplateCustomization>)}
                    className="w-full h-9 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Font Family */}
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Font Family</label>
              <select
                value={customization.fontFamily || theme.fontFamily}
                onChange={(e) => updateCustomization({ fontFamily: e.target.value as FontFamilyOption })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{labelize(f)}</option>)}
              </select>
            </div>

            {/* Font Color */}
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Font Color Override (optional)</label>
              <input
                type="color"
                value={customization.fontColor || (effectiveMode === 'light' ? '#0f172a' : '#ffffff')}
                onChange={(e) => updateCustomization({ fontColor: e.target.value })}
                className="w-full h-9 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
              />
            </div>

            {/* Border Style */}
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Border Style</label>
              <select
                value={customization.borderStyle || theme.borderStyle}
                onChange={(e) => updateCustomization({ borderStyle: e.target.value as BorderStyleOption })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {BORDER_OPTIONS.map((f) => <option key={f} value={f}>{labelize(f)}</option>)}
              </select>
            </div>

            {/* Badge Style */}
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Badge Style</label>
              <select
                value={customization.badgeStyle || theme.badgeStyle}
                onChange={(e) => updateCustomization({ badgeStyle: e.target.value as BadgeStyleOption })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {BADGE_OPTIONS.map((f) => <option key={f} value={f}>{labelize(f)}</option>)}
              </select>
            </div>

            {/* QR Frame Style */}
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">QR Frame Style</label>
              <select
                value={customization.qrFrameStyle || theme.qrFrameStyle}
                onChange={(e) => updateCustomization({ qrFrameStyle: e.target.value as QRFrameStyleOption })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {QR_FRAME_OPTIONS.map((f) => <option key={f} value={f}>{labelize(f)}</option>)}
              </select>
            </div>

            {/* Corner Style */}
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Corner Style</label>
              <select
                value={customization.cornerStyle || theme.cornerStyle}
                onChange={(e) => updateCustomization({ cornerStyle: e.target.value as CornerStyleOption })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {CORNER_OPTIONS.map((f) => <option key={f} value={f}>{labelize(f)}</option>)}
              </select>
            </div>

            {/* Orientation */}
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                {(['landscape', 'portrait'] as TicketOrientation[]).map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => updateCustomization({ orientation: o })}
                    className={`py-2 rounded-xl border text-xs font-bold uppercase ${
                      (customization.orientation || theme.defaultOrientation) === o
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Sponsor Logo Placement */}
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Sponsor Logo Placement</label>
              <select
                value={customization.sponsorLogoPosition || theme.sponsorLogoPosition}
                onChange={(e) => updateCustomization({ sponsorLogoPosition: e.target.value as SponsorLogoPlacement })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {SPONSOR_OPTIONS.map((f) => <option key={f} value={f}>{labelize(f)}</option>)}
              </select>
            </div>

            {/* Security Watermark */}
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Security Watermark (behind QR)</label>
              <select
                value={customization.securityWatermark || theme.securityWatermark}
                onChange={(e) => updateCustomization({ securityWatermark: e.target.value as SecurityWatermarkStyle })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {WATERMARK_OPTIONS.map((f) => <option key={f} value={f}>{labelize(f)}</option>)}
              </select>
            </div>
          </div>

          {/* Save as Custom Template */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-[11px] text-slate-400 mb-1 block">Save As Custom Template</label>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder={`${theme.name} (Custom)`}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600"
            />
            <button
              onClick={handleSaveCustomTemplate}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {savedFlash ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {savedFlash ? 'Saved!' : 'Save As New Template'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
