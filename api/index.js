const app = require('../src/app');
const { connectDatabase } = require('../src/config/database');

let connection;
module.exports = async (req, res) => {
  try {
    connection ||= connectDatabase();
    await connection;
    return app(req, res);
  } catch (error) {
    return res.status(503).json({ error: 'Database unavailable', message: 'The service is temporarily unavailable.' });
  }
};
