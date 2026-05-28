import { createClient } from '@supabase/supabase-js';
import { IdentityService } from 'src/types/services/IdentityService';
import { IdentityUserSchema } from 'src/types/identity/IdentityUser';

export function getIdentityService(
  url: string,
  serviceRoleKey: string
): IdentityService {
  const supabase = createClient(url, serviceRoleKey);

  return {
    async identify(token) {
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        throw new Error(error?.message ?? 'Unable to identify user');
      }

      return IdentityUserSchema.parse({
        subId: data.user.id,
        email: data.user.email
      });
    },

    async inviteUser(email) {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.CLIENT_APP_URL}/sign-up/invite`
      });

      if (error) {
        throw new Error(error.message);
      }

      return IdentityUserSchema.parse({
        subId: data.user.id,
        email: data.user.email
      });
    },

    async createUser(email, password) {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (error) {
        throw new Error(error.message);
      }

      return IdentityUserSchema.parse({
        subId: data.user?.id,
        email: data.user?.email
      });
    },

    async setPassword(userId, password) {
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      return IdentityUserSchema.parse({
        subId: data.user.id,
        email: data.user.email
      });
    },

    async banUser(userId) {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        // about 100 years
        ban_duration: '876000h'
      });

      if (error) {
        throw new Error(error.message);
      }
    },

    async unbanUser(userId) {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: 'none'
      });

      if (error) {
        throw new Error(error.message);
      }
    }
  };
}
