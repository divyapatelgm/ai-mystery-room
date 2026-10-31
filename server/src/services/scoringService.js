/**
 * Deterministic Scoring Service for AI Mystery Room
 *
 * Difficulty Base Points (Correct Accusation):
 * - Easy: 100
 * - Medium: 150
 * - Hard: 200
 *
 * Incorrect Accusation:
 * - Base points: 0
 *
 * Clue Discovery Bonus:
 * - Each discovered clue: +5
 *
 * Hint Penalty:
 * - Each used hint: -10
 *
 * Final Score Formula:
 * Math.max(0, basePoints + clueBonus - hintPenalty)
 */

export const DIFFICULTY_BASE_POINTS = {
  easy: 100,
  medium: 150,
  hard: 200,
};

export const POINTS_PER_CLUE = 5;
export const PENALTY_PER_HINT = 10;

/**
 * Calculates intermediate progress score (prior to final accusation)
 * @param {number} discoveredClueCount 
 * @param {number} usedHintCount 
 * @returns {number}
 */
export function calculateProgressScore(discoveredClueCount = 0, usedHintCount = 0) {
  const cluePoints = discoveredClueCount * POINTS_PER_CLUE;
  const hintPenalty = usedHintCount * PENALTY_PER_HINT;
  return Math.max(0, cluePoints - hintPenalty);
}

/**
 * Calculates finalized score upon accusation submission
 * @param {Object} params
 * @param {string} params.difficulty - 'easy' | 'medium' | 'hard'
 * @param {boolean} params.isCorrect - whether accusation matched the culprit
 * @param {number} params.discoveredClueCount - count of clues discovered
 * @param {number} params.usedHintCount - count of hints used
 * @returns {Object} itemized score breakdown
 */
export function calculateFinalScore({ difficulty, isCorrect, discoveredClueCount = 0, usedHintCount = 0 }) {
  const normalizedDifficulty = (difficulty || 'medium').toLowerCase();
  const maxBasePoints = DIFFICULTY_BASE_POINTS[normalizedDifficulty] ?? 150;
  
  const basePoints = isCorrect ? maxBasePoints : 0;
  const cluePoints = Math.max(0, discoveredClueCount) * POINTS_PER_CLUE;
  const hintPenalty = Math.max(0, usedHintCount) * PENALTY_PER_HINT;
  
  const rawScore = basePoints + cluePoints - hintPenalty;
  const finalScore = Math.max(0, rawScore);

  return {
    difficulty: normalizedDifficulty,
    isCorrect,
    basePoints,
    clueCount: discoveredClueCount,
    cluePoints,
    hintCount: usedHintCount,
    hintPenalty,
    finalScore,
  };
}

