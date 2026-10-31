import React, { useState, useEffect } from 'react';
import { Search, FileText, Fingerprint, Compass } from 'lucide-react';

const MESSAGES = [
  { text: 'Preparing the confidential case dossier...', icon: FileText },
  { text: 'Reconstructing the crime scene and timeline...', icon: Compass },
  { text: 'Identifying persons of interest and corroborating alibis...', icon: Fingerprint },
  { text: 'Analyzing forensic clues and forensic evidence...', icon: Search },
  { text: 'Synthesizing verified detective leads with Gemini...', icon: Compass },
  { text: 'Finalizing the investigation file for dispatch...', icon: FileText },
];

export default function LoadingDossier({ difficulty = 'medium' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = MESSAGES[index].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir-950/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-noir-900 border border-gold/40 rounded-lg p-8 shadow-noir-lg text-center relative overflow-hidden">
        {/* Top Gold Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        {/* Radar / Magnifier Animation */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-gold/30 animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full border border-dashed border-gold/50 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="w-14 h-14 rounded-full bg-noir-800 border border-gold flex items-center justify-center text-gold shadow-gold-glow">
            <CurrentIcon className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Case Generation Metadata */}
        <span className="text-[11px] font-mono uppercase tracking-widest text-gold/80 block mb-2">
          INVESTIGATION DISPATCH IN PROGRESS • {difficulty.toUpperCase()} TIER
        </span>

        {/* Rotating Contextual Message */}
        <h3 className="text-lg font-serif font-bold text-cream min-h-[3.5rem] flex items-center justify-center transition-all duration-300">
          "{MESSAGES[index].text}"
        </h3>

        <p className="text-xs text-parchment mt-4 max-w-xs mx-auto leading-relaxed">
          Google Gemini is architecting a logically consistent crime with forensic evidence and verified alibis.
        </p>

        {/* Authentic Typewriter Tick Dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-gold' : 'w-1.5 bg-noir-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

