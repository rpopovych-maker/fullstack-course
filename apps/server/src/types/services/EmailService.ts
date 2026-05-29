import type { CreateEmailOptions } from 'resend';

export interface EmailService {
  send(options: CreateEmailOptions): Promise<void>
}
