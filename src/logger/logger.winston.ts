import * as winston from 'winston';
import 'winston-daily-rotate-file';

const verboseTransport = {
  filename: 'logs/verbose/verbose-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  level: 'verbose',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

const errorTransport = {
  filename: 'logs/error/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  level: 'error',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

const infoTransport = {
  filename: 'logs/info/info-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  level: 'info',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};
const warnTransport = {
  filename: 'logs/warn/warn-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  level: 'warn',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

const verbosetransports = new winston.transports.DailyRotateFile(
  verboseTransport,
);
const errortransports = new winston.transports.DailyRotateFile(errorTransport);
const infoTransports = new winston.transports.DailyRotateFile(infoTransport);
const warntransports = new winston.transports.DailyRotateFile(warnTransport);

export const logger = winston.createLogger({
  transports: [
    verbosetransports,
    errortransports,
    infoTransports,
    warntransports,
  ],
});
