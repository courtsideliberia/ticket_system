import React, { useState } from 'react';
import {
  PassTicket, TicketCanvasThemeId, TemplateCustomization,
  FontFamilyOption, BorderStyleOption, BadgeStyleOption, QRFrameStyleOption,
  CornerStyleOption, TicketOrientation, SecurityWatermarkStyle, SponsorLogoPlacement
} from '../types';
import { TICKET_TEMPLATES, TICKET_TEMPLATE_IDS, PRESET_BACKGROUND_ARTWORKS } from '../lib/ticketTemplates';
import { TicketRenderer } from './TicketRenderer';
import { Palette, Check, Sparkles, LayoutGrid, Upload, RotateCcw, Sun, Moon, Image as ImageIcon, Sliders, Layers, X } from 'lucide-react';

interface TicketTemplateManagerProps {
  selectedThemeId: TicketCanvasThemeId;
  onSelectTheme: (id: TicketCanvasThemeId) => void;
  customization: TemplateCustomization;
  onChangeCustomization: (c: TemplateCustomization) => void;
  themeMode?: 'dark' | 'light';
  onChangeThemeMode: (m: 'dark' | 'light') => void;
  sponsorLogoUrl?: string;
  onChangeSponsorLogoUrl: (url: string) => void;
  previewTicket: PassTicket;
}

const FONT_OPTIONS: { value: FontFamilyOption; label: string }[] = [
  { value: 'heading', label: 'Heading (Space Grotesk)' },
  { value: 'sans', label: 'Sans' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Mono' },
  { value: 'display', label: 'Display Bold' },
  { value: 'stencil', label: 'Stencil Style' }
];
const BORDER_OPTIONS: { value: BorderStyleOption; label: string }[] = [
  { value: 'solid_gold', label: 'Solid' },
  { value: 'double_metallic', label: 'Double Metallic' },
  { value: 'dashed_stub', label: 'Dashed' },
  { value: 'neon_glow', label: 'Neon Glow' },
  { value: 'chamfer', label: 'Chamfer' },
  { value: 'none', label: 'None' }
];
const BADGE_OPTIONS: { value: BadgeStyleOption; label: string }[] = [
  { value: 'pill_stars', label: 'Pill + Star' },
  { value: 'metallic_ribbon', label: 'Ribbon' },
  { value: 'shield_crest', label: 'Shield' },
  { value: 'gold_tag', label: 'Hex Tag' },
  { value: 'minimal_block', label: 'Minimal Block' }
];
const QR_FRAME_OPTIONS: { value: QRFrameStyleOption; label: string }[] = [
  { value: 'security_glow', label: 'Security Glow' },
  { value: 'gold_metallic', label: 'Gold Metallic' },
  { value: 'corner_crosshairs', label: 'Crosshairs' },
  { value: 'glass_card', label: 'Glass Card' },
  { value: 'minimal', label: 'Minimal' }
];
const CORNER_OPTIONS: { value: CornerStyleOption; label: string }[] = [
  { value: 'rounded_lg', label: 'Rounded' },
  { value: 'sharp_square', label: 'Sharp' },
  { value: 'notch_cutouts', label: 'Notched' },
  { value: 'pill_edges', label: 'Pill' }
];
const WATERMARK_OPTIONS: { value: SecurityWatermarkStyle; label: string }[] = [
  { value: 'official_seal', label: 'Official Seal' },
  { value: 'shield_logo', label: 'Shield Verified' },
  { value: 'starburst_hologram', label: 'Starburst' },
  { value: 'none', label: 'None' }
];
const SPONSOR_OPTIONS: { value: SponsorLogoPlacement; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'top_header', label: 'Top Header' },
  { value: 'bottom_stub', label: 'QR Stub' },
  { value: 'footer', label: 'Footer' }
];

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
      <span>{label}</span>
      <span className="flex items-center gap-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-md border border-slate-700 bg-transparent cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-1.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-white focus:outline-none focus:border-amber-500"
        />
      </span>
    </label>
  );
}

function SelectField<T extends string>({
  label, value, options, onChange
}: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <label className="block text-[11px] text-slate-400 space-y-1">
      <span className="block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export const TicketTemplateManager: React.FC<TicketTemplateManagerProps> = ({
  selectedThemeId,
  onSelectTheme,
  customization,
  onChangeCustomization,
  themeMode,
  onChangeThemeMode,
  sponsorLogoUrl,
  onChangeSponsorLogoUrl,
  previewTicket
}) => {
  const [previewKey, setPreviewKey] = useState(0);
  const [galleryTab, setGalleryTab] = useState<'all' | 'graphic' | 'vector'>('all');
  const template = TICKET_TEMPLATES[selectedThemeId];
  const effectiveThemeMode = themeMode || template.themeMode;

  const bump = () => setPreviewKey((k) => k + 1);

  const update = (patch: Partial<TemplateCustomization>) => {
    onChangeCustomization({ ...customization, ...patch });
    bump();
  };

  const resetToTemplateDefaults = () => {
    onChangeCustomization({});
    onChangeThemeMode(template.themeMode);
    bump();
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        update({ backgroundImageUrl: evt.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSponsorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        onChangeSponsorLogoUrl(evt.target.result as string);
        bump();
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredTemplateIds = TICKET_TEMPLATE_IDS.filter((tId) => {
    const t = TICKET_TEMPLATES[tId];
    if (galleryTab === 'graphic') return Boolean(t.isGraphicArt || t.backgroundImageUrl);
    if (galleryTab === 'vector') return !t.isGraphicArt && !t.backgroundImageUrl;
    return true;
  });

  const activeBgImage = customization.backgroundImageUrl ?? template.backgroundImageUrl ?? template.defaults.backgroundImageUrl;
  const activeOverlayOpacity = customization.bgOverlayOpacity ?? template.defaults.bgOverlayOpacity ?? 0.35;

  return (
    <div className="space-y-4 pt-2 border-t border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-amber-400" /> Ticket Studio & Design Templates
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetToTemplateDefaults}
            className="text-[10px] font-bold text-slate-500 hover:text-amber-400 flex items-center gap-1 uppercase tracking-wider"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* ── Gallery Category Filter Tabs ── */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold">
        <button
          type="button"
          onClick={() => setGalleryTab('all')}
          className={`flex-1 py-1 px-2.5 rounded-lg transition-all ${galleryTab === 'all' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'}`}
        >
          All ({TICKET_TEMPLATE_IDS.length})
        </button>
        <button
          type="button"
          onClick={() => setGalleryTab('graphic')}
          className={`flex-1 py-1 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1 ${galleryTab === 'graphic' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'}`}
        >
          <ImageIcon className="w-3 h-3" /> Canva / Pinterest Graphic Art
        </button>
        <button
          type="button"
          onClick={() => setGalleryTab('vector')}
          className={`flex-1 py-1 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1 ${galleryTab === 'vector' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'}`}
        >
          <Layers className="w-3 h-3" /> Vector SVG
        </button>
      </div>

      {/* ── Template Gallery ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto p-1 pr-2 rounded-xl bg-slate-950/40 border border-slate-800">
        {filteredTemplateIds.map((tId) => {
          const t = TICKET_TEMPLATES[tId];
          const isSelected = selectedThemeId === tId;
          const bgImg = t.backgroundImageUrl || t.defaults.backgroundImageUrl;
          return (
            <button
              key={tId}
              type="button"
              onClick={() => {
                onSelectTheme(tId);
                onChangeCustomization({});
                onChangeThemeMode(t.themeMode);
                bump();
              }}
              className={`relative p-2 rounded-xl border text-left transition-all ${
                isSelected ? 'border-amber-400 bg-slate-800 ring-1 ring-amber-400' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
              title={t.description}
            >
              <div className={`relative h-10 w-full rounded-lg mb-1.5 overflow-hidden ${t.previewGradient} flex items-center justify-center`}>
                {bgImg && (
                  <img src={bgImg} alt={t.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                )}
                {isSelected && (
                  <div className="relative z-10 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                {t.isGraphicArt && (
                  <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-amber-500 text-[8px] font-black uppercase text-slate-950">
                    CANVA ART
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold text-white truncate">{t.name}</p>
              <p className="text-[9px] text-slate-500 truncate">{t.tagline}</p>
            </button>
          );
        })}
      </div>

      {/* ── Live Animated Preview ── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 overflow-hidden shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Live Pass Ticket Preview (Editable Text & Logo)
          </span>
          <button
            type="button"
            onClick={() => { onChangeThemeMode(effectiveThemeMode === 'dark' ? 'light' : 'dark'); bump(); }}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white uppercase px-2 py-1 rounded bg-slate-900 border border-slate-800"
          >
            {effectiveThemeMode === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            {effectiveThemeMode}
          </button>
        </div>
        <div key={previewKey} className="ticket-preview-animate">
          <TicketRenderer ticket={previewTicket} />
        </div>
      </div>

      {/* ── Real Image Artwork Background Studio ── */}
      <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-950 to-slate-950 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Graphic Background Artwork Studio
          </span>
          {activeBgImage && (
            <button
              type="button"
              onClick={() => update({ backgroundImageUrl: '' })}
              className="text-[10px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 uppercase"
            >
              <X className="w-3 h-3" /> Remove Image
            </button>
          )}
        </div>

        {/* Preset Graphic Artwork Grid */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Preset Canva / Pinterest Ticket Backgrounds:</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PRESET_BACKGROUND_ARTWORKS.map((art) => {
              const isCurrent = activeBgImage === art.url;
              return (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => update({ backgroundImageUrl: art.url })}
                  className={`relative h-14 rounded-xl overflow-hidden border transition-all text-left group ${
                    isCurrent ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img src={art.url} alt={art.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
                  <div className="relative z-10 p-1.5 flex flex-col justify-between h-full">
                    {isCurrent && (
                      <span className="self-end px-1 rounded bg-amber-500 text-[8px] font-black text-slate-950">
                        ACTIVE
                      </span>
                    )}
                    <span className="text-[9px] font-bold text-white drop-shadow truncate mt-auto">
                      {art.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload Custom Image & Backdrop Opacity Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Upload Custom Background Image (Canva / Pinterest):
            </label>
            <div className="relative flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomBgUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-2 truncate">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  {activeBgImage ? 'Custom Image Loaded' : 'Upload Canva/Pinterest JPG or PNG'}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] uppercase font-mono">
                  Browse
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-amber-400" /> Image Overlay Contrast:
              </span>
              <span className="text-amber-400 font-mono">{Math.round((1 - activeOverlayOpacity) * 100)}% Visibility</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.75"
              step="0.05"
              value={activeOverlayOpacity}
              onChange={(e) => update({ bgOverlayOpacity: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
            />
            <p className="text-[9px] text-slate-500 mt-1">Adjust overlay opacity so event text and QR code stay sharp & legible.</p>
          </div>
        </div>
      </div>

      {/* ── Customization Controls ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 p-3 rounded-2xl border border-slate-800 bg-slate-950/40">
        <span className="col-span-full text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <Palette className="w-3 h-3" /> Colors & Typography
        </span>
        <ColorField label="Primary Color" value={customization.primaryColor || template.defaults.primaryColor} onChange={(v) => update({ primaryColor: v })} />
        <ColorField label="Secondary Color" value={customization.secondaryColor || template.defaults.secondaryColor} onChange={(v) => update({ secondaryColor: v })} />
        <ColorField label="Accent Color" value={customization.accentColor || template.defaults.accentColor} onChange={(v) => update({ accentColor: v })} />
        <ColorField label="Font Color" value={customization.fontColor || template.defaults.fontColor} onChange={(v) => update({ fontColor: v })} />

        <SelectField label="Font Family" value={customization.fontFamily || template.defaults.fontFamily} options={FONT_OPTIONS} onChange={(v) => update({ fontFamily: v })} />
        <SelectField label="Orientation" value={customization.orientation || template.defaults.orientation} options={[{ value: 'landscape' as TicketOrientation, label: 'Landscape' }, { value: 'portrait' as TicketOrientation, label: 'Portrait' }]} onChange={(v) => update({ orientation: v })} />

        <span className="col-span-full text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Frame & Badge</span>
        <SelectField label="Border Style" value={customization.borderStyle || template.defaults.borderStyle} options={BORDER_OPTIONS} onChange={(v) => update({ borderStyle: v })} />
        <SelectField label="Corner Style" value={customization.cornerStyle || template.defaults.cornerStyle} options={CORNER_OPTIONS} onChange={(v) => update({ cornerStyle: v })} />
        <SelectField label="Badge Style" value={customization.badgeStyle || template.defaults.badgeStyle} options={BADGE_OPTIONS} onChange={(v) => update({ badgeStyle: v })} />
        <SelectField label="QR Frame Style" value={customization.qrFrameStyle || template.defaults.qrFrameStyle} options={QR_FRAME_OPTIONS} onChange={(v) => update({ qrFrameStyle: v })} />
        <SelectField label="Security Watermark" value={customization.securityWatermark || template.defaults.securityWatermark} options={WATERMARK_OPTIONS} onChange={(v) => update({ securityWatermark: v })} />

        <span className="col-span-full text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Sponsor Logo</span>
        <SelectField label="Placement" value={customization.sponsorLogoPosition || template.defaults.sponsorLogoPosition} options={SPONSOR_OPTIONS} onChange={(v) => update({ sponsorLogoPosition: v })} />
        <label className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>Upload Logo</span>
          <span className="relative">
            <input type="file" accept="image/*" onChange={handleSponsorUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">
              <Upload className="w-3 h-3" /> {sponsorLogoUrl ? 'Change' : 'Choose File'}
            </span>
          </span>
        </label>
      </div>
    </div>
  );
};
