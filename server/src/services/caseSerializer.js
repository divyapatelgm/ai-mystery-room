/**
 * Strict Public Serializer for Case Documents
 * Enforces the critical information security boundary.
 */

/**
 * Sanitizes a Case document for public client transmission.
 * @param {Object} caseDoc - Mongoose document or plain JS object
 * @returns {Object} Secure, sanitized representation
 */
export function serializePublicCase(caseDoc) {
  const doc = caseDoc.toObject ? caseDoc.toObject() : caseDoc;
  const isCompleted = doc.status === 'completed';

  const totalClues = doc.clues?.length || 0;
  const discoveredCluesList = (doc.clues || []).filter(c => c.discovered);
  const discoveredCluesCount = discoveredCluesList.length;

  const totalHints = doc.hints?.length || 0;
  const usedHintsList = (doc.hints || []).filter(h => h.used);
  const usedHintsCount = usedHintsList.length;
  const hintsRemaining = Math.max(0, totalHints - usedHintsCount);

  // Suspects: always safe to show public profiles
  const sanitizedSuspects = (doc.suspects || []).map(s => ({
    id: s.id,
    name: s.name,
    occupation: s.occupation,
    relationship: s.relationship,
    biography: s.biography,
    alibi: s.alibi,
    portraitDescription: s.portraitDescription,
    gender: s.gender,
    avatarIndex: s.avatarIndex,
  }));

  // Clues: Lock details and relevance if undiscovered
  const sanitizedClues = (doc.clues || []).map(c => {
    if (c.discovered || isCompleted) {
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        details: c.details,
        category: c.category,
        relevance: isCompleted ? c.relevance : undefined,
        discovered: Boolean(c.discovered),
        discoveredAt: c.discoveredAt,
        boardPosition: c.boardPosition,
      };
    }
    // Undiscovered clue teaser only
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      discovered: false,
      discoveredAt: null,
      boardPosition: c.boardPosition,
    };
  });

  // Hints: only show text for used hints
  const sanitizedHints = (doc.hints || []).map(h => {
    if (h.used || isCompleted) {
      return {
        id: h.id,
        text: h.text,
        used: true,
        usedAt: h.usedAt,
      };
    }
    return {
      id: h.id,
      used: false,
      usedAt: null,
    };
  });

  const baseResponse = {
    id: doc._id?.toString() || doc.id,
    caseNumber: doc.caseNumber,
    title: doc.title,
    story: doc.story,
    premise: doc.premise,
    difficulty: doc.difficulty,
    status: doc.status,
    suspects: sanitizedSuspects,
    clues: sanitizedClues,
    hints: sanitizedHints,
    hintsTotal: totalHints,
    hintsRemaining,
    progress: {
      discoveredCluesCount,
      totalCluesCount: totalClues,
      usedHintsCount,
      currentScore: doc.playerProgress?.currentScore || 0,
    },
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  // If case is completed, reveal full debrief
  if (isCompleted) {
    const culpritSuspect = (doc.suspects || []).find(s => s.id === doc.solution?.culpritId) || null;
    const supportingClues = (doc.clues || []).filter(c =>
      (doc.solution?.supportingClueIds || []).includes(c.id)
    ).map(c => ({
      id: c.id,
      title: c.title,
      relevance: c.relevance,
    }));

    return {
      ...baseResponse,
      accusation: doc.accusation,
      result: {
        completed: true,
        isCorrect: doc.accusation?.isCorrect ?? false,
        culprit: culpritSuspect,
        explanation: doc.solution?.explanation,
        supportingClues,
        score: doc.result,
      },
    };
  }

  // Active case: zero leak of solution
  return baseResponse;
}

/**
 * Sanitizes an array of cases for the guest history listing.
 * Never leaks solutions of active cases.
 * @param {Array} cases 
 * @returns {Array}
 */
export function serializeCaseHistory(cases = []) {
  return cases.map(c => {
    const doc = c.toObject ? c.toObject() : c;
    const isCompleted = doc.status === 'completed';

    return {
      id: doc._id?.toString() || doc.id,
      caseNumber: doc.caseNumber,
      title: doc.title,
      difficulty: doc.difficulty,
      status: doc.status,
      isCorrect: isCompleted ? (doc.accusation?.isCorrect ?? false) : null,
      finalScore: isCompleted ? (doc.result?.finalScore ?? 0) : null,
      createdAt: doc.createdAt,
      completedAt: isCompleted ? (doc.accusation?.submittedAt || doc.updatedAt) : null,
    };
  });
}
