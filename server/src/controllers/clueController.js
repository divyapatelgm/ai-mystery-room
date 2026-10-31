import { Case } from '../models/Case.js';
import { calculateProgressScore } from '../services/scoringService.js';

export async function discoverClue(req, res, next) {
  try {
    const { id, clueId } = req.params;

    const caseDoc = await Case.findById(id);
    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case file not found.',
        code: 'CASE_NOT_FOUND',
      });
    }

    if (caseDoc.ownerId !== req.guestId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized case access.',
        code: 'UNAUTHORIZED_CASE_ACCESS',
      });
    }

    if (caseDoc.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This case is already closed. Clues cannot be discovered on a finalized case.',
        code: 'CASE_ALREADY_COMPLETED',
      });
    }

    const clue = caseDoc.clues.find(c => c.id === clueId);
    if (!clue) {
      return res.status(404).json({
        success: false,
        message: `Evidence marker '${clueId}' does not exist on this investigation board.`,
        code: 'CLUE_NOT_FOUND',
      });
    }

    // If already discovered, return existing status idempotently without duplicate points
    if (clue.discovered) {
      return res.status(200).json({
        success: true,
        message: 'Evidence was previously examined.',
        clue: {
          id: clue.id,
          title: clue.title,
          description: clue.description,
          details: clue.details,
          category: clue.category,
          discovered: true,
          discoveredAt: clue.discoveredAt,
          boardPosition: clue.boardPosition,
        },
        progress: {
          discoveredCluesCount: caseDoc.clues.filter(c => c.discovered).length,
          totalCluesCount: caseDoc.clues.length,
          currentScore: caseDoc.playerProgress.currentScore,
        },
      });
    }

    // Discover the clue
    clue.discovered = true;
    clue.discoveredAt = new Date();

    if (!caseDoc.playerProgress.discoveredClueIds.includes(clueId)) {
      caseDoc.playerProgress.discoveredClueIds.push(clueId);
    }

    const discoveredCount = caseDoc.clues.filter(c => c.discovered).length;
    const usedHintCount = caseDoc.hints.filter(h => h.used).length;
    const newProgressScore = calculateProgressScore(discoveredCount, usedHintCount);

    caseDoc.playerProgress.currentScore = newProgressScore;

    await caseDoc.save();

    return res.status(200).json({
      success: true,
      clue: {
        id: clue.id,
        title: clue.title,
        description: clue.description,
        details: clue.details,
        category: clue.category,
        discovered: true,
        discoveredAt: clue.discoveredAt,
        boardPosition: clue.boardPosition,
      },
      progress: {
        discoveredCluesCount: discoveredCount,
        totalCluesCount: caseDoc.clues.length,
        currentScore: newProgressScore,
      },
    });
  } catch (err) {
    next(err);
  }
}

