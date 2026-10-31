import { Case } from '../models/Case.js';
import { calculateFinalScore } from '../services/scoringService.js';
import { serializePublicCase } from '../services/caseSerializer.js';
import { AccusationSchema } from '../validators/caseValidator.js';

export async function submitAccusation(req, res, next) {
  try {
    const { id } = req.params;
    const { suspectId } = AccusationSchema.parse(req.body);

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

    // Idempotent: If case is already completed, return existing result without re-evaluating or modifying score
    if (caseDoc.status === 'completed') {
      const serialized = serializePublicCase(caseDoc);
      return res.status(200).json({
        success: true,
        message: 'Accusation was previously evaluated and finalized.',
        result: serialized.result,
        case: serialized,
      });
    }

    // Verify suspect exists in this case
    const suspectExists = caseDoc.suspects.some(s => s.id === suspectId);
    if (!suspectExists) {
      return res.status(400).json({
        success: false,
        message: `Suspect '${suspectId}' does not belong to this case dossier.`,
        code: 'INVALID_SUSPECT_ACCUSATION',
      });
    }

    // Evaluate accusation
    const isCorrect = suspectId === caseDoc.solution.culpritId;
    const discoveredClueCount = caseDoc.clues.filter(c => c.discovered).length;
    const usedHintCount = caseDoc.hints.filter(h => h.used).length;

    // Calculate score deterministically
    const scoreBreakdown = calculateFinalScore({
      difficulty: caseDoc.difficulty,
      isCorrect,
      discoveredClueCount,
      usedHintCount,
    });

    // Update case model
    caseDoc.status = 'completed';
    caseDoc.accusation = {
      suspectId,
      submittedAt: new Date(),
      isCorrect,
    };
    caseDoc.result = {
      completed: true,
      basePoints: scoreBreakdown.basePoints,
      cluePoints: scoreBreakdown.cluePoints,
      hintPenalty: scoreBreakdown.hintPenalty,
      finalScore: scoreBreakdown.finalScore,
    };
    caseDoc.playerProgress.currentScore = scoreBreakdown.finalScore;

    await caseDoc.save();
    console.log(`[AccusationController] Case ${caseDoc.caseNumber} closed. Verdict: ${isCorrect ? 'SOLVED' : 'UNSOLVED'}, Score: ${scoreBreakdown.finalScore}`);

    const serialized = serializePublicCase(caseDoc);

    return res.status(200).json({
      success: true,
      result: serialized.result,
      case: serialized,
    });
  } catch (err) {
    next(err);
  }
}

