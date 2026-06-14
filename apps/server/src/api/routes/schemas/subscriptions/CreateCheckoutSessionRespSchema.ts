import { z } from 'zod';

export const CreateCheckoutSessionRespSchema = z.object({
  url: z.string().url()
});