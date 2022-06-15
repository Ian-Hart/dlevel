require('dotenv').config(); 
const winston = require('winston');
require('winston-daily-rotate-file');

const log_filepath = process.env.NODE_ENV==='production' ? process.env.LOGS : process.env.LOGS_TEST;

const transport = new winston.transports.DailyRotateFile({
  filename: log_filepath,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '1d'
});

transport.on('rotate', function (oldFilename, newFilename) {
  logger.info('Log files rotated:');
});

const logConfiguration = {
  transports: transport,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'MM-DD-YY HH:mm:ss'
    }),
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.prettyPrint(),
    winston.format.printf(info => `${info.level}: ${[info.timestamp]}: log: ${info.message}`),
  )
};

const logger = winston.createLogger(logConfiguration);

function msg(message) { 
  if (message.error === null || message.error === undefined)
    logger.info(JSON.stringify(message));
  else 
    logger.error(JSON.stringify(message));
}

module.exports.msg = msg;
