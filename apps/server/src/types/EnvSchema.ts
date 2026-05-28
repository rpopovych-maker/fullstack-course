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
  CLIENT_APP_URL: z.string().url()
});

export type Env = z.infer<typeof EnvSchema>;