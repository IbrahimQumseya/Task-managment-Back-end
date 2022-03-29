const winston = require('winston')
const CloudWatchTransport = require('winston-aws-cloudwatch')
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

const verboseTransports = new winston.transports.DailyRotateFile(
  verboseTransport,
);
const errorTransports = new winston.transports.DailyRotateFile(errorTransport);
const infoTransports = new winston.transports.DailyRotateFile(infoTransport);
const warnTransports = new winston.transports.DailyRotateFile(warnTransport);

const logger = winston.createLogger({
  transports: [
    new CloudWatchTransport({
      logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
      logStreamName: `${process.env.CLOUDWATCH_GROUP_NAME}-${process.env.NODE_ENV}`,
      createLogGroup: true,
      createLogStream: true,
      submissionInterval: 2000,
      submissionRetryCount: 1,
      batchSize: 20,
      awsConfig: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_BUCKET_REGION,
      },
      formatLog: (item) =>
        `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`,
    }),
    verboseTransports,
    errorTransports,
    infoTransports,
    warnTransports,
  ],
});

const cloudwatchConfig = {
  logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
  logStreamName: `${process.env.CLOUDWATCH_GROUP_NAME}-${process.env.NODE_ENV}`,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY,
  awsSecretKey: process.env.AWS_SECRET_KEY,
  awsRegion: process.env.AWS_BUCKET_REGION,
  messageFormatter: ({ level, message, additionalInfo }) =>
    `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(
      additionalInfo,
    )}}`,
};

export { logger };
