import { IUserRepo } from 'src/types/user/IUserRepo';

export async function signUp(params: {
  userRepo: IUserRepo;
  subId: string;
  email: string;
}) {
  const user = await params.userRepo.createUser({
    subId: params.subId,
    email: params.email
  });

  return user;
}
