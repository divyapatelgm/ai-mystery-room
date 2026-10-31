import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Lightbulb, Search, Award, Scale } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function CaseHeader({
  caseData,
  onOpenStory,
  onOpenHints,
}) {
  const {
    id,
    caseNumber,
    title,
    difficulty,
    progress = {},
    hintsRemaining = 0,
    hintsTotal = 3,
  } = caseData;

  const discoveredCount = progress.discoveredCluesCount || 0;
  const totalClues = progress.totalCluesCount || 0;
  const currentScore = progress.currentScore || 0;

  const difficultyVariant =
    difficulty === 'easy' ? 'olive' : difficulty === 'hard' ? 'crimson' : 'gold';

  return (
    <div className="bg-noir-900 border-b border-noir-600 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Case Info */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-parchment tracking-widest uppercase bg-noir-800 px-2 py-0.5 rounded border border-noir-600">
              FILE: {caseNumber}
            </span>
            <Badge variant={difficultyVariant} size="sm">
              {difficulty} CASE
            </Badge>
            <span className="text-xs text-parchment font-mono">
              • ACTIVE INVESTIGATION
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-cream tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right: Metrics & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Story Dossier Button */}
          <Button
            variant="outline"
            size="sm"
            icon={BookOpen}
            onClick={onOpenStory}
          >
            Incident Briefing
          </Button>

          {/* Clues Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-noir-800 border border-noir-600 text-xs font-mono text-cream">
            <Search className="w-3.5 h-3.5 text-gold" />
            <span className="text-parchment">Clues:</span>
            <span className="font-bold text-gold">{discoveredCount}/{totalClues}</span>
          </div>

          {/* Hints Drawer Trigger */}
          <button
            onClick={onOpenHints}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-noir-800 hover:bg-noir-700 border border-noir-600 hover:border-gold/40 text-xs font-mono text-cream transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-gold" />
            <span className="text-parchment">Hints:</span>
            <span className="font-bold text-cream">{hintsRemaining} left</span>
          </button>

          {/* Current Score */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-noir-800 border border-noir-600 text-xs font-mono text-cream">
            <Award className="w-3.5 h-3.5 text-gold" />
            <span className="text-parchment">Score:</span>
            <span className="font-bold text-gold">{currentScore} pts</span>
          </div>

          {/* Accusation CTA */}
          <Link to={`/case/${id}/accuse`}>
            <Button
              variant="gold"
              size="sm"
              icon={Scale}
              className="shadow-gold-glow"
            >
              Make Accusation
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
