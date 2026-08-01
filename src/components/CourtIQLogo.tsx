import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  showSlogan?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  onClick?: () => void;
}

// 1. CIRCULAR EMBLEM / APP ICON / FAVICON MARK
export const CourtIQIcon: React.FC<LogoProps> = ({
  className = 'w-10 h-10',
  size = 'md',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
    custom: '',
  };

  const finalClass = size === 'custom' ? className : `${sizeClasses[size]} ${className}`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={`${finalClass} select-none shrink-0 cursor-pointer`}
      onClick={onClick}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer Circular Gradient */}
        <linearGradient id="courtiq-blue-arc" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="courtiq-red-arc" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <filter id="courtiq-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* White Outer Circle Base */}
      <circle cx="100" cy="100" r="92" fill="#ffffff" filter="url(#courtiq-shadow)" />

      {/* Top Blue Swoosh Arc */}
      <path
        d="M 30,100 A 72,72 0 1,1 170,100"
        fill="none"
        stroke="url(#courtiq-blue-arc)"
        strokeWidth="16"
        strokeLinecap="round"
      />

      {/* Right Red Swoosh Arc */}
      <path
        d="M 170,100 A 72,72 0 0,1 30,120"
        fill="none"
        stroke="url(#courtiq-red-arc)"
        strokeWidth="16"
        strokeLinecap="round"
      />

      {/* Inner White Shield Canvas */}
      <circle cx="100" cy="100" r="64" fill="#ffffff" />

      {/* Backboard Frame (Dark Navy) */}
      <path
        d="M 52,60 C 52,50 148,50 148,60 V 102 C 148,110 125,124 100,124 C 75,124 52,110 52,102 Z"
        fill="#ffffff"
        stroke="#162a45"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <rect x="64" y="66" width="72" height="42" rx="4" fill="#ffffff" stroke="#162a45" strokeWidth="4" />

      {/* QR Code Graphic inside Backboard Box */}
      <g fill="#162a45">
        {/* Top Left Finder */}
        <rect x="70" y="72" width="14" height="14" rx="2" />
        <rect x="73" y="75" width="8" height="8" fill="#ffffff" />
        <rect x="75" y="77" width="4" height="4" fill="#162a45" />

        {/* Top Right Finder */}
        <rect x="116" y="72" width="14" height="14" rx="2" />
        <rect x="119" y="75" width="8" height="8" fill="#ffffff" />
        <rect x="121" y="77" width="4" height="4" fill="#162a45" />

        {/* Bottom Left Finder */}
        <rect x="70" y="90" width="14" height="14" rx="2" />
        <rect x="73" y="93" width="8" height="8" fill="#ffffff" />
        <rect x="75" y="95" width="4" height="4" fill="#162a45" />

        {/* Center Data Modules */}
        <rect x="88" y="72" width="4" height="4" />
        <rect x="94" y="72" width="4" height="4" />
        <rect x="108" y="72" width="4" height="4" />
        <rect x="88" y="80" width="8" height="4" />
        <rect x="100" y="78" width="12" height="4" />
        <rect x="88" y="90" width="4" height="8" />
        <rect x="96" y="88" width="6" height="6" />
        <rect x="106" y="88" width="6" height="6" />
        <rect x="116" y="90" width="14" height="4" />
        <rect x="122" y="98" width="8" height="6" />
      </g>

      {/* Red Basketball Rim */}
      <rect x="68" y="106" width="64" height="6" rx="3" fill="#dc2626" />

      {/* Basketball Net (Deep Navy Net Pattern) */}
      <path
        d="M 72,112 L 80,148 L 100,164 L 120,148 L 128,112 M 80,112 L 100,140 L 120,112 M 100,112 L 80,148 M 100,112 L 120,148"
        stroke="#162a45"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 2. FULL BRAND LOGO (TEXT + HIGH TECH BACKBOARD + SLOGAN)
export const CourtIQLogo: React.FC<LogoProps> = ({
  className = '',
  showSlogan = true,
  theme = 'auto',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none cursor-pointer group ${className}`}
    >
      {/* Top Banner Graphic & Typography Container */}
      <div className="flex items-center gap-3.5">
        {/* Emblem Icon */}
        <CourtIQIcon size="lg" className="group-hover:scale-105 transition-transform duration-300" />

        {/* Wordmark */}
        <div className="flex flex-col">
          <div className="flex items-baseline font-heading tracking-tight leading-none font-black text-2xl sm:text-3xl">
            <span className="text-[#162a45] dark:text-slate-100">Court</span>
            <span className="text-[#dc2626]">iQ</span>
          </div>

          {/* Slogan */}
          {showSlogan && (
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.22em] text-slate-500 dark:text-slate-400 uppercase mt-1">
              Secure. Simple. Smart.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. COMPACT BRAND BADGE FOR SIDEBARS & COMPACT HEADERS
export const CourtIQBadge: React.FC<{
  collapsed?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ collapsed = false, className = '', onClick }) => {
  if (collapsed) {
    return (
      <div onClick={onClick} className="flex items-center justify-center cursor-pointer p-1">
        <CourtIQIcon size="md" className="hover:scale-110 transition-transform" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 cursor-pointer group select-none ${className}`}
    >
      <CourtIQIcon size="md" className="group-hover:scale-105 transition-transform" />
      <div className="flex flex-col min-w-0">
        <div className="flex items-baseline font-heading font-black text-lg tracking-tight leading-none">
          <span className="text-white">Court</span>
          <span className="text-red-500">iQ</span>
        </div>
        <p className="text-[9px] font-mono font-semibold tracking-wider text-slate-400 uppercase mt-0.5 truncate">
          Secure. Simple. Smart.
        </p>
      </div>
    </div>
  );
};
