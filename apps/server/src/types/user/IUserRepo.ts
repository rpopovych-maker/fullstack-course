import { SortOrder } from 'src/types/SortOrder';
import { User } from './User';

export interface IUserRepo {
  createUser(data: Pick<User, 'subId' | 'email'>): Promise<User>;
  getUserBySubId(subId: string): Promise<User | null>;
}
