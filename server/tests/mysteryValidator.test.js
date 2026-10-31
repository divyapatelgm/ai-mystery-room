import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateMystery } from '../src/services/mysteryValidator.js';

function createSampleMystery(difficulty = 'easy') {
  if (difficulty === 'easy') {
    return {
      title: 'The Missing Manor Clock',
      story: 'A classic antique pendulum clock disappeared from the library during a severe thunderstorm...',
      difficulty: 'easy',
      suspects: [
        {
          id: 'suspect_1',
          name: 'Arthur Blackwood',
          occupation: 'Butler',
          relationship: 'Head of household staff',
          biography: 'Served the family for twenty years without incident.',
          alibi: 'Preparing tea in the basement pantry.',
          portraitDescription: 'A stern older gentleman with silver spectacles.',
          gender: 'male',
        },
        {
          id: 'suspect_2',
          name: 'Clara Oswald',
          occupation: 'Private Tutor',
          relationship: 'Employed by the estate',
          biography: 'Recently took up residency to tutor the estate heirs.',
          alibi: 'Grading French grammar exams in the west wing.',
          portraitDescription: 'A young woman with neat dark hair and ink-stained fingers.',
          gender: 'female',
        },
        {
          id: 'suspect_3',
          name: 'Vincent Vance',
          occupation: 'Antique Appraiser',
          relationship: 'Guest evaluating estate assets',
          biography: 'Known in elite collector circles with mounting debts.',
          alibi: 'Examining silver cutlery in the dining hall.',
          portraitDescription: 'A slick, well-groomed man with velvet lapels.',
          gender: 'male',
        },
      ],
      clues: [
        {
          id: 'clue_1',
          title: 'Velvet Thread on Latch',
          description: 'A crimson fabric fiber caught on the library window latch.',
          details: 'Microscopic inspection matches the bespoke velvet lapels of Vincent Vance.',
          category: 'physical',
          relevance: 'Ties the trespasser directly to Vance clothing.',
        },
        {
          id: 'clue_2',
          title: 'Clock Oil on Towel',
          description: 'Heavy grease residue on a linen napkin.',
          details: 'Spectrometry confirms 19th-century horological oil.',
          category: 'forensic',
          relevance: 'Shows the thief handled the internal clockwork mechanism.',
        },
        {
          id: 'clue_3',
          title: 'Pantry Log Sheet',
          description: 'Arthur Blackwood kitchen duty register.',
          details: 'Shows continuous kitchen presence verified by cook testimony.',
          category: 'document',
          relevance: 'Validates Butler alibi.',
        },
        {
          id: 'clue_4',
          title: 'Tutor Exam Papers',
          description: 'Stack of graded student papers with wet ink timestamps.',
          details: 'Corroborates Clara whereabouts throughout the storm.',
          category: 'document',
          relevance: 'Exonerates Clara Oswald.',
        },
        {
          id: 'clue_5',
          title: 'Appraisal Pawn Catalog',
          description: 'A pocket pamphlet containing antique listings.',
          details: 'Contains a handwritten reserve auction price for the missing clock.',
          category: 'document',
          relevance: 'Proves premeditation and financial motive.',
        },
      ],
      hints: [
        {
          id: 'hint_1',
          text: 'Examine who possessed professional expertise in horology and valuable antiquities.',
        },
        {
          id: 'hint_2',
          text: 'Compare the fiber evidence on the library window with the suspects wardrobe.',
        },
      ],
      solution: {
        culpritId: 'suspect_3',
        explanation: 'Vincent Vance used his appraisal access to unmount the antique clock and escape through the library window...',
        supportingClueIds: ['clue_1', 'clue_5'],
      },
    };
  }

  throw new Error('Unknown sample mystery difficulty');
}

describe('Mystery Validator', () => {
  it('successfully validates a well-formed Easy mystery', () => {
    const raw = createSampleMystery('easy');
    const validated = validateMystery(raw, 'easy');

    assert.equal(validated.title, 'The Missing Manor Clock');
    assert.equal(validated.suspects.length, 3);
    assert.equal(validated.clues.length, 5);
    assert.equal(validated.hints.length, 2);
    assert.equal(validated.solution.culpritId, 'suspect_3');
    // Check positions and avatar index assigned
    assert.ok(validated.clues[0].boardPosition);
    assert.equal(typeof validated.suspects[0].avatarIndex, 'number');
  });

  it('rejects mystery with incorrect suspect count for difficulty', () => {
    const raw = createSampleMystery('easy');
    raw.suspects.pop(); // Remove one suspect (leaving 2 instead of 3)

    assert.throws(() => validateMystery(raw, 'easy'), {
      message: /expects exactly 3 suspects, but got 2/,
    });
  });

  it('rejects mystery with incorrect clue count for difficulty', () => {
    const raw = createSampleMystery('easy');
    raw.clues.pop(); // Remove one clue (leaving 4 instead of 5)

    assert.throws(() => validateMystery(raw, 'easy'), {
      message: /expects exactly 5 clues, but got 4/,
    });
  });

  it('rejects mystery where culpritId does not match any suspect', () => {
    const raw = createSampleMystery('easy');
    raw.solution.culpritId = 'suspect_99_ghost';

    assert.throws(() => validateMystery(raw, 'easy'), {
      message: /culpritId 'suspect_99_ghost' does not match any valid suspect/,
    });
  });

  it('rejects mystery where supportingClueIds references invalid clue', () => {
    const raw = createSampleMystery('easy');
    raw.solution.supportingClueIds = ['clue_1', 'clue_ghost'];

    assert.throws(() => validateMystery(raw, 'easy'), {
      message: /supportingClueId 'clue_ghost' does not match any valid clue/,
    });
  });

  it('rejects mystery with duplicate suspect IDs', () => {
    const raw = createSampleMystery('easy');
    raw.suspects[1].id = raw.suspects[0].id; // duplicate id

    assert.throws(() => validateMystery(raw, 'easy'), {
      message: /Duplicate suspect ID found/,
    });
  });
});

