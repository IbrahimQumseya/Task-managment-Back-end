import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as S3StreamLogger from 's3-streamlogger';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
  constructor(private readonly configService: ConfigService) {}

  private s3_stream = new S3StreamLogger.S3StreamLogger({
    bucket: this.configService.get('AWS_BUCKET_NAME'),
    access_key_id: this.configService.get('AWS_ACCESS_KEY'),
    secret_access_key: this.configService.get('AWS_SECRET_KEY'),
    folder: 'logs/',
    upload_every: 1000,
  });

  private verboseTransport = {
    filename: 'logs/verbose/verbose-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    level: 'verbose',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };

  // private s3_stream = new S3StreamLogger.S3StreamLogger({
  //   bucket: process.env.AWS_BUCKET_NAME,
  //   access_key_id: process.env.AWS_ACCESS_KEY,
  //   secret_access_key: process.env.AWS_SECRET_KEY,
  //   folder: 'logs/',
  //   upload_every: 1000,
  // });

  // private transportS3Logger = new winston.transports.Stream({
  //   stream: s3_stream,
  // });

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
