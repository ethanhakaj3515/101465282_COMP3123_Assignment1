const fs = require('fs');
const path = require('path');

const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
let fileLoggingEnabled = process.env.NODE_ENV !== 'test' && !process.env.VERCEL;
if (fileLoggingEnabled) {
  try { fs.mkdirSync(logDir, { recursive: true }); }
  catch { fileLoggingEnabled = false; }
}

function write(level, event, details = {}) {
  const record = JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...details }) + '\n';
  if (fileLoggingEnabled) {
    try { fs.appendFileSync(path.join(logDir, 'app.log'), record); } catch { /* serverless filesystem may be read-only */ }
  }
  if (level === 'error') console.error(record.trim());
  else if (process.env.NODE_ENV !== 'test') console.log(record.trim());
}

module.exports = {
  info: (event, details) => write('info', event, details),
  warn: (event, details) => write('warn', event, details),
  error: (event, details) => write('error', event, details)
};
