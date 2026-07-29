import React from 'react';

/**
 * Reusable, pure-SVG background pattern layer for ticket templates.
 * Every pattern fills its parent (absolute inset-0) and is driven entirely by
 * color props + CSS — no raster images, so patterns scale crisply at any
 * export resolution (needed for clean 300 DPI PNG/PDF export).
 */
export interface PatternProps {
  primary: string;
  secondary: string;
  accent: string;
  opacity?: number;
}

export type PatternId =
  | 'court_lines'
  | 'confetti_burst'
  | 'crowd_silhouette'
  | 'trophy_motif'
  | 'geometric_shards'
  | 'spotlight_rays'
  | 'hex_grid'
  | 'carbon_weave'
  | 'hologram_wave'
  | 'starburst'
  | 'none';

const uid = (seed: string) => `p_${seed}_${Math.random().toString(36).slice(2, 8)}`;

export const CourtLinesPattern: React.FC<PatternProps> = ({ accent, opacity = 0.16 }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" style={{ opacity }}>
    <rect x="10" y="10" width="780" height="380" fill="none" stroke={accent} strokeWidth="3" />
    <line x1="400" y1="10" x2="400" y2="390" stroke={accent} strokeWidth="3" />
    <circle cx="400" cy="200" r="70" fill="none" stroke={accent} strokeWidth="3" />
    <path d="M 10 120 A 140 140 0 0 1 10 280" fill="none" stroke={accent} strokeWidth="3" />
    <path d="M 790 120 A 140 140 0 0 0 790 280" fill="none" stroke={accent} strokeWidth="3" />
    <rect x="10" y="130" width="120" height="140" fill="none" stroke={accent} strokeWidth="3" />
    <rect x="670" y="130" width="120" height="140" fill="none" stroke={accent} strokeWidth="3" />
  </svg>
);

export const ConfettiBurstPattern: React.FC<PatternProps> = ({ primary, secondary, accent, opacity = 0.5 }) => {
  const shapes = React.useMemo(() => {
    const rnd = (seed: number) => {
      const x = Math.sin(seed * 999) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 40 }).map((_, i) => ({
      x: rnd(i * 1.1) * 100,
      y: rnd(i * 2.3) * 100,
      r: 2 + rnd(i * 3.7) * 5,
      rot: rnd(i * 5.9) * 360,
      shape: i % 3,
      color: i % 3 === 0 ? accent : i % 3 === 1 ? primary : secondary,
    }));
  }, []);
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity }}>
      {shapes.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}>
          {s.shape === 0 && <rect x={-s.r / 2} y={-s.r / 2} width={s.r} height={s.r} fill={s.color} />}
          {s.shape === 1 && <circle r={s.r / 2} fill={s.color} />}
          {s.shape === 2 && <polygon points={`0,-${s.r} ${s.r},${s.r} -${s.r},${s.r}`} fill={s.color} />}
        </g>
      ))}
    </svg>
  );
};

export const CrowdSilhouettePattern: React.FC<PatternProps> = ({ primary, opacity = 0.4 }) => (
  <svg className="absolute inset-x-0 bottom-0 w-full h-1/3 pointer-events-none" viewBox="0 0 800 120" preserveAspectRatio="none" style={{ opacity }}>
    {Array.from({ length: 26 }).map((_, i) => {
      const x = (i * 800) / 26;
      const h = 30 + ((i * 37) % 40);
      return <rect key={i} x={x} y={120 - h} width={800 / 26 - 3} height={h} rx="8" fill={primary} />;
    })}
  </svg>
);

export const TrophyMotifPattern: React.FC<PatternProps> = ({ accent, opacity = 0.14 }) => (
  <svg className="absolute -right-6 -bottom-8 w-40 h-40 pointer-events-none" viewBox="0 0 100 100" style={{ opacity }}>
    <path
      d="M30 10 H70 V25 C70 40 60 48 55 50 V60 H45 V50 C40 48 30 40 30 25 Z M20 15 H30 V30 C20 30 15 22 20 15 Z M80 15 H70 V30 C80 30 85 22 80 15 Z M40 65 H60 V75 H40 Z M30 78 H70 V85 H30 Z"
      fill={accent}
    />
  </svg>
);

export const GeometricShardsPattern: React.FC<PatternProps> = ({ primary, secondary, opacity = 0.25 }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="none" style={{ opacity }}>
    <polygon points="0,0 220,0 60,400 0,400" fill={primary} />
    <polygon points="240,0 340,0 180,400 80,400" fill={secondary} opacity="0.7" />
    <polygon points="800,0 800,400 640,400" fill={primary} opacity="0.8" />
    <polygon points="800,60 800,220 700,180" fill={secondary} opacity="0.5" />
  </svg>
);

export const SpotlightRaysPattern: React.FC<PatternProps> = ({ accent, opacity = 0.2 }) => {
  const id = React.useMemo(() => uid('spot'), []);
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" style={{ opacity }}>
      <defs>
        <radialGradient id={id} cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="400" fill={`url(#${id})`} />
      {Array.from({ length: 8 }).map((_, i) => (
        <polygon key={i} points={`400,0 ${360 + i * 12},400 ${380 + i * 12},400`} fill={accent} opacity="0.06" />
      ))}
    </svg>
  );
};

export const HexGridPattern: React.FC<PatternProps> = ({ accent, opacity = 0.18 }) => {
  const id = React.useMemo(() => uid('hex'), []);
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <defs>
        <pattern id={id} width="28" height="48" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
          <polygon points="14,0 28,8 28,24 14,32 0,24 0,8" fill="none" stroke={accent} strokeWidth="1" />
          <polygon points="14,32 28,40 28,56 14,64 0,56 0,40" fill="none" stroke={accent} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};

export const CarbonWeavePattern: React.FC<PatternProps> = ({ secondary, opacity = 0.5 }) => {
  const id = React.useMemo(() => uid('carbon'), []);
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <defs>
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="transparent" />
          <path d="M0 0 L8 8 M8 0 L0 8" stroke={secondary} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};

export const HologramWavePattern: React.FC<PatternProps> = ({ accent, secondary, opacity = 0.28 }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="none" style={{ opacity }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <path
        key={i}
        d={`M0 ${40 + i * 60} Q 200 ${10 + i * 60} 400 ${40 + i * 60} T 800 ${40 + i * 60}`}
        fill="none"
        stroke={i % 2 === 0 ? accent : secondary}
        strokeWidth="1.5"
      />
    ))}
  </svg>
);

export const StarburstPattern: React.FC<PatternProps> = ({ accent, opacity = 0.18 }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" style={{ opacity }}>
    <g transform="translate(200,200)">
      {Array.from({ length: 24 }).map((_, i) => (
        <rect key={i} x="-1.5" y="-200" width="3" height="200" fill={accent} transform={`rotate(${i * 15})`} />
      ))}
    </g>
  </svg>
);

/** Behind-QR security watermark: a tiled faint seal/shield glyph. Distinct
 *  from the main background pattern — always rendered at very low opacity,
 *  directly behind the QR code panel only. */
export const SecurityWatermarkPattern: React.FC<{ color: string; opacity?: number }> = ({ color, opacity = 0.08 }) => {
  const id = React.useMemo(() => uid('seal'), []);
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <defs>
        <pattern id={id} width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
          <path d="M15 3 L23 6 V15 C23 20 19 24 15 26 C11 24 7 20 7 15 V6 Z" fill="none" stroke={color} strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};

export function renderPattern(id: PatternId, props: PatternProps): React.ReactNode {
  switch (id) {
    case 'court_lines': return <CourtLinesPattern {...props} />;
    case 'confetti_burst': return <ConfettiBurstPattern {...props} />;
    case 'crowd_silhouette': return <CrowdSilhouettePattern {...props} />;
    case 'trophy_motif': return <TrophyMotifPattern {...props} />;
    case 'geometric_shards': return <GeometricShardsPattern {...props} />;
    case 'spotlight_rays': return <SpotlightRaysPattern {...props} />;
    case 'hex_grid': return <HexGridPattern {...props} />;
    case 'carbon_weave': return <CarbonWeavePattern {...props} />;
    case 'hologram_wave': return <HologramWavePattern {...props} />;
    case 'starburst': return <StarburstPattern {...props} />;
    case 'none': default: return null;
  }
}
