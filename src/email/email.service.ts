import { Injectable } from '@nestjs/common';
import * as SES from 'aws-sdk/clients/ses';

@Injectable()
export class EmailService {
  private client: SES;

  constructor() {
    this.client = new SES({
      region: 'sa-east-1',
    });
  }

  send = async (emailRequest: SES.SendEmailRequest): Promise<void> => {
    await this.client.sendEmail(emailRequest).promise();
  };
}
