import { IdentityUser } from 'src/types/identity/IdentityUser';

export interface IdentityService {
  identify(token: string): Promise<IdentityUser>;
  createUser(email: string, password: string): Promise<IdentityUser>;
  setPassword(userId: string, password: string): Promise<IdentityUser>;
  inviteUser(email: string): Promise<IdentityUser>;
  resendInvite(email: string): Promise<void>;
  banUser(userId: string): Promise<void>;
  unbanUser(userId: string): Promise<void>;
}
