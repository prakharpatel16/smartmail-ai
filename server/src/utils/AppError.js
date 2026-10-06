export class AppError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }
}

export const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
export const notFound = (req, res, next) => next(new AppError(404, 'RESOURCE_NOT_FOUND', 'The requested resource was not found.'));

export function errorHandler(error, req, res, _next) {
  const isSchemaError = error.name === 'ZodError' || error.name === 'ValidationError';
  const isDuplicate = error.code === 11000;
  const status = Number.isInteger(error.statusCode) ? error.statusCode : isSchemaError ? 400 : isDuplicate ? 409 : error.name === 'CastError' ? 400 : 500;
  const code = error.isOperational && typeof error.code === 'string' ? error.code : (isSchemaError ? 'VALIDATION_ERROR' : isDuplicate ? 'RESOURCE_CONFLICT' : error.name === 'CastError' ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR');
  if (status >= 500) console.error(JSON.stringify({ level: 'error', code, path: req.path, method: req.method, requestId: req.id }));
  const message = status >= 500 && !error.isOperational ? 'Something went wrong. Please try again.' : error.message;
  const details = error.details || (error.name === 'ZodError' ? error.issues.map(({ path, message: issueMessage }) => ({ field: path.join('.'), message: issueMessage })) : undefined);
  if (code === 'AI_RATE_LIMITED' && Number.isInteger(details?.retryAfterSeconds)) res.setHeader('Retry-After', String(details.retryAfterSeconds));
  res.status(status).json({ success: false, error: { code, message, ...(details ? { details } : {}) } });
}
