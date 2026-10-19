require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const users = require('./routes/users');
const employees = require('./routes/employees');
const requestLogger = require('./middleware/requestLogger');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(requestLogger);
app.use(morgan('tiny', { stream: { write: () => {} } }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/v1/user', users);
app.use('/api/v1/emp', employees);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
