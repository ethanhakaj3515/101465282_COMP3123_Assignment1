const express = require('express');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const { userRegistration, login } = require('../validators/user');
const logger = require('../utils/logger');

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many authentication attempts. Try again later.' } });

router.post('/signup', authLimiter, userRegistration, validate, asyncHandler(async (req, res) => {
  const username = req.body.username.trim();
  const email = req.body.email.toLowerCase();
  if (await User.exists({ $or: [{ username }, { email }] })) return res.status(409).json({ error: 'Username or email is already registered' });
  const user = await User.create({ username, email, password: req.body.password });
  logger.info('user.registered', { userId: user.id });
  return res.status(201).json({ user });
}));

router.post('/login', authLimiter, login, validate, asyncHandler(async (req, res) => {
  const identifier = req.body.username ? { username: req.body.username.trim() } : { email: req.body.email.toLowerCase() };
  const user = await User.findOne(identifier).select('+password');
  const valid = user ? await user.verifyPassword(req.body.password) : await bcrypt.compare(req.body.password, '$2a$12$C6UzMDM.H6dfI/f/IKcEe.0k2s6bZK9x8U1fdg3Y1y9v1M5Z1f9G2');
  if (!user || !valid) { logger.warn('auth.failed', { identifierType: req.body.username ? 'username' : 'email' }); return res.status(401).json({ error: 'Invalid credentials' }); }
  if (!process.env.JWT_SECRET) throw Object.assign(new Error('Server configuration error'), { statusCode: 500 });
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
  logger.info('auth.succeeded', { userId: user.id });
  return res.status(200).json({ token, token_type: 'Bearer', expires_in: process.env.JWT_EXPIRES_IN || '1h', user: user.toJSON() });
}));

module.exports = router;
