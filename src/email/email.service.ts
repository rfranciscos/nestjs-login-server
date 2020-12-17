import { Injectable } from '@nestjs/common';
import SES from 'aws-sdk/clients/ses';

@Injectable()
export class EmailService {
  private client: SES;

  constructor() {
    this.client = new SES();
  }

  send = async (emailRequest: SES.SendEmailRequest): Promise<void> => {
    await this.client.sendEmail(emailRequest).promise();
  };
}
