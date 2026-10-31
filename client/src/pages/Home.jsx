import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Shield, Cpu, BookOpen, Clock, Award, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { caseService } from '../services/api';
import { useSound } from '../context/SoundContext';

export default function Home() {
  const { playClick } = useSound();
  const [recentCases, setRecentCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);

  useEffect(() => {
    caseService.getCaseHistory()
      .then((res) => {
        if (res.cases) {
          setRecentCases(res.cases.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingCases(false));
  }, []);

  const scrollToHowItWorks = () => {
    playClick();
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Noir Ambient Lighting Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          
          {/* AI Badge Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-noir-900 border border-gold/30 text-xs font-mono text-gold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span>POWERED BY GOOGLE GEMINI 3.8 • DETERMINISTIC NOIR ENGINE</span>
          </div>

          {/* Cinematic Serif Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-cream tracking-tight leading-[1.1]">
            Every mystery has a truth waiting to be uncovered.
          </h1>

          {/* Supporting Narrative */}
          <p className="text-base sm:text-xl text-parchment max-w-2xl mx-auto leading-relaxed font-sans font-light">
            Step into the investigation. Examine evidence, question the details, uncover hidden connections and discover who is responsible.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/create">
              <Button
                variant="gold"
                size="lg"
                icon={ArrowRight}
                className="w-full sm:w-auto shadow-gold-glow text-noir-950 font-bold"
              >
                Start Investigation
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto"
            >
              Explore How It Works
            </Button>
          </div>

          {/* Subtle Bureau Disclaimer */}
          <p className="text-[11px] font-mono text-vintage-muted pt-2">
            No registration required • Persistent guest dossier saved in MongoDB Atlas
          </p>
        </div>
      </section>

      {/* Recent Cases Section (If Player Has Cases) */}
      {recentCases.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-noir-900 border border-noir-600 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-noir-700/60 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-gold block mb-1">
                  OFFICIAL ARCHIVES
                </span>
                <h2 className="text-xl font-serif font-bold text-cream">
                  Your Recent Case Files
                </h2>
              </div>
              <Link to="/history" className="text-xs font-mono text-gold hover:underline">
                View All Files →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentCases.map((c) => (
                <Link
                  key={c.id}
                  to={c.status === 'completed' ? `/case/${c.id}/result` : `/case/${c.id}`}
                  onClick={playClick}
                  className="bg-noir-800 hover:bg-noir-750 border border-noir-600 hover:border-gold/40 rounded-lg p-5 transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-vintage-muted">
                      {c.caseNumber}
                    </span>
                    <Badge variant={c.difficulty === 'easy' ? 'olive' : c.difficulty === 'hard' ? 'crimson' : 'gold'} size="sm">
                      {c.difficulty}
                    </Badge>
                  </div>

                  <h3 className="font-serif font-bold text-base text-cream group-hover:text-gold transition-colors line-clamp-1">
                    {c.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-noir-700/40">
                    <span className={c.status === 'completed' ? (c.isCorrect ? 'text-[#8cb080]' : 'text-[#cf6d6d]') : 'text-gold'}>
                      {c.status === 'completed' ? (c.isCorrect ? '✓ SOLVED' : '✗ UNSOLVED') : '● ACTIVE'}
                    </span>
                    <span className="text-vintage-muted">
                      {c.status === 'completed' ? `${c.finalScore} pts` : 'Resume →'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-gold block">
            THE INVESTIGATION PROTOCOL
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cream">
            How The Bureau Operates
          </h2>
          <p className="text-sm text-parchment max-w-xl mx-auto">
            Experience an authentic, tactile detective investigation built with rigorous forensic logic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-noir-900 border border-noir-600 rounded-lg p-6 space-y-4 relative">
            <span className="text-3xl font-serif font-bold text-gold/30 block">
              01
            </span>
            <h3 className="font-serif font-bold text-lg text-cream">
              Synthesize The Crime
            </h3>
            <p className="text-xs text-parchment leading-relaxed font-sans">
              Provide a custom premise or request an enigmatic enigma. Gemini designs a crime with interconnected suspects, alibis, and forensic clues.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-noir-900 border border-noir-600 rounded-lg p-6 space-y-4 relative">
            <span className="text-3xl font-serif font-bold text-gold/30 block">
              02
            </span>
            <h3 className="font-serif font-bold text-lg text-cream">
              Inspect Suspect Dossiers
            </h3>
            <p className="text-xs text-parchment leading-relaxed font-sans">
              Interrogate realistic suspect profiles. Examine background motives, personal relationships, and sworn whereabouts.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-noir-900 border border-noir-600 rounded-lg p-6 space-y-4 relative">
            <span className="text-3xl font-serif font-bold text-gold/30 block">
              03
            </span>
            <h3 className="font-serif font-bold text-lg text-cream">
              Work The Corkboard
            </h3>
            <p className="text-xs text-parchment leading-relaxed font-sans">
              Uncover pinned physical evidence, ballistic reports, and documents. Request strategic hints from the precinct with score deductions.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-noir-900 border border-noir-600 rounded-lg p-6 space-y-4 relative">
            <span className="text-3xl font-serif font-bold text-gold/30 block">
              04
            </span>
            <h3 className="font-serif font-bold text-lg text-cream">
              Deliver The Accusation
            </h3>
            <p className="text-xs text-parchment leading-relaxed font-sans">
              Name the single responsible culprit. The bureau server evaluates your deduction, computes your objective score, and unseals the full debrief.
            </p>
          </div>

        </div>

        {/* Start CTA banner */}
        <div className="mt-12 text-center">
          <Link to="/create">
            <Button variant="gold" size="md" icon={ArrowRight}>
              Open A New Investigation Dossier
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}

