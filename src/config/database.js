const mongoose = require('mongoose');
const logger = require('../utils/logger');

async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) throw new Error('MONGODB_URI is required');
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  await mongoose.connect(uri, { dbName: 'comp3123_assignment1' });
  logger.info('database.connected');
  return mongoose.connection;
}

module.exports = { connectDatabase };
