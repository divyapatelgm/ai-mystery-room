import crypto from 'crypto';

const GUEST_COOKIE_NAME = 'agy_guest_id';
const COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function guestAuthMiddleware(req, res, next) {
  let guestId = req.signedCookies?.[GUEST_COOKIE_NAME];

  // If no valid signed cookie exists, generate a new cryptographically secure UUID
  if (!guestId || typeof guestId !== 'string' || guestId.trim().length === 0) {
    guestId = crypto.randomUUID();

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(GUEST_COOKIE_NAME, guestId, {
      maxAge: COOKIE_MAX_AGE_MS,
      httpOnly: true,
      signed: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
  }

  req.guestId = guestId;
  next();
}
