import { IUserRepo } from 'src/types/user/IUserRepo';

export async function getUsers(params: {
  userRepo: IUserRepo,
  page: number,
  pageSize: number
  search?: string
}) {
  const users = await params.userRepo.getUsers({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search
  });

  return users;
}