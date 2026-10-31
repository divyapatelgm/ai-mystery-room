import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import Button from '../common/Button';

export default function HintDrawer({
  isOpen,
  onClose,
  hints = [],
  hintsRemaining = 0,
  hintsTotal = 3,
  onRequestHint,
  requesting = false,
}) {
  if (!isOpen) return null;

  const usedHints = hints.filter(h => h.used);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-noir-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-noir-900 border-l border-noir-600 shadow-noir-lg flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-noir-600 flex items-center justify-between bg-noir-850">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-gold" />
              <div>
                <h3 className="font-serif font-bold text-lg text-cream">
                  Investigative Hints
                </h3>
                <span className="text-[11px] font-mono text-parchment">
                  {hintsRemaining} of {hintsTotal} hints remaining
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-parchment hover:text-cream hover:bg-noir-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hint Warning Banner */}
          <div className="p-4 bg-noir-800/60 border-b border-noir-600 text-xs text-parchment flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <p>
              Requesting a hint consults senior precinct records and deducts <strong className="text-gold">10 points</strong> from your final score. Hints will guide your reasoning without directly naming the culprit.
            </p>
          </div>

          {/* Hint Content List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {usedHints.length === 0 ? (
              <div className="text-center py-12 text-vintage-muted">
                <Lightbulb className="w-10 h-10 mx-auto mb-3 opacity-30 text-gold" />
                <p className="text-sm font-medium text-cream">No hints requested yet</p>
                <p className="text-xs text-parchment mt-1">
                  You are currently relying purely on your own deductive prowess.
                </p>
              </div>
            ) : (
              usedHints.map((hint, idx) => (
                <div
                  key={hint.id || idx}
                  className="bg-noir-800 border border-gold/40 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-gold" />
                      UNLOCKED HINT #{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-vintage-muted">
                      -10 PTS
                    </span>
                  </div>
                  <p className="text-sm text-cream leading-relaxed font-sans">
                    "{hint.text}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Bottom Action */}
          <div className="p-5 border-t border-noir-600 bg-noir-850">
            {hintsRemaining > 0 ? (
              <Button
                variant="gold"
                className="w-full shadow-gold-glow"
                onClick={onRequestHint}
                loading={requesting}
                icon={Lightbulb}
              >
                Request Hint (-10 Points)
              </Button>
            ) : (
              <div className="text-center py-2 text-xs font-mono text-vintage-muted border border-noir-600 rounded bg-noir-800">
                ALL HINTS EXHAUSTED FOR THIS DIFFICULTY
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

