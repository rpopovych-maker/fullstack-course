import { createClient } from '@supabase/supabase-js';
import { IdentityService } from 'src/types/services/IdentityService';
import { IdentityUserSchema } from 'src/types/identity/IdentityUser';

export function getIdentityService(
  url: string,
  serviceRoleKey: string
): IdentityService {
  const supabase = createClient(url, serviceRoleKey);

  return {
    async identify(token: string) {
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        throw new Error(error?.message ?? 'Unable to identify user');
      }

      return IdentityUserSchema.parse({
        subId: data.user.id,
        email: data.user.email
      });
    },

    async createUser(email: string, password: string) {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      })

      if (error) {
        throw new Error(error.message);
      }

      return  IdentityUserSchema.parse({
        subId: data.user?.id,
        email: data.user?.email
      });
    }
  };
}
