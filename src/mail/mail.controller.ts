import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/users.respository';
import { UsersService } from '../users/users.service';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(
    private mailService: MailService,
    private userService: UsersService,
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
  ) {}

  @Get('/forgot-password/:email')
  async sendEmail(@Param('email') email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new NotFoundException();
    return this.mailService.sendEmail(user);
  }
}
