import { Case } from '../models/Case.js';
import { calculateProgressScore } from '../services/scoringService.js';

export async function requestHint(req, res, next) {
  try {
    const { id } = req.params;

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
        message: 'Investigation is closed. Hints cannot be requested on a completed case.',
        code: 'CASE_ALREADY_COMPLETED',
      });
    }

    // Find first unused hint
    const unusedHint = caseDoc.hints.find(h => !h.used);
    if (!unusedHint) {
      return res.status(400).json({
        success: false,
        message: 'All available investigative hints for this difficulty tier have been exhausted.',
        code: 'HINT_LIMIT_REACHED',
      });
    }

    // Mark hint as used
    unusedHint.used = true;
    unusedHint.usedAt = new Date();

    if (!caseDoc.playerProgress.usedHintIds.includes(unusedHint.id)) {
      caseDoc.playerProgress.usedHintIds.push(unusedHint.id);
    }

    const discoveredCount = caseDoc.clues.filter(c => c.discovered).length;
    const usedHintCount = caseDoc.hints.filter(h => h.used).length;
    const totalHints = caseDoc.hints.length;
    const hintsRemaining = Math.max(0, totalHints - usedHintCount);

    const newProgressScore = calculateProgressScore(discoveredCount, usedHintCount);
    caseDoc.playerProgress.currentScore = newProgressScore;

    await caseDoc.save();

    return res.status(200).json({
      success: true,
      hint: {
        id: unusedHint.id,
        text: unusedHint.text,
        usedAt: unusedHint.usedAt,
      },
      hintsRemaining,
      progress: {
        usedHintsCount: usedHintCount,
        hintsTotal: totalHints,
        currentScore: newProgressScore,
      },
    });
  } catch (err) {
    next(err);
  }
}

