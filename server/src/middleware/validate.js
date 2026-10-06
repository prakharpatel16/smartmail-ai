import { AppError } from '../utils/AppError.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!result.success) {
    const details = result.error.issues.map(({ path, message }) => ({ field: path.join('.'), message }));
    return next(new AppError(400, 'VALIDATION_ERROR', 'Invalid request data.', details));
  }
  req.validated = result.data;
  next();
};

export const validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map(({ path, message }) => ({ field: path.join('.'), message }));
    return next(new AppError(400, 'VALIDATION_ERROR', 'Invalid request data.', details));
  }
  req.validatedBody = result.data;
  next();
};

export function validateObjectId(req, _res, next) {
  if (req.params.id && !/^[a-f\d]{24}$/i.test(req.params.id)) return next(new AppError(400, 'VALIDATION_ERROR', 'Invalid resource identifier.'));
  next();
}
