import { HttpError } from 'src/api/errors/HttpError';
import { IdentityUser } from 'src/types/identity/IdentityUser';
import { IInviteRepo } from 'src/types/invite/IInviteRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IdentityService } from 'src/types/services/IdentityService';
import { IUserRepo } from 'src/types/user/IUserRepo';

export async function acceptInvite(params: {
  inviteRepo: IInviteRepo
  userRepo: IUserRepo
  identityService: IdentityService
  identityUser: IdentityUser
  transactionManager: ITransactionManager
  username: string
  password: string
}) {
  const invite = await params.inviteRepo.getInviteBySubId(params.identityUser.subId);

  if (!invite) {
    throw new HttpError(404, 'Invite not found');
  }

  if (invite.status !== 'pending') {
    throw new HttpError(409, 'Invite is already accepted');
  }

  const { email, subId } = await params.identityService
    .setPassword(params.identityUser.subId, params.password);
  
  return await params.transactionManager.execute(async ({ tx }) => {
    const user = await params.userRepo.createUser({
      email,
      subId,
      role: 'user',
      username: params.username
    }, tx);

    const updatedInvite = await params.inviteRepo.updateInviteById(invite.id, {
      status: 'accepted',
      acceptedAt: new Date()
    }, tx); 

    if (!updatedInvite) {
      throw new HttpError(404, 'Invite not found');
    }

    return user;
  });
}