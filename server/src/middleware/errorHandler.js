export function errorHandler(err, req, res, next) {
  console.error('[API Error]', {
    method: req.method,
    path: req.path,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: err.errors?.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') || 'Validation error',
      code: 'VALIDATION_ERROR',
    });
  }

  // Handle CastError from Mongoose (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid identifier format.',
      code: 'INVALID_ID_FORMAT',
    });
  }

  const statusCode = err.statusCode || (err.status && typeof err.status === 'number' ? err.status : 500);
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.isPublic ? err.message : (statusCode === 500 ? 'An unexpected detective agency server error occurred.' : err.message);

  res.status(statusCode).json({
    success: false,
    message,
    code,
  });
}
