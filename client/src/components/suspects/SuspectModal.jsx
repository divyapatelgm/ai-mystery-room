import React from 'react';
import Modal from '../common/Modal';
import SuspectAvatar from './SuspectAvatar';
import { UserCheck, Clock, MapPin, ShieldQuestion, Scale } from 'lucide-react';
import Button from '../common/Button';

export default function SuspectModal({
  isOpen,
  onClose,
  suspect,
  onAccuse,
}) {
  if (!suspect) return null;

  const {
    id,
    name,
    occupation,
    relationship,
    biography,
    alibi,
    portraitDescription,
    gender,
    avatarIndex = 0,
  } = suspect;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      subtitle={`CONFIDENTIAL DOSSIER • ${id.toUpperCase()}`}
      title={name}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 bg-noir-800/80 border border-noir-600 rounded-lg">
          <SuspectAvatar
            name={name}
            gender={gender}
            avatarIndex={avatarIndex}
            className="w-24 h-24 flex-shrink-0"
          />
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-gold bg-noir-900 px-2 py-0.5 rounded border border-noir-600 inline-block">
              {occupation}
            </span>
            <h4 className="text-lg font-serif font-bold text-cream">
              {name}
            </h4>
            <p className="text-xs text-parchment font-mono">
              <span className="text-vintage-muted">Relationship: </span>{relationship}
            </p>
            {portraitDescription && (
              <p className="text-[11px] text-vintage-muted italic">
                "{portraitDescription}"
              </p>
            )}
          </div>
        </div>

        {/* Claimed Alibi (Crucial Investigation Detail) */}
        <div className="bg-noir-950/70 border border-gold/40 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-wider">
            <Clock className="w-4 h-4 text-gold" />
            <span>Formal Sworn Alibi</span>
          </div>
          <p className="text-sm text-cream font-sans italic leading-relaxed pl-2 border-l-2 border-gold/60">
            "{alibi}"
          </p>
          <p className="text-[11px] text-parchment pt-1">
            * Cross-reference this statement against recovered physical clues and timestamps on the corkboard.
          </p>
        </div>

        {/* Complete Background Dossier */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-parchment">
            <ShieldQuestion className="w-4 h-4 text-gold" />
            <span>Detective Bureau Background Check</span>
          </div>
          <p className="text-sm text-cream leading-relaxed bg-noir-850 p-3 rounded border border-noir-600">
            {biography}
          </p>
        </div>

        {/* Action Button */}
        {onAccuse && (
          <div className="pt-2 border-t border-noir-600/60 flex justify-end">
            <Button
              variant="gold"
              icon={Scale}
              onClick={() => {
                onClose();
                onAccuse(suspect);
              }}
            >
              Name as Prime Suspect
            </Button>
          </div>
        )}

      </div>
    </Modal>
  );
}
