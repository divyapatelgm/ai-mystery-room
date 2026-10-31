import React from 'react';
import Modal from '../common/Modal';
import { Microscope, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export default function EvidenceModal({
  isOpen,
  onClose,
  clue,
  onDiscover,
  discovering = false,
}) {
  if (!clue) return null;

  const {
    id,
    title,
    description,
    details,
    category,
    discovered = false,
  } = clue;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      subtitle={`EVIDENCE RECORD • ${id.toUpperCase()}`}
      title={title}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        
        {/* Status Indicator */}
        <div className="flex items-center justify-between p-3 rounded bg-noir-850 border border-noir-600">
          <span className="text-xs font-mono uppercase tracking-wider text-parchment">
            CLASSIFICATION: <strong className="text-gold">{category}</strong>
          </span>
          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
            discovered
              ? 'bg-vintage-success/20 text-[#8cb080] border-vintage-success/40'
              : 'bg-gold/15 text-gold border-gold/40'
          }`}>
            {discovered ? 'EVIDENCE EXAMINED' : 'UNEXAMINED LEAD'}
          </span>
        </div>

        {/* Surface Observation */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-parchment mb-1">
            Scene Observation
          </h4>
          <p className="text-sm text-cream bg-noir-950/60 p-3 rounded border border-noir-600 leading-relaxed font-sans">
            "{description}"
          </p>
        </div>

        {/* Detailed Forensic / Testimonial Examination */}
        {discovered ? (
          <div className="bg-noir-950 border border-gold/40 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-wider">
              <Microscope className="w-4 h-4 text-gold" />
              <span>Forensic & Detective Analysis Report</span>
            </div>
            <p className="text-sm text-cream leading-relaxed font-sans whitespace-pre-line pl-2 border-l-2 border-gold/60">
              {details || 'Comprehensive forensic examination verified.'}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono text-[#8cb080]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Evidence officially recorded in detective logbook (+5 points awarded).</span>
            </div>
          </div>
        ) : (
          <div className="bg-noir-850 border border-dashed border-noir-600 rounded-lg p-6 text-center space-y-3">
            <ShieldAlert className="w-8 h-8 text-gold mx-auto opacity-70" />
            <h5 className="font-serif font-bold text-cream text-base">
              Detailed Forensic Analysis Sealed
            </h5>
            <p className="text-xs text-parchment max-w-sm mx-auto leading-relaxed">
              Examine this evidence marker to perform chemical spectroscopy, fingerprint dusting, or witness interrogation and unlock its true significance.
            </p>
            <Button
              variant="gold"
              icon={Sparkles}
              onClick={() => onDiscover(clue)}
              loading={discovering}
              className="mt-2"
            >
              Examine & Unseal Evidence (+5 Points)
            </Button>
          </div>
        )}

      </div>
    </Modal>
  );
}
