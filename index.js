require('dotenv').config();
const app = require('./src/app');
const { connectDatabase } = require('./src/config/database');
const logger = require('./src/utils/logger');

const port = Number(process.env.PORT || 3000);
connectDatabase().then(() => app.listen(port, () => logger.info('server.started', { port })))
  .catch(error => { logger.error('server.start_failed', { message: error.message }); process.exit(1); });
