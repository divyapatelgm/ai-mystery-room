import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderArchive, PlusCircle, CheckCircle, XCircle, Clock, ChevronRight, Award } from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { caseService } from '../services/api';
import { useSound } from '../context/SoundContext';

export default function CaseHistory() {
  const { playClick } = useSound();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'solved' | 'unsolved' | 'active'

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await caseService.getCaseHistory();
      if (res.success && res.cases) {
        setCases(res.cases);
      }
    } catch (err) {
      console.error('[History Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'solved') return c.status === 'completed' && c.isCorrect;
    if (filter === 'unsolved') return c.status === 'completed' && !c.isCorrect;
    if (filter === 'active') return c.status === 'active';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-noir-600 pb-6">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-gold block">
            CONFIDENTIAL ARCHIVES
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-cream">
            Investigative Case History
          </h1>
          <p className="text-sm text-parchment font-sans">
            Review past debriefs, deductive accuracy, and ongoing detective operations.
          </p>
        </div>

        <Link to="/create">
          <Button variant="gold" icon={PlusCircle} className="shadow-gold-glow">
            New Investigation
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'solved', 'unsolved', 'active'].map((f) => (
          <button
            key={f}
            onClick={() => {
              playClick();
              setFilter(f);
            }}
            className={`px-3 py-1.5 text-xs font-mono rounded uppercase transition-all ${
              filter === f
                ? 'bg-gold text-noir-950 font-bold shadow-gold-glow'
                : 'bg-noir-900 text-parchment hover:text-cream border border-noir-600 hover:border-gold/30'
            }`}
          >
            {f} {f === 'all' ? `(${cases.length})` : ''}
          </button>
        ))}
      </div>

      {/* Case List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-parchment">Reading case logs...</p>
        </div>
      ) : filteredCases.length === 0 ? (
        /* Empty State */
        <div className="bg-noir-900 border border-noir-600 rounded-xl p-12 text-center max-w-lg mx-auto space-y-4">
          <FolderArchive className="w-12 h-12 text-vintage-muted mx-auto opacity-40" />
          <h3 className="font-serif font-bold text-xl text-cream">
            No Case Files Recorded
          </h3>
          <p className="text-xs text-parchment font-sans leading-relaxed">
            {filter === 'all'
              ? 'Your private investigator ledger is currently clear. Step up and take on your first procedural mystery.'
              : `No cases match the filter "${filter.toUpperCase()}".`}
          </p>
          <div className="pt-2">
            <Link to="/create">
              <Button variant="gold" size="sm" icon={PlusCircle}>
                Initiate New Investigation
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCases.map((c) => {
            const isCompleted = c.status === 'completed';
            const dateStr = new Date(c.completedAt || c.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <Link
                key={c.id}
                to={isCompleted ? `/case/${c.id}/result` : `/case/${c.id}`}
                onClick={playClick}
                className="block bg-noir-900 hover:bg-noir-850 border border-noir-600 hover:border-gold/50 rounded-lg p-5 transition-all group shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Case Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-vintage-muted uppercase bg-noir-800 px-2 py-0.5 rounded border border-noir-600">
                        {c.caseNumber}
                      </span>
                      <Badge variant={c.difficulty === 'easy' ? 'olive' : c.difficulty === 'hard' ? 'crimson' : 'gold'} size="sm">
                        {c.difficulty}
                      </Badge>
                      <span className="text-xs text-vintage-muted font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {dateStr}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-cream group-hover:text-gold transition-colors truncate">
                      {c.title}
                    </h3>
                  </div>

                  {/* Right: Outcome & Score */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-noir-700/60">
                    {isCompleted ? (
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                          {c.isCorrect ? (
                            <span className="text-[#8cb080] flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> SOLVED
                            </span>
                          ) : (
                            <span className="text-[#cf6d6d] flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> WRONGFUL
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-gold flex items-center gap-1 justify-end pt-0.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>{c.finalScore} pts</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-xs font-mono text-gold bg-gold/15 px-2 py-0.5 rounded border border-gold/40">
                          ● IN PROGRESS
                        </span>
                        <p className="text-[10px] font-mono text-vintage-muted pt-1">
                          Resume Investigation
                        </p>
                      </div>
                    )}

                    <ChevronRight className="w-5 h-5 text-vintage-muted group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}

