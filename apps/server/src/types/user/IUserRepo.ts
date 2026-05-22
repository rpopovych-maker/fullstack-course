import { SortOrder } from 'src/types/SortOrder';
import { User } from './User';

export interface IUserRepo {
  getUserBySubId(subId: string): Promise<User | null>;
  createUser(data: Pick<User, 'subId' | 'email'>): Promise<User>;
}
