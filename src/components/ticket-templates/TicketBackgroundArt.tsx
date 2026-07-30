import React from 'react';

export interface TicketArtProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  themeMode: 'dark' | 'light';
  uid: string; // unique id suffix so multiple tickets on one page don't clash gradient/pattern ids
}

/** Base full-bleed gradient wash every background sits on top of. */
export const BaseWashSVG: React.FC<TicketArtProps> = ({ primaryColor, secondaryColor, themeMode, uid }) => (
  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
    <defs>
      <linearGradient id={`wash-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={themeMode === 'dark' ? '#020617' : '#f8fafc'} />
        <stop offset="45%" stopColor={themeMode === 'dark' ? primaryColor : '#ffffff'} stopOpacity={themeMode === 'dark' ? 0.22 : 1} />
        <stop offset="100%" stopColor={themeMode === 'dark' ? secondaryColor : secondaryColor} stopOpacity={themeMode === 'dark' ? 0.28 : 0.12} />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill={`url(#wash-${uid})`} />
  </svg>
);

/** Basketball court line markings — center circle, arcs, key lines. */
export const CourtLinesSVG: React.FC<TicketArtProps> = ({ accentColor, uid }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.14]" preserveAspectRatio="none" viewBox="0 0 400 220">
    <g stroke={accentColor} strokeWidth="1.4" fill="none">
      <circle cx="330" cy="110" r="55" />
      <circle cx="330" cy="110" r="4" />
      <path d="M 400 40 L 340 40 Q 300 110 340 180 L 400 180" />
      <line x1="330" y1="20" x2="330" y2="200" strokeDasharray="3 3" />
      <path d="M 0 0 L 90 0 Q 130 110 90 220 L 0 220" opacity="0.5" />
    </g>
  </svg>
);

/** Scattered confetti shapes — triangles, dots, ribbons. */
export const ConfettiBurstSVG: React.FC<TicketArtProps> = ({ accentColor, secondaryColor, uid }) => {
  const pieces = React.useMemo(() => {
    const seedRand = (n: number) => {
      const x = Math.sin(n * 999) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 26 }).map((_, i) => ({
      x: seedRand(i) * 400,
      y: seedRand(i + 50) * 220,
      r: seedRand(i + 100) * 360,
      s: 3 + seedRand(i + 150) * 5,
      shape: i % 3
    }));
  }, []);
  return (
    <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 400 220">
      {pieces.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
          {p.shape === 0 && <rect width={p.s} height={p.s} fill={i % 2 === 0 ? accentColor : secondaryColor} rx="0.6" />}
          {p.shape === 1 && <circle r={p.s / 2.4} fill={accentColor} />}
          {p.shape === 2 && <polygon points={`0,0 ${p.s},0 ${p.s / 2},${p.s}`} fill={secondaryColor} />}
        </g>
      ))}
    </svg>
  );
};

/** Abstract crowd silhouette — a wavy dot-matrix band along the bottom. */
export const CrowdSilhouetteSVG: React.FC<TicketArtProps> = ({ uid, themeMode }) => (
  <svg className="absolute inset-x-0 bottom-0 w-full h-[35%] opacity-20" preserveAspectRatio="none" viewBox="0 0 400 80">
    <defs>
      <pattern id={`crowd-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="2.1" fill={themeMode === 'dark' ? '#ffffff' : '#0f172a'} />
      </pattern>
      <linearGradient id={`crowdfade-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="100%" stopColor="white" stopOpacity="1" />
      </linearGradient>
      <mask id={`crowdmask-${uid}`}>
        <rect width="400" height="80" fill={`url(#crowdfade-${uid})`} />
      </mask>
    </defs>
    <rect width="400" height="80" fill={`url(#crowd-${uid})`} mask={`url(#crowdmask-${uid})`} />
  </svg>
);

/** Trophy silhouette with a soft radial glow behind it. */
export const TrophyGlowSVG: React.FC<TicketArtProps> = ({ accentColor, uid }) => (
  <svg className="absolute right-[-6%] top-1/2 -translate-y-1/2 w-[48%] h-[85%] opacity-[0.16]" viewBox="0 0 200 260" fill="none">
    <defs>
      <radialGradient id={`trophyglow-${uid}`} cx="50%" cy="45%" r="60%">
        <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
        <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="120" r="110" fill={`url(#trophyglow-${uid})`} />
    <path
      d="M70 30 h60 v25 c0 30 -12 48 -30 48 s-30 -18 -30 -48 Z M55 40 c-18 2 -22 30 -2 42 M145 40 c18 2 22 30 2 42 M100 103 v35 M78 170 h44 l-8 -22 h-28 Z M70 175 h60 v14 h-60 Z"
      stroke={accentColor}
      strokeWidth="4"
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

/** Diagonal geometric diamond/facet pattern. */
export const GeometricPatternSVG: React.FC<TicketArtProps> = ({ accentColor, secondaryColor, uid }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.12]" preserveAspectRatio="none" viewBox="0 0 400 220">
    <g stroke={accentColor} strokeWidth="1">
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={i * 50 - 40} y1="0" x2={i * 50 + 60} y2="220" />
      ))}
    </g>
    <polygon points="330,0 400,0 400,90" fill={secondaryColor} opacity="0.5" />
    <polygon points="0,220 0,140 70,220" fill={accentColor} opacity="0.35" />
  </svg>
);

/** Converging spotlight / light-ray beams from the top. */
export const LightRaysSVG: React.FC<TicketArtProps> = ({ accentColor, uid }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.18]" preserveAspectRatio="none" viewBox="0 0 400 220">
    <defs>
      <linearGradient id={`ray-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
        <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
      </linearGradient>
    </defs>
    {[60, 140, 220, 300].map((x, i) => (
      <polygon key={i} points={`${x - 6},0 ${x + 26},0 ${x + 70},220 ${x + 10},220`} fill={`url(#ray-${uid})`} />
    ))}
  </svg>
);

/** Stadium seating arc lines, top corner. */
export const StadiumArcSVG: React.FC<TicketArtProps> = ({ secondaryColor, uid }) => (
  <svg className="absolute -left-10 -top-16 w-[70%] h-[70%] opacity-[0.15]" viewBox="0 0 300 300" fill="none">
    {[40, 70, 100, 130, 160].map((r, i) => (
      <circle key={i} cx="0" cy="0" r={r} stroke={secondaryColor} strokeWidth="2" />
    ))}
  </svg>
);

/** Repeating diagonal security watermark, placed behind the QR code.
 * Style varies the label/pattern to match SecurityWatermarkStyle. */
export const SecurityWatermarkSVG: React.FC<{
  color: string;
  uid: string;
  style?: 'shield_logo' | 'starburst_hologram' | 'official_seal' | 'none';
}> = ({ color, uid, style = 'official_seal' }) => {
  if (style === 'none') return null;
  const label =
    style === 'shield_logo' ? 'COURTSIDE • VERIFIED' :
    style === 'starburst_hologram' ? '★ AUTHENTIC ★' :
    'OFFICIAL • SECURE';

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
      <defs>
        <pattern id={`sec-${uid}`} width="90" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
          <text x="0" y="18" fontSize="9" fontWeight="700" letterSpacing="1" fill={color} opacity="0.16">
            {label}
          </text>
        </pattern>
      </defs>
      <rect width="200" height="200" fill={`url(#sec-${uid})`} />
    </svg>
  );
};

/** Neon grid floor — cyberpunk / esports styled receding grid lines. */
export const NeonGridSVG: React.FC<TicketArtProps> = ({ accentColor, uid }) => (
  <svg className="absolute inset-x-0 bottom-0 w-full h-[55%] opacity-25" preserveAspectRatio="none" viewBox="0 0 400 140">
    <defs>
      <linearGradient id={`neonfade-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
        <stop offset="100%" stopColor={accentColor} stopOpacity="1" />
      </linearGradient>
    </defs>
    <g stroke={`url(#neonfade-${uid})`} strokeWidth="1">
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 44} y1="140" x2={160 + i * 12} y2="0" />
      ))}
      {[20, 45, 75, 110].map((y, i) => (
        <line key={`h${i}`} x1="0" y1={y} x2="400" y2={y} stroke={accentColor} strokeOpacity={0.15 + i * 0.05} />
      ))}
    </g>
  </svg>
);

/** Gentle flowing wave band — used by the minimalist light template. */
export const MinimalWaveSVG: React.FC<TicketArtProps> = ({ accentColor, uid }) => (
  <svg className="absolute inset-x-0 bottom-0 w-full h-[30%] opacity-[0.35]" preserveAspectRatio="none" viewBox="0 0 400 90">
    <path d="M0 60 C 80 20, 160 90, 240 50 S 400 20, 400 20 L 400 90 L 0 90 Z" fill={accentColor} opacity="0.5" />
    <path d="M0 75 C 100 40, 200 95, 300 60 S 400 40, 400 40 L 400 90 L 0 90 Z" fill={accentColor} opacity="0.3" />
  </svg>
);
