import React, { useState } from 'react';
import EvidenceCard from './EvidenceCard';
import { Filter, Sparkles, CheckCheck } from 'lucide-react';
import Button from '../common/Button';

export default function Corkboard({
  clues = [],
  onInspectClue,
  onDiscoverClue,
  discoveringClueId,
  onDiscoverAllRemaining,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'physical', 'testimony', 'document', 'forensic'];

  const filteredClues = clues.filter((clue) => {
    if (selectedCategory === 'all') return true;
    return clue.category === selectedCategory;
  });

  const discoveredCount = clues.filter((c) => c.discovered).length;
  const allDiscovered = discoveredCount === clues.length && clues.length > 0;

  return (
    <div className="relative w-full rounded-xl overflow-hidden corkboard-surface border border-noir-600/80 shadow-noir-lg flex flex-col min-h-[550px]">
      
      {/* Decorative Wood Corkboard Frame Edges */}
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-[#2A231C] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-[#2A231C] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-[#2A231C] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-[#2A231C] to-transparent pointer-events-none" />

      {/* Top Filter and Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-noir-600/50 bg-noir-950/80 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3 z-10">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-mono text-vintage-muted uppercase mr-1 hidden sm:inline-flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-mono rounded uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-gold text-noir-950 font-semibold shadow-gold-glow'
                  : 'bg-noir-900/90 text-parchment hover:text-cream border border-noir-600 hover:border-gold/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Board Meta & Batch Action */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-parchment">
            Examined: <strong className="text-gold">{discoveredCount}/{clues.length}</strong>
          </span>

          {!allDiscovered && onDiscoverAllRemaining && (
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={onDiscoverAllRemaining}
              className="text-xs font-mono py-1 px-2.5"
            >
              Investigate All Leads
            </Button>
          )}

          {allDiscovered && (
            <span className="text-[#8cb080] flex items-center gap-1 text-[11px] font-mono bg-noir-900 px-2 py-1 rounded border border-vintage-success/30">
              <CheckCheck className="w-3.5 h-3.5" /> All Clues Verified
            </span>
          )}
        </div>
      </div>

      {/* Corkboard Canvas Workspace */}
      <div className="relative p-6 sm:p-8 flex-1">
        {/* Visual Connecting Yarn Lines (SVG Overlay for desktop) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle atmospheric crime scene string lines */}
          <line x1="20%" y1="25%" x2="50%" y2="55%" stroke="#8F3939" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="50%" y1="55%" x2="80%" y2="30%" stroke="#8F3939" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="50%" y1="55%" x2="35%" y2="80%" stroke="#C69B52" strokeWidth="1" strokeDasharray="3 3" />
        </svg>

        {/* Pinned Clues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          {filteredClues.map((clue) => (
            <EvidenceCard
              key={clue.id}
              clue={clue}
              onInspect={onInspectClue}
              onDiscover={onDiscoverClue}
              discovering={discoveringClueId === clue.id}
            />
          ))}
        </div>

        {filteredClues.length === 0 && (
          <div className="text-center py-20 text-vintage-muted font-mono text-sm">
            NO EVIDENCE CARDS FOUND IN CATEGORY "{selectedCategory.toUpperCase()}"
          </div>
        )}
      </div>

      {/* Corkboard Footer Note */}
      <div className="p-3 bg-noir-950/70 border-t border-noir-600/40 text-center text-[11px] font-mono text-vintage-muted z-10">
        📌 Click unexamined evidence pins to unseal forensic reports (+5 points). Pinned red tags represent uninspected scene leads.
      </div>

    </div>
  );
}
