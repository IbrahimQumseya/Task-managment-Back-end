import * as S3StreamLogger from 's3-streamlogger';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as dotenv from 'dotenv';
dotenv.config();
console.log(process.env);

export default class LoggerService {
  // constructor(private configService: ConfigService) {}

  // static configService: ConfigService = new ConfigService();
  // static s3_stream = new S3StreamLogger.S3StreamLogger({
  //   bucket: LoggerService.configService.get('AWS_BUCKET_NAME'),
  //   access_key_id: LoggerService.configService.get('AWS_ACCESS_KEY'),
  //   secret_access_key: LoggerService.configService.get('AWS_SECRET_KEY'),
  //   folder: 'logs/',
  //   upload_every: 1000,
  // });

  private s3_stream = new S3StreamLogger.S3StreamLogger({
    bucket: process.env.AWS_BUCKET_NAME,
    access_key_id: process.env.AWS_ACCESS_KEY,
    secret_access_key: process.env.AWS_SECRET_KEY,
    folder: 'logs/',
    upload_every: 1000,
    // tags: { type: 'error', project: 'myproject' },
  });
  // private s3_stream = new S3StreamLogger.S3StreamLogger({
  //   bucket: 'nestjs-task-management-back-end',
  //   access_key_id: 'AKIAZL2JLEVH6MLUTYPO',
  //   secret_access_key: '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',
  //   folder: 'logs/',
  //   upload_every: 2000,
  //   tags: { type: 'error', project: 'myproject' },
  // });

  private verboseTransport = {
    filename: 'logs/verbose/verbose-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    level: 'verbose',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };

  private errorTransport = {
    filename: 'logs/error/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    level: 'error',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };

  private infoTransport = {
    filename: 'logs/info/info-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    level: 'info',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };
  private warnTransport = {
    filename: 'logs/warn/warn-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    level: 'warn',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };

  private verboseTransports = new winston.transports.DailyRotateFile(
    this.verboseTransport,
  );
  private errorTransports = new winston.transports.DailyRotateFile(
    this.errorTransport,
  );
  private infoTransports = new winston.transports.DailyRotateFile(
    this.infoTransport,
  );
  private warnTransports = new winston.transports.DailyRotateFile(
    this.warnTransport,
  );

  private transportS3Logger = new winston.transports.Stream({
    stream: this.s3_stream,
  });

  public logger = winston.createLogger({
    transports: [
      this.verboseTransports,
      this.errorTransports,
      this.infoTransports,
      this.warnTransports,
      this.transportS3Logger,
    ],
  });
}
const logger = new LoggerService();
// export default logger;
