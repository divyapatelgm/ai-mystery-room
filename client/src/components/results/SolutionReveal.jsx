import React from 'react';
import { UserCheck, ShieldAlert, Key, FileCheck2 } from 'lucide-react';
import SuspectAvatar from '../suspects/SuspectAvatar';

export default function SolutionReveal({
  culprit,
  explanation,
  supportingClues = [],
  isCorrect = false,
}) {
  return (
    <div className="bg-noir-900 border border-noir-600 rounded-xl overflow-hidden shadow-noir-lg">
      
      {/* Top Banner */}
      <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
        isCorrect
          ? 'bg-vintage-success/15 border-vintage-success/40 text-[#8cb080]'
          : 'bg-vintage-danger/15 border-vintage-danger/40 text-[#cf6d6d]'
      }`}>
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <UserCheck className="w-5 h-5 text-[#8cb080]" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-[#cf6d6d]" />
          )}
          <span className="font-serif font-bold text-lg sm:text-xl text-cream">
            {isCorrect ? 'Accusation Confirmed — Case Solved' : 'Wrongful Accusation — True Culprit Identified'}
          </span>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded border uppercase bg-noir-950/80">
          {isCorrect ? 'VERDICT: GUILTY' : 'MISCARRIAGE OF JUSTICE'}
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Culprit Profile Dossier */}
        {culprit && (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-noir-800 rounded-lg border border-gold/40 shadow-md">
            <SuspectAvatar
              name={culprit.name}
              gender={culprit.gender}
              avatarIndex={culprit.avatarIndex || 0}
              className="w-24 h-24 flex-shrink-0"
            />
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gold bg-noir-950 px-2 py-0.5 rounded border border-gold/40 inline-block">
                PERPETRATOR DOSSIER
              </span>
              <h4 className="font-serif font-bold text-2xl text-cream">
                {culprit.name}
              </h4>
              <p className="text-xs font-mono text-parchment">
                <span className="text-vintage-muted">Occupation: </span>{culprit.occupation} • <span className="text-vintage-muted">Relationship: </span>{culprit.relationship}
              </p>
              <p className="text-xs text-parchment/90 leading-relaxed pt-1">
                {culprit.biography}
              </p>
            </div>
          </div>
        )}

        {/* Complete Solution Narrative */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold">
            <Key className="w-4 h-4 text-gold" />
            <span>Canonical Crime Reconstruction & Motive</span>
          </div>
          <div className="bg-noir-950 p-5 rounded-lg border border-noir-600/90 text-sm sm:text-base text-cream font-sans leading-relaxed whitespace-pre-line shadow-inner">
            {explanation}
          </div>
        </div>

        {/* Supporting Clues That Proved It */}
        {supportingClues && supportingClues.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-parchment">
              <FileCheck2 className="w-4 h-4 text-gold" />
              <span>Key Supporting Evidence Citing Guilt</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supportingClues.map((clue, idx) => (
                <div
                  key={clue.id || idx}
                  className="bg-noir-850 border border-noir-600 rounded p-3.5 space-y-1"
                >
                  <span className="text-[10px] font-mono text-gold block uppercase">
                    EVIDENCE RECORD #{clue.id.toUpperCase()}
                  </span>
                  <h5 className="font-serif font-bold text-sm text-cream">
                    {clue.title}
                  </h5>
                  <p className="text-xs text-parchment leading-relaxed">
                    {clue.relevance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
