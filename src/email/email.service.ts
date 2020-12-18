import { Injectable } from '@nestjs/common';
import SES from 'aws-sdk/clients/ses';

@Injectable()
export class EmailService {
  send = async (emailRequest: SES.SendEmailRequest): Promise<void> => {
    const client = new SES();
    await client.sendEmail(emailRequest).promise();
  };
}
