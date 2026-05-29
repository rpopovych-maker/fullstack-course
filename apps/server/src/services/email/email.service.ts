import { Resend } from 'resend';
import { HttpError } from 'src/api/errors/HttpError';
import { EmailService } from 'src/types/services/EmailService';

export function getEmailService(): EmailService {

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  return {
    async send(options) {
      const { error } = await resend.emails.send(options);

      if (error) {
        throw new HttpError(error.statusCode ?? 400, error.message, error);
      }
    }
  };
}