import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFinalScore,
  calculateProgressScore,
  DIFFICULTY_BASE_POINTS,
} from '../src/services/scoringService.js';

describe('Scoring Service', () => {
  describe('calculateProgressScore', () => {
    it('calculates intermediate score accurately', () => {
      // 3 clues (+15), 1 hint (-10) => 5
      assert.equal(calculateProgressScore(3, 1), 5);
    });

    it('enforces 0 minimum floor for progress score', () => {
      // 0 clues (0), 2 hints (-20) => 0
      assert.equal(calculateProgressScore(0, 2), 0);
    });
  });

  describe('calculateFinalScore - Correct Accusations', () => {
    it('calculates Easy difficulty score correctly', () => {
      const result = calculateFinalScore({
        difficulty: 'easy',
        isCorrect: true,
        discoveredClueCount: 5,
        usedHintCount: 1,
      });

      // Easy base: 100 + (5*5 = 25) - (1*10 = 10) = 115
      assert.equal(result.basePoints, 100);
      assert.equal(result.cluePoints, 25);
      assert.equal(result.hintPenalty, 10);
      assert.equal(result.finalScore, 115);
      assert.equal(result.isCorrect, true);
    });

    it('calculates Medium difficulty score correctly', () => {
      const result = calculateFinalScore({
        difficulty: 'medium',
        isCorrect: true,
        discoveredClueCount: 5,
        usedHintCount: 1,
      });

      // Medium base: 150 + 25 - 10 = 165
      assert.equal(result.basePoints, 150);
      assert.equal(result.cluePoints, 25);
      assert.equal(result.hintPenalty, 10);
      assert.equal(result.finalScore, 165);
    });

    it('calculates Hard difficulty score correctly', () => {
      const result = calculateFinalScore({
        difficulty: 'hard',
        isCorrect: true,
        discoveredClueCount: 9,
        usedHintCount: 3,
      });

      // Hard base: 200 + (9*5 = 45) - (3*10 = 30) = 215
      assert.equal(result.basePoints, 200);
      assert.equal(result.cluePoints, 45);
      assert.equal(result.hintPenalty, 30);
      assert.equal(result.finalScore, 215);
    });
  });

  describe('calculateFinalScore - Incorrect Accusations', () => {
    it('awards 0 base points on incorrect accusation', () => {
      const result = calculateFinalScore({
        difficulty: 'hard',
        isCorrect: false,
        discoveredClueCount: 5,
        usedHintCount: 1,
      });

      // Base: 0 + 25 - 10 = 15
      assert.equal(result.basePoints, 0);
      assert.equal(result.cluePoints, 25);
      assert.equal(result.hintPenalty, 10);
      assert.equal(result.finalScore, 15);
    });

    it('strictly clamps final score to 0 and never returns negative numbers', () => {
      const result = calculateFinalScore({
        difficulty: 'easy',
        isCorrect: false,
        discoveredClueCount: 0,
        usedHintCount: 3,
      });

      // Base: 0 + 0 - 30 = -30 => clamped to 0
      assert.equal(result.basePoints, 0);
      assert.equal(result.finalScore, 0);
    });
  });
});

