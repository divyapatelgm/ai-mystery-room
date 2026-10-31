import rateLimit from 'express-rate-limit';

// Standard rate limiter for general game operations (clue discovery, inspection)
export const standardLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down your investigation.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

// Stricter rate limiter for mystery creation to prevent API flooding
export const caseCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 new cases per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Case creation limit reached. Please investigate your existing cases or try again later.',
    code: 'CASE_CREATION_RATE_LIMIT',
  },
});
