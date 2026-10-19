const logger = require('../utils/logger');
function notFound(_req, res) { res.status(404).json({ error: 'Route not found' }); }
function errorHandler(err, _req, res, _next) {
  logger.error('request.failed', { name: err.name, message: err.message });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON body' });
  if (err.name === 'ValidationError') return res.status(400).json({ error: 'Validation failed', details: Object.values(err.errors).map(e => e.message) });
  if (err.code === 11000) return res.status(409).json({ error: 'A record with that value already exists' });
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid identifier' });
  return res.status(err.statusCode || 500).json({ error: err.statusCode ? err.message : 'Internal server error' });
}
module.exports = { notFound, errorHandler };
