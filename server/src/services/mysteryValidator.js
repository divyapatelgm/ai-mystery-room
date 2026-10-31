import { z } from 'zod';

export const DIFFICULTY_CONSTRAINTS = {
  easy: { suspects: 3, clues: 5, hints: 2 },
  medium: { suspects: 4, clues: 7, hints: 3 },
  hard: { suspects: 5, clues: 9, hints: 3 },
};

// Zod Schema for Suspect
const SuspectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  occupation: z.string().min(2),
  relationship: z.string().min(3),
  biography: z.string().min(10),
  alibi: z.string().min(5),
  portraitDescription: z.string().min(5),
  gender: z.enum(['male', 'female', 'neutral']).default('neutral'),
});

// Zod Schema for Clue
const ClueSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(5),
  details: z.string().min(10),
  category: z.enum(['physical', 'testimony', 'document', 'forensic']),
  relevance: z.string().min(5),
});

// Zod Schema for Hint
const HintSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(10),
});

// Zod Schema for Solution
const SolutionSchema = z.object({
  culpritId: z.string().min(1),
  explanation: z.string().min(20),
  supportingClueIds: z.array(z.string()).min(2),
});

// Full Mystery Schema
export const RawMysterySchema = z.object({
  title: z.string().min(3).max(120),
  story: z.string().min(30),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  suspects: z.array(SuspectSchema),
  clues: z.array(ClueSchema),
  hints: z.array(HintSchema),
  solution: SolutionSchema,
});

/**
 * Validates the raw parsed AI mystery payload for structural and logical consistency.
 * Throws an Error with detailed message if validation fails.
 * 
 * @param {any} data - Raw parsed JSON from Gemini
 * @param {string} requestedDifficulty - Expected difficulty level
 * @returns {Object} Validated and formatted mystery data
 */
export function validateMystery(data, requestedDifficulty = 'medium') {
  const normDifficulty = (requestedDifficulty || 'medium').toLowerCase();
  const constraints = DIFFICULTY_CONSTRAINTS[normDifficulty];

  if (!constraints) {
    throw new Error(`Invalid difficulty level: ${requestedDifficulty}`);
  }

  // 1. Zod structural validation
  const parsed = RawMysterySchema.parse(data);

  // 2. Difficulty item count constraints
  if (parsed.suspects.length !== constraints.suspects) {
    throw new Error(
      `Difficulty '${normDifficulty}' expects exactly ${constraints.suspects} suspects, but got ${parsed.suspects.length}`
    );
  }

  if (parsed.clues.length !== constraints.clues) {
    throw new Error(
      `Difficulty '${normDifficulty}' expects exactly ${constraints.clues} clues, but got ${parsed.clues.length}`
    );
  }

  if (parsed.hints.length !== constraints.hints) {
    throw new Error(
      `Difficulty '${normDifficulty}' expects exactly ${constraints.hints} hints, but got ${parsed.hints.length}`
    );
  }

  // 3. Unique ID validations
  const suspectIds = new Set();
  for (const s of parsed.suspects) {
    if (suspectIds.has(s.id)) {
      throw new Error(`Duplicate suspect ID found: ${s.id}`);
    }
    suspectIds.add(s.id);
  }

  const clueIds = new Set();
  for (const c of parsed.clues) {
    if (clueIds.has(c.id)) {
      throw new Error(`Duplicate clue ID found: ${c.id}`);
    }
    clueIds.add(c.id);
  }

  const hintIds = new Set();
  for (const h of parsed.hints) {
    if (hintIds.has(h.id)) {
      throw new Error(`Duplicate hint ID found: ${h.id}`);
    }
    hintIds.add(h.id);
  }

  // 4. Logical consistency: Culprit ID must exist in suspects
  if (!suspectIds.has(parsed.solution.culpritId)) {
    throw new Error(
      `Solution culpritId '${parsed.solution.culpritId}' does not match any valid suspect`
    );
  }

  // 5. Logical consistency: Supporting clues must exist in clues
  for (const suppId of parsed.solution.supportingClueIds) {
    if (!clueIds.has(suppId)) {
      throw new Error(
        `Solution supportingClueId '${suppId}' does not match any valid clue`
      );
    }
  }

  // 6. Assign corkboard layout positions
  const cluesWithPositions = parsed.clues.map((clue, index) => {
    // Generate pleasant corkboard grid coordinates with slight natural offsets
    const col = index % 3;
    const row = Math.floor(index / 3);
    const baseX = 40 + col * 280;
    const baseY = 30 + row * 220;
    // Slight deterministic pseudo-random tilt
    const rot = ((index * 7) % 7) - 3; // -3deg to +3deg

    return {
      ...clue,
      discovered: false,
      discoveredAt: null,
      boardPosition: {
        x: baseX,
        y: baseY,
        rotation: rot,
      },
    };
  });

  // Assign avatarIndex to suspects
  const suspectsWithAvatars = parsed.suspects.map((suspect, idx) => ({
    ...suspect,
    avatarIndex: idx % 8,
  }));

  return {
    ...parsed,
    difficulty: normDifficulty,
    suspects: suspectsWithAvatars,
    clues: cluesWithPositions,
    hints: parsed.hints.map(h => ({
      ...h,
      used: false,
      usedAt: null,
    })),
  };
}

