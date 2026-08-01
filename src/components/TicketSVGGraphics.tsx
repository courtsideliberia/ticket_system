import React from 'react';
import { SecurityWatermarkStyle } from '../types';

// ============================================================================
// SVG GRAPHICS & TEMPLATE LAYER COMPONENTS
// Pure Vector SVG elements: Trophies, Players, Stadiums, Geometric Patterns,
// Watermarks, Splatters, and Lighting Effects.
// ============================================================================

/** 1. Golden Championship Trophy SVG */
export const TrophySVG: React.FC<{ className?: string }> = ({ className = "w-24 h-32" }) => (
  <svg viewBox="0 0 200 260" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldTrophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#eab308" />
        <stop offset="70%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <linearGradient id="goldBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ca8a04" />
        <stop offset="50%" stopColor="#854d0e" />
        <stop offset="100%" stopColor="#3f2305" />
      </linearGradient>
      <radialGradient id="trophyGlow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
      </radialGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.5" />
      </filter>
    </defs>

    {/* Glow behind trophy */}
    <circle cx="100" cy="90" r="75" fill="url(#trophyGlow)" />

    {/* Basketball Globe on Top */}
    <g filter="url(#shadow)">
      <circle cx="100" cy="70" r="42" fill="url(#goldTrophyGrad)" />
      {/* Basketball Seams */}
      <path d="M 58 70 Q 100 70 142 70" stroke="#854d0e" strokeWidth="2.5" fill="none" />
      <path d="M 100 28 Q 100 70 100 112" stroke="#854d0e" strokeWidth="2.5" fill="none" />
      <path d="M 68 38 C 82 55, 82 85, 68 102" stroke="#854d0e" strokeWidth="2.5" fill="none" />
      <path d="M 132 38 C 118 55, 118 85, 132 102" stroke="#854d0e" strokeWidth="2.5" fill="none" />
      {/* Globe Shine */}
      <ellipse cx="85" cy="50" rx="14" ry="8" fill="#ffffff" fillOpacity="0.35" transform="rotate(-25 85 50)" />
    </g>

    {/* Trophy Cup Handles */}
    <path d="M 58 75 C 30 75, 30 115, 68 125" stroke="url(#goldTrophyGrad)" strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d="M 142 75 C 170 75, 170 115, 132 125" stroke="url(#goldTrophyGrad)" strokeWidth="7" fill="none" strokeLinecap="round" />

    {/* Trophy Stem */}
    <path d="M 86 110 L 80 160 L 120 160 L 114 110 Z" fill="url(#goldTrophyGrad)" filter="url(#shadow)" />
    <path d="M 94 110 L 91 160 L 109 160 L 106 110 Z" fill="#fef08a" fillOpacity="0.4" />

    {/* Trophy Stem Ring */}
    <rect x="75" y="155" width="50" height="12" rx="3" fill="url(#goldTrophyGrad)" />

    {/* Tiered Base */}
    <path d="M 65 167 L 55 200 L 145 200 L 135 167 Z" fill="url(#goldBaseGrad)" />
    <rect x="45" y="200" width="110" height="25" rx="4" fill="url(#goldBaseGrad)" stroke="#ca8a04" strokeWidth="1.5" />
    <rect x="52" y="205" width="96" height="15" rx="2" fill="#18181b" />
    {/* Plaque text line */}
    <rect x="62" y="210" width="76" height="5" rx="1" fill="#fef08a" fillOpacity="0.8" />

    {/* Sparkle Stars */}
    <path d="M 45 40 L 48 46 L 54 49 L 48 52 L 45 58 L 42 52 L 36 49 L 42 46 Z" fill="#ffffff" />
    <path d="M 155 45 L 157 50 L 162 52 L 157 54 L 155 59 L 153 54 L 148 52 L 153 50 Z" fill="#fef08a" />
    <path d="M 125 10 L 127 14 L 131 16 L 127 18 L 125 22 L 123 18 L 119 16 L 123 14 Z" fill="#ffffff" />
  </svg>
);

/** 2. Slam Dunk Basketball Player Silhouette SVG */
export const DunkerSilhouetteSVG: React.FC<{ color?: string; className?: string }> = ({
  color = "#dc2626",
  className = "w-40 h-56"
}) => (
  <svg viewBox="0 0 240 320" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dunkerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#18181b" />
      </linearGradient>
    </defs>
    {/* Dynamic Paint Splatter background behind player */}
    <g opacity="0.4">
      <circle cx="140" cy="120" r="70" fill={color} />
      <path d="M 100 80 Q 70 30 120 20 Q 150 10 180 50 Q 220 80 190 140 Q 210 190 160 210 Q 110 230 80 170 Z" fill={color} />
      <circle cx="50" cy="70" r="12" fill={color} />
      <circle cx="210" cy="40" r="8" fill={color} />
      <circle cx="220" cy="180" r="14" fill={color} />
      <circle cx="40" cy="180" r="6" fill={color} />
    </g>
    {/* Player Silhouette Dunking */}
    <g fill={color}>
      {/* Head */}
      <circle cx="150" cy="75" r="12" />
      {/* Raised Arm & Hand holding Ball */}
      <path d="M 148 82 L 175 48 L 195 35 L 200 42 L 178 58 L 152 88 Z" />
      <circle cx="205" cy="30" r="14" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
      {/* Torso & Jersey */}
      <path d="M 140 85 L 156 86 L 165 130 L 125 138 Z" />
      {/* Left Arm extended */}
      <path d="M 140 88 L 110 95 L 85 110 L 88 116 L 115 102 Z" />
      {/* Shorts */}
      <path d="M 125 135 L 165 128 L 175 165 L 148 175 L 138 152 L 120 168 Z" />
      {/* Legs in dynamic spread */}
      <path d="M 120 168 L 90 205 L 65 245 L 55 240 L 80 195 L 115 160 Z" />
      <path d="M 152 172 L 180 210 L 215 250 L 208 258 L 170 215 L 144 175 Z" />
    </g>
  </svg>
);

/** 3. Basketball Court Floor & Stadium Floodlights SVG */
export const StadiumCourtSVG: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 800 400" className={className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Floodlight beams */}
      <linearGradient id="beamGrad1" x1="0%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="beamGrad2" x1="100%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="courtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0f172a" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.7" />
      </linearGradient>
    </defs>

    {/* Light Beams from Top Corners */}
    <polygon points="50,-20 200,-20 450,400 250,400" fill="url(#beamGrad1)" />
    <polygon points="750,-20 600,-20 350,400 550,400" fill="url(#beamGrad2)" />

    {/* Spotlight Flare Circles */}
    <circle cx="120" cy="10" r="80" fill="#38bdf8" opacity="0.15" filter="blur(20px)" />
    <circle cx="680" cy="10" r="80" fill="#818cf8" opacity="0.15" filter="blur(20px)" />

    {/* Perspective Court Floor Lines */}
    <g opacity="0.35" stroke="#60a5fa" strokeWidth="2" fill="none">
      {/* Outer Boundary Perspective */}
      <polygon points="100,260 700,260 780,390 20,390" fill="url(#courtGrad)" />
      {/* Center Key Circle */}
      <ellipse cx="400" cy="325" rx="120" ry="40" />
      <ellipse cx="400" cy="325" rx="40" ry="14" />
      {/* Half Court Line */}
      <line x1="400" y1="260" x2="400" y2="390" />
      {/* 3-Point Arc Perspective Left & Right */}
      <path d="M 120 390 Q 200 290 280 390" />
      <path d="M 680 390 Q 600 290 520 390" />
    </g>

    {/* Crowd Silhouette dots at back */}
    <g opacity="0.15" fill="#ffffff">
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={20 + i * 20} cy={220 + (i % 3) * 6} r={2 + (i % 2)} />
      ))}
    </g>
  </svg>
);

/** 4. Geometric Gold Lattice VIP Lines SVG */
export const GeometricGoldSVG: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 600 400" className={className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#eab308" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#854d0e" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* Diagonal Art Deco Diamond Grid */}
    <g stroke="url(#goldLineGrad)" strokeWidth="1" fill="none">
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={`d1-${i}`} x1={-100 + i * 60} y1="0" x2={200 + i * 60} y2="400" />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={`d2-${i}`} x1={700 - i * 60} y1="0" x2={400 - i * 60} y2="400" />
      ))}
    </g>
    {/* Corner Geometric Accents */}
    <g stroke="#eab308" strokeWidth="2" fill="none" opacity="0.6">
      <path d="M 20 60 L 20 20 L 60 20" />
      <path d="M 30 70 L 30 30 L 70 30" />
      <path d="M 580 60 L 580 20 L 540 20" />
      <path d="M 570 70 L 570 30 L 530 30" />
      <path d="M 20 340 L 20 380 L 60 380" />
      <path d="M 580 340 L 580 380 L 540 380" />
    </g>
  </svg>
);

/** 5. Urban Grunge Graffiti Splatter SVG */
export const GrungeSplatterSVG: React.FC<{ color1?: string; color2?: string; className?: string }> = ({
  color1 = "#f59e0b",
  color2 = "#3b82f6",
  className = "w-full h-full"
}) => (
  <svg viewBox="0 0 500 350" className={className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.35">
      <path d="M 50 40 Q 120 10 180 60 T 320 30 T 450 90 Q 480 180 410 260 T 250 320 T 90 280 Q 20 160 50 40 Z" fill={color1} />
      <path d="M 200 100 Q 280 40 380 110 T 480 250 T 310 340 Q 180 300 220 190 Z" fill={color2} opacity="0.7" />
      {/* Paint drip drops */}
      <circle cx="80" cy="310" r="8" fill={color1} />
      <circle cx="95" cy="335" r="4" fill={color1} />
      <circle cx="420" cy="30" r="10" fill={color2} />
      <circle cx="440" cy="15" r="5" fill={color2} />
      <circle cx="460" cy="290" r="7" fill={color1} />
    </g>
  </svg>
);

/** 6. Broadcast Press Camera & Arena Lights SVG */
export const MediaCameraSVG: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 500 350" className={className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pressBeam" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Light Beams */}
    <polygon points="100,0 250,0 450,350 200,350" fill="url(#pressBeam)" />
    {/* Camera Silhouette */}
    <g fill="#064e3b" opacity="0.6" transform="translate(40, 120)">
      {/* Lens */}
      <rect x="120" y="30" width="40" height="30" rx="3" fill="#10b981" opacity="0.8" />
      <polygon points="160,25 210,10 210,75 160,60" fill="#047857" />
      {/* Body */}
      <rect x="20" y="15" width="100" height="60" rx="8" />
      <circle cx="50" cy="45" r="18" fill="#047857" />
      {/* Tripod */}
      <line x1="40" y1="75" x2="10" y2="180" stroke="#064e3b" strokeWidth="6" strokeLinecap="round" />
      <line x1="70" y1="75" x2="70" y2="180" stroke="#064e3b" strokeWidth="6" strokeLinecap="round" />
      <line x1="100" y1="75" x2="130" y2="180" stroke="#064e3b" strokeWidth="6" strokeLinecap="round" />
    </g>
  </svg>
);

/** 7. Security Watermark Overlay SVG Component */
export const SecurityWatermarkSVG: React.FC<{ style?: SecurityWatermarkStyle; color?: string; className?: string }> = ({
  style = 'shield_logo',
  color = '#eab308',
  className = 'w-24 h-24 opacity-20'
}) => {
  if (style === 'none') return null;

  if (style === 'starburst_hologram') {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke={color} strokeWidth="1.5" opacity="0.8">
          <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="38" />
          <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 42 * Math.cos((i * 30 * Math.PI) / 180)}
              y2={50 + 42 * Math.sin((i * 30 * Math.PI) / 180)}
            />
          ))}
        </g>
        <text x="50" y="54" textAnchor="middle" fill={color} fontSize="8" fontWeight="900" letterSpacing="1 font-mono">
          SECURE
        </text>
      </svg>
    );
  }

  if (style === 'official_seal') {
    return (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 60 10 L 72 22 L 88 18 L 94 34 L 110 40 L 108 56 L 120 70 L 108 84 L 110 100 L 94 106 L 88 122 L 72 118 L 60 130 L 48 118 L 32 122 L 26 106 L 10 100 L 12 84 L 0 70 L 12 56 L 10 40 L 26 34 L 32 18 L 48 22 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.7"
        />
        <circle cx="60" cy="70" r="36" stroke={color} strokeWidth="1.5" fill="none" />
        <text x="60" y="66" textAnchor="middle" fill={color} fontSize="7" fontWeight="900" letterSpacing="1">
          COURTIQ
        </text>
        <text x="60" y="78" textAnchor="middle" fill={color} fontSize="6" fontWeight="700">
          OFFICIAL VERIFIED
        </text>
      </svg>
    );
  }

  // Default: Shield Logo Watermark
  return (
    <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 50 10 L 90 25 L 90 65 C 90 90, 50 110, 50 110 C 50 110, 10 90, 10 65 L 10 25 Z"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
      {/* Basketball inside shield */}
      <circle cx="50" cy="55" r="22" stroke={color} strokeWidth="2" fill="none" />
      <path d="M 28 55 L 72 55" stroke={color} strokeWidth="1.5" />
      <path d="M 50 33 L 50 77" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};
