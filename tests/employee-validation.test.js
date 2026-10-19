const express = require('express');
const request = require('supertest');
const { employeeCreate, employeeUpdate } = require('../src/validators/employee');
const validate = require('../src/middleware/validate');
const app = express();
app.use(express.json());
app.post('/employees', employeeCreate, validate, (_req, res) => res.sendStatus(201));
app.patch('/employees', employeeUpdate, validate, (_req, res) => res.sendStatus(204));

const valid = { first_name: 'Sample', last_name: 'Employee', email: 'sample@example.test', position: 'Developer', salary: 60000, date_of_joining: '2026-10-18', department: 'Engineering' };

test.each(Object.keys(valid))('creation requires %s even after update validators are built', async field => {
  const body = { ...valid };
  delete body[field];
  await request(app).post('/employees').send(body).expect(400);
});

test('creation accepts all valid required fields', async () => {
  await request(app).post('/employees').send(valid).expect(201);
});

test('partial updates do not require unrelated fields', async () => {
  await request(app).patch('/employees').send({ salary: 65000 }).expect(204);
});

test('partial updates still validate supplied fields', async () => {
  await request(app).patch('/employees').send({ salary: -1 }).expect(400);
});
