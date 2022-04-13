import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateChargeDto } from '../stripe/dto/CreateCharge.Dto';
import { BrainService } from './brain.service';

@UseGuards(AuthGuard('jwt'))
@Controller('brain')
export class BrainController {
  constructor(private readonly brainTreeService: BrainService) {}

  @Post('/charge')
  async createCharge(@Body() charge: CreateChargeDto, @GetUser() user: User) {
    const { amount, paymentMethodId } = charge;
    console.log(charge, user);

    const transaction = await this.brainTreeService.charge(
      amount,
      paymentMethodId,
      user.brainTreeCustomerId,
    );
    // return transaction;
  }

  @Get('/token')
  async getTokenBrainTree(
    @GetUser() user: User,
  ): Promise<{ clientToken: string }> {
    const { brainTreeCustomerId } = user;
    return this.brainTreeService.generateToken(brainTreeCustomerId);
  }
}
