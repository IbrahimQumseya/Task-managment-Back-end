import * as winston from 'winston';
import 'winston-daily-rotate-file';
// var S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
import * as S3StreamLogger from 's3-streamlogger';

const verboseTransport = {
  filename: 'logs/verbose/verbose-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  level: 'verbose',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

// console.log(s3_stream);

// const s3_stream = new S3StreamLogger.S3StreamLogger({
//   bucket: process.env.AWS_BUCKET_NAME,
//   access_key_id: process.env.AWS_ACCESS_KEY,
//   secret_access_key: process.env.AWS_SECRET_KEY,
//   folder: 'logs/',
//   upload_every: 1000,
// });

// const transportS3Logger = new winston.transports.Stream({
//   stream: s3_stream,
// });

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

const verboseTransports = new winston.transports.DailyRotateFile(
  verboseTransport,
);
const errorTransports = new winston.transports.DailyRotateFile(errorTransport);
const infoTransports = new winston.transports.DailyRotateFile(infoTransport);
const warnTransports = new winston.transports.DailyRotateFile(warnTransport);

export const transports = [
  verboseTransports,
  errorTransports,
  infoTransports,
  warnTransports,
];
export const logger = winston.createLogger({
  transports: [
    verboseTransports,
    errorTransports,
    infoTransports,
    warnTransports,
  ],
});
