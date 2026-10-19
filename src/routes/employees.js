const express = require('express');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const authenticate = require('../middleware/authenticate');
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const { employeeCreate, employeeUpdate, employeeId, employeeDelete } = require('../validators/employee');

const router = express.Router();
router.use(authenticate);

router.get('/employees', asyncHandler(async (req, res) => {
  const employees = await Employee.find({ user: req.user.id }).sort({ created_at: -1 });
  return res.status(200).json({ employees });
}));
router.post('/employees', employeeCreate, validate, asyncHandler(async (req, res) => {
  const employee = await Employee.create({ ...req.body, user: req.user.id });
  return res.status(201).json({ employee });
}));
router.get('/employees/:eid', employeeId, validate, asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.eid, user: req.user.id });
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  return res.status(200).json({ employee });
}));
router.put('/employees/:eid', employeeId, employeeUpdate, validate, asyncHandler(async (req, res) => {
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => ['first_name', 'last_name', 'email', 'position', 'salary', 'date_of_joining', 'department'].includes(key)));
  const employee = await Employee.findOneAndUpdate({ _id: req.params.eid, user: req.user.id }, updates, { new: true, runValidators: true });
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  return res.status(200).json({ employee });
}));
router.delete('/employees', employeeDelete, validate, asyncHandler(async (req, res) => {
  const result = await Employee.deleteOne({ _id: req.query.eid, user: req.user.id });
  if (!result.deletedCount) return res.status(404).json({ error: 'Employee not found' });
  return res.status(204).end();
}));

module.exports = router;
