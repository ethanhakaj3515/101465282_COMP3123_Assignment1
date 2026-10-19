const { validationResult } = require('express-validator');
module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: result.array().map(({ path, msg }) => ({ field: path, message: msg })) });
  return next();
};
