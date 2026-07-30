import React from 'react';
import { BadgeStyleOption, QRFrameStyleOption, BorderStyleOption, CornerStyleOption } from '../../types';

export const TicketBadge: React.FC<{
  style: BadgeStyleOption;
  text: string;
  accentColor: string;
  themeMode: 'dark' | 'light';
}> = ({ style, text, accentColor, themeMode }) => {
  const base = `inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 shrink-0`;
  const fg = themeMode === 'dark' ? '#fff' : '#0f172a';

  if (style === 'metallic_ribbon') {
    return (
      <span
        className={base}
        style={{
          background: `linear-gradient(135deg, ${accentColor}, #fff8, ${accentColor})`,
          color: fg,
          clipPath: 'polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)',
          paddingRight: '14px'
        }}
      >
        {text}
      </span>
    );
  }
  if (style === 'shield_crest') {
    return (
      <span
        className={base}
        style={{
          background: `${accentColor}30`,
          color: accentColor,
          border: `1.5px solid ${accentColor}`,
          clipPath: 'polygon(50% 0%, 100% 15%, 100% 75%, 50% 100%, 0 75%, 0 15%)'
        }}
      >
        {text}
      </span>
    );
  }
  if (style === 'gold_tag') {
    return (
      <span
        className={base}
        style={{
          background: `${accentColor}25`,
          color: accentColor,
          border: `1.5px solid ${accentColor}`,
          clipPath: 'polygon(12% 0, 88% 0, 100% 50%, 88% 100%, 12% 100%, 0 50%)'
        }}
      >
        {text}
      </span>
    );
  }
  if (style === 'minimal_block') {
    return (
      <span className={`${base} rounded-sm`} style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}` }}>
        {text}
      </span>
    );
  }
  // pill_stars (default)
  return (
    <span className={`${base} rounded-full`} style={{ background: `${accentColor}25`, color: accentColor, border: `1px solid ${accentColor}90` }}>
      ★ {text}
    </span>
  );
};

export function getQrFrameClass(style: QRFrameStyleOption): string {
  switch (style) {
    case 'glass_card': return 'rounded-2xl backdrop-blur-md';
    case 'corner_crosshairs': return 'rounded-none';
    case 'gold_metallic': return 'rounded-xl';
    case 'minimal': return 'rounded-lg';
    default: return 'rounded-xl'; // security_glow
  }
}

export function getBorderClass(style: BorderStyleOption): string {
  switch (style) {
    case 'double_metallic': return 'border-4 border-double';
    case 'dashed_stub': return 'border-2 border-dashed';
    case 'neon_glow': return 'border-2';
    case 'none': return 'border-0';
    case 'chamfer': return 'border-2';
    default: return 'border-2'; // solid_gold
  }
}

export function getBorderGlowStyle(style: BorderStyleOption, accentColor: string): React.CSSProperties {
  if (style === 'neon_glow') {
    return { borderColor: accentColor, boxShadow: `0 0 24px ${accentColor}55, inset 0 0 20px ${accentColor}22` };
  }
  return { borderColor: accentColor };
}

export function getCornerClass(style: CornerStyleOption): string {
  switch (style) {
    case 'sharp_square': return 'rounded-none';
    case 'notch_cutouts': return 'rounded-none';
    case 'pill_edges': return 'rounded-[2.5rem]';
    default: return 'rounded-3xl'; // rounded_lg
  }
}

/** Returns an inline clip-path for corner styles that need one. */
export function getCornerClipPath(style: CornerStyleOption): string | undefined {
  if (style === 'notch_cutouts') {
    return 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)';
  }
  return undefined;
}
