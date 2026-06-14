import { GetUsersResult } from 'src/types/user/GetUsersResult';
import { User } from './User';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { SortOrder } from 'src/types/SortOrder';

export interface IUserRepo {
  updateUser(id: string, data: Partial<Pick<User, 'bannedAt' | 'email' | 'role' | 'stripeCustomerId' | 'username'>>): Promise<User | null>;
  getUserBySubId(subId: string): Promise<User | null>;
  getUserById(id: string, returnDeleted?: boolean): Promise<User | null>;
  getExistingUserIds(ids: string[]): Promise<string[]>;
  createUser(
    data: Pick<User, 'subId' | 'email' | 'username' | 'role'> &
      Partial<Pick<User, 'id' | 'deletedAt' | 'bannedAt' | 'createdAt' | 'updatedAt' | 'stripeCustomerId'>>,
    tx?: NodePgDatabase
  ): Promise<User>;
  getUsers(params: {
    page: number
    pageSize: number
    search?: string
    order?: SortOrder
    orderBy?: keyof User
  }): Promise<GetUsersResult>;
  getSoftDeletedUsers(params: {
    page: number
    pageSize: number
    search?: string
    order?: SortOrder
    orderBy?: keyof User
  }): Promise<GetUsersResult>;
  banUser(id: string): Promise<User | null>;
  unbanUser(id: string): Promise<User | null>;
  softDeleteUser(id: string, deletedAt: Date, tx?: NodePgDatabase): Promise<User | null>
  restoreSoftDeletedUser(id: string, tx?: NodePgDatabase): Promise<User | null>
  deleteUser(id: string, tx?: NodePgDatabase): Promise<void>
}
