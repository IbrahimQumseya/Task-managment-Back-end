import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateChargeDto } from './dto/CreateCharge.Dto';
import { StripeService } from './stripe.service';

@UseGuards(AuthGuard('jwt'))
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/charge')
  async createCharge(@Body() charge: CreateChargeDto, @GetUser() user: User) {
    const { amount, paymentMethodId } = charge;
    console.log(charge, user);

    await this.stripeService.charge(
      +amount,
      paymentMethodId,
      user.stripeCustomerId,
    );
  }
}
