export const validate = (schema, source = 'body') => (req, _res, next) => {
  try {
    const parsed = schema.parse(req[source]);
    req.validated = req.validated || {};
    req.validated[source] = parsed;
    // body is writable, assign directly so existing controllers work
    if (source === 'body') req.body = parsed;
    next();
  } catch (err) {
    next(err);
  }
};
