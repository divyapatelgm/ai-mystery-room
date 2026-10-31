import React from 'react';
import { User, Eye, Scale } from 'lucide-react';
import SuspectAvatar from './SuspectAvatar';
import Button from '../common/Button';

export default function SuspectCard({
  suspect,
  onInspect,
  onSelectForAccusation,
  isSelected = false,
  isAccusationMode = false,
}) {
  const {
    id,
    name,
    occupation,
    relationship,
    biography,
    gender,
    avatarIndex = 0,
  } = suspect;

  return (
    <div
      onClick={isAccusationMode ? () => onSelectForAccusation && onSelectForAccusation(suspect) : undefined}
      className={`relative bg-noir-800 border rounded-lg overflow-hidden transition-all duration-200 ${
        isSelected
          ? 'border-gold ring-2 ring-gold/50 shadow-gold-glow bg-noir-750'
          : 'border-noir-600 hover:border-gold/40 hover:bg-noir-750'
      } ${isAccusationMode ? 'cursor-pointer' : ''}`}
    >
      {/* Top Gold Corner Accent */}
      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
        <div className={`w-12 h-1 bg-gold transform rotate-45 translate-x-3 -translate-y-1 ${isSelected ? 'opacity-100' : 'opacity-20'}`} />
      </div>

      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
        {/* Suspect Avatar Portrait */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <SuspectAvatar
            name={name}
            gender={gender}
            avatarIndex={avatarIndex}
            className="w-20 h-20 sm:w-24 sm:h-24"
          />
        </div>

        {/* Suspect Dossier Details */}
        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5 w-full">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h3 className="font-serif font-bold text-base sm:text-lg text-cream truncate">
              {name}
            </h3>
            <span className="text-[11px] font-mono text-gold bg-noir-900 px-2 py-0.5 rounded border border-noir-600 self-center sm:self-auto">
              {occupation}
            </span>
          </div>

          <p className="text-xs text-parchment line-clamp-1 font-mono">
            <strong className="text-vintage-muted">Role: </strong>{relationship}
          </p>

          <p className="text-xs text-parchment/90 line-clamp-2 leading-relaxed">
            {biography}
          </p>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Eye}
              onClick={(e) => {
                e.stopPropagation();
                onInspect(suspect);
              }}
            >
              Examine Alibi
            </Button>

            {!isAccusationMode && onSelectForAccusation && (
              <Button
                variant="ghost"
                size="sm"
                icon={Scale}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectForAccusation(suspect);
                }}
                className="text-gold hover:text-gold-hover hover:bg-gold/10"
              >
                Indict
              </Button>
            )}

            {isAccusationMode && (
              <span className={`text-xs font-mono px-2 py-1 rounded ml-auto ${isSelected ? 'text-gold font-bold' : 'text-parchment'}`}>
                {isSelected ? '✓ SELECTED CULPRIT' : 'CLICK TO SELECT'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
