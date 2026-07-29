import {
  PassCategory,
  PassTemplate,
  TicketCanvasThemeId,
  ThemeMode,
  FontFamilyOption,
  BorderStyleOption,
  BadgeStyleOption,
  QRFrameStyleOption,
  CornerStyleOption,
  SecurityWatermarkStyle,
  SponsorLogoPlacement,
  TicketOrientation,
} from '../types';
import { PatternId } from '../components/ticket-patterns/TicketPatterns';

export interface CanvasThemeDefinition {
  id: TicketCanvasThemeId;
  name: string;
  tagline: string;
  badgeText: string;
  categoryDefault: PassCategory;
  mode: ThemeMode;
  /** Hex colors — used both for Tailwind-free inline styling (SVG patterns,
   *  QR frames) and as the starting point for the Template Manager's color
   *  pickers when someone customizes this theme. */
  colors: { primary: string; secondary: string; accent: string };
  bgClass: string;
  accentClass: string;
  borderClass: string;
  previewGradient: string;
  patternId: PatternId;
  borderStyle: BorderStyleOption;
  badgeStyle: BadgeStyleOption;
  qrFrameStyle: QRFrameStyleOption;
  cornerStyle: CornerStyleOption;
  fontFamily: FontFamilyOption;
  sponsorLogoPosition: SponsorLogoPlacement;
  securityWatermark: SecurityWatermarkStyle;
  defaultOrientation: TicketOrientation;
  thumbnailStyle: string;
  description: string;
}

export const CANVAS_THEMES: Record<TicketCanvasThemeId, CanvasThemeDefinition> = {
  gold_trophy: {
    id: 'gold_trophy', name: 'Gold Trophy Classic', tagline: 'Championship Trophy Edition', badgeText: 'CHAMPIONSHIP',
    categoryDefault: 'vvip', mode: 'dark',
    colors: { primary: '#78350f', secondary: '#1c1917', accent: '#f59e0b' },
    bgClass: 'from-amber-950 via-zinc-950 to-amber-900', accentClass: '#f59e0b', borderClass: 'border-amber-400/80',
    previewGradient: 'bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700', patternId: 'trophy_motif',
    borderStyle: 'solid_gold', badgeStyle: 'gold_tag', qrFrameStyle: 'gold_metallic', cornerStyle: 'rounded_lg',
    fontFamily: 'heading', sponsorLogoPosition: 'top_header', securityWatermark: 'official_seal', defaultOrientation: 'landscape',
    thumbnailStyle: 'Gold trophy silhouette on deep black-amber gradient', description: 'Championship-grade gold trophy motif for finals and title matches.',
  },
  red_slam_dunk: {
    id: 'red_slam_dunk', name: 'Red Slam Dunk', tagline: 'Fast Break Action Edition', badgeText: 'MATCH DAY',
    categoryDefault: 'regular', mode: 'dark',
    colors: { primary: '#7f1d1d', secondary: '#18181b', accent: '#ef4444' },
    bgClass: 'from-red-950 via-zinc-950 to-red-900', accentClass: '#ef4444', borderClass: 'border-red-500/70',
    previewGradient: 'bg-gradient-to-r from-red-600 via-red-800 to-zinc-900', patternId: 'court_lines',
    borderStyle: 'chamfer', badgeStyle: 'pill_stars', qrFrameStyle: 'security_glow', cornerStyle: 'sharp_square',
    fontFamily: 'display', sponsorLogoPosition: 'top_header', securityWatermark: 'shield_logo', defaultOrientation: 'landscape',
    thumbnailStyle: 'Bold red court-line ticket with sharp chamfered edges', description: 'High-energy red court-line design for regular season match tickets.',
  },
  blue_arena: {
    id: 'blue_arena', name: 'Blue Arena Lights', tagline: 'Stadium Spotlight Edition', badgeText: 'ARENA PASS',
    categoryDefault: 'regular', mode: 'dark',
    colors: { primary: '#1e3a8a', secondary: '#0f172a', accent: '#38bdf8' },
    bgClass: 'from-blue-950 via-slate-950 to-sky-900', accentClass: '#38bdf8', borderClass: 'border-sky-400/70',
    previewGradient: 'bg-gradient-to-r from-blue-700 via-sky-700 to-blue-900', patternId: 'spotlight_rays',
    borderStyle: 'neon_glow', badgeStyle: 'pill_stars', qrFrameStyle: 'security_glow', cornerStyle: 'rounded_lg',
    fontFamily: 'sans', sponsorLogoPosition: 'top_header', securityWatermark: 'shield_logo', defaultOrientation: 'landscape',
    thumbnailStyle: 'Cool blue stadium spotlight beams', description: 'Bright arena spotlight beams for a clean, modern stadium look.',
  },
  geometric_gold_vip: {
    id: 'geometric_gold_vip', name: 'Geometric Gold VIP', tagline: 'Angular Prestige Edition', badgeText: 'VIP ACCESS',
    categoryDefault: 'vip', mode: 'dark',
    colors: { primary: '#78350f', secondary: '#27272a', accent: '#fbbf24' },
    bgClass: 'from-zinc-950 via-amber-950 to-zinc-900', accentClass: '#fbbf24', borderClass: 'border-amber-400/70',
    previewGradient: 'bg-gradient-to-r from-zinc-800 via-amber-700 to-zinc-900', patternId: 'geometric_shards',
    borderStyle: 'double_metallic', badgeStyle: 'shield_crest', qrFrameStyle: 'gold_metallic', cornerStyle: 'notch_cutouts',
    fontFamily: 'heading', sponsorLogoPosition: 'top_header', securityWatermark: 'official_seal', defaultOrientation: 'landscape',
    thumbnailStyle: 'Angular gold shards over black', description: 'Sharp angular gold shard graphics for a prestige VIP tier.',
  },
  grunge_dunker: {
    id: 'grunge_dunker', name: 'Grunge Dunker', tagline: 'Street Ball Texture Edition', badgeText: 'STREET PASS',
    categoryDefault: 'regular', mode: 'dark',
    colors: { primary: '#7c2d12', secondary: '#1c1917', accent: '#f97316' },
    bgClass: 'from-orange-950 via-zinc-950 to-stone-900', accentClass: '#f97316', borderClass: 'border-orange-500/70',
    previewGradient: 'bg-gradient-to-r from-orange-700 via-stone-800 to-zinc-900', patternId: 'carbon_weave',
    borderStyle: 'dashed_stub', badgeStyle: 'minimal_block', qrFrameStyle: 'minimal', cornerStyle: 'sharp_square',
    fontFamily: 'stencil', sponsorLogoPosition: 'footer', securityWatermark: 'none', defaultOrientation: 'landscape',
    thumbnailStyle: 'Textured orange-black street ball grit', description: 'Gritty street-ball texture with stencil-style typography.',
  },
  emerald_press: {
    id: 'emerald_press', name: 'Emerald Press Row', tagline: 'Media Credential Edition', badgeText: 'PRESS / MEDIA',
    categoryDefault: 'regular', mode: 'dark',
    colors: { primary: '#064e3b', secondary: '#0f172a', accent: '#10b981' },
    bgClass: 'from-emerald-950 via-slate-950 to-emerald-900', accentClass: '#10b981', borderClass: 'border-emerald-500/70',
    previewGradient: 'bg-gradient-to-r from-emerald-700 via-slate-800 to-emerald-900', patternId: 'hex_grid',
    borderStyle: 'solid_gold', badgeStyle: 'minimal_block', qrFrameStyle: 'glass_card', cornerStyle: 'rounded_lg',
    fontFamily: 'mono', sponsorLogoPosition: 'footer', securityWatermark: 'shield_logo', defaultOrientation: 'landscape',
    thumbnailStyle: 'Emerald hex-grid press credential', description: 'Clean emerald hex-grid press/media credential design.',
  },
  royal_purple: {
    id: 'royal_purple', name: 'Royal Purple Reign', tagline: 'Regal All-Star Edition', badgeText: 'ALL-STAR',
    categoryDefault: 'vvip', mode: 'dark',
    colors: { primary: '#581c87', secondary: '#1e1b4b', accent: '#eab308' },
    bgClass: 'from-purple-950 via-indigo-950 to-purple-900', accentClass: '#eab308', borderClass: 'border-purple-400/70',
    previewGradient: 'bg-gradient-to-r from-purple-700 via-indigo-800 to-yellow-500', patternId: 'starburst',
    borderStyle: 'double_metallic', badgeStyle: 'shield_crest', qrFrameStyle: 'gold_metallic', cornerStyle: 'pill_edges',
    fontFamily: 'heading', sponsorLogoPosition: 'top_header', securityWatermark: 'official_seal', defaultOrientation: 'landscape',
    thumbnailStyle: 'Royal purple starburst with gold trim', description: 'Regal purple and gold starburst for all-star showcase events.',
  },
  neon_cyberpunk: {
    id: 'neon_cyberpunk', name: 'Neon Cyberpunk', tagline: 'Digital Arena Edition', badgeText: 'CYBER PASS',
    categoryDefault: 'regular', mode: 'dark',
    colors: { primary: '#701a75', secondary: '#020617', accent: '#22d3ee' },
    bgClass: 'from-fuchsia-950 via-slate-950 to-cyan-950', accentClass: '#22d3ee', borderClass: 'border-cyan-400/70',
    previewGradient: 'bg-gradient-to-r from-fuchsia-600 via-slate-900 to-cyan-500', patternId: 'hex_grid',
    borderStyle: 'neon_glow', badgeStyle: 'pill_stars', qrFrameStyle: 'security_glow', cornerStyle: 'notch_cutouts',
    fontFamily: 'mono', sponsorLogoPosition: 'top_header', securityWatermark: 'starburst_hologram', defaultOrientation: 'landscape',
    thumbnailStyle: 'Fuchsia-cyan neon cyber grid', description: 'Electric fuchsia-cyan cyberpunk grid for esports/digital events.',
  },
  platinum_suite: {
    id: 'platinum_suite', name: 'Platinum Suite', tagline: 'Executive Lounge Edition', badgeText: 'PLATINUM',
    categoryDefault: 'vvip', mode: 'light',
    colors: { primary: '#cbd5e1', secondary: '#f8fafc', accent: '#64748b' },
    bgClass: 'from-slate-100 via-white to-slate-200', accentClass: '#64748b', borderClass: 'border-slate-400/70',
    previewGradient: 'bg-gradient-to-r from-slate-300 via-white to-slate-400', patternId: 'hologram_wave',
    borderStyle: 'double_metallic', badgeStyle: 'metallic_ribbon', qrFrameStyle: 'glass_card', cornerStyle: 'rounded_lg',
    fontFamily: 'serif', sponsorLogoPosition: 'top_header', securityWatermark: 'official_seal', defaultOrientation: 'landscape',
    thumbnailStyle: 'Platinum-white executive suite, light theme', description: 'Bright platinum executive suite pass — the light-theme flagship.',
  },
  vintage_classic: {
    id: 'vintage_classic', name: 'Vintage Classic', tagline: 'Heritage Stadium Edition', badgeText: 'CLASSIC',
    categoryDefault: 'regular', mode: 'light',
    colors: { primary: '#78350f', secondary: '#fef3c7', accent: '#991b1b' },
    bgClass: 'from-amber-50 via-yellow-50 to-amber-100', accentClass: '#991b1b', borderClass: 'border-amber-800/50',
    previewGradient: 'bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200', patternId: 'court_lines',
    borderStyle: 'solid_gold', badgeStyle: 'shield_crest', qrFrameStyle: 'minimal', cornerStyle: 'sharp_square',
    fontFamily: 'serif', sponsorLogoPosition: 'footer', securityWatermark: 'official_seal', defaultOrientation: 'landscape',
    thumbnailStyle: 'Cream heritage ticket with maroon trim', description: 'Old-school heritage cream & maroon design, light theme.',
  },
  minimal_modern: {
    id: 'minimal_modern', name: 'Minimal Modern', tagline: 'Clean Editorial Edition', badgeText: 'ADMIT ONE',
    categoryDefault: 'regular', mode: 'light',
    colors: { primary: '#0f172a', secondary: '#f1f5f9', accent: '#0f172a' },
    bgClass: 'from-white via-slate-50 to-white', accentClass: '#0f172a', borderClass: 'border-slate-900/20',
    previewGradient: 'bg-gradient-to-r from-slate-100 via-white to-slate-100', patternId: 'none',
    borderStyle: 'none', badgeStyle: 'minimal_block', qrFrameStyle: 'minimal', cornerStyle: 'sharp_square',
    fontFamily: 'sans', sponsorLogoPosition: 'footer', securityWatermark: 'none', defaultOrientation: 'landscape',
    thumbnailStyle: 'Pure white editorial minimalism', description: 'Editorial-grade minimalist design — no clutter, just clean type.',
  },
  electric_spike: {
    id: 'electric_spike', name: 'Electric Spike', tagline: 'High Voltage Edition', badgeText: 'HIGH VOLTAGE',
    categoryDefault: 'regular', mode: 'dark',
    colors: { primary: '#713f12', secondary: '#0a0a0a', accent: '#facc15' },
    bgClass: 'from-yellow-950 via-black to-yellow-900', accentClass: '#facc15', borderClass: 'border-yellow-400/70',
    previewGradient: 'bg-gradient-to-r from-yellow-500 via-black to-yellow-600', patternId: 'geometric_shards',
    borderStyle: 'chamfer', badgeStyle: 'pill_stars', qrFrameStyle: 'security_glow', cornerStyle: 'notch_cutouts',
    fontFamily: 'display', sponsorLogoPosition: 'top_header', securityWatermark: 'shield_logo', defaultOrientation: 'landscape',
    thumbnailStyle: 'Electric yellow shards on black', description: 'High-voltage yellow-black shards for explosive game-day energy.',
  },
  flame_fire: {
    id: 'flame_fire', name: 'Flame & Fire', tagline: "Playoff Heat Edition", badgeText: 'PLAYOFFS',
    categoryDefault: 'vip', mode: 'dark',
    colors: { primary: '#7c2d12', secondary: '#450a0a', accent: '#fb923c' },
    bgClass: 'from-red-950 via-orange-950 to-red-900', accentClass: '#fb923c', borderClass: 'border-orange-400/70',
    previewGradient: 'bg-gradient-to-r from-red-700 via-orange-600 to-red-800', patternId: 'spotlight_rays',
    borderStyle: 'neon_glow', badgeStyle: 'gold_tag', qrFrameStyle: 'security_glow', cornerStyle: 'rounded_lg',
    fontFamily: 'display', sponsorLogoPosition: 'top_header', securityWatermark: 'shield_logo', defaultOrientation: 'landscape',
    thumbnailStyle: 'Fiery orange-red playoff heat rays', description: 'Playoff-intensity flame gradient with radiant spotlight rays.',
  },
  crimson_stadium: {
    id: 'crimson_stadium', name: 'Crimson Stadium', tagline: 'Full House Edition', badgeText: 'SOLD OUT',
    categoryDefault: 'regular', mode: 'dark',
    colors: { primary: '#7f1d1d', secondary: '#0a0a0a', accent: '#dc2626' },
    bgClass: 'from-red-950 via-zinc-950 to-black', accentClass: '#dc2626', borderClass: 'border-red-600/70',
    previewGradient: 'bg-gradient-to-r from-red-800 via-zinc-900 to-black', patternId: 'crowd_silhouette',
    borderStyle: 'solid_gold', badgeStyle: 'pill_stars', qrFrameStyle: 'security_glow', cornerStyle: 'rounded_lg',
    fontFamily: 'heading', sponsorLogoPosition: 'top_header', securityWatermark: 'shield_logo', defaultOrientation: 'landscape',
    thumbnailStyle: 'Crowd silhouette under crimson stadium lights', description: 'Roaring sold-out crowd silhouette beneath crimson stadium lights.',
  },
  midnight_stealth: {
    id: 'midnight_stealth', name: 'Midnight Stealth', tagline: 'Blackout Edition', badgeText: 'BLACKOUT',
    categoryDefault: 'vip', mode: 'dark',
    colors: { primary: '#1e293b', secondary: '#020617', accent: '#64748b' },
    bgClass: 'from-slate-950 via-black to-slate-900', accentClass: '#94a3b8', borderClass: 'border-slate-500/50',
    previewGradient: 'bg-gradient-to-r from-slate-800 via-black to-slate-800', patternId: 'carbon_weave',
    borderStyle: 'none', badgeStyle: 'minimal_block', qrFrameStyle: 'minimal', cornerStyle: 'sharp_square',
    fontFamily: 'mono', sponsorLogoPosition: 'footer', securityWatermark: 'none', defaultOrientation: 'landscape',
    thumbnailStyle: 'Stealth all-black carbon weave', description: 'Ultra-sleek all-black blackout edition with subtle carbon texture.',
  },
  diamond_all_access: {
    id: 'diamond_all_access', name: 'Diamond All-Access', tagline: 'Ultimate Credential Edition', badgeText: 'ALL ACCESS',
    categoryDefault: 'vvip', mode: 'dark',
    colors: { primary: '#0c4a6e', secondary: '#0f172a', accent: '#e0f2fe' },
    bgClass: 'from-sky-950 via-slate-950 to-sky-900', accentClass: '#7dd3fc', borderClass: 'border-sky-300/80',
    previewGradient: 'bg-gradient-to-r from-sky-300 via-slate-800 to-sky-500', patternId: 'starburst',
    borderStyle: 'double_metallic', badgeStyle: 'shield_crest', qrFrameStyle: 'glass_card', cornerStyle: 'pill_edges',
    fontFamily: 'heading', sponsorLogoPosition: 'top_header', securityWatermark: 'starburst_hologram', defaultOrientation: 'landscape',
    thumbnailStyle: 'Diamond-white starburst on deep sky blue', description: 'Diamond-white starburst credential for ultimate all-access status.',
  },
  gold_foil_vip: {
    id: 'gold_foil_vip', name: 'Gold Foil VIP Pass', tagline: 'World Cup Trophy Edition', badgeText: 'VIP PASS',
    categoryDefault: 'vip', mode: 'dark',
    colors: { primary: '#78350f', secondary: '#18181b', accent: '#f59e0b' },
    bgClass: 'from-amber-950 via-zinc-950 to-amber-900', accentClass: '#f59e0b', borderClass: 'border-amber-400/80',
    previewGradient: 'bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700', patternId: 'trophy_motif',
    borderStyle: 'solid_gold', badgeStyle: 'gold_tag', qrFrameStyle: 'gold_metallic', cornerStyle: 'rounded_lg',
    fontFamily: 'heading', sponsorLogoPosition: 'top_header', securityWatermark: 'official_seal', defaultOrientation: 'landscape',
    thumbnailStyle: 'Gold Leaf Metallic with Vertical VIP Ribbon & Trophy', description: 'Ultra-luxurious gold leaf foil pass with vertical ribbon and trophy accents.',
  },
  purple_gold_sports: {
    id: 'purple_gold_sports', name: 'Sports All-Stars Tournament', tagline: 'Purple & Gold Stub Edition', badgeText: 'SPORT EVENT',
    categoryDefault: 'vip', mode: 'dark',
    colors: { primary: '#581c87', secondary: '#1e1b4b', accent: '#eab308' },
    bgClass: 'from-purple-950 via-indigo-950 to-purple-900', accentClass: '#eab308', borderClass: 'border-purple-400/70',
    previewGradient: 'bg-gradient-to-r from-purple-700 via-indigo-800 to-yellow-500', patternId: 'confetti_burst',
    borderStyle: 'double_metallic', badgeStyle: 'metallic_ribbon', qrFrameStyle: 'gold_metallic', cornerStyle: 'notch_cutouts',
    fontFamily: 'display', sponsorLogoPosition: 'top_header', securityWatermark: 'official_seal', defaultOrientation: 'landscape',
    thumbnailStyle: 'Vibrant Deep Purple & Gold 3D Sports Lettering', description: 'Electric royal purple stub ticket with celebratory confetti burst.',
  },
  neon_esports: {
    id: 'neon_esports', name: 'Esports Gaming Champion', tagline: 'Cyber Neon Crimson Edition', badgeText: 'GAMING CHAMPION',
    categoryDefault: 'regular', mode: 'dark',
    colors: { primary: '#9f1239', secondary: '#0f0a0a', accent: '#f43f5e' },
    bgClass: 'from-rose-950 via-slate-950 to-red-950', accentClass: '#f43f5e', borderClass: 'border-rose-500/80',
    previewGradient: 'bg-gradient-to-r from-rose-700 via-red-900 to-rose-600', patternId: 'hex_grid',
    borderStyle: 'neon_glow', badgeStyle: 'pill_stars', qrFrameStyle: 'security_glow', cornerStyle: 'notch_cutouts',
    fontFamily: 'mono', sponsorLogoPosition: 'top_header', securityWatermark: 'starburst_hologram', defaultOrientation: 'landscape',
    thumbnailStyle: 'Dark Crimson & Neon Pink Block Typography', description: 'High-octane tournament pass with notch cutouts and neon crimson grid.',
  },
  sleek_black_match: {
    id: 'sleek_black_match', name: 'Sleek Black Match Day', tagline: 'Minimalist Matte Gold Edition', badgeText: 'MATCH TICKET',
    categoryDefault: 'regular', mode: 'dark',
    colors: { primary: '#3f3f46', secondary: '#09090b', accent: '#d97706' },
    bgClass: 'from-zinc-950 via-slate-950 to-zinc-900', accentClass: '#d97706', borderClass: 'border-amber-500/50',
    previewGradient: 'bg-gradient-to-r from-zinc-800 via-zinc-900 to-amber-600', patternId: 'carbon_weave',
    borderStyle: 'dashed_stub', badgeStyle: 'minimal_block', qrFrameStyle: 'minimal', cornerStyle: 'sharp_square',
    fontFamily: 'sans', sponsorLogoPosition: 'footer', securityWatermark: 'none', defaultOrientation: 'landscape',
    thumbnailStyle: 'Matte Black & Gold Line Stadium Ticket', description: 'Sleek matte black ticket with gold trim and match day stats.',
  },
  courtside_classic: {
    id: 'courtside_classic', name: 'Courtside Official Credential', tagline: 'Liberia Arena VIP Edition', badgeText: 'COURTSIDE PASS',
    categoryDefault: 'vvip', mode: 'dark',
    colors: { primary: '#1d4ed8', secondary: '#0f172a', accent: '#3b82f6' },
    bgClass: 'from-blue-950 via-slate-900 to-red-950', accentClass: '#3b82f6', borderClass: 'border-blue-500/60',
    previewGradient: 'bg-gradient-to-r from-blue-700 via-slate-800 to-red-600', patternId: 'court_lines',
    borderStyle: 'solid_gold', badgeStyle: 'shield_crest', qrFrameStyle: 'security_glow', cornerStyle: 'rounded_lg',
    fontFamily: 'heading', sponsorLogoPosition: 'top_header', securityWatermark: 'official_seal', defaultOrientation: 'landscape',
    thumbnailStyle: 'Official Blue & Red Hologram Security Credential', description: 'Official Courtside Liberia digital pass with metallic header and encrypted QR.',
  },
};

export const PASS_TEMPLATES: Record<PassCategory, PassTemplate> = {
  courtside_vip: {
    id: 'tpl_courtside_vip', name: 'Courtside Ultra VIP', category: 'courtside_vip',
    bgGradient: 'from-blue-950 via-slate-900 to-red-950', badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    badgeText: 'COURTSIDE VIP', borderColor: 'border-blue-500/40', accentColor: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.25)',
    description: 'Front row courtside experience with exclusive lounge, valet & open bar.',
  },
  regular: {
    id: 'tpl_regular', name: 'Regular Admission', category: 'regular',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950', badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    badgeText: 'REGULAR', borderColor: 'border-blue-500/40', accentColor: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.25)',
    description: 'Standard event admission access.',
  },
  vip: {
    id: 'tpl_vip', name: 'VIP Executive', category: 'vip',
    bgGradient: 'from-amber-950 via-slate-900 to-yellow-950', badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    badgeText: 'VIP PASS', borderColor: 'border-amber-500/40', accentColor: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.25)',
    description: 'Premium elevated seating with fast track entry and catering.',
  },
  vvip: {
    id: 'tpl_vvip', name: 'VVIP Courtside', category: 'vvip',
    bgGradient: 'from-purple-950 via-slate-950 to-amber-950', badgeBg: 'bg-amber-400/30 text-amber-300 border-amber-400/80',
    badgeText: 'VVIP ACCESS', borderColor: 'border-amber-400', accentColor: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.35)',
    description: 'Ultra-exclusive VVIP admission with all-access privileges.',
  },
  all_access: {
    id: 'tpl_all_access', name: 'All Access Pass', category: 'all_access',
    bgGradient: 'from-emerald-950 via-slate-950 to-red-950', badgeBg: 'bg-emerald-500/30 text-emerald-300 border-emerald-400/80',
    badgeText: 'ALL ACCESS', borderColor: 'border-emerald-400', accentColor: '#10b981', glowColor: 'rgba(16, 185, 129, 0.35)',
    description: 'Full facility and back-of-house all-access credential.',
  },
  courtside_box: {
    id: 'tpl_courtside_box', name: 'Courtside Box Suite', category: 'courtside_box',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950', badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    badgeText: 'BOX SUITE', borderColor: 'border-blue-500/40', accentColor: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.25)',
    description: 'Private luxury box for group hosting right next to team bench.',
  },
  courtside_floor: {
    id: 'tpl_courtside_floor', name: 'Courtside Floor Access', category: 'courtside_floor',
    bgGradient: 'from-rose-950 via-slate-900 to-red-950', badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    badgeText: 'FLOOR PASS', borderColor: 'border-rose-500/40', accentColor: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.25)',
    description: 'Floor level access with sideline seats and halftime tunnel walk.',
  },
  general_access: {
    id: 'tpl_general_access', name: 'General Access', category: 'general_access',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950', badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    badgeText: 'STANDARD PASS', borderColor: 'border-blue-500/40', accentColor: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.25)',
    description: 'Standard stadium tier seating with access to fan concessions.',
  },
  media: {
    id: 'tpl_media', name: 'Press & Media Credential', category: 'media',
    bgGradient: 'from-sky-950 via-slate-900 to-slate-900', badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    badgeText: 'PRESS / MEDIA', borderColor: 'border-sky-500/40', accentColor: '#0ea5e9', glowColor: 'rgba(14, 165, 233, 0.25)',
    description: 'Press row access, post-match conference hall, and photo deck.',
  },
  player_staff: {
    id: 'tpl_player_staff', name: 'Player & All-Access Staff', category: 'player_staff',
    bgGradient: 'from-red-950 via-slate-900 to-blue-950', badgeBg: 'bg-red-500/20 text-red-300 border-red-400/40',
    badgeText: 'ALL ACCESS / STAFF', borderColor: 'border-red-500/40', accentColor: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.25)',
    description: 'Locker room, team bench, referee tunnel and back-of-house areas.',
  },
};

export const DEFAULT_EVENT_INFO = {
  eventName: '',
  venue: '',
  eventDate: '',
  eventTime: '18:00 GMT',
  currency: 'USD',
};

// ---------------------------------------------------------------------------
// Deterministic category → gate-tier mapping for scanner access control.
// Every one of the app's PassCategory values maps to EXACTLY one of three
// checkpoint tiers (or 'all_access', which bypasses every checkpoint). This
// replaces fragile substring matching on a free-text "gate name" — the
// scanner now picks one of these three tiers explicitly, and a ticket is
// only ever valid at the tier it maps to. That's what makes "VVIP gate
// rejects a Regular ticket" (and every other combination) reliable.
// ---------------------------------------------------------------------------
export type GateTier = 'regular' | 'vip' | 'vvip';

export const CATEGORY_TO_GATE_TIER: Record<PassCategory, GateTier | 'all_access'> = {
  regular: 'regular',
  general_access: 'regular',
  vip: 'vip',
  courtside_vip: 'vip',
  media: 'vip',
  player_staff: 'vip',
  vvip: 'vvip',
  courtside_box: 'vvip',
  courtside_floor: 'vvip',
  all_access: 'all_access',
};

export const GATE_TIER_LABEL: Record<GateTier, string> = {
  regular: 'Regular',
  vip: 'VIP',
  vvip: 'VVIP',
};

// ---------------------------------------------------------------------------
// Custom templates created in the Template Manager are persisted here
// (localStorage-backed) and merged with the 21 built-ins at runtime.
// ---------------------------------------------------------------------------
const CUSTOM_THEMES_KEY = 'courtside_custom_ticket_themes_v1';

export function getCustomThemes(): CanvasThemeDefinition[] {
  try {
    const raw = localStorage.getItem(CUSTOM_THEMES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomTheme(theme: CanvasThemeDefinition) {
  const existing = getCustomThemes().filter((t) => t.id !== theme.id);
  const updated = [...existing, theme];
  localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteCustomTheme(id: string) {
  const updated = getCustomThemes().filter((t) => t.id !== id);
  localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(updated));
  return updated;
}

/** All built-in templates plus any saved custom ones, keyed by id. */
export function getAllThemes(): Record<string, CanvasThemeDefinition> {
  const custom = getCustomThemes();
  const merged: Record<string, CanvasThemeDefinition> = { ...CANVAS_THEMES };
  custom.forEach((t) => { merged[t.id] = t; });
  return merged;
}
