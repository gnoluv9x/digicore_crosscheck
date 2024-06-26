import winston from 'winston';
import DailyRotateFile, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import dotenv from 'dotenv';

dotenv.config();

const dailyConfig: DailyRotateFileTransportOptions = {
  filename: 'logs/%DATE%.log',
  datePattern: 'DD-MM-YYYY',
  zippedArchive: true,
};

if (process.env.NODE_ENV !== 'production') {
  dailyConfig.maxSize = '20m';
  dailyConfig.maxFiles = '7d';
}

console.log('Debug_here dailyConfig: ', dailyConfig);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'hh:mm:ss DD-MM-YYYY' }),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console(), new DailyRotateFile(dailyConfig)],
});

export default logger;
