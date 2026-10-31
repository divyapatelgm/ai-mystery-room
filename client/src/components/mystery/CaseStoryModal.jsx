import React from 'react';
import Modal from '../common/Modal';
import { FileText, ShieldAlert } from 'lucide-react';

export default function CaseStoryModal({ isOpen, onClose, caseData }) {
  if (!caseData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      subtitle={`OFFICIAL DISPATCH • ${caseData.caseNumber}`}
      title={caseData.title}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Incident Classification Tag */}
        <div className="flex items-center gap-2 p-3 bg-noir-800/80 border border-gold/30 rounded text-xs font-mono text-gold">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>CONFIDENTIAL DETECTIVE BRIEFING — INITIAL EVIDENCE BOARD OPENED</span>
        </div>

        {/* Premise / Initial Lead */}
        {caseData.premise && (
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-parchment mb-1">
              Investigative Lead / Premise
            </h4>
            <p className="text-sm text-cream italic bg-noir-950/60 p-3 rounded border border-noir-600">
              "{caseData.premise}"
            </p>
          </div>
        )}

        {/* Narrative Story */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-parchment mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gold" />
            Case Incident Report
          </h4>
          <div className="text-sm leading-relaxed text-cream space-y-4 font-sans bg-noir-850 p-4 rounded border border-noir-600 whitespace-pre-line">
            {caseData.story}
          </div>
        </div>

        {/* Detective Instructions */}
        <div className="p-3 bg-noir-800/40 border border-noir-600 rounded text-xs text-parchment">
          <span className="text-cream font-semibold">Detective Orders: </span>
          Question the suspects, scrutinize their alibis, and discover forensic clues on the evidence board. Once you identify the contradiction, deliver your final accusation.
        </div>
      </div>
    </Modal>
  );
}
