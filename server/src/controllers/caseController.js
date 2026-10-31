import { Case } from '../models/Case.js';
import { generateMysteryFromGemini } from '../services/geminiService.js';
import { serializePublicCase } from '../services/caseSerializer.js';
import { CreateCaseSchema } from '../validators/caseValidator.js';

export async function createCase(req, res, next) {
  try {
    const validatedBody = CreateCaseSchema.parse(req.body);
    const { premise, difficulty } = validatedBody;

    console.log(`[CaseController] Creating new case for guest: ${req.guestId}`);

    // Call Gemini with validation and retries
    const mystery = await generateMysteryFromGemini({ premise, difficulty });

    // Generate unique random case number CR-XXXXXX
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const caseNumber = `CR-${randomNum}`;

    const newCase = new Case({
      caseNumber,
      ownerId: req.guestId,
      title: mystery.title,
      story: mystery.story,
      premise: premise || 'A high-stakes crime of cunning and deception.',
      difficulty: mystery.difficulty,
      status: 'active',
      suspects: mystery.suspects,
      clues: mystery.clues,
      hints: mystery.hints,
      solution: mystery.solution,
      playerProgress: {
        discoveredClueIds: [],
        usedHintIds: [],
        currentScore: 0,
      },
    });

    await newCase.save();
    console.log(`[CaseController] Case ${caseNumber} (${newCase._id}) saved successfully.`);

    return res.status(201).json({
      success: true,
      case: serializePublicCase(newCase),
    });
  } catch (err) {
    next(err);
  }
}

export async function getCaseById(req, res, next) {
  try {
    const { id } = req.params;
    const caseDoc = await Case.findById(id);

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case file not found in detective archives.',
        code: 'CASE_NOT_FOUND',
      });
    }

    if (caseDoc.ownerId !== req.guestId) {
      return res.status(403).json({
        success: false,
        message: 'Classified: You do not have investigative authority over this case.',
        code: 'UNAUTHORIZED_CASE_ACCESS',
      });
    }

    return res.status(200).json({
      success: true,
      case: serializePublicCase(caseDoc),
    });
  } catch (err) {
    next(err);
  }
}

export async function getCaseResult(req, res, next) {
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
        message: 'Classified: You do not have investigative authority over this case.',
        code: 'UNAUTHORIZED_CASE_ACCESS',
      });
    }

    if (caseDoc.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Investigation is still active. Submit an official accusation to unseal the final debrief.',
        code: 'CASE_STILL_ACTIVE',
      });
    }

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
