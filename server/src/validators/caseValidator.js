import { z } from 'zod';

export const CreateCaseSchema = z.object({
  premise: z.string().max(600).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

export const AccusationSchema = z.object({
  suspectId: z.string().min(1, 'A suspect must be chosen for the accusation.'),
});

