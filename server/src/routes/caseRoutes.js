import { Router } from 'express';
import { createCase, getCaseById, getCaseResult } from '../controllers/caseController.js';
import { discoverClue } from '../controllers/clueController.js';
import { requestHint } from '../controllers/hintController.js';
import { submitAccusation } from '../controllers/accusationController.js';
import { caseCreationLimiter, standardLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply standard rate limiter to all case routes
router.use(standardLimiter);

// Case generation (stricter rate limiter)
router.post('/', caseCreationLimiter, createCase);

// Retrieve case by ID
router.get('/:id', getCaseById);

// Discover clue
router.post('/:id/clues/:clueId/discover', discoverClue);

// Request hint
router.post('/:id/hints', requestHint);

// Submit accusation
router.post('/:id/accuse', submitAccusation);

// Get finalized result
router.get('/:id/result', getCaseResult);

export default router;

