export function sanitizeObject(input) {
  if (!input || typeof input !== 'object') return input;

  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      if (typeof value === 'string') {
        return [key, value.trim().replace(/[<>]/g, '')];
      }

      if (Array.isArray(value)) {
        return [key, value.map((item) => sanitizeObject(item))];
      }

      if (value && typeof value === 'object') {
        return [key, sanitizeObject(value)];
      }

      return [key, value];
    })
  );
}
