import * as S3StreamLogger from 's3-streamlogger';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export class LoggerService {
  //   constructor(private configService: ConfigService) {}

  //   private static configService: ConfigService = new ConfigService();
  //   private static s3_stream = new S3StreamLogger.S3StreamLogger({
  //     bucket: LoggerService.configService.get('AWS_BUCKET_NAME'),
  //     access_key_id: LoggerService.configService.get('AWS_ACCESS_KEY'),
  //     secret_access_key: LoggerService.configService.get('AWS_SECRET_KEY'),
  //     folder: 'logs/',
  //     upload_every: 1000,
  //   });

  static {
    console.log(process.env);
    // console.log(LoggerService.configService.get('AWS_BUCKET_NAME'));
  }
  static s3_stream = new S3StreamLogger.S3StreamLogger({
    bucket: process.env.AWS_BUCKET_NAME,
    access_key_id: process.env.AWS_ACCESS_KEY,
    secret_access_key: process.env.AWS_SECRET_KEY,
    folder: 'logs/',
    upload_every: 1000,
    tags: { type: 'error', project: 'myproject' },
  });

  static verboseTransport = {
    filename: 'logs/verbose/verbose-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    level: 'verbose',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };

  static errorTransport = {
    filename: 'logs/error/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    level: 'error',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };

  static infoTransport = {
    filename: 'logs/info/info-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    level: 'info',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };
  static warnTransport = {
    filename: 'logs/warn/warn-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    level: 'warn',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };

  static verboseTransports = new winston.transports.DailyRotateFile(
    LoggerService.verboseTransport,
  );
  static errorTransports = new winston.transports.DailyRotateFile(
    this.errorTransport,
  );
  static infoTransports = new winston.transports.DailyRotateFile(
    LoggerService.infoTransport,
  );
  static warnTransports = new winston.transports.DailyRotateFile(
    LoggerService.warnTransport,
  );

  static transportS3Logger = new winston.transports.Stream({
    stream: this.s3_stream,
  });

  static logger = winston.createLogger({
    transports: [
      LoggerService.verboseTransports,
      LoggerService.errorTransports,
      LoggerService.infoTransports,
      LoggerService.warnTransports,
      LoggerService.transportS3Logger,
    ],
  });
}
