const { body, param, query } = require('express-validator');
const fields = [
  body('first_name').trim().isLength({ min: 1, max: 80 }),
  body('last_name').trim().isLength({ min: 1, max: 80 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('position').trim().isLength({ min: 1, max: 100 }),
  body('salary').isFloat({ min: 0 }).toFloat(),
  body('date_of_joining').isISO8601().toDate(),
  body('department').trim().isLength({ min: 1, max: 100 })
];
const employeeCreate = fields;
const employeeUpdate = fields.map(rule => rule.optional());
const employeeId = [param('eid').isMongoId().withMessage('Employee ID must be a valid MongoDB ObjectId.')];
const employeeDelete = [query('eid').isMongoId().withMessage('Employee ID must be a valid MongoDB ObjectId.')];
module.exports = { employeeCreate, employeeUpdate, employeeId, employeeDelete };
