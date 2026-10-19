const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

module.exports = asyncHandler(async (req, res, next) => {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Authentication required' });
  if (!process.env.JWT_SECRET) return res.status(500).json({ error: 'Server configuration error' });
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid authentication token' });
  }
  const user = await User.findById(payload.sub);
  if (!user) return res.status(401).json({ error: 'Invalid authentication token' });
  req.user = user;
  return next();
});
