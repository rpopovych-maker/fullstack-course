import { SortOrder } from 'src/types/SortOrder';
import { User } from './User';

export interface IUserRepo {
  getUserBySubId(subId: string): Promise<User | null>;
}
