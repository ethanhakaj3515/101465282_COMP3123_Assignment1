const logger = require('../utils/logger');
module.exports = (req, res, next) => {
  const started = Date.now();
  res.on('finish', () => logger.info('http.request', { method: req.method, path: req.path, status: res.statusCode, durationMs: Date.now() - started }));
  next();
};
