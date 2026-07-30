import {
  TicketCanvasThemeId, TemplateCustomization, FontFamilyOption
} from '../types';
import {
  CourtLinesSVG, ConfettiBurstSVG, CrowdSilhouetteSVG, TrophyGlowSVG,
  GeometricPatternSVG, LightRaysSVG, StadiumArcSVG, NeonGridSVG, MinimalWaveSVG,
  TicketArtProps
} from '../components/ticket-templates/TicketBackgroundArt';
import React from 'react';

export interface TicketTemplateDefinition {
  id: TicketCanvasThemeId;
  name: string;
  tagline: string;
  badgeText: string;
  themeMode: 'dark' | 'light';
  isGraphicArt?: boolean;
  backgroundImageUrl?: string;
  /** The template's own default styling — any of these can be overridden
   * per-ticket via PassTicket.templateCustomization. */
  defaults: Required<TemplateCustomization>;
  /** Which layered SVG art pieces render behind the content, back to front. */
  artLayers: Array<React.FC<TicketArtProps>>;
  previewGradient: string; // tailwind gradient classes for small swatches in pickers
  description: string;
}

function defaults(d: Partial<TemplateCustomization>): Required<TemplateCustomization> {
  return {
    mode: 'dark',
    primaryColor: '#78350f',
    secondaryColor: '#0f172a',
    accentColor: '#f59e0b',
    fontFamily: 'sans',
    fontColor: '#ffffff',
    borderStyle: 'solid_gold',
    badgeStyle: 'pill_stars',
    qrFrameStyle: 'glass_card',
    orientation: 'landscape',
    cornerStyle: 'rounded_lg',
    securityWatermark: 'shield_logo',
    sponsorLogoPosition: 'none',
    backgroundImageUrl: '',
    bgOverlayOpacity: 0.45,
    canvasElements: [],
    ...d
  };
}

export const TICKET_TEMPLATES: Record<string, TicketTemplateDefinition> = {
  gold_championship: {
    id: 'gold_championship',
    name: 'Gold Championship',
    tagline: 'Trophy Edition',
    badgeText: 'VIP ACCESS',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#78350f', secondaryColor: '#0f172a', accentColor: '#f59e0b',
      fontFamily: 'heading', fontColor: '#fef3c7', borderStyle: 'neon_glow',
      badgeStyle: 'metallic_ribbon', qrFrameStyle: 'security_glow', orientation: 'landscape',
      cornerStyle: 'notch_cutouts', securityWatermark: 'starburst_hologram', sponsorLogoPosition: 'none'
    }),
    artLayers: [TrophyGlowSVG, LightRaysSVG],
    previewGradient: 'bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-800',
    description: 'Deep gold and midnight, trophy glow, ornate QR frame — for your top-tier passes.'
  },
  crimson_slam: {
    id: 'crimson_slam',
    name: 'Crimson Slam',
    tagline: 'Game Day Edition',
    badgeText: 'GAME DAY',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#7f1d1d', secondaryColor: '#1c1917', accentColor: '#f43f5e',
      fontFamily: 'display', fontColor: '#fff1f2', borderStyle: 'solid_gold',
      badgeStyle: 'shield_crest', qrFrameStyle: 'minimal', orientation: 'landscape',
      cornerStyle: 'notch_cutouts', securityWatermark: 'official_seal', sponsorLogoPosition: 'none'
    }),
    artLayers: [CourtLinesSVG, ConfettiBurstSVG],
    previewGradient: 'bg-gradient-to-r from-rose-700 via-red-800 to-rose-950',
    description: 'Bold crimson court-line energy with a confetti burst — general admission favorite.'
  },
  royal_courtside: {
    id: 'royal_courtside',
    name: 'Royal Courtside',
    tagline: 'Official Credential',
    badgeText: 'COURTSIDE',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#1e3a8a', secondaryColor: '#7f1d1d', accentColor: '#3b82f6',
      fontFamily: 'sans', fontColor: '#e0e7ff', borderStyle: 'double_metallic',
      badgeStyle: 'pill_stars', qrFrameStyle: 'glass_card', orientation: 'landscape',
      cornerStyle: 'rounded_lg', securityWatermark: 'shield_logo', sponsorLogoPosition: 'none'
    }),
    artLayers: [CourtLinesSVG, StadiumArcSVG],
    previewGradient: 'bg-gradient-to-r from-blue-700 via-slate-800 to-red-700',
    description: 'The signature Courtside Liberia blue-and-red official credential.'
  },
  emerald_press: {
    id: 'emerald_press',
    name: 'Emerald Press',
    tagline: 'Media Credential',
    badgeText: 'PRESS',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#064e3b', secondaryColor: '#0f172a', accentColor: '#10b981',
      fontFamily: 'mono', fontColor: '#d1fae5', borderStyle: 'solid_gold',
      badgeStyle: 'minimal_block', qrFrameStyle: 'minimal', orientation: 'landscape',
      cornerStyle: 'sharp_square', securityWatermark: 'official_seal', sponsorLogoPosition: 'none'
    }),
    artLayers: [GeometricPatternSVG],
    previewGradient: 'bg-gradient-to-r from-emerald-700 via-slate-900 to-emerald-950',
    description: 'Clean, structured emerald credential for press row and media access.'
  },
  violet_allstar: {
    id: 'violet_allstar',
    name: 'Violet All-Star',
    tagline: 'Purple & Gold Edition',
    badgeText: 'ALL-STAR',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#4c1d95', secondaryColor: '#78350f', accentColor: '#eab308',
      fontFamily: 'heading', fontColor: '#f5f3ff', borderStyle: 'neon_glow',
      badgeStyle: 'metallic_ribbon', qrFrameStyle: 'gold_metallic', orientation: 'landscape',
      cornerStyle: 'rounded_lg', securityWatermark: 'starburst_hologram', sponsorLogoPosition: 'none'
    }),
    artLayers: [ConfettiBurstSVG, LightRaysSVG],
    previewGradient: 'bg-gradient-to-r from-purple-700 via-indigo-800 to-yellow-500',
    description: 'Electric royal purple and gold — festival-grade all-star game energy.'
  },
  midnight_neon: {
    id: 'midnight_neon',
    name: 'Midnight Neon',
    tagline: 'Cyber Arena Edition',
    badgeText: 'GAMING PASS',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#0e7490', secondaryColor: '#831843', accentColor: '#22d3ee',
      fontFamily: 'mono', fontColor: '#cffafe', borderStyle: 'neon_glow',
      badgeStyle: 'gold_tag', qrFrameStyle: 'security_glow', orientation: 'landscape',
      cornerStyle: 'notch_cutouts', securityWatermark: 'starburst_hologram', sponsorLogoPosition: 'none'
    }),
    artLayers: [NeonGridSVG, LightRaysSVG],
    previewGradient: 'bg-gradient-to-r from-cyan-500 via-slate-900 to-fuchsia-700',
    description: 'Neon grid floor and cyan glow — esports and gaming tournament ready.'
  },
  platinum_vvip: {
    id: 'platinum_vvip',
    name: 'Platinum VVIP',
    tagline: 'Ultra Exclusive Edition',
    badgeText: 'VVIP',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#334155', secondaryColor: '#78350f', accentColor: '#e2e8f0',
      fontFamily: 'heading', fontColor: '#f8fafc', borderStyle: 'double_metallic',
      badgeStyle: 'gold_tag', qrFrameStyle: 'gold_metallic', orientation: 'landscape',
      cornerStyle: 'notch_cutouts', securityWatermark: 'shield_logo', sponsorLogoPosition: 'none'
    }),
    artLayers: [TrophyGlowSVG, GeometricPatternSVG],
    previewGradient: 'bg-gradient-to-r from-slate-400 via-slate-700 to-amber-600',
    description: 'Platinum and gold facets for the most exclusive VVIP credentials.'
  },
  sunset_finals: {
    id: 'sunset_finals',
    name: 'Sunset Finals',
    tagline: 'Championship Finals Edition',
    badgeText: 'FINALS',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#9a3412', secondaryColor: '#831843', accentColor: '#fb923c',
      fontFamily: 'display', fontColor: '#ffedd5', borderStyle: 'solid_gold',
      badgeStyle: 'metallic_ribbon', qrFrameStyle: 'glass_card', orientation: 'landscape',
      cornerStyle: 'notch_cutouts', securityWatermark: 'official_seal', sponsorLogoPosition: 'none'
    }),
    artLayers: [LightRaysSVG, CourtLinesSVG],
    previewGradient: 'bg-gradient-to-r from-orange-600 via-rose-700 to-pink-800',
    description: 'Warm sunset gradients and light rays for finals-night atmosphere.'
  },
  ice_arena: {
    id: 'ice_arena',
    name: 'Ice Arena',
    tagline: 'Cool Blue Edition',
    badgeText: 'ARENA PASS',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#0c4a6e', secondaryColor: '#1e293b', accentColor: '#38bdf8',
      fontFamily: 'sans', fontColor: '#e0f2fe', borderStyle: 'solid_gold',
      badgeStyle: 'pill_stars', qrFrameStyle: 'glass_card', orientation: 'landscape',
      cornerStyle: 'rounded_lg', securityWatermark: 'shield_logo', sponsorLogoPosition: 'none'
    }),
    artLayers: [StadiumArcSVG, GeometricPatternSVG],
    previewGradient: 'bg-gradient-to-r from-sky-600 via-slate-800 to-sky-950',
    description: 'Crisp icy blues with stadium arc lines — a cool, modern arena pass.'
  },
  copper_classic: {
    id: 'copper_classic',
    name: 'Copper Classic',
    tagline: 'Heritage Edition',
    badgeText: 'CLASSIC',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#7c2d12', secondaryColor: '#292524', accentColor: '#d97706',
      fontFamily: 'serif', fontColor: '#fed7aa', borderStyle: 'double_metallic',
      badgeStyle: 'shield_crest', qrFrameStyle: 'minimal', orientation: 'landscape',
      cornerStyle: 'sharp_square', securityWatermark: 'official_seal', sponsorLogoPosition: 'none'
    }),
    artLayers: [CourtLinesSVG, TrophyGlowSVG],
    previewGradient: 'bg-gradient-to-r from-orange-800 via-stone-900 to-amber-700',
    description: 'A warm, heritage-inspired copper and stone ticket with classic serif type.'
  },
  confetti_celebration: {
    id: 'confetti_celebration',
    name: 'Confetti Celebration',
    tagline: 'Victory Edition',
    badgeText: 'CELEBRATION',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#be123c', secondaryColor: '#1e40af', accentColor: '#facc15',
      fontFamily: 'heading', fontColor: '#fffbeb', borderStyle: 'neon_glow',
      badgeStyle: 'metallic_ribbon', qrFrameStyle: 'glass_card', orientation: 'landscape',
      cornerStyle: 'rounded_lg', securityWatermark: 'starburst_hologram', sponsorLogoPosition: 'none'
    }),
    artLayers: [ConfettiBurstSVG, CrowdSilhouetteSVG],
    previewGradient: 'bg-gradient-to-r from-rose-600 via-amber-500 to-blue-700',
    description: 'Bright, festive confetti burst over a crowd silhouette — championship parties.'
  },
  trophy_gold_foil: {
    id: 'trophy_gold_foil',
    name: 'Trophy Gold Foil',
    tagline: 'Metallic Foil Edition',
    badgeText: 'GOLD FOIL',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#451a03', secondaryColor: '#1c1917', accentColor: '#fbbf24',
      fontFamily: 'heading', fontColor: '#fef9c3', borderStyle: 'neon_glow',
      badgeStyle: 'gold_tag', qrFrameStyle: 'gold_metallic', orientation: 'landscape',
      cornerStyle: 'notch_cutouts', securityWatermark: 'starburst_hologram', sponsorLogoPosition: 'none'
    }),
    artLayers: [TrophyGlowSVG, GeometricPatternSVG],
    previewGradient: 'bg-gradient-to-r from-amber-400 via-yellow-700 to-amber-950',
    description: 'Ultra-luxurious metallic gold foil look with a glowing trophy centerpiece.'
  },
  stadium_lights: {
    id: 'stadium_lights',
    name: 'Stadium Lights',
    tagline: 'Night Game Edition',
    badgeText: 'NIGHT GAME',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#1e293b', secondaryColor: '#78350f', accentColor: '#fbbf24',
      fontFamily: 'display', fontColor: '#f1f5f9', borderStyle: 'solid_gold',
      badgeStyle: 'minimal_block', qrFrameStyle: 'minimal', orientation: 'landscape',
      cornerStyle: 'notch_cutouts', securityWatermark: 'official_seal', sponsorLogoPosition: 'none'
    }),
    artLayers: [LightRaysSVG, StadiumArcSVG, CrowdSilhouetteSVG],
    previewGradient: 'bg-gradient-to-r from-slate-700 via-slate-900 to-amber-700',
    description: 'Floodlit stadium atmosphere with crowd silhouette and beaming light rays.'
  },
  minimal_light_court: {
    id: 'minimal_light_court',
    name: 'Minimal Light Court',
    tagline: 'Modern Light Edition',
    badgeText: 'GENERAL ADMISSION',
    themeMode: 'light',
    defaults: defaults({
      primaryColor: '#1d4ed8', secondaryColor: '#0f172a', accentColor: '#2563eb',
      fontFamily: 'sans', fontColor: '#0f172a', borderStyle: 'solid_gold',
      badgeStyle: 'pill_stars', qrFrameStyle: 'glass_card', orientation: 'landscape',
      cornerStyle: 'rounded_lg', securityWatermark: 'shield_logo', sponsorLogoPosition: 'none'
    }),
    artLayers: [MinimalWaveSVG, CourtLinesSVG],
    previewGradient: 'bg-gradient-to-r from-blue-100 via-white to-slate-200',
    description: 'A crisp white and blue light-mode ticket for a clean, modern brand feel.'
  },
  student_access: {
    id: 'student_access',
    name: 'Student Access',
    tagline: 'Campus Edition',
    badgeText: 'STUDENT',
    themeMode: 'light',
    defaults: defaults({
      primaryColor: '#0d9488', secondaryColor: '#1e3a8a', accentColor: '#14b8a6',
      fontFamily: 'sans', fontColor: '#0f172a', borderStyle: 'dashed_stub',
      badgeStyle: 'minimal_block', qrFrameStyle: 'minimal', orientation: 'landscape',
      cornerStyle: 'rounded_lg', securityWatermark: 'none', sponsorLogoPosition: 'none'
    }),
    artLayers: [MinimalWaveSVG],
    previewGradient: 'bg-gradient-to-r from-teal-100 via-white to-blue-100',
    description: 'Friendly, affordable-feeling light-mode pass for student ticket tiers.'
  },
  media_press_pass: {
    id: 'media_press_pass',
    name: 'Media Press Pass',
    tagline: 'Broadcast Edition',
    badgeText: 'MEDIA',
    themeMode: 'dark',
    defaults: defaults({
      primaryColor: '#0c4a6e', secondaryColor: '#1e293b', accentColor: '#0ea5e9',
      fontFamily: 'mono', fontColor: '#e0f2fe', borderStyle: 'solid_gold',
      badgeStyle: 'minimal_block', qrFrameStyle: 'minimal', orientation: 'landscape',
      cornerStyle: 'sharp_square', securityWatermark: 'official_seal', sponsorLogoPosition: 'none'
    }),
    artLayers: [GeometricPatternSVG, StadiumArcSVG],
    previewGradient: 'bg-gradient-to-r from-sky-700 via-slate-800 to-slate-950',
    description: 'A no-nonsense broadcast/media credential with camera-ready contrast.'
  },
  stadium_championship_art_bg: {
    id: 'stadium_championship_art_bg',
    name: 'Stadium Championship Art',
    tagline: 'Canva Arena Graphic Edition',
    badgeText: 'CHAMPIONSHIP',
    themeMode: 'dark',
    isGraphicArt: true,
    backgroundImageUrl: '/stadium_championship_art.jpg',
    defaults: defaults({
      primaryColor: '#1e293b', secondaryColor: '#0f172a', accentColor: '#fbbf24',
      fontFamily: 'display', fontColor: '#ffffff', borderStyle: 'solid_gold',
      badgeStyle: 'metallic_ribbon', qrFrameStyle: 'security_glow', orientation: 'landscape',
      cornerStyle: 'notch_cutouts', securityWatermark: 'starburst_hologram', sponsorLogoPosition: 'none',
      backgroundImageUrl: '/stadium_championship_art.jpg', bgOverlayOpacity: 0.35
    }),
    artLayers: [],
    previewGradient: 'bg-gradient-to-r from-amber-600 via-yellow-800 to-stone-900',
    description: 'High-res Canva-style basketball arena graphic background with golden stadium flares and hardwood court glow.'
  },
  vvip_gold_badge_art_bg: {
    id: 'vvip_gold_badge_art_bg',
    name: 'VVIP Gold Luxury Art',
    tagline: 'Metallic Foil Graphic Edition',
    badgeText: 'VVIP GOLD',
    themeMode: 'dark',
    isGraphicArt: true,
    backgroundImageUrl: '/vvip_gold_badge_art.jpg',
    defaults: defaults({
      primaryColor: '#451a03', secondaryColor: '#1c1917', accentColor: '#f59e0b',
      fontFamily: 'heading', fontColor: '#fef3c7', borderStyle: 'double_metallic',
      badgeStyle: 'gold_tag', qrFrameStyle: 'gold_metallic', orientation: 'landscape',
      cornerStyle: 'rounded_lg', securityWatermark: 'shield_logo', sponsorLogoPosition: 'none',
      backgroundImageUrl: '/vvip_gold_badge_art.jpg', bgOverlayOpacity: 0.30
    }),
    artLayers: [],
    previewGradient: 'bg-gradient-to-r from-yellow-500 via-amber-700 to-stone-950',
    description: 'Canva-style metallic gold foil border artwork with deep carbon fiber texture.'
  },
  cyber_neon_match_art_bg: {
    id: 'cyber_neon_match_art_bg',
    name: 'Cyber Neon Arena Art',
    tagline: 'Pinterest Neon Graphic Edition',
    badgeText: 'NEON MATCH',
    themeMode: 'dark',
    isGraphicArt: true,
    backgroundImageUrl: '/cyber_neon_match_art.jpg',
    defaults: defaults({
      primaryColor: '#0e7490', secondaryColor: '#831843', accentColor: '#22d3ee',
      fontFamily: 'mono', fontColor: '#cffafe', borderStyle: 'neon_glow',
      badgeStyle: 'minimal_block', qrFrameStyle: 'security_glow', orientation: 'landscape',
      cornerStyle: 'notch_cutouts', securityWatermark: 'starburst_hologram', sponsorLogoPosition: 'none',
      backgroundImageUrl: '/cyber_neon_match_art.jpg', bgOverlayOpacity: 0.35
    }),
    artLayers: [],
    previewGradient: 'bg-gradient-to-r from-cyan-600 via-purple-900 to-fuchsia-800',
    description: 'Pinterest-style cyberpunk sports arena background with electric blue and magenta neon gridlines.'
  },
  retro_vintage_stub_art_bg: {
    id: 'retro_vintage_stub_art_bg',
    name: 'Retro Vintage Ticket Art',
    tagline: 'Pinterest Vintage Paper Edition',
    badgeText: 'CLASSIC STUB',
    themeMode: 'dark',
    isGraphicArt: true,
    backgroundImageUrl: '/retro_vintage_stub_art.jpg',
    defaults: defaults({
      primaryColor: '#7c2d12', secondaryColor: '#1c1917', accentColor: '#ea580c',
      fontFamily: 'serif', fontColor: '#ffedd5', borderStyle: 'dashed_stub',
      badgeStyle: 'shield_crest', qrFrameStyle: 'minimal', orientation: 'landscape',
      cornerStyle: 'sharp_square', securityWatermark: 'official_seal', sponsorLogoPosition: 'none',
      backgroundImageUrl: '/retro_vintage_stub_art.jpg', bgOverlayOpacity: 0.25
    }),
    artLayers: [],
    previewGradient: 'bg-gradient-to-r from-amber-800 via-red-950 to-amber-900',
    description: 'Vintage Pinterest-style basketball stub template with aged warm paper texture and crimson/navy court lines.'
  },
  royal_courtside_art_bg: {
    id: 'royal_courtside_art_bg',
    name: 'Royal Courtside Graphic',
    tagline: 'Official Arena Graphic Edition',
    badgeText: 'COURTSIDE PASS',
    themeMode: 'dark',
    isGraphicArt: true,
    backgroundImageUrl: '/royal_courtside_art.jpg',
    defaults: defaults({
      primaryColor: '#1e3a8a', secondaryColor: '#7f1d1d', accentColor: '#3b82f6',
      fontFamily: 'sans', fontColor: '#ffffff', borderStyle: 'double_metallic',
      badgeStyle: 'pill_stars', qrFrameStyle: 'glass_card', orientation: 'landscape',
      cornerStyle: 'rounded_lg', securityWatermark: 'shield_logo', sponsorLogoPosition: 'none',
      backgroundImageUrl: '/royal_courtside_art.jpg', bgOverlayOpacity: 0.30
    }),
    artLayers: [],
    previewGradient: 'bg-gradient-to-r from-blue-600 via-slate-900 to-red-700',
    description: 'Canva-style official royal blue & crimson red arena background graphics with stadium lights.'
  }
};

export const PRESET_BACKGROUND_ARTWORKS = [
  { id: 'stadium', name: 'Stadium Arena Lights', url: '/stadium_championship_art.jpg' },
  { id: 'vvip_gold', name: 'VVIP Gold Foil Luxury', url: '/vvip_gold_badge_art.jpg' },
  { id: 'cyber_neon', name: 'Cyber Neon Match', url: '/cyber_neon_match_art.jpg' },
  { id: 'retro_vintage', name: 'Retro Vintage Paper', url: '/retro_vintage_stub_art.jpg' },
  { id: 'royal_courtside', name: 'Royal Arena Graphics', url: '/royal_courtside_art.jpg' }
];

export const TICKET_TEMPLATE_IDS = Object.keys(TICKET_TEMPLATES) as TicketCanvasThemeId[];

export const FONT_FAMILY_CLASS: Record<FontFamilyOption, string> = {
  heading: 'font-heading',
  mono: 'font-mono',
  sans: 'font-sans',
  serif: 'font-serif',
  display: 'font-heading tracking-tight',
  stencil: 'font-mono uppercase tracking-[0.15em]'
};
