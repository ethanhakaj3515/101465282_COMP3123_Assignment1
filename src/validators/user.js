const { body } = require('express-validator');
const userRegistration = [
  body('username').trim().isLength({ min: 3, max: 40 }).withMessage('Username must be 3–40 characters.'),
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').isString().isLength({ min: 8, max: 128 }).withMessage('Password must be at least 8 characters.')
];
const login = [
  body().custom(value => (value.username || value.email) && value.password).withMessage('Username or email and password are required.'),
  body('username').optional().trim().isLength({ min: 3, max: 40 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 1, max: 128 })
];
module.exports = { userRegistration, login };
