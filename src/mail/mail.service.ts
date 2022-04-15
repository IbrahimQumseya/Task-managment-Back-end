import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mailgun from 'mailgun-js';
import * as fs from 'fs';
import path from 'path';
import { User } from '../auth/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ForgetPasswordStrategy } from './token-service/ForgetPassword.strategy';
import { ResetPasswordDto } from './password-dto/reset-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/users.respository';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private mg = mailgun({
    apiKey: this.configService.get('MAIL_GUN_API'),
    domain: this.configService.get('MAIL_GUN_DOMAIN'),
  });

  async sendEmail(user: User) {
    const link = `${process.env.BACKEND_URL}/auth/reset-password/`;
    const payload: ResetPasswordDto = { email: user.email };
    const token: string = this.jwtService.sign(payload);
    if (!token) return;
    try {
      this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ resetPasswordToken: token })
        .where('id=:id', { id: user.id })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException();
    }
    const data: mailgun.messages.SendData = {
      from: 'ibrahim-qum@hotmail.com',
      to: user.email,
      subject: 'hello',
      html: `
        <html>
            <head>
                <style>
                </style>
            </head>
            <body>
                <p>Hi ${user.username},</p>
                <p>You requested to reset your password.</p>
                <p> Please, click the link below to reset your password</p>
                <a href="${link}${token}">Reset Password</a>
            </body>
        </html>`,
    };
    try {
      return this.mg.messages().send(data);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
