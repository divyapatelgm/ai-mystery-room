import React from 'react';
import { FileText, Microscope, MessageSquare, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

const CATEGORY_CONFIG = {
  physical: {
    icon: ShieldAlert,
    badgeColor: 'border-amber-700/50 text-amber-400 bg-amber-950/40',
    label: 'PHYSICAL',
  },
  testimony: {
    icon: MessageSquare,
    badgeColor: 'border-blue-700/50 text-blue-400 bg-blue-950/40',
    label: 'TESTIMONY',
  },
  document: {
    icon: FileText,
    badgeColor: 'border-purple-700/50 text-purple-400 bg-purple-950/40',
    label: 'DOCUMENT',
  },
  forensic: {
    icon: Microscope,
    badgeColor: 'border-emerald-700/50 text-emerald-400 bg-emerald-950/40',
    label: 'FORENSIC',
  },
};

export default function EvidenceCard({
  clue,
  onInspect,
  onDiscover,
  discovering = false,
}) {
  const { playPin, playClick } = useSound();
  const {
    id,
    title,
    description,
    category = 'physical',
    discovered = false,
    boardPosition = {},
  } = clue;

  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.physical;
  const CategoryIcon = config.icon;
  const rotation = boardPosition.rotation || 0;

  const handleClick = () => {
    playPin();
    if (discovered) {
      onInspect(clue);
    } else {
      onDiscover(clue);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className={`group relative select-none cursor-pointer transition-all duration-300 rounded p-4 border shadow-pin ${
        discovered
          ? 'bg-[#1E2024] border-gold/40 hover:border-gold hover:shadow-gold-glow hover:-translate-y-1'
          : 'bg-[#18191C] border-noir-600/80 hover:border-gold/30 hover:bg-[#1D1E22] hover:-translate-y-0.5'
      }`}
    >
      {/* Physical Pin Head */}
      <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 z-10">
        <div
          className={`w-5 h-5 rounded-full ${
            discovered ? 'pin-brass' : 'pin-red'
          }`}
        />
      </div>

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-2 pt-1">
        <span className="text-[10px] font-mono text-vintage-muted">
          ITEM #{id.toUpperCase()}
        </span>
        <span
          className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase flex items-center gap-1 ${config.badgeColor}`}
        >
          <CategoryIcon className="w-2.5 h-2.5" />
          {config.label}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-serif font-bold text-sm text-cream mb-1.5 group-hover:text-gold transition-colors line-clamp-1">
        {title}
      </h4>

      {/* Surface Description / Teaser */}
      <p className="text-xs text-parchment line-clamp-2 leading-relaxed mb-3">
        {description}
      </p>

      {/* Discovery Status Pill */}
      <div className="pt-2 border-t border-noir-600/60 flex items-center justify-between text-[11px] font-mono">
        {discovered ? (
          <span className="text-[#8cb080] flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>DISCOVERED (+5 PTS)</span>
          </span>
        ) : (
          <span className="text-gold flex items-center gap-1 group-hover:underline">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>EXAMINE EVIDENCE</span>
          </span>
        )}

        <span className="text-vintage-muted group-hover:text-parchment">
          {discovered ? 'View Lab Notes →' : 'Unlock →'}
        </span>
      </div>
    </div>
  );
}
