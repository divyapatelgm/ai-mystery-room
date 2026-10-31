import { Router } from 'express';
import { getCaseHistory } from '../controllers/historyController.js';
import { standardLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(standardLimiter);

router.get('/', getCaseHistory);

export default router;
