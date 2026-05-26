import { HttpError } from 'src/api/errors/HttpError';
import { IdentityService } from 'src/types/services/IdentityService';
import { IUserRepo } from 'src/types/user/IUserRepo';

export async function unbanUser(params: {
  userId: string
  userRepo: IUserRepo
  identityService: IdentityService
}) {
  const user = await params.userRepo.getUserById(params.userId);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  await params.identityService.unbanUser(user.subId);
  await params.userRepo.unbanUser(user.id);
}