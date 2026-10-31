import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, FileSearch, HelpCircle, Scale, AlertCircle } from 'lucide-react';
import CaseHeader from '../components/mystery/CaseHeader';
import CaseStoryModal from '../components/mystery/CaseStoryModal';
import HintDrawer from '../components/mystery/HintDrawer';
import Corkboard from '../components/evidence/Corkboard';
import EvidenceModal from '../components/evidence/EvidenceModal';
import SuspectCard from '../components/suspects/SuspectCard';
import SuspectModal from '../components/suspects/SuspectModal';
import Button from '../components/common/Button';
import { caseService } from '../services/api';
import { useSound } from '../context/SoundContext';
import toast from 'react-hot-toast';

export default function InvestigationRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playDiscover, playClick } = useSound();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab state: 'board' | 'suspects'
  const [activeTab, setActiveTab] = useState('board');

  // Modals state
  const [storyOpen, setStoryOpen] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [selectedClue, setSelectedClue] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState(null);

  // Action loading states
  const [discoveringClueId, setDiscoveringClueId] = useState(null);
  const [requestingHint, setRequestingHint] = useState(false);

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await caseService.getCase(id);
      if (res.success && res.case) {
        // If already completed, redirect to results debrief
        if (res.case.status === 'completed') {
          navigate(`/case/${id}/result`);
          return;
        }
        setCaseData(res.case);
      } else {
        throw new Error(res.message || 'Failed to retrieve case file.');
      }
    } catch (err) {
      console.error('[Fetch Case Error]', err);
      const msg = err.response?.data?.message || err.message || 'Case file not found or unauthorized.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Clue discovery handler
  const handleDiscoverClue = async (clue) => {
    if (!clue || clue.discovered) return;

    try {
      setDiscoveringClueId(clue.id);
      const res = await caseService.discoverClue(id, clue.id);
      if (res.success && res.clue) {
        playDiscover();
        toast.success(`Forensic clue discovered: "${res.clue.title}" (+5 pts)`);

        // Update local state with the unsealed clue
        setCaseData((prev) => {
          if (!prev) return prev;
          const updatedClues = prev.clues.map((c) =>
            c.id === clue.id ? res.clue : c
          );
          return {
            ...prev,
            clues: updatedClues,
            progress: {
              ...prev.progress,
              discoveredCluesCount: res.progress?.discoveredCluesCount ?? (prev.progress.discoveredCluesCount + 1),
              currentScore: res.progress?.currentScore ?? prev.progress.currentScore,
            },
          };
        });

        // Also update selected clue modal if open
        if (selectedClue && selectedClue.id === clue.id) {
          setSelectedClue(res.clue);
        }
      }
    } catch (err) {
      console.error('[Discover Clue Error]', err);
      toast.error(err.response?.data?.message || 'Failed to examine evidence.');
    } finally {
      setDiscoveringClueId(null);
    }
  };

  // Discover all remaining clues sequentially (convenience feature)
  const handleDiscoverAllRemaining = async () => {
    if (!caseData?.clues) return;
    const undiscovered = caseData.clues.filter((c) => !c.discovered);
    if (undiscovered.length === 0) return;

    for (const clue of undiscovered) {
      await handleDiscoverClue(clue);
    }
  };

  // Hint request handler
  const handleRequestHint = async () => {
    if (requestingHint) return;

    try {
      setRequestingHint(true);
      const res = await caseService.requestHint(id);
      if (res.success && res.hint) {
        playDiscover();
        toast('New investigative hint unlocked (-10 pts)', {
          icon: '💡',
          style: {
            background: '#1B1D20',
            color: '#E8E2D5',
            border: '1px solid #C69B52',
          },
        });

        setCaseData((prev) => {
          if (!prev) return prev;
          const updatedHints = prev.hints.map((h) =>
            h.id === res.hint.id ? { ...h, text: res.hint.text, used: true, usedAt: res.hint.usedAt } : h
          );
          return {
            ...prev,
            hints: updatedHints,
            hintsRemaining: res.hintsRemaining,
            progress: {
              ...prev.progress,
              usedHintsCount: res.progress?.usedHintsCount ?? (prev.progress.usedHintsCount + 1),
              currentScore: res.progress?.currentScore ?? prev.progress.currentScore,
            },
          };
        });
      }
    } catch (err) {
      console.error('[Request Hint Error]', err);
      toast.error(err.response?.data?.message || 'Unable to request hint.');
    } finally {
      setRequestingHint(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-center">
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="font-serif font-bold text-cream text-lg">
            Unsealing Investigation Workspace...
          </p>
          <p className="text-xs font-mono text-parchment">
            Retrieving physical evidence board and suspect dossiers
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
          Classified Case File Unavailable
        </h2>
        <p className="text-sm text-parchment">
          {error || 'This case does not exist or your guest detective authorization has expired.'}
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate('/history')}>
            View Case Archives
          </Button>
          <Button variant="gold" onClick={() => navigate('/create')}>
            Start New Case
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      
      {/* Case Header */}
      <CaseHeader
        caseData={caseData}
        onOpenStory={() => {
          playClick();
          setStoryOpen(true);
        }}
        onOpenHints={() => {
          playClick();
          setHintsOpen(true);
        }}
      />

      {/* Main Workspace Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-noir-600 pb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                playClick();
                setActiveTab('board');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs sm:text-sm font-mono uppercase tracking-wider transition-all ${
                activeTab === 'board'
                  ? 'bg-gold text-noir-950 font-bold shadow-gold-glow'
                  : 'text-parchment hover:text-cream hover:bg-noir-900 border border-transparent hover:border-noir-600'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>Evidence Board ({caseData.clues?.length})</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setActiveTab('suspects');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs sm:text-sm font-mono uppercase tracking-wider transition-all ${
                activeTab === 'suspects'
                  ? 'bg-gold text-noir-950 font-bold shadow-gold-glow'
                  : 'text-parchment hover:text-cream hover:bg-noir-900 border border-transparent hover:border-noir-600'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Suspect Lineup ({caseData.suspects?.length})</span>
            </button>
          </div>

          {/* Quick Make Accusation Action */}
          <Button
            variant="outline"
            size="sm"
            icon={Scale}
            onClick={() => navigate(`/case/${id}/accuse`)}
            className="text-xs font-mono"
          >
            File Accusation →
          </Button>
        </div>

        {/* Tab 1: Physical Corkboard Evidence Board */}
        {activeTab === 'board' && (
          <div className="space-y-4">
            <Corkboard
              clues={caseData.clues || []}
              onInspectClue={(clue) => setSelectedClue(clue)}
              onDiscoverClue={handleDiscoverClue}
              discoveringClueId={discoveringClueId}
              onDiscoverAllRemaining={handleDiscoverAllRemaining}
            />
          </div>
        )}

        {/* Tab 2: Suspect Profiles */}
        {activeTab === 'suspects' && (
          <div className="space-y-6">
            <div className="p-4 bg-noir-900 border border-noir-600 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-parchment font-mono">
              <span>
                SUSPECT ROSTER: <strong className="text-cream">{caseData.suspects?.length} Persons of Interest</strong> Under Surveillance
              </span>
              <span className="text-gold">
                * Click "Examine Alibi" to inspect timeline details or "Indict" to formally accuse.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {caseData.suspects?.map((suspect) => (
                <SuspectCard
                  key={suspect.id}
                  suspect={suspect}
                  onInspect={(s) => setSelectedSuspect(s)}
                  onSelectForAccusation={() => navigate(`/case/${id}/accuse?suspectId=${suspect.id}`)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Case Story Modal */}
      <CaseStoryModal
        isOpen={storyOpen}
        onClose={() => setStoryOpen(false)}
        caseData={caseData}
      />

      {/* Hint Drawer */}
      <HintDrawer
        isOpen={hintsOpen}
        onClose={() => setHintsOpen(false)}
        hints={caseData.hints || []}
        hintsRemaining={caseData.hintsRemaining || 0}
        hintsTotal={caseData.hintsTotal || 3}
        onRequestHint={handleRequestHint}
        requesting={requestingHint}
      />

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={Boolean(selectedClue)}
        onClose={() => setSelectedClue(null)}
        clue={selectedClue}
        onDiscover={handleDiscoverClue}
        discovering={discoveringClueId === selectedClue?.id}
      />

      {/* Suspect Modal */}
      <SuspectModal
        isOpen={Boolean(selectedSuspect)}
        onClose={() => setSelectedSuspect(null)}
        suspect={selectedSuspect}
        onAccuse={(s) => navigate(`/case/${id}/accuse?suspectId=${s.id}`)}
      />

    </div>
  );
}

