import { z } from 'zod';

// DONT USE transform here
// because we are not overwriting process.env
export const EnvSchema = z.object({
  TZ: z.string().optional(),
  NODE_ENV: z.enum(['local', 'staging', 'production']),
  PORT: z.string(),
  HOST: z.string(),
  DATABASE_URL: z.string().url(),
  SWAGGER_USER: z.string(),
  SWAGGER_PWD: z.string().min(10),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SECRET_KEY: z.string(),
  CLIENT_APP_URL: z.string().url(),
  RESEND_API_KEY: z.string(),
  SIGNATURE_SECRET: z.string(),
  SENDER_EMAIL: z.string().email(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_PRO_PRICE_ID: z.string().startsWith('price_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_')
});

export type Env = z.infer<typeof EnvSchema>;