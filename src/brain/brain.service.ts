import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as braintree from 'braintree';

@Injectable()
export class BrainService {
  private brainTree: braintree.BraintreeGateway;
  public constructor(private configService: ConfigService) {
    this.brainTree = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: configService.get('MERCHANT_ID'),
      publicKey: configService.get('BRAIN_TREE_PUBLIC_KEY'),
      privateKey: configService.get('BRAIN_TREE_PRIVATE_KEY'),
    });
  }

  async createCustomer(name: string, email: string) {
    return this.brainTree.customer.create({
      email,
      firstName: name,
    });
  }

  async generateToken(customerId: string): Promise<{ clientToken: string }> {
    try {
      const tokenBrainTree = await this.brainTree.clientToken.generate({
        customerId,
      });
      const { clientToken } = tokenBrainTree;
      return { clientToken };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async charge(amount: string, paymentMethodNonce: string, customerId: string) {
    try {
      await this.brainTree.transaction.sale({
        amount,
        customerId,
        //   customer: customerId,
        paymentMethodNonce: paymentMethodNonce,
        options: {
          submitForSettlement: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
