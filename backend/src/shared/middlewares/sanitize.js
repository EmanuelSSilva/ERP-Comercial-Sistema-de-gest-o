import { sanitizeObject } from '../utils/sanitize.js';

export function sanitizeInput(req, _res, next) {
  if (req.body) req.body = sanitizeObject(req.body);
  next();
}
