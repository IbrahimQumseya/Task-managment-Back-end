import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from './logger.service';
import { transports } from './logger.winston';

@Module({
  providers: [LoggerService],
})
export class LoggerModule {}
