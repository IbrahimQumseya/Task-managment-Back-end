import { Module } from '@nestjs/common';
import * as braintree from 'braintree';
import { BrainService } from './brain.service';
import { BrainController } from './brain.controller';

console.log(process.env);

@Module({
  providers: [BrainService],
  controllers: [BrainController],
})
export class BrainModule {}
