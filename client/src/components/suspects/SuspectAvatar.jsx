import React from 'react';

// Handcrafted, authentic Noir portrait silhouettes with distinctive styling
const AVATAR_PALETTES = [
  { bg: '#1C1E22', accent: '#C69B52', hat: '#141518', suit: '#26282E' }, // Classic Fedoraman / Trenchcoat
  { bg: '#231F1C', accent: '#D5AD6C', hat: '#1A1715', suit: '#352D26' }, // Aristocrat / Curator
  { bg: '#1D2120', accent: '#708E66', hat: '#161918', suit: '#29322E' }, // Doctor / Pathologist
  { bg: '#251E20', accent: '#A85757', hat: '#1B1416', suit: '#36282B' }, // Heiress / Socialite
  { bg: '#201E24', accent: '#8F7C68', hat: '#17151A', suit: '#2C2834' }, // Butler / Confidant
  { bg: '#1A2125', accent: '#C69B52', hat: '#13181B', suit: '#243036' }, // Stage Tech / Machinist
  { bg: '#22211E', accent: '#B89047', hat: '#1A1916', suit: '#32302A' }, // Banker / Investor
  { bg: '#221E23', accent: '#9B7855', hat: '#1A161B', suit: '#302933' }, // Journalist / Private Eye
];

export default function SuspectAvatar({ name, gender, avatarIndex = 0, className = 'w-24 h-24' }) {
  const palette = AVATAR_PALETTES[avatarIndex % AVATAR_PALETTES.length];
  const initials = (name || 'Suspect')
    .split(' ')
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isFemale = gender === 'female';

  return (
    <div
      className={`relative rounded-md overflow-hidden border border-noir-600 bg-noir-900 shadow-md flex items-center justify-center select-none ${className}`}
      style={{ backgroundColor: palette.bg }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full object-cover"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`noir-grad-${avatarIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A2C31" />
            <stop offset="100%" stopColor="#121316" />
          </linearGradient>
          <linearGradient id={`gold-rim-${avatarIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor={palette.accent} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Ambient Dark Background */}
        <rect width="100" height="100" fill={`url(#noir-grad-${avatarIndex})`} />

        {/* Subtle Rim Lighting */}
        <circle cx="50" cy="50" r="44" stroke={`url(#gold-rim-${avatarIndex})`} strokeWidth="1" strokeDasharray="2 3" />

        {/* Shoulders & Suit */}
        <path
          d="M15 100 C 15 78, 30 72, 50 72 C 70 72, 85 78, 85 100 Z"
          fill={palette.suit}
        />
        {/* Collar / Lapel */}
        <polygon points="40,72 50,86 60,72 54,72 50,78 46,72" fill="#E8E2D5" opacity="0.85" />
        <polygon points="35,74 48,88 44,96 30,85" fill={palette.hat} />
        <polygon points="65,74 52,88 56,96 70,85" fill={palette.hat} />

        {/* Neck */}
        <rect x="44" y="56" width="12" height="18" fill="#C2AB95" rx="3" />

        {/* Head */}
        <ellipse cx="50" cy="46" rx="16" ry="20" fill="#C2AB95" />

        {/* Distinctive Hairstyles / Hats */}
        {isFemale ? (
          // Elegant 1940s waved bob hair
          <path
            d="M32 46 C 30 28, 40 22, 50 22 C 60 22, 70 28, 68 46 C 68 56, 64 62, 62 62 C 60 52, 60 38, 50 38 C 40 38, 40 52, 38 62 C 36 62, 32 56, 32 46 Z"
            fill={palette.hat}
          />
        ) : (
          // Noir Fedora / Sleek parted hair
          avatarIndex % 2 === 0 ? (
            <g>
              {/* Fedora Brim */}
              <ellipse cx="50" cy="34" rx="28" ry="8" fill={palette.hat} />
              {/* Crown */}
              <path d="M35 34 C 36 20, 42 16, 50 16 C 58 16, 64 20, 65 34 Z" fill={palette.hat} />
              {/* Ribbon */}
              <rect x="36" y="30" width="28" height="3" fill={palette.accent} />
            </g>
          ) : (
            // Parted detective hair
            <path
              d="M32 42 C 32 26, 42 22, 50 22 C 58 22, 68 26, 68 42 C 64 36, 56 34, 50 34 C 44 34, 36 36, 32 42 Z"
              fill={palette.hat}
            />
          )
        )}

        {/* Noir Shadow Cast across Face */}
        <path
          d="M34 46 C 45 42, 55 42, 66 46 C 62 58, 50 64, 50 64 C 50 64, 38 58, 34 46 Z"
          fill="#101113"
          opacity="0.3"
        />

        {/* Eyes shadow / glint */}
        <ellipse cx="44" cy="48" rx="2" ry="1.2" fill="#E8E2D5" opacity="0.4" />
        <ellipse cx="56" cy="48" rx="2" ry="1.2" fill="#E8E2D5" opacity="0.4" />
      </svg>

      {/* Detective Monogram Badge at Bottom Right */}
      <div className="absolute bottom-1 right-1 bg-noir-950/90 border border-gold/40 text-gold text-[10px] font-mono px-1.5 py-0.5 rounded shadow">
        {initials}
      </div>
    </div>
  );
}

