import React from 'react';
import { Award, CheckCircle, Search, HelpCircle, Trophy } from 'lucide-react';

export default function ScoreCard({ scoreData = {} }) {
  const {
    difficulty = 'medium',
    basePoints = 0,
    clueCount = 0,
    cluePoints = 0,
    hintCount = 0,
    hintPenalty = 0,
    finalScore = 0,
  } = scoreData;

  return (
    <div className="bg-noir-900 border border-gold/40 rounded-xl p-6 sm:p-8 shadow-noir-lg max-w-lg mx-auto">
      
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-noir-600/70 pb-4 mb-6">
        <div className="flex items-center gap-2 text-gold">
          <Trophy className="w-5 h-5 text-gold" />
          <h3 className="font-serif font-bold text-lg text-cream">
            Official Case Scorecard
          </h3>
        </div>
        <span className="text-xs font-mono uppercase bg-noir-800 text-gold px-2.5 py-1 rounded border border-gold/30">
          {difficulty} TIER
        </span>
      </div>

      {/* Itemized Points Breakdown */}
      <div className="space-y-4 font-mono text-sm">
        
        {/* Base Points */}
        <div className="flex items-center justify-between py-1.5 border-b border-noir-700/60">
          <div className="flex items-center gap-2 text-cream">
            <CheckCircle className={`w-4 h-4 ${basePoints > 0 ? 'text-[#8cb080]' : 'text-[#cf6d6d]'}`} />
            <span>Base Accusation Verdict</span>
          </div>
          <span className={`font-bold ${basePoints > 0 ? 'text-cream' : 'text-[#cf6d6d]'}`}>
            +{basePoints} pts
          </span>
        </div>

        {/* Clue Discovery Points */}
        <div className="flex items-center justify-between py-1.5 border-b border-noir-700/60">
          <div className="flex items-center gap-2 text-parchment">
            <Search className="w-4 h-4 text-gold" />
            <span>Discovered Evidence ({clueCount} × 5)</span>
          </div>
          <span className="font-bold text-[#8cb080]">
            +{cluePoints} pts
          </span>
        </div>

        {/* Hint Deductions */}
        <div className="flex items-center justify-between py-1.5 border-b border-noir-700/60">
          <div className="flex items-center gap-2 text-parchment">
            <HelpCircle className="w-4 h-4 text-vintage-muted" />
            <span>Investigative Hints ({hintCount} × -10)</span>
          </div>
          <span className={`font-bold ${hintPenalty > 0 ? 'text-[#cf6d6d]' : 'text-vintage-muted'}`}>
            -{hintPenalty} pts
          </span>
        </div>

        {/* Grand Total */}
        <div className="pt-4 flex items-center justify-between text-base sm:text-lg">
          <span className="font-serif font-bold text-cream tracking-wide">
            NET FINAL SCORE:
          </span>
          <span className="font-serif font-bold text-2xl text-gold">
            {finalScore} PTS
          </span>
        </div>

        <p className="text-[11px] text-vintage-muted font-sans text-center pt-2">
          * Calculated deterministically by the detective bureau audit server. Minimum floor: 0 pts.
        </p>

      </div>
    </div>
  );
}
