import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-noir-600 bg-noir-950 py-10 mt-auto text-parchment text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Bureau Badge */}
          <div className="flex items-center gap-3 text-cream">
            <div className="w-7 h-7 rounded border border-gold/30 flex items-center justify-center text-gold bg-noir-900">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-serif font-bold tracking-wide text-sm">
                AI Mystery Room Bureau
              </p>
              <p className="text-[11px] font-mono text-vintage-muted">
                Deductive Noir Investigation Unit • Gemini Powered
              </p>
            </div>
          </div>

          {/* Design Philosophy */}
          <div className="text-center md:text-right text-vintage-muted space-y-1">
            <p>
              Dark Detective Noir Architecture • Zero Client Solution Leaks • Deterministic Scoring
            </p>
            <p className="font-mono text-[10px]">
              Target Release Deadline: November 2, 2026 • Single Source: SPEC.md
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
