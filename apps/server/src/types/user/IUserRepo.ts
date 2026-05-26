import { GetUsersResult } from 'src/types/admin/GetUsersResult';
import { User } from './User';

export interface IUserRepo {
  getUserBySubId(subId: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  createUser(data: Pick<User, 'subId' | 'email' | 'username' | 'role'>): Promise<User>;
  getUsers(params: {
    page: number,
    pageSize: number,
    search?: string
  }): Promise<GetUsersResult>;
  banUser(id: string): Promise<User | null>;
  unbanUser(id: string): Promise<User | null>;
}
