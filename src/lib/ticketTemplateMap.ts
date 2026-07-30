import { PassCategory, PassTemplate, TicketCanvasThemeId } from '../types';
import { TICKET_TEMPLATES } from './ticketTemplates';

export interface CanvasThemeDefinition {
  id: TicketCanvasThemeId | string;
  name: string;
  tagline?: string;
  badgeText?: string;
  categoryDefault?: PassCategory;
  bgClass?: string;
  accentClass?: string;
  borderClass?: string;
  previewGradient?: string;
  thumbnailStyle?: string;
  description?: string;
  mode?: 'dark' | 'light';
  borderStyle?: any;
  badgeStyle?: any;
  qrFrameStyle?: any;
  defaultOrientation?: any;
  cornerStyle?: any;
  securityWatermark?: any;
  sponsorLogoPosition?: any;
  fontFamily?: any;
  patternId?: string;
  colors?: any;
  [key: string]: any;
}

export const DEFAULT_EVENT_INFO = {
  eventName: '',
  venue: '',
  eventDate: '',
  eventTime: '18:00 GMT',
  currency: 'USD',
};

/** Kept for backward compatibility with existing call sites (e.g.
 * TicketsWorkspace.tsx's theme-name lookup) — now derived from the real
 * template engine registry in ticketTemplates.ts, so there's a single
 * source of truth and the two can never drift out of sync again like the
 * previous hardcoded version did. */
export const CANVAS_THEMES: Record<TicketCanvasThemeId, CanvasThemeDefinition> = Object.fromEntries(
  Object.entries(TICKET_TEMPLATES).map(([id, t]) => [
    id,
    {
      id: t.id,
      name: t.name,
      tagline: t.tagline,
      badgeText: t.badgeText,
      categoryDefault: 'regular' as PassCategory,
      bgClass: '',
      accentClass: t.defaults.accentColor,
      borderClass: '',
      previewGradient: t.previewGradient,
      thumbnailStyle: t.tagline,
      description: t.description
    }
  ])
) as Record<TicketCanvasThemeId, CanvasThemeDefinition>;

export const PASS_TEMPLATES: Record<PassCategory, PassTemplate> = {
  courtside_vip: {
    id: 'tpl_courtside_vip',
    name: 'Courtside Ultra VIP',
    category: 'courtside_vip',
    bgGradient: 'from-blue-950 via-slate-900 to-red-950',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    badgeText: 'COURTSIDE VIP',
    borderColor: 'border-blue-500/40',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    description: 'Front row courtside experience with exclusive lounge, valet & open bar.',
  },
  regular: {
    id: 'tpl_regular',
    name: 'Regular Admission',
    category: 'regular',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    badgeText: 'REGULAR',
    borderColor: 'border-blue-500/40',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    description: 'Standard event admission access.',
  },
  vip: {
    id: 'tpl_vip',
    name: 'VIP Executive',
    category: 'vip',
    bgGradient: 'from-amber-950 via-slate-900 to-yellow-950',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    badgeText: 'VIP PASS',
    borderColor: 'border-amber-500/40',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    description: 'Premium elevated seating with fast track entry and catering.',
  },
  vvip: {
    id: 'tpl_vvip',
    name: 'VVIP Courtside',
    category: 'vvip',
    bgGradient: 'from-purple-950 via-slate-950 to-amber-950',
    badgeBg: 'bg-amber-400/30 text-amber-300 border-amber-400/80',
    badgeText: 'VVIP ACCESS',
    borderColor: 'border-amber-400',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    description: 'Ultra-exclusive VVIP admission with all-access privileges.',
  },
  all_access: {
    id: 'tpl_all_access',
    name: 'All Access Pass',
    category: 'all_access',
    bgGradient: 'from-emerald-950 via-slate-950 to-red-950',
    badgeBg: 'bg-emerald-500/30 text-emerald-300 border-emerald-400/80',
    badgeText: 'ALL ACCESS',
    borderColor: 'border-emerald-400',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    description: 'Full facility and back-of-house all-access credential.',
  },
  courtside_box: {
    id: 'tpl_courtside_box',
    name: 'Courtside Box Suite',
    category: 'courtside_box',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    badgeText: 'BOX SUITE',
    borderColor: 'border-blue-500/40',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    description: 'Private luxury box for group hosting right next to team bench.',
  },
  courtside_floor: {
    id: 'tpl_courtside_floor',
    name: 'Courtside Floor Access',
    category: 'courtside_floor',
    bgGradient: 'from-rose-950 via-slate-900 to-red-950',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    badgeText: 'FLOOR PASS',
    borderColor: 'border-rose-500/40',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    description: 'Floor level access with sideline seats and halftime tunnel walk.',
  },
  general_access: {
    id: 'tpl_general_access',
    name: 'General Access',
    category: 'general_access',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    badgeText: 'STANDARD PASS',
    borderColor: 'border-blue-500/40',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    description: 'Standard stadium tier seating with access to fan concessions.',
  },
  media: {
    id: 'tpl_media',
    name: 'Press & Media Credential',
    category: 'media',
    bgGradient: 'from-sky-950 via-slate-900 to-slate-900',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    badgeText: 'PRESS / MEDIA',
    borderColor: 'border-sky-500/40',
    accentColor: '#0ea5e9',
    glowColor: 'rgba(14, 165, 233, 0.25)',
    description: 'Press row access, post-match conference hall, and photo deck.',
  },
  player_staff: {
    id: 'tpl_player_staff',
    name: 'Player & All-Access Staff',
    category: 'player_staff',
    bgGradient: 'from-red-950 via-slate-900 to-blue-950',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-400/40',
    badgeText: 'ALL ACCESS / STAFF',
    borderColor: 'border-red-500/40',
    accentColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.25)',
    description: 'Locker room, team bench, referee tunnel and back-of-house areas.',
  },
};

export const DEFAULT_FALLBACK_THEME: CanvasThemeDefinition = {
  id: 'gold_championship' as TicketCanvasThemeId,
  name: 'Gold Championship',
  tagline: 'Trophy Edition',
  badgeText: 'VIP ACCESS',
  categoryDefault: 'regular',
  bgClass: '',
  accentClass: '#f59e0b',
  borderClass: '',
  previewGradient: 'from-amber-600 via-yellow-500 to-amber-700',
  thumbnailStyle: 'Trophy Edition',
  description: 'Premium gold championship edition'
};

export function getCustomThemes(): Record<string, CanvasThemeDefinition> {
  try {
    const stored = localStorage.getItem('courtside_custom_canvas_themes');
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

export function saveCustomTheme(theme: CanvasThemeDefinition): void {
  try {
    const existing = getCustomThemes();
    existing[theme.id] = theme;
    localStorage.setItem('courtside_custom_canvas_themes', JSON.stringify(existing));
  } catch {}
}

export function deleteCustomTheme(id: string): void {
  try {
    const existing = getCustomThemes();
    delete existing[id];
    localStorage.setItem('courtside_custom_canvas_themes', JSON.stringify(existing));
  } catch {}
}

export function getAllThemes(): Record<string, CanvasThemeDefinition> {
  const custom = getCustomThemes();
  return { ...CANVAS_THEMES, ...custom };
}
