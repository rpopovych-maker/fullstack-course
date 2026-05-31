import { IInviteRepo } from 'src/types/invite/IInviteRepo';
import { Invite } from 'src/types/invite/Invite';
import { SortOrder } from 'src/types/SortOrder';

export async function getInvites(params: {
  inviteRepo: IInviteRepo,
  page: number,
  pageSize: number
  order?: SortOrder
  orderBy?: keyof Invite
  search?: string
}) {
  const invites = await params.inviteRepo.getInvites({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    order: params.order,
    orderBy: params.orderBy
  });

  return invites;
}