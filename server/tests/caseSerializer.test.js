import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { serializePublicCase, serializeCaseHistory } from '../src/services/caseSerializer.js';

describe('Case Serializer (Information Barrier Security)', () => {
  const mockActiveCase = {
    _id: '507f1f77bcf86cd799439011',
    caseNumber: 'CR-123456',
    title: 'The Stolen Diamond',
    story: 'A sparkling gem vanished into thin air...',
    difficulty: 'easy',
    status: 'active',
    suspects: [
      { id: 'suspect_1', name: 'Alice', occupation: 'Jeweler', relationship: 'Appraiser', biography: 'Bio', alibi: 'Alibi', portraitDescription: 'Pic' },
      { id: 'suspect_2', name: 'Bob', occupation: 'Guard', relationship: 'Security', biography: 'Bio', alibi: 'Alibi', portraitDescription: 'Pic' },
    ],
    clues: [
      {
        id: 'clue_1',
        title: 'Glass Shards',
        description: 'Broken display glass on carpet',
        details: 'Top secret forensic DNA match to Bob',
        category: 'forensic',
        relevance: 'Shows Bob broke the glass',
        discovered: true,
        discoveredAt: new Date(),
        boardPosition: { x: 10, y: 20, rotation: 0 },
      },
      {
        id: 'clue_2',
        title: 'Security Log',
        description: 'Visitor ledger near vault',
        details: 'Secret timestamp showing Alice entered early',
        category: 'document',
        relevance: 'Alice false alibi',
        discovered: false,
        discoveredAt: null,
        boardPosition: { x: 50, y: 80, rotation: 1 },
      },
    ],
    hints: [
      { id: 'hint_1', text: 'Used hint secret text', used: true, usedAt: new Date() },
      { id: 'hint_2', text: 'Unused hint secret text: Bob had the key!', used: false, usedAt: null },
    ],
    solution: {
      culpritId: 'suspect_2',
      explanation: 'Bob stole the diamond using guard master key.',
      supportingClueIds: ['clue_1'],
    },
    playerProgress: {
      discoveredClueIds: ['clue_1'],
      usedHintIds: ['hint_1'],
      currentScore: 5,
    },
  };

  it('strictly hides solution from active case payload', () => {
    const serialized = serializePublicCase(mockActiveCase);

    assert.equal(serialized.solution, undefined);
    assert.equal(serialized.status, 'active');
  });

  it('redacts details and relevance for undiscovered clues in active cases', () => {
    const serialized = serializePublicCase(mockActiveCase);

    // clue_1 was discovered -> details must be present
    const clue1 = serialized.clues.find(c => c.id === 'clue_1');
    assert.ok(clue1.details);
    assert.equal(clue1.discovered, true);

    // clue_2 was NOT discovered -> details and relevance must be undefined
    const clue2 = serialized.clues.find(c => c.id === 'clue_2');
    assert.equal(clue2.details, undefined);
    assert.equal(clue2.relevance, undefined);
    assert.equal(clue2.discovered, false);
  });

  it('redacts text of unused hints in active cases', () => {
    const serialized = serializePublicCase(mockActiveCase);

    // hint_1 was used -> text is visible
    const hint1 = serialized.hints.find(h => h.id === 'hint_1');
    assert.equal(hint1.text, 'Used hint secret text');
    assert.equal(hint1.used, true);

    // hint_2 was NOT used -> text must be undefined
    const hint2 = serialized.hints.find(h => h.id === 'hint_2');
    assert.equal(hint2.text, undefined);
    assert.equal(hint2.used, false);
  });

  it('reveals complete solution and debrief when case status is completed', () => {
    const mockCompletedCase = {
      ...mockActiveCase,
      status: 'completed',
      accusation: {
        suspectId: 'suspect_2',
        submittedAt: new Date(),
        isCorrect: true,
      },
      result: {
        completed: true,
        basePoints: 100,
        cluePoints: 5,
        hintPenalty: 10,
        finalScore: 95,
      },
    };

    const serialized = serializePublicCase(mockCompletedCase);

    assert.ok(serialized.result);
    assert.equal(serialized.result.isCorrect, true);
    assert.equal(serialized.result.culprit.id, 'suspect_2');
    assert.ok(serialized.result.explanation);
    assert.ok(serialized.result.supportingClues.length > 0);
  });

  it('history serialization never exposes solutions of active cases', () => {
    const historyList = serializeCaseHistory([mockActiveCase]);

    assert.equal(historyList[0].id, '507f1f77bcf86cd799439011');
    assert.equal(historyList[0].solution, undefined);
    assert.equal(historyList[0].isCorrect, null);
  });
});

