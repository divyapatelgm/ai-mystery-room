import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Dices, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import LoadingDossier from '../components/common/LoadingDossier';
import { caseService } from '../services/api';
import { useSound } from '../context/SoundContext';
import toast from 'react-hot-toast';

const RANDOM_PREMISES = [
  'A priceless 18th-century Stradivarius violin vanished from a locked dressing room during an orchestra intermission.',
  'The chief archivist of the city museum was found unconscious beside an empty vault that once held the Obsidian Dagger.',
  'During a stormy private gala at an isolated cliffside manor, the host collapsed after proposing a toast from a freshly uncorked vintage.',
  'A renowned diamond merchant vanished into thin air from an express train passenger cabin between two mountain stations.',
  'A rare astronomical manuscript containing coded coordinates was stolen from the university observatory safe.',
];

const DIFFICULTIES = [
  {
    id: 'easy',
    name: 'Easy',
    suspects: 3,
    clues: 5,
    hints: 2,
    basePoints: 100,
    desc: 'Introductory case with a straightforward timeline and direct forensic links.',
    badgeColor: 'border-vintage-success/40 text-[#8cb080]',
  },
  {
    id: 'medium',
    name: 'Medium',
    suspects: 4,
    clues: 7,
    hints: 3,
    basePoints: 150,
    desc: 'Standard investigation featuring competing alibis and deceptive red herrings.',
    badgeColor: 'border-gold/40 text-gold',
  },
  {
    id: 'hard',
    name: 'Hard',
    suspects: 5,
    clues: 9,
    hints: 3,
    basePoints: 200,
    desc: 'Mastermind-level conspiracy requiring meticulous cross-examination and forensic synthesis.',
    badgeColor: 'border-vintage-danger/40 text-[#cf6d6d]',
  },
];

export default function CreateMystery() {
  const navigate = useNavigate();
  const { playClick } = useSound();

  const [premise, setPremise] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRandomizePremise = () => {
    playClick();
    const randomPick = RANDOM_PREMISES[Math.floor(Math.random() * RANDOM_PREMISES.length)];
    setPremise(randomPick);
    setError(null);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const response = await caseService.createMystery({
        premise: premise.trim() || undefined,
        difficulty,
      });

      if (response.success && response.case?.id) {
        toast.success('Investigation case file initialized!');
        navigate(`/case/${response.case.id}`);
      } else {
        throw new Error(response.message || 'Failed to initialize case file.');
      }
    } catch (err) {
      console.error('[Creation Error]', err);
      const msg = err.response?.data?.message || err.message || 'Unable to generate mystery. Check backend connection and Gemini API key.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Loading Overlay */}
      {loading && <LoadingDossier difficulty={difficulty} />}

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-gold block">
          CASE COMMISSIONING OFFICE
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-cream">
          Draft An Investigation
        </h1>
        <p className="text-sm sm:text-base text-parchment max-w-xl mx-auto font-sans">
          Define the circumstances of the crime or commission a random noir enigma. Gemini will construct a fully solvable case with interconnected clues.
        </p>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="p-4 bg-vintage-danger/15 border border-vintage-danger/40 rounded-lg flex items-start gap-3 text-sm text-[#cf6d6d]">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <h4 className="font-bold">Investigation Dispatch Failed</h4>
            <p className="text-xs text-parchment">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleGenerate} className="bg-noir-900 border border-noir-600 rounded-xl p-6 sm:p-10 shadow-noir-lg space-y-8">
        
        {/* Step 1: Mystery Premise */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label htmlFor="premise" className="block text-sm font-mono uppercase tracking-wider text-cream">
              1. Incident Premise (Optional)
            </label>
            <button
              type="button"
              onClick={handleRandomizePremise}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-gold hover:text-gold-hover hover:underline transition-colors"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Random Enigma Suggestion</span>
            </button>
          </div>

          <textarea
            id="premise"
            rows={4}
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            maxLength={500}
            placeholder="Describe the mystery you want to investigate. A missing artifact, a suspicious death, a stolen painting, an unexplained disappearance..."
            className="w-full bg-noir-950 border border-noir-600 rounded-lg p-4 text-cream placeholder-vintage-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm leading-relaxed transition-colors font-sans resize-y"
          />

          <div className="flex justify-between items-center text-[11px] font-mono text-vintage-muted">
            <span>Leave blank to let the AI architect an original setting and storyline.</span>
            <span>{premise.length}/500</span>
          </div>
        </div>

        {/* Step 2: Difficulty Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-mono uppercase tracking-wider text-cream">
            2. Investigative Difficulty Tier
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DIFFICULTIES.map((diff) => {
              const isSelected = difficulty === diff.id;

              return (
                <div
                  key={diff.id}
                  onClick={() => {
                    playClick();
                    setDifficulty(diff.id);
                  }}
                  className={`cursor-pointer rounded-lg p-5 border transition-all select-none space-y-3 ${
                    isSelected
                      ? 'bg-noir-800 border-gold ring-2 ring-gold/40 shadow-gold-glow'
                      : 'bg-noir-950/60 border-noir-600 hover:border-gold/30 hover:bg-noir-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-lg text-cream">
                      {diff.name}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${diff.badgeColor}`}>
                      +{diff.basePoints} PTS
                    </span>
                  </div>

                  {/* Quantitative Stats */}
                  <div className="space-y-1 text-xs font-mono text-parchment">
                    <div className="flex justify-between">
                      <span className="text-vintage-muted">Suspects:</span>
                      <strong className="text-cream">{diff.suspects} Persons</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-vintage-muted">Evidence Clues:</span>
                      <strong className="text-cream">{diff.clues} Markers</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-vintage-muted">Precinct Hints:</span>
                      <strong className="text-cream">{diff.hints} Requests</strong>
                    </div>
                  </div>

                  <p className="text-xs text-vintage-muted leading-relaxed font-sans pt-1">
                    {diff.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-noir-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-vintage-muted text-center sm:text-left">
            * Backend enforces zero-leakage security and rigorous logical verification.
          </span>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            icon={ArrowRight}
            loading={loading}
            className="w-full sm:w-auto shadow-gold-glow"
          >
            Generate Mystery
          </Button>
        </div>

      </form>

    </div>
  );
}
