import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { RotateCcw, FolderArchive, Scale, AlertCircle } from 'lucide-react';
import ScoreCard from '../components/results/ScoreCard';
import SolutionReveal from '../components/results/SolutionReveal';
import Button from '../components/common/Button';
import { caseService } from '../services/api';

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await caseService.getCaseResult(id);
      if (res.success && res.case) {
        setCaseData(res.case);

        // Confetti celebration if solved correctly
        if (res.case.result?.isCorrect) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#C69B52', '#E8E2D5', '#687D60'],
          });
        }
      } else {
        throw new Error(res.message || 'Failed to retrieve case result.');
      }
    } catch (err) {
      console.error('[Result Fetch Error]', err);
      setError(err.response?.data?.message || err.message || 'Result unavailable.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-center">
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="font-serif font-bold text-cream text-lg">
            Unsealing Post-Mortem Debrief...
          </p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <AlertCircle className="w-12 h-12 text-vintage-danger mx-auto" />
        <h2 className="text-2xl font-serif font-bold text-cream">
          Debrief Unavailable
        </h2>
        <p className="text-sm text-parchment">
          {error || 'This case has not been completed or you do not have permission to view its solution.'}
        </p>
        <Button variant="gold" onClick={() => navigate('/history')}>
          Return to Archives
        </Button>
      </div>
    );
  }

  const { result = {}, title, caseNumber, difficulty } = caseData;
  const isCorrect = result.isCorrect ?? false;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header Verdict */}
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-gold block">
          OFFICIAL VERDICT FILE • {caseNumber}
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-cream">
          {title}
        </h1>
        <p className="text-sm font-mono text-parchment">
          Investigation Closed • Difficulty: <strong className="text-cream uppercase">{difficulty}</strong>
        </p>
      </div>

      {/* Itemized Score Card */}
      <ScoreCard scoreData={result.score} />

      {/* True Solution Reveal & Debrief */}
      <SolutionReveal
        culprit={result.culprit}
        explanation={result.explanation}
        supportingClues={result.supportingClues}
        isCorrect={isCorrect}
      />

      {/* Navigation & Next Case Actions */}
      <div className="p-8 bg-noir-900 border border-noir-600 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-noir-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif font-bold text-lg text-cream">
            Ready for your next detective challenge?
          </h4>
          <p className="text-xs text-parchment font-mono">
            Your case debrief has been safely archived in your guest history records.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
          <Link to="/history" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              icon={FolderArchive}
              className="w-full"
            >
              Case History
            </Button>
          </Link>

          <Link to="/create" className="w-full sm:w-auto">
            <Button
              variant="gold"
              size="md"
              icon={RotateCcw}
              className="w-full shadow-gold-glow"
            >
              Play Again (New Case)
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}

