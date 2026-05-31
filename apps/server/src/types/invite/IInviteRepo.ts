import { SortOrder } from 'src/types/SortOrder';
import { GetInvitesResult } from './GetInvitesResult';
import { Invite } from './Invite';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export interface IInviteRepo {
  createInvite(data: Pick<Invite, 'email' | 'invitedByUserId' | 'sentAt' | 'status' | 'subId'>): Promise<Invite>
  updateInviteById(id: string, data: Partial<Pick<Invite, 'resentAt' | 'status' | 'acceptedAt'>>, tx?: NodePgDatabase): Promise<Invite | null>
  getInviteById(id: string): Promise<Invite | null>
  getInviteBySubId(subId: string): Promise<Invite | null>
  getInviteByEmail(email: string): Promise<Invite | null>
  getInvites(params: {
    page: number
    pageSize: number
    search?: string
    order?: SortOrder
    orderBy?: keyof Invite
  }): Promise<GetInvitesResult>
}
