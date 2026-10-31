import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Scale, AlertTriangle, ArrowLeft, ShieldAlert } from 'lucide-react';
import SuspectCard from '../components/suspects/SuspectCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { caseService } from '../services/api';
import { useSound } from '../context/SoundContext';
import toast from 'react-hot-toast';

export default function Accusation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('suspectId');
  const { playClick, playPin, playVictory, playWrong } = useSound();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSuspectId, setSelectedSuspectId] = useState(preselectedId || null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const res = await caseService.getCase(id);
      if (res.success && res.case) {
        if (res.case.status === 'completed') {
          navigate(`/case/${id}/result`);
          return;
        }
        setCaseData(res.case);
        if (preselectedId && res.case.suspects.some(s => s.id === preselectedId)) {
          setSelectedSuspectId(preselectedId);
        }
      }
    } catch (err) {
      toast.error('Failed to load suspects for accusation.');
      navigate(`/case/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuspect = (suspect) => {
    playPin();
    setSelectedSuspectId(suspect.id);
  };

  const handleTriggerAccusation = () => {
    if (!selectedSuspectId) {
      toast.error('You must designate exactly one suspect to indict.');
      return;
    }
    playClick();
    setConfirmModalOpen(true);
  };

  const handleConfirmAccusation = async () => {
    if (!selectedSuspectId || submitting) return;

    try {
      setSubmitting(true);
      const res = await caseService.submitAccusation(id, selectedSuspectId);

      if (res.success && res.result) {
        if (res.result.isCorrect) {
          playVictory();
          toast.success('Accusation Verified! The culprit has been apprehended!', { duration: 4000 });
        } else {
          playWrong();
          toast.error('Wrongful Accusation! The true culprit eluded apprehension.', { duration: 4000 });
        }

        navigate(`/case/${id}/result`);
      } else {
        throw new Error(res.message || 'Failed to submit accusation.');
      }
    } catch (err) {
      console.error('[Accusation Error]', err);
      toast.error(err.response?.data?.message || err.message || 'Error evaluating accusation.');
      setConfirmModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  const selectedSuspect = caseData.suspects?.find(s => s.id === selectedSuspectId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Return to Room Link */}
      <button
        onClick={() => navigate(`/case/${id}`)}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-parchment hover:text-cream transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Investigation Board</span>
      </button>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-noir-900 border border-gold/30 text-xs font-mono text-gold">
          <Scale className="w-3.5 h-3.5" />
          <span>FORMAL INDICTMENT PROCEEDING • {caseData.caseNumber}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-cream">
          Name The Responsible Culprit
        </h1>
        <p className="text-sm text-parchment max-w-xl mx-auto font-sans leading-relaxed">
          Select exactly one person of interest to formally accuse. Carefully review the evidence gathered before delivering your irreversible verdict.
        </p>
      </div>

      {/* Suspect Roster Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-parchment px-1">
          <span>SELECT ONE CANDIDATE:</span>
          <span className="text-gold font-bold">
            {selectedSuspect ? `Designated: ${selectedSuspect.name}` : 'None chosen yet'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseData.suspects?.map((suspect) => (
            <SuspectCard
              key={suspect.id}
              suspect={suspect}
              isAccusationMode={true}
              isSelected={selectedSuspectId === suspect.id}
              onSelectForAccusation={handleSelectSuspect}
              onInspect={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Submit Accusation Bottom Bar */}
      <div className="p-6 bg-noir-900 border border-noir-600 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-noir-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif font-bold text-base text-cream">
            Ready to close the investigation?
          </h4>
          <p className="text-xs text-vintage-muted font-mono">
            An indictment permanently finalizes the official case score and reveals the canonical solution.
          </p>
        </div>

        <Button
          variant="gold"
          size="lg"
          icon={Scale}
          disabled={!selectedSuspectId}
          onClick={handleTriggerAccusation}
          className="w-full sm:w-auto shadow-gold-glow"
        >
          Submit Formal Accusation
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        subtitle="FINAL INDICTMENT CONFIRMATION"
        title="Are you certain of this accusation?"
        maxWidth="max-w-lg"
      >
        <div className="space-y-5">
          <div className="p-4 bg-vintage-danger/15 border border-vintage-danger/40 rounded-lg flex items-start gap-3 text-sm text-[#cf6d6d]">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold">Irreversible Action</h5>
              <p className="text-xs text-parchment leading-relaxed">
                Submitting this accusation terminates the active investigation. If your deduction is incorrect, you will earn <strong className="text-cream">0 base points</strong>.
              </p>
            </div>
          </div>

          {selectedSuspect && (
            <div className="p-4 bg-noir-850 rounded border border-gold/40 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-gold block">
                OFFICIALLY ACCUSED SUSPECT
              </span>
              <h4 className="font-serif font-bold text-xl text-cream">
                {selectedSuspect.name}
              </h4>
              <p className="text-xs text-parchment font-mono">
                {selectedSuspect.occupation} • {selectedSuspect.relationship}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-noir-600">
            <Button
              variant="outline"
              onClick={() => setConfirmModalOpen(false)}
              disabled={submitting}
            >
              Re-examine Evidence
            </Button>
            <Button
              variant="danger"
              icon={Scale}
              loading={submitting}
              onClick={handleConfirmAccusation}
            >
              Confirm Indictment
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

