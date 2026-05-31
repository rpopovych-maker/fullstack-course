import { SortOrder } from 'src/types/SortOrder';
import { IUserRepo } from 'src/types/user/IUserRepo';
import { User } from 'src/types/user/User';

export async function getUsers(params: {
  userRepo: IUserRepo,
  page: number,
  pageSize: number
  order?: SortOrder
  orderBy?: keyof User
  search?: string
}) {
  const users = await params.userRepo.getUsers({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    order: params.order,
    orderBy: params.orderBy
  });

  return users;
}