import { IdentityUser } from 'src/types/identity/IdentityUser';

export interface IdentityService {
  identify(token: string): Promise<IdentityUser>;
  createUser(email: string, password: string): Promise<IdentityUser>;
}
